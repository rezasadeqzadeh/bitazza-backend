## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Swagger Document

http://localhost:3000/docs

# Better performance suggestion

Due to the alot instruments that match with THB, it's better to use a cache server to avoid redundant requests. To implement this, We can setting up a Redis cache server that can store data based on the instrument ID and date range. By caching frequently accessed data in Redis, we can significantly reduce the number of requests application needs to make to the WebSocket server.
