FROM node

ENV MONGO_DB_USERNAME=ada \
  MONGO_DB_PWD=lovelace

RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN npm install
CMD ["npm", "server.js"]
