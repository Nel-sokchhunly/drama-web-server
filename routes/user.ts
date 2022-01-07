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
        username: userParam,
    });

    if (userData.length > 0) {
        res.send(userData[0]);
    } else {
        res.status(404).send("The user doesn't exist on the database");
    }
});

router.put("/:username/add/:query_title", async (req, res) => {
    /*
    This is endpoint is responsible adding drama query_title into the drama_list 
    array of the user

    :param: username:String => the username of the specific user
    :param: drama:String => the string of query_title to add to the specific user

    :return: the updated object of the user
    */

    const usernameParams: String = req.params.username;
    const queryTitleParams: String = req.params.query_title;

    const userObj = await UserList.find({
        username: usernameParams,
    });

    // validating user params
    if (userObj && userObj.length == 0) {
        res.status(404).send("The user doesn't exist on the database");
        return;
    }

    const user = userObj[0];

    // validating if the drama that intended to be add to the list is already
    // exist in the list
    if (user.drama_list.includes(queryTitleParams)) {
        res.status(400).send(
            "The drama already exist inside the user drama list"
        );
        return;
    }

    user.drama_list.push(queryTitleParams);

    const result = await UserList.updateOne(
        {
            username: usernameParams,
        },
        {
            $set: {
                drama_list: user.drama_list,
            },
        }
    );

    res.send(result);
});

export = router;
