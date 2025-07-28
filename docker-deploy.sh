echo_green() {
  echo "\033[0;32m$1\033[0m"
}
echo_yellow() {
  echo "\033[0;33m$1\033[0m"
}
echo_red() {
  echo "\033[0;31m$1\033[0m"
}

handle_error() {
  echo_red "ERROR: $1"
  echo_red "Deployment failed."
  exit 1
}

echo_yellow "--- Starting Docker Compose Deployment ---"

echo_yellow "\n1. Stopping and removing existing Docker Compose services..."
docker compose down --remove-orphans
if [ $? -ne 0 ]; then handle_error "Failed to stop existing services."; fi
echo_green "   Existing services removed."

echo_yellow "\n2. Building and running frontend_builder to prepare assets..."
docker compose --profile build-frontend up frontend_builder --build --force-recreate --abort-on-container-exit --exit-code-from frontend_builder
if [ $? -ne 0 ]; then handle_error "Frontend build and copy failed."; fi
echo_green "   Frontend assets successfully built and copied."

echo_yellow "\n3. Building and starting main application services..."
docker compose up --force-recreate --build --remove-orphans -d
if [ $? -ne 0 ]; then handle_error "Failed to start main application services."; fi
echo_green "   Main application services started successfully."

echo_yellow "\n4. Current Docker Compose service status:"
docker compose ps
echo_green "\n--- Deployment Complete! ---"
echo_green "Your application should now be accessible at your domain! 🚀"
