docker pull pazgas/usedtube:v1
docker run --name postgres -d -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v %cd%\Postgres\data:/var/lib/postgresql/data -p 5432:5432 pazgas/usedtube:v1

