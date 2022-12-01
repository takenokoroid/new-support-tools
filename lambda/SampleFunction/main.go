package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	_ "github.com/lib/pq"
)

type Service struct {
	Deleted bool `json:"deleted"`
}

type User struct {
	CggId string `json:"cgg_id"`
	Name  string `json:"name"`
}

type Id struct {
	Id string `json:"id"`
}

// Response Lambdaが返答するデータ
type Response struct {
	Service Service `json:"service"`
	User    User    `json:"user"`
}

type Item struct {
	Cgg_id  string `dynamodbav:"cgg_id" json:"cgg_id"`
	Deleted bool   `dynamodbav:"deleted" json:"deleted"`
	Name    string `dynamodbav:"name" json:"name"`
}

var (
	ErrNoId = errors.New("no id in HTTP response")
)

func handleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Printf("start")

	// DBと接続するセッションを作る→DB接続
	sess, err := session.NewSession()
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       err.Error(),
			StatusCode: 500,
		}, err
	}

	db := dynamodb.New(sess)

	fmt.Printf("body:%v", request.Body)

	// リクエストボディのjsonから、ID構造体(DB検索用の構造体)を作成
	reqBody := request.Body
	resBodyJSONBytes := ([]byte)(reqBody)
	id := Id{}
	if err := json.Unmarshal(resBodyJSONBytes, &id); err != nil {
		return events.APIGatewayProxyResponse{
			Body:       err.Error(),
			StatusCode: 500,
		}, err
	}

	fmt.Printf("ID:%v", id.Id)

	// 検索条件を用意
	getParam := &dynamodb.GetItemInput{
		TableName: aws.String(os.Getenv("TABLE_NAME")),
		Key: map[string]*dynamodb.AttributeValue{
			"cgg_id": {
				S: aws.String(id.Id),
			},
		},
	}

	fmt.Printf("param:%v", getParam)

	// 検索
	result, err := db.GetItem(getParam)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       err.Error(),
			StatusCode: 404,
		}, err
	}

	fmt.Printf("result:%v", result)

	// 結果を構造体にパース
	item := Item{}
	err = dynamodbattribute.UnmarshalMap(result.Item, &item)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       err.Error(),
			StatusCode: 500,
		}, err
	}

	fmt.Printf("item:%v", item)
	fmt.Printf("item:%v", item.Cgg_id)

	//itemからユーザー情報を取り出す
	user := User{
		CggId: item.Cgg_id,
		Name:  item.Name,
	}

	//itemからサービス情報を取り出す
	service := Service{
		Deleted: item.Deleted,
	}

	fmt.Printf("user:%v", user)

	// httpレスポンス作成
	headers := map[string]string{
		"Content-Type":                    "application/json",
		"Access-Control-Allow-Origin":     "*", // こっちは小文字!
		"Access-Control-Allow-Methods":    "OPTIONS,POST,GET",
		"Access-Control-Allow-Headers":    "Origin,Authorization,Accept,X-Requested-With",
		"Access-Control-Allow-Credential": "true",
	}
	res := Response{
		Service: service,
		User:    user,
	}
	jsonBytes, _ := json.Marshal(res)

	if user.CggId == "" {
		return events.APIGatewayProxyResponse{
			Headers:    headers,
			Body:       string(jsonBytes),
			StatusCode: 404,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		Headers:    headers,
		Body:       string(jsonBytes),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
