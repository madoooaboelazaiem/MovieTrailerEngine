# MovieTrailerEngine

this repo contains the movie trailer engine backend built with node, express and postgres and vuejs

## Getting Started

folder structure is inspired by https://softwareontheroad.com/ideal-nodejs-project-structure/ with some modifications like adding controllers folder

### Prerequisites

in order to install this repo you need to make sure you have git, node and postgres installed on your machine

### Installing

A step by step series of examples that tell you how to get a development env running

clone this repo

open terminal and change directory to the project root

install project dependencies

```
npm install
```

create .env in project root directory and copy its data from env.example

```
cp env.example .env
```

create database with whatever name you want in postgres
fill out the .env file with the name for database you chose and also change the other env variable according the description provided in `env.example`

run migrations

```
node_modules/.bin/knex migrate:latest
```

For the creation of a new migration file through terminal type:

```
node_modules/.bin/knex migrate:make (name_of_the_migration_file)
```

run the project

```
npm run dev
```

```
For frontend (Client-Side)
```

cd client

```
npm i
```

npm run serve

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [Knex](https://knexjs.org/) - Database migration
- [Objectionjs](https://vincit.github.io/objection.js/) - Database ORM
- [npm](https://www.npmjs.com/) - Dependency Management
- [Postgres](https://www.postgresql.org/) - Relational Database Management server

## Versioning

## Author

- **Mado**
