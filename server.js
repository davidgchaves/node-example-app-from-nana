const express = require("express");
const path = require("path");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

// Use when starting application locally
const mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// Use when starting application as docker container
const mongoUrlDocker = "mongodb://admin:password@mongodb";

// Pass these options to mongo client connect request to avoid DeprecationWarning
// for current Server Discovery and Monitoring engine
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// Database name in demo with docker: "user-account"
const databaseNameWithDocker = "user-account";
// Database name in demo with docker-compose; "my-db"
const databaseNameWithDockerCompose = "my-db";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", (request, response) => {
  const imgProfile = fs.readFileSync(
    path.join(__dirname, "images/profile-1.jpg")
  );
  response.writeHead(200, { "Content-Type": "image/jpg" });
  response.end(imgProfile, "binary");
});

app.get("/get-profile", (request, response) => {
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, (error, client) => {
    if (error) throw error;

    // BEWARE!!!
    const db = client.db(databaseNameWithDockerCompose);
    const myQuery = { userid: 1 };

    db.collection("users").findOne(myQuery, (error, result) => {
      if (error) throw error;
      client.close();

      response.send(result ? result : {});
    });
  });
});

app.post("/update-profile", (request, response) => {
  const userObj = request.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, (error, client) => {
    if (error) throw error;

    // BEWARE!!!
    const db = client.db(databaseNameWithDockerCompose);
    userObj["userid"] = 1;

    const myQuery = { userid: 1 };
    const newValues = { $set: userObj };

    db.collection("users").updateOne(
      myQuery,
      newValues,
      { upsert: true },
      (error, response) => {
        if (error) throw error;
        client.close();
      }
    );
  });

  response.send(userObj);
});

app.listen(3000, () => {
  console.log("🚀🚀🚀 App listening on port 3000! 🚀🚀🚀");
});
