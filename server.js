const express = require("express");
const app = express();
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();

app.set("view engine", "ejs");

const connection = require("./config/db")

// app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/views"));
// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/public/create.html");
    res.redirect("/create.html");
})

app.get("/data", (req, res) => {
    connection.query("SELECT * FROM products", (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("read.ejs", { rows });
        }
    })
})

app.get("/delete-data", (req, res) => {
    const deleteQuery = "DELETE FROM products where id=?";
    connection.query(deleteQuery, [req.query.id], (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/data");
        }
    })
})

app.get("/update-data", (req, res) => {
    connection.query("SELECT * FROM products where id=?", [req.query.id], (err, eachRow) => {
        if(err) {
            console.log(err);
        }
        else {
            result = JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);
            res.render("edit.ejs", { result });
        }
    })       
})

//update
app.post("/final-update", (req, res) => {
    const id = req.body.hidden_id;
    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;

    console.log("id....", id);

    const updateQuery = "update products set name=?, price=?, quantity=? where id=?";

    try {

        connection.query(updateQuery, [name, price, quantity, id], (err,rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error");
                }
                else {
                    res.redirect("/data")
                }
            }
        );
    }
    catch(err) {
        console.log(err);
    }
})




// create
app.post("/create", (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;

    try {
        connection.query("INSERT into products (name, price, quantity) values(?, ?, ?)",
            [name, price, quantity],
            (err,rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error");
                }
                else {
                    res.redirect("/data")
                }
            }
        );
    }
    catch(err) {
        console.log(err);
    }
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(process.env.PORT || 4000, (error) => {
    if (error) throw error;

    console.log(`server running on ${process.env.PORT}`);
});

