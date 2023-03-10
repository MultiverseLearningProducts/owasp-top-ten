"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const { User, sequelize } = require("./sequelize");

const app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
	autoescape: true,
	express: app,
});

/** @type {session.SessionOptions} */
const sess = {
	cookie: {
		maxAge: 24 * 60 * 60 * 1000, // 1 day
		sameSite: true,
	},
	resave: false,
	saveUninitialized: true,
	secret: process.env.SECRET,
};

app.use(session(sess));
app.use(express.static("public"));
app.use(cookieParser(process.env.SECRET));
app.use(express.urlencoded({ extended: true }));

function isAuthenticated(req, _res, next) {
	if (req.session.user) {
		next();
	} else {
		next("route");
	}
}

app.get("/", isAuthenticated, (req, res) => {
	const { user } = req.session;
	res.render("index.html", { email: user.email });
});

app.get("/", (_req, res) => {
	res.render("login.html");
});

app.post("/login", async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { email: req.body.email } });
		const hash = user ? user.get("hash") : "undefined";
		const success = await bcrypt.compare(req.body.password, hash);
		if (!success) {
			console.log("Incorrect email and/or password");
			res.redirect("/");
			return;
		}
		req.session.user = user;
		req.session.save((err) => {
			if (err) throw err;
			res.redirect("/");
		});
	} catch (err) {
		console.log("Something went wrong");
		next(err);
		res.redirect("/");
	}
});

app.get("/logout", (req, res, next) => {
	delete req.session.user;
	req.session.save((err) => {
		if (err) next(err);
		res.redirect("/");
	});
});

app.get("/register", isAuthenticated, (_req, res) => {
	res.redirect("/");
});

app.get("/register", (_req, res) => {
	res.render("register.html");
});

app.post("/account/create", async (req, res, next) => {
	// 5-8 chars, 1+ number, 1+ lowercase, 1+ uppercase, and 1+ "special" char
	const regex =
		/^(?=.*?[0-9])(?=.*?[\W_])(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z0-9\W_]{5,8}$/;

	if (!regex.test(req.body.password)) {
		console.log("Invalid password");
		res.redirect("/register");
		return;
	}

	try {
		const hash = await bcrypt.hash(req.body.password, 10);
		await User.create({ email: req.body.email, hash });
		console.log("User created");
		res.redirect("/");
	} catch (err) {
		next(err);
		console.log("Invalid username");
		res.redirect("/register");
	}
});

const port = 3000;

app.listen(port, async () => {
	try {
		await sequelize.authenticate();
		console.log(`Listening at http://localhost:${port}`);
	} catch (err) {
		console.error(err);
	}
});
