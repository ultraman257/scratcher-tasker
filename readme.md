## Scracher Tasker Service

This service keeps track of and co-ordinates between the frontend, database and the scraper itself.

#### EnvironmentVariables
```rethinkdb``` - the IP of the rethinkDB server
```rethinkDBTable``` - the name of the DB table
```conccurentScrapes``` - The max number of allowed scrap bots at once


Format for .env file:

```dotenv
rethinkdb=127.0.0.1
rethinkDBTable=scratcher
conccurentScrapes=5
```
