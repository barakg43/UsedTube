set version=latest
docker run --name mongodb -d -v %cd%\mongo\data:/data/db -p 27017:27017  mongodb/mongodb-community-server:%version% 