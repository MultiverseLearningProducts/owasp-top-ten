"use strict";

const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

const sqlite3 =
	process.env.NODE_ENV === "production"
		? require("sqlite3")
		: require("sqlite3").verbose();

const db = new sqlite3.Database(path.join(__dirname, "db.sqlite"));

const app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
	autoescape: true,
	express: app,
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res, next) => {
	db.all("SELECT * FROM messages", [], (err, rows) => {
		if (err) {
			next(err);
		} else {
			res.render("index.html", { messages: rows });
		}
	});
});

const port = 3000;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
