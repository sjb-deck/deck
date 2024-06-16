#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

trap 'cleanup' ERR

print_msg() {
    echo -e "${BLUE}==>${NC} $1"
}

handle_error() {
    echo -e "${RED}Error: $1${NC}"
    cleanup
    exit 1
}

cleanup() {
    print_msg "${RED}Cleaning up...${NC}"
    if [ "$MODE" == "prod" ]; then
        docker-compose -f docker-compose-prod.yml down
    else
        docker-compose down
    fi
    print_msg "${RED}Containers have been stopped.${NC}"
}

build_and_push() {
    IMAGE_NAME=$1
    CONTEXT_DIR=$2

    print_msg "${YELLOW}Building and pushing Docker image for ${IMAGE_NAME} from ${CONTEXT_DIR}${NC}"

    docker buildx inspect mybuilder > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_msg "${GREEN}Creating Docker buildx builder instance...${NC}"
        docker buildx create --name mybuilder --use || handle_error "Failed to create Docker buildx builder instance"
    fi

    print_msg "${GREEN}Ensuring the Docker buildx builder instance is started...${NC}"
    docker buildx inspect mybuilder --bootstrap || handle_error "Failed to start Docker buildx builder instance"

    print_msg "${GREEN}Building and pushing the image for ${IMAGE_NAME}...${NC}"
    docker buildx build --platform linux/amd64,linux/arm64 \
        -t jonasgwt/${IMAGE_NAME}:latest \
        --push \
        ${CONTEXT_DIR} || handle_error "Failed to build and push ${IMAGE_NAME}"

    print_msg "${GREEN}Successfully built and pushed ${IMAGE_NAME}${NC}"

    print_msg "${GREEN}Removing the Docker buildx builder instance...${NC}"
    docker buildx rm mybuilder || handle_error "Failed to remove Docker buildx builder instance"
}

if [ "$1" == "--prod" ]; then
    MODE="prod"
    print_msg "${YELLOW}Entering production mode...${NC}"

    print_msg "${GREEN}Changing to frontend directory...${NC}"
    cd frontend || handle_error "Failed to change directory to frontend"

    print_msg "${GREEN}Installing npm dependencies...${NC}"
    npm install || handle_error "Failed to install npm dependencies"

    print_msg "${GREEN}Building the frontend...${NC}"
    npm run build || handle_error "Failed to build the frontend"

    print_msg "${GREEN}Changing back to the root directory...${NC}"
    cd .. || handle_error "Failed to change back to the root directory"

    build_and_push "deck-frontend" "./frontend"

    build_and_push "deck-backend" "./backend"

    print_msg "${GREEN}Production images have been built and pushed successfully.${NC}"
else
    MODE="dev"
    print_msg "${YELLOW}Entering development mode...${NC}"

    print_msg "${GREEN}Bringing up the development environment with Docker Compose...${NC}"
    docker-compose up --build || handle_error "Failed to bring up the development environment with Docker Compose"

    print_msg "${GREEN}Development environment is up and running${NC}"
fi
