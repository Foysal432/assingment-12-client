const express =require('express');
const app =express();
const cors =require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdlhstb.mongodb.net/?retryWrites=true&w=majority`;

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
    // create collection
const adderequest =client.db('edonDb').collection('trequest')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

// post alladdedfoods
app.get('/trequest',async(req,res)=>{
  const result =await adderequest.find().toArray();
  res.send(result)
})
app.post('/trequest', async(req,res)=>{
  const foods =req.body;
  console.log(foods);
  const result = await adderequest.insertOne(foods)
  res.send(result);
})






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb



app.get('/',(req,res)=>{
    res.send('edon is running')
})
app.listen(port,()=>{
    console.log(`edon in running on port ${port}`);
})