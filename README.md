# assistant-chat

## Fill credentials in .env

Fill the correct environment variables found in the `.env` file.

## How to run local dev server

1. Install packages with `npm install`
2. Launch vite dev mode with `npm run dev`

## How to build and serve locally

1. Build website with `npm run build`
2. Serve built website with `npm start`

## How to build and run docker container

1. Have the terminal positioned in the root of the repo
2. To build the image run: `docker build -t banco-de-chile-ui-assistant:latest .`
3. To run the container run: `docker run -p 8080:80 banco-de-chile-ui-assistant:latest`
4. (If running locally) container running on: http://localhost:8080/