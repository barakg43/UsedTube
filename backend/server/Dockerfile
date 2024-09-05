# Use an official Python runtime as a parent image
FROM python:3.12.5-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Copy the project code into the container
WORKDIR /app
COPY . .

# Install dependencies
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2-binary
RUN pip install -r requirements.txt