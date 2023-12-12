const express =require('express');
const app =express();
const cors =require('cors')
const jwt =require('jsonwebtoken');
require('dotenv').config()
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const adderequest =client.db('edonDb').collection('trequest');
const userCollection =client.db('edonDb').collection('users');
const addedClassCollection =client.db('edonDb').collection('addedClass');
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // JWT RELATED API
    app.post('/jwt', async(req,res)=>{
      const user =req.body;
      const token =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'1h'})
        res.send({token});
    })
// user related api
app.post('/users',async (req,res)=>{
  const user =req.body;
  const query ={email: user.email}
  const existingUser =await userCollection.findOne(query);
  if (existingUser) {
    return res.send({message: 'user already exist', insertedId: null})
  }
  const result =await userCollection.insertOne(user)
  res.send(result)
  console.log(result);
})
app.get('/users',async(req,res)=>{
  const coursol = userCollection.find();
const result = await coursol.toArray();
  res.send(result)
console.log(result);
})
// make admin
app.patch('/users/admin/:id',async (req,res)=>{
  const id =req.params.id;
  const filter ={_id: new ObjectId(id)};
  const updatedDoc = {
    $set:{
      selectedRole:'admin'
    }
  }
  const result =await userCollection.updateOne(filter,updatedDoc)
  res.send(result);
  console.log(result);
})
app.get('/users/admin/:email',async(req,res)=>{
  const email =req.params.email;
  const query = {email : email}
  const user = await userCollection.findOne(query)
 let Role =''
  if (user) {
    Role = user?.selectedRole
  }
  res.send(Role)
})

// post teacherrequest
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

// added class
app.post('/addedclass', async(req,res)=>{
  const addedclass =req.body;
  console.log(addedclass);
  const result = await addedClassCollection.insertOne(addedclass)
  res.send(result);
})
// get userbased addClass
app.get('/addedclass/:email',async(req,res)=>{
  const email = req.params.email;
  const query ={email:email}
  const user = addedClassCollection.find(query);
  const result = await user.toArray() 
  res.send(result)
})
// get all added data
app.get('/addedclass',async(req,res)=>{
  const result =await addedClassCollection.find().toArray();
  res.send(result)
})
// get approved button
app.get('/addedclass/approved/:status',async(req,res)=>{
  const status = req.params.status;
  const query ={status:status}
  const user = addedClassCollection.find(query);
  const result = await user.toArray()
  res.send(result)
})
// delete added class

app.delete('/addedclass/:id', async (req, res)=>{
  const id =req.params.id;
  const query ={ _id: new ObjectId(id) }
  const result = await addedClassCollection.deleteOne(query);
  res.send(result);
})
// // update item
app.get('addedclass/update/:id',async(req,res)=>{
  const id =req.params.id;
  const query ={_id:new ObjectId(id)};
  const user = await addedClassCollection.findOne(query);
  res.send(user)
})
// update
app.put('/addedclass/update/:id',async(req,res)=>{
  const id =req.params.id;
  const filter ={_id: new ObjectId(id)}
  const options ={upsert:true};
  const updateditem = req.body;
  const iteam ={
    $set:{
      email:updateditem.email,
      name:updateditem.name,
      photo:updateditem.photo,
      title:updateditem.title,
      price:updateditem.price,
      description:updateditem.description,
    }
  }
  const result =await addedClassCollection.updateOne(filter,iteam,options);
  res.send(result)
})

// make approved class
app.patch('/addedclass/approved/:id',async (req,res)=>{
  const id =req.params.id;
  const filter ={_id: new ObjectId(id)};
  const updatedDoc = {
    $set:{   
        status:'approved'
    }
  }
  const result =await addedClassCollection.updateOne(filter,updatedDoc)
  res.send(result);
  console.log(result);
})

   
   
  } finally {
 
    
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