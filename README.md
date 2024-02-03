# Express Application

This is a simple Express application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- Docker
- Express
- HTML
- openai

### Installing

1. Clone the repository:
    ```bash
    git clone https://github.com/abhishek8290-github/recipeMaker.git
    ```

2. Navigate to the project directory:
    ```bash
    cd recipe-app
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application on Docker

To run the application on docker:

1. create .env file 
```bash
    touch .env
```
2. add your openapi_key in .env file
```bash
OPENAI_API_KEY=<openapi_key>
```
3. add your mongo atlas uri in .env file
```bash
ATLAS_URI=<uri>
```

1. Build the Docker image:
    ```bash
    docker build -t recipe-app .
    ```

2. Run the Docker container:
    ```bash
    docker run -p 3000:3000 recipe-app
    ```

### Running the Application on compiler

1.  ```bash
    node index.js
    ```

2. With Nodemon :
    ```bash
    nodemon index.js
    ```

#### The application will be available at `http://localhost:3000`.



#### The live application is  available at `http://34.160.110.0/`.







### To deploy the application on kubernetes:

1. Change the uri for the docker image in recipe-maker-app/ values 
```yaml
image:
  repository: <docker_uri>:latest
  pullPolicy: Always
```
2. Build Docker file 
```bash 
docker build --platform linux/amd64 -t recipemakerapp:latest . 
```

3. Tag the docker image  
```bash 
docker tag recipemakerapp:latest <docker_uri>:latest
```
4. Push the docker Image 
```bash
docker push <docker_uri>:latest
```

5. Package the service via [Helm](https://helm.sh/)
```bash
helm package recipemaker-app
```
6. Install the app 
```bash
helm install recipemaker-app recipemaker-app-0.1.0.tgz 
```

## Built With

- [Express](https://expressjs.com/) - The web framework used

## Authors

- Abhishek Singh 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details