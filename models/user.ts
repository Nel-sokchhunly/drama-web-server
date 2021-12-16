import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    drama_list: {
        type: [String],
        required: true
    },
}, {
    versionKey: false
})

const UserList = mongoose.model('user-drama-list', userSchema, 'user-drama-list')

export = UserList;
