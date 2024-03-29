const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
  }) 
  




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xf9xueb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productsCollection = client.db('DGray').collection('products')
    const cartCollection = client.db('DGray').collection('carts')


// products related API
  app.get('/products', async(req, res) => {
    const result = await productsCollection.find().toArray();
    res.send(result)
  })

//   carts related API

app.get('/carts', async(req, res) => {
    const email = req.query.email;
    const query = {email : email};
    const result = await cartCollection.find(query).toArray();
    res.send(result)
})

  app.post('/carts', async(req, res) => {
    const cartItem = req.body;
    const result = await cartCollection.insertOne(cartItem);
    res.send(result)
  })

  app.delete('/carts/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await cartCollection.deleteOne(query);
    res.send(result)
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
    res.send('D gray is running...')
  })
  
  app.listen(port, () => {
    console.log(`D gray app listening on port ${port}`)
  })

 
 