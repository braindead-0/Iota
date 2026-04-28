# Use the official lightweight Python image.
FROM python:3.11-slim

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED=True

# Copy local code to the container image.
ENV APP_HOME=/app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Run the web service on container startup using uvicorn.
# Cloud Run automatically sets the PORT environment variable (default 8080).
CMD ["sh", "-c", "uvicorn iota_neural_api:app --host 0.0.0.0 --port ${PORT:-8080}"]
