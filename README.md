[![codecov](https://codecov.io/gh/sjb-deck/deck/branch/main/graph/badge.svg?token=A6P3NNHZ7R)](https://codecov.io/gh/sjb-deck/deck)
![Build Status](https://github.com/sjb-deck/deck/actions/workflows/deck.yml/badge.svg)

# Getting Started

## Prerequisites

1. Install Docker:

      Download and install Docker Desktop from [Docker's official site](https://www.docker.com/products/docker-desktop).

      Follow the installation instructions for your distribution from [Docker's official site](https://docs.docker.com/engine/install/).

2. Clone the repo:

    ```bash
    git clone https://github.com/sjb-deck/deck.git
    ```

3. Move into the directory:

    ```bash
    cd deck
    ```

4. Copy the `.env` file into the current directory.

## Running the Development Server with Docker

You can run the development server using Docker and the provided `run.sh` script.

1. Make the `run.sh` script executable:

    ```bash
    chmod +x run.sh
    ```

2. Add the following line to your `/etc/hosts` file:

    ```bash
    127.0.0.1 deck-dev.nhhs-sjb.org
    ::1 deck-dev.nhhs-sjb.org
    ```

3. Run the script in development mode:

    ```bash
    ./run.sh
    ```

4. Visit the site at [https://deck-dev.nhhs-sjb.org](https://deck-dev.nhhs-sjb.org).

This script will build and start the Docker containers for the frontend, backend, and MySQL services.

### Additional Notes

If this is your first time running the dev server, you will need to create a new superuser account

1. Start a shell in the backend container:

    ```bash
    docker exec -it [backend_container_id] sh
    ```

2. Run the following command to create a superuser:

    ```bash
    python manage.py createsuperuser
    ```

3. Follow the prompts to create a new superuser account, then exit the shell:

    ```bash
    exit
    ```

You can find the `[backend_container_id]` by running `docker ps -a` and look for the container with the name `deck_backend`.

## Running tests

### Backend

#### Running tests with test.sh

1. Make the `test.sh` script executable:

    ```bash
    chmod +x test.sh
    ```

2. Run the script:

    ```bash
    ./test.sh [optional_test_args]
    ```

    Example:

    ```bash
    ./test.sh accounts.__tests__.triggers.test_trigger_user_extras.TestTriggerUserExtras
    ```

3. The script will run the backend tests and output the results.


#### Running tests with Docker

1. Start a shell in the backend container:

    ```bash
    docker exec -it [backend_container_id] sh
    ```

2. Run the following command to run the tests:

    ```bash
    python manage.py test [optional_test_args]
    ```

3. The tests will run and output the results.

### Frontend

1. Go to the frontend directory:

    ```bash
    cd frontend
    ```

2. Run the following command to run the tests:

    ```bash
    npm run test
    ```

3. The tests will run and output the results.

# Must Have VSCode Extensions

- [Black Python Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
