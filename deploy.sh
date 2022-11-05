#!/bin/bash

# .env読み込み
export $(cat .env | grep -v ^# | xargs);

# LayerをLambdaにデプロイ
docker build -t layer ./opt
docker run --rm \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  layer

# SampleFunctionをLambdaにデプロイ
docker build -t sample-function ./lambda/SampleFunction
docker run --rm \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  sample-function