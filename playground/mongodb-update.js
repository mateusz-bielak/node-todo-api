const { MongoClient, ObjectId } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to MongoDB server", err);
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    // db.collection("Todos")
    //   .findOneAndUpdate(
    //     { _id: new ObjectId("5b8bf368fc5b3d2e98d0a4bd") },
    //     { $set: { completed: true } },
    //     { returnOriginal: false }
    //   )
    //   .then(console.log);

    db.collection("Users")
      .find({ _id: new ObjectId("5b8a76964a159cfead7f42b1") })
      .toArray()
      .then(console.log);

    db.collection("Users")
      .findOneAndUpdate(
        { _id: new ObjectId("5b8a76964a159cfead7f42b1") },
        { $inc: { age: 1 }, $set: { name: "Matt" } },
        { returnOriginal: false }
      )
      .then(console.log);

    // client.close();
  }
);
