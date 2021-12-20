import mongoose from "mongoose";

const Schema = mongoose.Schema


const dramaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    query_title: {
        type: String,
        required: true
    },
    other_name: [String],
    image_info: {
        type: Map,
        of: String
    },
    description: [String],
    status: String,
    genre: [String],
    trailer_embed_link: String,
    episodes: {
        type: [Map],
        required: true
    },
    last_updated: {
        type: Date,
        required: true
    }
}, {
    versionKey: false
})

const DramaList = mongoose.model('drama', dramaSchema, 'drama')


export = DramaList;
