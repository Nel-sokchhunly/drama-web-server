import express from "express";

import DramaList from "../models/drama";
import scraper from "../utils/scaper";

const router = express.Router();

router.get("/:dramas", async (req, res) => {
    /* This endpoint for getting the stored drama information in the database and return it back to the user
     * if the drama exist
     *
     * :params: dramas:String = a string contains all the query_title that the user want to get from the database
     * */
    // convert query string to list
    // this is the list of string of request query_title
    const queryDramaList = req.params.dramas.split(",");

    // getting all dramas in the database that is being requested
    const dramas = await DramaList.find({
        query_title: { $in: queryDramaList },
    });

    // getting all available stored drama based on the query
    // this excludes the title that doesn't store in the database
    const userDrama: any[] = queryDramaList;
    // running through the drama database and replace the list of query_title with the actual drama object
    for (const index in dramas) {
        // get the current drama object
        const dramaObj = dramas[index];

        //check if the current drama query_title exist in the request query_title
        if (userDrama.includes(dramaObj.query_title)) {
            // replacing the string of title with the drama object
            const index = userDrama.indexOf(dramaObj.query_title);
            userDrama[index] = dramaObj;
        }
    }

    // running through the list of the request query_titles
    // and scraped the drama that doesn't exist in the database
    // original request query_title
    // At this point, the list of request query_title can consist of either 'String' or 'Object'
    // Object: indicate that the drama exist in the scraped database
    // String: indicate that the drama doesn't exist in the scraped database
    for (let index in userDrama) {
        // getting the current item of the loop
        const drama = userDrama[index];

        // checking if the current item is a string type
        // if it is, it meant it doesn't exist in the database because it didn't get
        // replace with an actual drama object
        if (typeof drama == "string") {
            // scraping the current item of the loop
            // scraper function return either Object or Null
            const scrapedDrama = await scraper(drama);
            // checking if the scraped data is valid
            if (scrapedDrama) {
                const newDrama = new DramaList(scrapedDrama);
                await newDrama
                    .save()
                    .then((result) => {
                        userDrama[index] = result;
                    })
                    .catch((err) => {
                        userDrama[index] = null;
                        console.log(err);
                    });
            }
        }
    }

    // res.send(userDrama);
});

export = router;
