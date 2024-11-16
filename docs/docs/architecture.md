# Architecture

## CI/CD Pipeline
![pipeline-light](assets/pipeline-light.png#only-light)
![pipeline-dark](assets/pipeline-dark.png#only-dark)

* The deployment pipeline is triggered by a push to the `main` or `staging` branch.
* To avoid additional costs on AWS, we build the frontend and backend images on the GitHub Actions runner and push them to the Docker Hub.
* Our AWS EC2 instances pull the images and restart the containers.

## Production Architecture
![architecture-light](assets/architecture-light.png#only-light)
![architecture-dark](assets/architecture-dark.png#only-dark)

* This architecture diagram represents a high-level overview, some details such as certificate management are not shown.
* To reduce bandwidth costs when serving media files, `/media` serves as a proxy to the S3 bucket, using presigned URLS, and cached using NGINX.
![presigned-light](assets/presigned-light.png#only-light)
![presigned-dark](assets/presigned-dark.png#only-dark)


## Development Architecture
![architecture-dev-light](assets/architecture-dev-light.png#only-light)
![architecture-dev-dark](assets/architecture-dev-dark.png#only-dark)

* The development environment can be brought up with `./run.sh`, it also has additional containers for testing which can be brought up with `./test.sh`.
* We make use of a self-signed certificate for local development, which is stored in the `nginx` container and used by the `frontend` container.
* Our backend container waits for the `mysql` container to be ready before starting the Django application.
* Our backend container is setup to use the `devuser` and `devpassword` credentials in `.env` by default.