[![codecov](https://codecov.io/gh/sjb-deck/deck/branch/main/graph/badge.svg?token=A6P3NNHZ7R)](https://codecov.io/gh/sjb-deck/deck)
![Build Status](https://github.com/sjb-deck/deck/actions/workflows/deck.yml/badge.svg)

# Getting Started

## Prerequisites

1. Install Docker:

    - **MacOS**:
      Download and install Docker Desktop from [Docker's official site](https://www.docker.com/products/docker-desktop).

    - **Windows**:
      Download and install Docker Desktop from [Docker's official site](https://www.docker.com/products/docker-desktop).

    - **Linux**:
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

2. Run the script in development mode:

    ```bash
    ./run.sh
    ```

This script will build and start the Docker containers for the frontend, backend, and MySQL services.

## Manually Running the Development Server

If you prefer to manually run the development server without Docker, follow these steps:

1. Install the required Python modules and Node.js libraries:

    ```bash
    pip install -r requirements.txt
    npm install
    ```

2. Start the JSX compiler:

    ```bash
    npm run dev
    ```

3. Open a new terminal window, apply database migrations, and start the Django development server:

    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

# Must Have VSCode Extensions

- [Black Python Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
