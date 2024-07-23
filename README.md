# Emacommerce - E-Commerce API

## Description

Emacommerce es un E-Commerce API desarollado con NestJS, TypeScript, y PostgreSQL.

Está deployado en Elastic Container Service (ECS) y se puede acceder a la documentación a través de la siguiente URL: https://emacommerce.com.br

Su base de datos está alojada en Neon

Hace uso de un despliegue continuo con GitHub Actions, que se encarga de subir la imagen a AWS Elastic Container Registry (ECR) y desplegarla en AWS Elastic Container Service (ECS).

## Instalación

```bash
$ npm install
```

## Ejecución

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
