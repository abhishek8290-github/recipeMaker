
docker build --platform linux/amd64 -t recipemakerapp:latest . 

docker tag recipemakerapp:latest asia-south1-docker.pkg.dev/elevated-dynamo-2024/recipemaker/latest:latest

docker push asia-south1-docker.pkg.dev/elevated-dynamo-2024/recipemaker/latest:latest



helm package recipemaker-app

helm delete recipemaker-app

helm install recipemaker-app recipemaker-app-0.1.0.tgz


# kubectl port-forward services/recipemaker 3000:3000 
