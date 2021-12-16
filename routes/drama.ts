import express from 'express';

import DramaList from '../models/drama';
import UserList from "../models/user"
import scraper from "../utils/scaper";

const router = express.Router()

router.get('/:dramas', async (req, res) => {

    // convert query string to list
    const queryDramaList = req.params.dramas.split(',')

    // getting all the dramas in the database
    const dramas = await DramaList.find({})

    // getting all available stored drama based on the query
    // this excludes the title that doesn't store in the database
    const userDrama: any[] = queryDramaList
    for (const drama in dramas) {

        const dramaObj = dramas[drama]

        // replacing the string of title with the drama object
        if (userDrama.includes(dramaObj.query_title)) {

            const index = userDrama.indexOf(dramaObj.query_title)

            userDrama[index] = dramaObj

        }
    }

    // fetching the drama that is not the database
    for (let index in userDrama) {
        const drama = userDrama[index]
        if (typeof drama == 'string') {
            const scrapedDrama = await scraper(drama)
            if (scrapedDrama) {
                const newDrama = new DramaList(scrapedDrama)
                await newDrama.save()
                    .then((result) => {
                        userDrama[index] = result
                    })
                    .catch(err => console.log(err))

            }
        }
    }


    res.send(userDrama)
})


export = router;
