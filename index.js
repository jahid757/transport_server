const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId; 
app.use(bodyParser.json())
app.use(cors())


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mirr.mongodb.net/transport?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("transport").collection("service");
  const adminCollection = client.db("transport").collection("admin");
  const messageCollection = client.db("transport").collection("message");
  const paymentCollection = client.db("transport").collection("payment");
  const reviewCollection = client.db("transport").collection("review");
  

  console.log("Database Connect Success");  

  // add service
  app.post("/addService",(req, res) => {
      const service = req.body
      serviceCollection.insertOne(service)
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
  })

  //read service

  app.get('/services',(req, res) => {
    serviceCollection.find({})
    .toArray((err,document) => {
      res.send(document)
    })
  })
// add new admin
  app.post('/adminList',(req, res) => {
    const adminData = req.body;
    adminCollection.insertOne(adminData)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  //add message

  app.post('/sendMessage',(req, res) => {
    const message = req.body;
    messageCollection.insertOne(message)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

// read message

  app.get('/message',(req, res) => {
    messageCollection.find({})
    .toArray((err, message) => {
      res.send(message)
    })
  })

  // read data by id 
  app.post('/book',(req, res) => {
    const id = req.body.id;
    serviceCollection.find({_id: ObjectId(id)})
    .toArray((err, document) => {
      res.send(document);
    })
  })

// add payment  
  app.post('/addPayment',(req, res) => {
    const payment = req.body;
    paymentCollection.insertOne(payment)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

//read payment collection

  app.get('/payment',(req, res) => {
    paymentCollection.find({})
    .toArray((err, document) => {
      res.send(document)
    })
  })
// update book item status
  app.patch('/update/:id', (req, res)=>{
    const newStatus = req.body;
    paymentCollection.updateOne({_id: ObjectId(req.params.id)},{
      $set: newStatus
    })
    .then( result => {
      res.send(result.modifiedCount > 0)
    })
  })

  // add review

  app.post('/addReview',(req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

// read user review

  app.get('/testimonial',(req, res) => {
    reviewCollection.find({})
    .toArray((err, document) => {
      res.send(document)
    })
  })

  // check admin
  app.post('/isAdmin',(req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email})
    .toArray((err, admin) => {
      res.send(admin.length > 0)
    })
  })

  // check user book by email

  app.get('/userBooking', (req, res) => {
    const email = req.query.email
    paymentCollection.find({email:email})
    .toArray((err,document) =>{
      res.send(document)
    })
  })

  // delete service

  app.post('/delete/:id',(req,res) => {
    const deleteService = ObjectId(req.params.id)
    serviceCollection.findOneAndDelete({_id:deleteService})
    .then(result => {
      // res.send(result.)
      console.log(result);
    })
  })


});









app.get('/',(req, res) => {
    res.send('Server Is Running...')
})
app.listen( process.env.PORT || 5000)