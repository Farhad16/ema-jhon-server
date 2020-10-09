const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neh82.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhon").collection("products");
    const ordersCollection = client.db("emaJhon").collection("orders");


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })


    app.get('/products', (req, res) => {
        const search = req.query.search;
        productsCollection.find({
            name: { $regex: search }
        })
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/product/:key', (req, res) => {
        console.log(req.params.key);
        productsCollection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/productByKey', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});




app.get('/', (req, res) => {
    res.send("Hello ema john")
})

app.listen(process.env.PORT || port, () => console.log("App listen"))