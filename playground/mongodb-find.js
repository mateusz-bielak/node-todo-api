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
    //   .find({ _id: new ObjectId("5b8a751ba46872fe53abbede") })
    //   .toArray()
    //   .then(docs => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    //   })
    //   .catch(err => console.log("Unable to fetch todos", err));

    // db.collection("Todos")
    //   .find()
    //   .count()
    //   .then(count => {
    //     console.log(`Todos count: ${count}`);
    //   })
    //   .catch(err => console.log("Unable to fetch todos", err));

    db.collection("Users")
      .find({ name: "Matt" })
      .toArray()
      .then(docs => {
        console.log("Todos for Matt:");
        console.log(JSON.stringify(docs, undefined, 2));
      })
      .catch(err => console.log("Unable to fetch todos", err));

    // client.close();
  }
);
