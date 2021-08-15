FROM node:12 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm install nodemon

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["nodemon", "app.js"]
