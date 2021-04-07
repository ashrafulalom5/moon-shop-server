const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config();
// import mongo client
const MongoClient = require('mongodb').MongoClient;

// Middleware init
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

let ObjectId = require('mongodb').ObjectID;

// mongo db information

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5tfhr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("moon-shop").collection("products");
  const ordersCollection = client.db("moon-shop").collection("orders");
	 console.log('db connected');

	 // insert all books from fake data 
	 app.post('/add-book', (req, res) => {
	 	const books = req.body;
	 	// console.log(books);
	 	productsCollection.insertOne(books)
	 });

	 // delete book item 

	 app.delete('/delete-book/:id', (req, res) => {
	 	// const id = ObjectId(req.body.id);
	 	// const id = req.params.id;
	 	// console.log('server', id);
	 	productsCollection.deleteOne({_id: ObjectId(req.params.id)})
	 	.then((err, result) =>{
	 		if(err){
	 		console.log('server',result)
	 	}
	 	})

	 });

	 // get books by id 
	 app.get('/book/:id', (req, res) => {
	 	const id = ObjectId(req.params.id);
	 	// console.log(id);
		 productsCollection.find({ _id: id }).toArray((err, documents) => {
            // res.send(documents[0]);
            res.send(documents);
        });

	 })

	 // post order to database
	 app.post('/orders', (req, res) => {
	 	const orders = req.body;
	 	// console.log('log from post orders', req.body)
	 	ordersCollection.insertOne(orders);
	 });

	 // get orders using user specific email

	 app.post('/getOrderByUser', (req, res) => {
	 	// const email = req.body;
	 	// console.log(email);
	 	ordersCollection.find({userEmail: req.body.userEmail})
	 	.toArray((err, documents) => {
	 		res.send(documents)
	 	})
	 })

	 // get all books from db
	 app.get('/books', (req, res) => {
		productsCollection.find({})
	 	.toArray((err, documents) => {
	 		if(err) {
	 			console.log('log from /books ', err);
	 		}

	 		res.send(documents);
	 	})

	 });


});


// define root uri
app.get('/', (req, res) => {
	// console.log(req.body)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})