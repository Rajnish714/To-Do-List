
const express = require("express");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");
const _ = require("lodash")
//const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")
const app = express();
dotenv.config()


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);

const itemSchema = {
    name: String
}

const Item = mongoose.model("Item", itemSchema)

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)


const item1 = new Item({
    name: "welcome to the todo list!"
});



const defaultItems = [item1];


app.get("/", (req, res) => {

    // const day = date.getDay();
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("data inserted!");
                }
            })
            res.redirect("/")
        } else {

            res.render("list", { listTitle: "Today", newItemList: foundItems });
        }

    })

})


app.get("/:customItemList", (req, res) => {

    const customList = _.capitalize(req.params.customItemList);
    List.findOne({ name: customList }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customList,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customList)
            } else {
                res.render("list", { listTitle: foundList.name, newItemList: foundList.items })
            }

        }

    })

})

app.post("/", (req, res) => {

    const itemName = req.body.newItem
    const listName = req.body.list
    const item = new Item({
        name: itemName
    })
    if (listName === "Today") {
        item.save()
        res.redirect("/");
    } else {

        List.findOne({ name: listName }, (err, foundList) => {

            foundList.items.push(item)
            foundList.save();
            res.redirect("/" + listName)


        });
    }


});


app.post("/delete", (req, res) => {

    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {

        Item.findByIdAndRemove(checkItemId, err => {
            if (!err) {

                console.log("successfully deleted");
                res.redirect("/")

            }
        })

    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkItemId } } }, (err, foundlist) => {
            if (!err) {
                res.redirect("/" + listName)
            }
        })

    }

})



app.listen(process.env.PORT || 3000, () => {
    console.log("server has started!")
})
