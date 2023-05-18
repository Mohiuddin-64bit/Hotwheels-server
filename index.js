const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://Hotwheels:Tew51rbYMORr5APr@cluster0.bfg1fsg.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db("hotwheels").collection("hotwheelsCollection");

    app.post('/addToy', async(req, res) => {
      const body = req.body;
      console.log(body)
      const result = await toyCollection.insertOne(body);
      res.send(result)
      console.log(result)
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("hotwheels is running")
})
app.get('http://localhost:5000/addToy', (req, res) => {
  res.send("hotwheels is running")
})

app.listen(port, () => {
  console.log(`HotWheels server is running on port, ${port}`)
})