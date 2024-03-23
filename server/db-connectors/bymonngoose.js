const { default: mongoose } = require("mongoose");

function bymongoose() {
    
    mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
}

module.exports = bymongoose