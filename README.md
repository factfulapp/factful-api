# Factful API

This repository contains the source code of the API backend that provides content to the Factful mobile app, as well as the user interface for managing the content.

## Requirements:
 * Node >=8.x
 * MySQL

## Getting Started

Configure your database. Run the following commands in MySQL CLI:

```
CREATE USER factful@localhost IDENTIFIED BY 'factful';
GRANT ALL PRIVILEGES ON factful.* TO factful@localhost;
FLUSH PRIVILEGES;
exit;
```

Clone the repository.

```
git clone git@gitlab.com:factful/factful-api
cd factful-api
```

Install the dependencies.

```
npm i -g yarn
yarn
```

Create the database and run the migrations.

```
node bin/createDatabase
node bin/migrate
```

Run the app:

```
npm i -g nodemon
nodemon
```

The app will listen on http://localhost:3000/

## Development

To build the frontend on Linux/macOS, run:

```
yarn build
```

## License

AGPL-3.0
