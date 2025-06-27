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
