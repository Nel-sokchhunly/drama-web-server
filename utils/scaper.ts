import axios from 'axios';
import * as cheerio from 'cheerio';

// interface
import {DramaObjType} from "./GlobalInterface";
import e from "express";

const base_url = 'https://www2.dramacool.sk'
const drama_detail_base_url = 'https://www2.dramacool.sk/drama-detail/'
const drama_search_base_url = 'https://www2.dramacool.sk/search?type=movies&keyword='

async function scraper(dramaTitle: String) {
    /*
    this functions uses to fetch the drama information from the dramacool website.

    :param drama_title:String = it is the title query of the drama that will be fetched

    :return:    title:String = the official title of the drama
    :return:    query_title:String = the query title to use for link
    :return:    other_name:List<String> = list contains other alternative names of the drama
    :return:    image_info:Object{src, alt} = it is an object of the drama poster info
    :return:    description:List<String> = it is a list of drama description paragraph
    :return:    status:String = the status of the drama
    :return:    genre:list<String> = the list of genre of this drama
    :return:    trailer_embed_link:String = url string of the trailer embed YouTube link
    :return:    episodes:List<Object> = list of existing episode
    */
    try {
        const dramaData: DramaObjType = {
            title: '',
            query_title: dramaTitle,
            other_name: [],
            image_info: {},
            description: [],
            status: '',
            genre: [],
            trailer_embed_link: {},
            episodes: [],
            last_updated: new Date(),
        }

        const request = await axios.get(`${drama_detail_base_url}${dramaTitle}`)
        const html = request.data

        const htmlSoup = cheerio.load(html, null, false)

        // drama title
        dramaData.title = htmlSoup('.info').children().first().text() || ''

        // other title
        const other_name_soup = htmlSoup('p[class=other_name]').children('a[href=/drama-detail/us-that-year]').toArray()
        for (let child in other_name_soup) {
            const other_title = other_name_soup[child].attribs.title.trim()
            dramaData.other_name.push(other_title)
        }

        // image info
        const img_tag = htmlSoup('.img').first().children().first()
        dramaData.image_info = {
            src: img_tag.attr('src'),
            alt: img_tag.attr('alt')
        }

        // status
        dramaData.status = htmlSoup('span:contains("Status:")').next().text()

        // genre
        const genre_tags = htmlSoup('span:contains("Genre:")').parent().find('a').toArray()
        for (let index in genre_tags) {
            const genre = htmlSoup(genre_tags[index]).html() || ''
            if (genre && genre !== '') {
                dramaData.genre.push(genre)
            }
        }

        // trailer embed link
        dramaData.trailer_embed_link = htmlSoup('iframe').attr('src') || ''

        // episodes
        const ep_wrapper_tag = htmlSoup('ul[class="list-episode-item-2 all-episode"]').find('a').toArray()

        for (let tag in ep_wrapper_tag) {
            const a_tag = htmlSoup(ep_wrapper_tag[tag])

            const title = a_tag.find('h3').text()
            const link = `${base_url}${ep_wrapper_tag[tag].attribs.href}`
            const upload_time = a_tag.find('.time').text()
            const type = a_tag.find('.type').text()

            // getting streaming link for this episode
            const epRequest = await axios.get(link)
            const epSoup = cheerio.load(epRequest.data, null, false)

            const ep_streaming_link = 'https:' + epSoup('iframe').attr('src')

            dramaData.episodes.unshift({
                title,
                link,
                ep_streaming_link,
                upload_time,
                type
            })

        }

        // description
        const info_p_tags = htmlSoup('.info').find('p').toArray()

        for (let index in info_p_tags) {

            const p_tag = htmlSoup(info_p_tags[index])

            const descriptionRegex = /.+[.]$/

            if (p_tag.text().match(descriptionRegex)) {
                dramaData.description.push(p_tag.text())
            }
        }

        return dramaData
    } catch (err) {
        console.log(err)
        return null
    }
}


export = scraper;
