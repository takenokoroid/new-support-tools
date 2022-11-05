package main
import (
	"database/sql"
	"context"
	"fmt"
	"net/http"
	"os"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/lib/pq"
)

type Response struct {
	Message    string `json:"message"`
	StatusCode int    `json:"statusCode"`
}
func handleRequest(ctx context.Context, event events.S3Event) (Response, error) {
	db, err := initDB()
	if err != nil {
		fmt.Println(err.Error())
		return Response{Message: err.Error(), StatusCode: http.StatusInternalServerError}, err
	}

	cgg_id, err := getCggId(db)

	if err != nil {
		fmt.Println(err.Error())
		return Response{Message: err.Error(), StatusCode: http.StatusInternalServerError}, err
	}

	return Response{
		Message:    fmt.Sprintf("cgg_id: %s", *cgg_id),
		StatusCode: http.StatusOK,
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


func getCggId(db *sql.DB) (*string, error) {
	var cgg_id string
	sql := "SELECT cgg_id FROM users LIMIT 1"
	err := db.QueryRow(sql).Scan(&cgg_id)
	if err != nil {
		return nil, err
	}

	return &cgg_id, nil
}

func main() {
	lambda.Start(handleRequest)
}