const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect(
    'mongodb://localhost:27017/TodoApp',
    { useNewUrlParser: true },
    (err, client) => {
        if (err) {
            return console.log('Unable to connect to MongoDB server', err);
        }
        console.log('Connected to MongoDB server');
        const db = client.db('TodoApp');

        // deleteMany
        // db.collection("Todos")
        //   .deleteMany({ text: "Eat lunch" })
        //   .then(result => console.log(result));

        // deleteOne
        // db.collection("Todos")
        //   .deleteOne({ text: "Eat lunch" })
        //   .then(result => console.log(result));

        // findOneAndDelete
        // db.collection("Todos")
        //   .findOneAndDelete({ completed: false })
        //   .then(result => console.log(result));

        // db.collection("Users")
        //   .deleteMany({ name: "Matt" })
        //   .then(console.log);

        db.collection('Users')
            .findOneAndDelete({ _id: new ObjectId('5b8a789f1e4a6b0071bf016f') })
            .then(console.log);

        // client.close();
    },
);
