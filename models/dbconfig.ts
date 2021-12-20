import mongoose from "mongoose";

const DatabaseConnect = (callback) => {
    // connecting to mongodb
    const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smkuq.mongodb.net/drama-list?retryWrites=true&w=majority`;
    mongoose.connect(dbURI).then(() => {
        callback();
        console.log("database connected");
    });
};

export = DatabaseConnect;
