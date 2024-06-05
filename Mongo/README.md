# MongoDB 

## Build a MongoDB with replica set

docker-compose -f docker-compose-rs.yml up --build

docker exec -it mongo bash     

Mongo> mongosh -u root -p example

Test> config = { "_id": "dbrs", "members": [ { "_id": 0, "host": "localhost:27017" }] }

Test> rs.initiate(config)

exit
exit


Now we can build the BD

npx prisma db push


if trouble
https://velog.io/@youngkiu/MongoDB-Replica-Set-for-Prisma

