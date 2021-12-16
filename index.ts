require("dotenv").config();

import express from "express";
import mongoose from 'mongoose';

//routes
import drama from './routes/drama';

// connecting to mongodb
const dbURI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.smkuq.mongodb.net/drama-list?retryWrites=true&w=majority`
const port = process.env.PORT;
mongoose.connect(dbURI)
    .then(() => {
        // listen for request
        app.listen(port, () => {
            console.log(`server is running on ${port}`);
        });
        console.log('database connected')
    })

// initializing express app
const app = express();
app.use(express.json());


app.get('/', async (req, res) => {


    res.send('dramas')
})

// connecting route
app.use("/drama", drama)

// 404 status code
app.use((req, res) => {
    res.status(404).send("Ohh no! Our server, it's broken!");
});


