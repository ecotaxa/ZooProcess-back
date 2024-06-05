echo "obsolete"
echo "make keyfile with make_key.sh"
echo "then"
echo "use: docker-compose -f docker-compose up --detach"

exit
docker run -p 27017:27017 -v bd/   \
    --name zoo-mongo \
    -d mongo:5.0.22-focal \
    -v ./data:/data/db