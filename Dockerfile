FROM node:12 AS builder
WORKDIR /app
COPY . .
RUN npm install

FROM node:12-alpine
WORKDIR /app
RUN npm install -g nodemon
COPY --from=builder /app ./
CMD ["npm", "run", "start"]
