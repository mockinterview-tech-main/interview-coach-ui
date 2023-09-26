BINARY_NAME=pocketbase
MAIN_FILE=main.go
BUILD_DIR=build
FRONTEND_DIR=../
OS=darwin
HEROKU_APP_NAME=mockinterview-users

.PHONY: build
build:
	GOARCH=amd64 GOOS=darwin go build -o ${BUILD_DIR}/${BINARY_NAME}-darwin ${MAIN_FILE}
	GOARCH=amd64 GOOS=linux go build -o ${BUILD_DIR}/${BINARY_NAME}-linux ${MAIN_FILE}
	GOARCH=amd64 GOOS=windows go build -o ${BUILD_DIR}/${BINARY_NAME}-windows ${MAIN_FILE}

.PHONY: backend-up
backend-up: 
	go run main.go serve --http=0.0.0.0:5555

.PHONY: frontend-up
frontend-up:
	cd ${FRONTEND_DIR} && npm run dev

.PHONY: clean
clean:
	go clean
	rm ${BUILD_DIR}/*

.PHONY: deploy
deploy:
	docker buildx build --platform linux/amd64 -t $(HEROKU_APP_NAME) . && \
	docker tag $(HEROKU_APP_NAME) registry.heroku.com/$(HEROKU_APP_NAME)/web && \
	docker push registry.heroku.com/$(HEROKU_APP_NAME)/web && \
	heroku container:release web -a $(HEROKU_APP_NAME)