FROM node:18-alpine AS build
WORKDIR /app
COPY . /app/
RUN npm run build
RUN npm install serve -g
RUN npm install
CMD [ "serve", "-s", "dist" ]