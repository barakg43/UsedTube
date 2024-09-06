# Use an official Python runtime as a parent image
FROM python:3.12.5-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Copy the project code into the container
WORKDIR /app
COPY . .

# Install dependencies
RUN apt-get update -y \
    && apt-get -y install libpq-dev gcc
#USER django

#Install HTTPS and SSL dependencies and certificates
#RUN apt-get install wget libnss3-tools -y
#RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
#RUN mv mkcert-v1.4.3-linux-amd64 /usr/bin/mkcert
#RUN chmod +x /usr/bin/mkcert
#RUN mkcert -install
#RUN mkcert -cert-file ssl/cert.pem -key-file ssl/key.pem 10.10.40.180 localhost 127.0.0.1 ::1
# Install python requirements
RUN pip install -r requirements.txt