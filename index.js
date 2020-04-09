const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()

const app = express()

app.use(cors())
// parse application/json
app.use(bodyParser.json());

const uri = process.env.DB_PATH
let client = new MongoClient(uri, { useNewUrlParser: true });


app.get('/', (req, res) =>{
    res.send('Welcome To Backend Doctors Portal')
})
app.get("/getAppointments", (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      // { name: 'mobile', stock: { $gt: 20 } } find er modde dile filter korbe
      const collection = client.db("doctorsPortal").collection("appointments");
      collection.find().toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });
      client.close();
    });
    
});





app.get('/patients/:id', (req, res) => {
    const id = req.params.id
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("doctorsPortal").collection("appointments");
      collection.find({id}).toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents[0]);
        }
      });
      client.close();
    });
})



app.post('/getAppointmentById', (req, res) => {
  const id = req.params.id
  const patientsId = req.body
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.find({ id: {$in: patientsId} }).limit(5).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});




// post
app.post('/addAppointment', (req, res) => {
  const patientsDetails = req.body
  orderDetails.orderTime = new Date()
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err })
      } else {
        res.send(result.ops[0]);
      }

    })
    client.close();
  });
}) 



// app.post('/addProduct', (req, res) => {
//     client = new MongoClient(uri, { useNewUrlParser: true });
//     const product = req.body

//     client.connect(err => {
//       const collection = client.db("doctorsPortal").collection("appointments");
//     collection.insertOne(product, (err, result) => {
//         if (err) {
//             console.log(err)
//             res.status(500).send({message: err})
//         }else{
//             res.send(result.ops[0]);
//         }
        
//     })
//     client.close();
//     });
// })


// app.post('/addProducts', (req, res) => {
//   // console.log('data received', req.body);
//   client = new MongoClient(uri, { useNewUrlParser: true });

//   //save to database
//   const product = req.body
//   // console.log(product);

//   client.connect(err => {
//     const collection = client.db("doctorsPortal").collection("features");
//     // const collection = client.db("onlineStore").collection("products");
//     collection.insert(product, (err, result) => {
//       // console.log("successfully inserted", result);
//       if (err) {
//         console.log(err)
//         res.status(500).send({ message: err })
//       } else {
//         res.send(result.ops[0]);
//       }

//     })
//     client.close();
//   });
// })

const port = process.env.PORT || 4400
app.listen(port, () => console.log(`Listening to port ${port}`))











