const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.static("public"));

// Make it so that you can get values from submitted forms
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pathuri@4061",
  database: "My_Project",
});

connection.connect(function (err) {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/index", (req, res) => {
  connection.query("SELECT * FROM items", (error, results) => {
    res.render("index.ejs", { items: results });
  });
});

// Add a route to display the create page
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// Add a route method for creating items
app.post("/create", (req, res) => {
  connection.query(
    "INSERT INTO items (name) VALUES (?)",
    [req.body.itemName],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.redirect("/index");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
  // connection.query("ALTER TABLE items AUTO_INCREMENT = 1");
  connection.query("set @autoid :=0");
  connection.query("update items set id = @autoid :=(@autoid+1)");
  connection.query("alter table items auto_increment = 1");
});

app.get("/edit/:id", (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.render("edit.ejs", { item: results[0] });
    }
  );
});

app.post("/update/:id", (req, res) => {
  // Write code to update the selected item
  connection.query(
    "UPDATE items SET name = ? WHERE id = ?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.redirect("/index");
    }
  );
});

//BOLG-START

app.listen(8050);
