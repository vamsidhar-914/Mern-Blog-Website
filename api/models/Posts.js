const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        userId:{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        content : {
            type : String,
            required : true,
        },
        title : {
            type : String,
            required : true,
            unique : true
        },
        image : {
            type : String,
            default : "https://media.istockphoto.com/id/1440246683/photo/blog-word-on-wooden-cube-blocks-on-gray-background.webp?b=1&s=170667a&w=0&k=20&c=eRpm1n7qvukgx7bK4ZWH8_LO8BPAoFFsxCGbDFatkoE=",
        },
        category : {
            type : String,
            default : 'uncategorized'
        },
        slug : {
            type: String,
            required : true,
            unique : true
        }
    } , { timestamps : true })

module.exports = mongoose.model('Post' , postSchema)