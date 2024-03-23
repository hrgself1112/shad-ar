const { mongoose } = require("mongoose");
const { ArticleSchema } = require("../schemas/articles")

const ArticleRegistrationsModel = mongoose.model("Article"  , ArticleSchema)

module.exports =     ArticleRegistrationsModel
