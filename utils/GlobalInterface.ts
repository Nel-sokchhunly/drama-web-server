export interface EpisodeObjType {
    title: String,
    link: String,
    ep_streaming_link: String,
    upload_time: String,
    type: String
}

export interface DramaObjType {
    title: String,
    query_title: String,
    other_name: String[],
    image_info: Object,
    description: String[],
    status: String,
    genre: String[],
    trailer_embed_link: Object,
    episodes: EpisodeObjType[],
    last_updated: Date
}

