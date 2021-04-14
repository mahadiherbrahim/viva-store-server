const express = require('express')
const app = express()
const port = process.env.PORT || 5000 
const cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId


app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goub9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const shopCollection = client.db("fullStackShop").collection("products");
  const orderCollection = client.db("fullStackShop").collection("orders");

  //API CALLING CODE HERE

  //Products Add API
  app.post('/addProduct',(req,res)=>{
      const newProduct = req.body
      shopCollection.insertOne(req.body)
      .then(result=>{
        //console.log('Data Inserted',result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  //Products Add API
  app.post('/addOrder',(req,res)=>{
      const newProduct = req.body
      orderCollection.insertOne(req.body)
      .then(result=>{
        console.log('Order Inserted',result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  
  //Show All Products

  app.get('/products',(req,res) => {
    shopCollection.find()
      .toArray((err,items) => {
          res.send(items)
      })
  })

  app.get('/checkout/:id',(req,res) =>{
    shopCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,document)=>{
        res.send(document)
      })
  })

  app.get('/orders/:email',(req,res) =>{
    orderCollection.find({email: req.params.email})
    .toArray((err,document)=>{
        res.send(document)
      })
  })

  app.delete('/delete/:id', (req,res) => {
    shopCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log('Product Deleted')
      res.send(result.deletedCount > 0)
    })
  });






});
app.get('/', (req, res) => {
  res.send('Hello World Shop!')
})

app.listen(port, () => {
  
  console.log(`Server Site Running`);

})