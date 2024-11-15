FROM node:18-alpine AS build
WORKDIR /app
COPY . /app/
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm run build
RUN npm install serve -g
CMD ["serve", "-s", "dist"]