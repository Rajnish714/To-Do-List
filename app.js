
const express = require("express");

const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js")

const app = express();

const items = ["eat", "cook", "guy"];
const workList = []
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", (req, res) => {


    const day = date.getDay();
    res.render("list", { listTitle: day, newItemList: items });

})

app.post("/", (req, res) => {

    const item = req.body.newItem
    if (req.body.list === "work") {
        workList.push(item)
        res.redirect("/work")
    }
    else {
        items.push(item)
        res.redirect("/")
    }


})


app.get("/work", (req, res) => {

    res.render("list", { listTitle: "work", newItemList: workList });

})



app.listen(process.env.PORT || 3000, () => {
    console.log("server has started!")
})
