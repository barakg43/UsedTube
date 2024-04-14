set version=4.4.20-ubi8
docker run --name mongodb -d -v %cd%/mongo/data:/data/db -p 27017:27017  mongodb/mongodb-community-server:%version% 