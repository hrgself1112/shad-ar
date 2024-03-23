
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config()
const registerRouter = require("./routes/resiter");
const bymongoose = require('./db-connectors/bymonngoose');
const port = process.env.PORT
const serverless = require("serverless-http")

bymongoose()


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' })); // Set your desired payload size limit
app.use(cors());
app.use("/register", registerRouter)







app.get("/", (req, res) => {
  res.send("you are in homepage")
})




app.listen(port, () => {
  console.log(`Express.js backend is listening on port ${port}`);
});


module.exports.handler=serverless(app)