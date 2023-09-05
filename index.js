const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
//node js environment variable 
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())

app.use(express.json()); // Undefined solved



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0s8i3u.mongodb.net/?retryWrites=true&w=majority`;


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
    const database = client.db('class-53-mongo-CURD')
    const userCollection = database.collection('Users');
    const ordersCollection = database.collection('Order');
    //const user = {name: 'text', email: 'text@gmail.com'}
    //const send = await userCollection.insertOne(user);
    //console.log(send);

    // user get
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users)
    })

    //specific user get

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user)
    })

    //user add via POST
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // Delete

    app.delete('/users/:id', async (req, res) => {
      //console.log('Delete API hits');
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    });

    // update
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      const update = {
        $set: {
          name: user.name,
          address: user.address,
          phone: user?.phone,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(query, update, options);
      res.send(result);
    })

    



  } finally {

    // under this line have to off
    //await client.close();
  }
}
run().catch(error => console.log(error));





app.get('/', (req, res) => {
  res.send('Hello CURD Operation!')
})



app.listen(port, () => {
  console.log(`Our CURD Operation run on port ${port}`)
})