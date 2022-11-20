package main
import (
	"database/sql"
	"fmt"
	"os"
	"strconv"
	"encoding/json"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
	_ "github.com/lib/pq"
)

type Service struct {
	Deleted bool `json:"deleted"`
}

type User struct {
	CggId string `json:"cgg_id"`
	Name  string `json:"name"`
}

type Request struct {
	Id	string `json:"id"`
}

var (
	ErrNoId = errors.New("No Id in HTTP response")
)

// JSONの形のテキストデータをgolangの構造体に変換するための関数
func ConvertInputDataToStruct(inputs string) (*Request, error) {
	var req Request
	err := json.Unmarshal([]byte(inputs), &req)
	if err != nil {
		return nil, err
	}
	return &req, nil
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	req, err := ConvertInputDataToStruct(request.Body)
	headers := map[string]string{
        "Content-Type":                    "application/json",
        "Access-Control-Allow-Origin":     "*", // こっちは小文字!
        "Access-Control-Allow-Methods":    "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers":    "Origin,Authorization,Accept,X-Requested-With",
        "Access-Control-Allow-Credential": "true",
    }
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: err.Error(),
			StatusCode: 500,
		}, err
	}

	if request.Id == "" {
		Response := struct {
			errorMessage string `json:"errorMessage"`
		}{
			"idが必要です",
		}
		jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 404,
		}, ErrNoId
	}

	db, err := initDB()
	if err != nil {
		fmt.Println(err.Error())

		Response := struct {
			errorMessage string `json:"errorMessage"`
		}{
			"エラーです",
		}
		jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 500,
		}, err
	}

	cgg_id, err := getCggId(db, request.Id)
	if err != nil {
		fmt.Println(err.Error())
		Response := struct {
			errorMessage string `json:"errorMessage"`
		}{
			"データが見つかりません",
		}
		jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 500,
		}, err
	}
	
	deleted, err := getDeleted(db, request.Id)
	if err != nil {
		fmt.Println(err.Error())
		Response := struct {
			errorMessage string `json:"errorMessage"`
		}{
			"データが見つかりません",
		}
		jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 500,
		}, err
	}

	name, err := getName(db, request.Id)
	if err != nil {
		fmt.Println(err.Error())
		Response := struct {
			errorMessage string `json:"errorMessage"`
		}{
			"データが見つかりません",
		}
		jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 500,
		}, err
	}
	fmt.Println(*cgg_id, *name, *deleted)

	Response := struct {
		User User `json:"user"`
		Service Service `json:"service"`
	}{
		User{
			fmt.Sprintf("%s",*cgg_id),
			fmt.Sprintf("%s",*name),
		},
		Service{
			*deleted,
		},
	}
	jsonResult, _ := json.Marshal(Response)
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body: string(jsonResult),
			StatusCode: 500,
		}, nil
}

func initDB() (*sql.DB, error) {
	dbName := os.Getenv("DB_DATABASE")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	hostName := os.Getenv("HOST_NAME")

	d, err := sql.Open("postgres", fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", hostName, dbUser, dbPass, dbName))
	if err != nil {
		return nil, err
	}

	if err := d.Ping(); err != nil {
		return nil, err
	}

	return d, nil
}


func getCggId(db *sql.DB, id string) (*string, error) {
	var cgg_id string
	sql := "SELECT cgg_id FROM users WHERE cgg_id = $1"
	err := db.QueryRow(sql, id).Scan(&cgg_id)
	if err != nil {
		return nil, err
	}

	return &cgg_id, nil
}

func getName(db *sql.DB, id string) (*string, error) {
	var name string
	sql := "SELECT name FROM users WHERE cgg_id = $1"
	err := db.QueryRow(sql, id).Scan(&name)
	if err != nil {
		return nil, err
	}

	return &name, nil
}

func getDeleted(db *sql.DB, id string) (*bool, error) {
	var user_id int
	var deleted bool

	sql := "SELECT id FROM users WHERE cgg_id = $1"
	err := db.QueryRow(sql, id).Scan(&user_id)
	if err != nil {
		return nil, err
	}

	s:=strconv.Itoa(user_id)
	sql = "SELECT deleted FROM service WHERE user_id = $1"
	err = db.QueryRow(sql, s).Scan(&deleted)
	if err != nil {
		return nil, err
	}

	return &deleted, nil
}

func main() {
	lambda.Start(handleRequest)
}