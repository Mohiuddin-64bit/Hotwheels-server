const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.User_name}:${process.env.password}@cluster0.bfg1fsg.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toyCollection = client
      .db("hotwheels")
      .collection("hotwheelsCollection");

    // POST method
    app.post("/addToy", async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
    });

    // GET method
    app.get("/allToy", async (req, res) => {
      // const limit = 20;
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    // Update Method
    app.put("/updateToy/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: body.price,
          quantity: body.quantity,
          description: body.description,
        },
      };
      const result = await toyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete Method
    app.delete("/deleteToy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(filter);
      res.send(result);
    });

    // gat method
    app.get("/allToy/:category", async (req, res) => {
      if (
        req.params.category === "sports_car" ||
        req.params.category === "truck" ||
        req.params.category === "regular_car"
      ) {
        const result = await toyCollection
          .find({ category: req.params.category })
          .toArray();

        res.send(result);
      } else {
        const result = await toyCollection.find({}).toArray();
        res.send(result);
      }
    });

    app.get("/allToy/carDetails/:id", async (req, res) => {
      const id = req.params.id;
      const selectedToy = await toyCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(selectedToy);
    });
    // email get method
    app.get("/myToy/:email", async (req, res) => {
      const email = req.params.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    // indexing for search
    const indexKey = { toyName: 1, category: 1 };
    const indexOptions = { name: "toyCategory" };
    const result = await toyCollection.createIndex(indexKey, indexOptions);

    app.get("/toySearchByName/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await toyCollection
        .find({
          $or: [
            { toyName: { $regex: searchText, $options: "i" } },
            { category: { $regex: searchText, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hotwheels is running");
});

app.listen(port, () => {
  console.log(`HotWheels server is running on port, ${port}`);
});
