import DramaList from "./models/drama";

require("dotenv").config();

import express from "express";
import morgan from 'morgan';

// database
import DatabaseConnect from "./models/dbconfig";

//routes
import drama from "./routes/drama";
import user from "./routes/user";

// initializing express app
const app = express();
app.use(express.json());
app.use(morgan('dev'))

// listen for request
const port = process.env.PORT;
DatabaseConnect(() => {
    app.listen(port, () => {
        console.log(`server is running on ${port}`);
    });
})

app.get("/", async (req, res) => {
    /*
    * This endpoint use for getting all the drama that stored in the database
    *
    * :return: all drama stored in the database
    */

    const dramasList = await DramaList.find({})
    if (dramasList) {
        res.send(dramasList);
    } else {
        res.status(500).send("There is broken on the database")
    }

});

// connecting route
app.use("/drama", drama);
app.use("/user", user);

// 404 status code
app.use((req, res) => {
    res.status(404).send("Ohh no! Our server, it's broken!");
});
