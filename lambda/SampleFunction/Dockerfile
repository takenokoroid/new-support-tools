FROM public.ecr.aws/lambda/provided:al2 as build
# install compiler
RUN yum install -y golang
RUN go env -w GOPROXY=direct
# cache dependencies
ADD go.mod ./
RUN go mod download 
RUN go mod tidy
# build
ADD . .
RUN go get go-lambda-sample
RUN go build -o /main
# copy artifacts to a clean image
FROM public.ecr.aws/lambda/provided:al2
COPY --from=build /main /main
COPY entry.sh /
RUN chmod 755 /entry.sh
ENTRYPOINT [ "/entry.sh", "/main" ]