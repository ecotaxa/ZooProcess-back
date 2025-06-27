The API part of the ZooProcess project.



## Install

```bash
npm run deps && npm i
```

## Run

```bash
npm start
```


# docker

## build

docker build -t zooprocess-back .

## run

docker run -p 8081:8081  --name zooprocess-back zooprocess-back




# DB

need mongo:5.0.26-focal 
the better way is to use docker-compose for this purpose.




# Deployement
Deployment Steps
Create a deployment package:

deploy.sh:
```sh
# Create a deployment directory
mkdir -p deploy

# Copy necessary files
cp -r dist deploy/
cp app.js deploy/
cp package.json package-lock.json deploy/
cp zooprocess.openapi.yaml deploy/

# Create a production .env file (don't copy your development one directly)
cp .sample.env deploy/.env
# Edit the .env file with production values
```

Transfer to your web server using SCP, SFTP, or your preferred method:

```sh
scp -r deploy/* user@your-server:/path/to/application/
```

On the server:

```sh
cd /path/to/application
npm install --production  # Installs only dependencies, not devDependencies
node app.js  # Or use a process manager like PM2
```

Using a Process Manager (Recommended)
For production deployments, I recommend using a process manager like PM2:

# Install PM2 globally on your server
```sh
npm install -g pm2
```

# Start your application
```sh
pm2 start app.js --name "zooprocess-api"
````

# Make PM2 startup on server reboot
```sh
pm2 startup
pm2 save
```


# Docker Deployment (Alternative)
Since you have a Dockerfile, you could also build and deploy as a Docker container:

# Build the Docker image
```sh
docker build -t zooprocess-api .
```

# Run the container
```sh
docker run -d -p 8081:8081 --env-file .env --name zooprocess-api zooprocess-api
````

This approach is cleaner as it packages everything together and ensures consistent environments.

Would you like more specific instructions for any of these deployment methods?

