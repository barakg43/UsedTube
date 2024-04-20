set version=latest
docker run --name mongo -d -v %cd%\mongo\data:/data/db -p 27017:27017  mongodb/mongodb-community-server:%version% 