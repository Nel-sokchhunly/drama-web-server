import express from "express";

import UserList from "../models/user";

const router = express.Router();

router.get("/:user", async (req, res) => {
    /*
    * this endpoint is using for getting the user object in the database and then return the data
    * :param: user:String = the username of the user
    *
    * :return: the object of the requested user
    */

    const userParam: String = req.params.user;
    
    const userData = await UserList.find({
        'username': userParam
    })
    if (userData) {
        res.send(userData[0])
    } else {
        const errorMsg = "The user doesn't exist on the database"
        res.status(404).send(errorMsg)
    }
});

export = router;
