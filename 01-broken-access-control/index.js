"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const { sequelize, User } = require("./sequelize");

const app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
	autoescape: true,
	express: app,
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		},
		resave: false,
		saveUninitialized: true,
		secret: process.env.SECRET,
	})
);

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
		req.session.regenerate((err) => {
			if (err) next(err);
			req.session.user = user;
			req.session.save((err) => {
				if (err) next(err);
				res.redirect("/");
			});
		});
	} catch (err) {
		console.log("Failed to log in");
		next(err);
		res.redirect("/");
	}
});

app.get("/logout", (req, res, next) => {
	delete req.session.user;
	req.session.save((err) => {
		if (err) next(err);
		req.session.regenerate((err) => {
			if (err) next(err);
			res.redirect("/");
		});
	});
});

app.get("/change-email", isAuthenticated, (_req, res) => {
	res.render("change-email.html");
});

app.get("/change-email", (_req, res) => {
	res.redirect("/");
});

app.post(
	"/email/change",
	cookieParser(process.env.SECRET),
	async (req, res, next) => {
		// On its own, this is vulnerable to CSRF!
		if (req.session.id !== req.signedCookies["connect.sid"]) {
			console.log("Session IDs don't match");
			res.sendStatus(403);
			return;
		}

		try {
			let user = await User.findByPk(req.session.user.id);
			user = await user.update({ email: req.body.email });
			req.session.user = user;
			req.session.save((err) => {
				if (err) next(err);
				res.redirect("/");
			});
		} catch (err) {
			console.log("Something went wrong");
			next(err);
			res.sendStatus(500);
		}
	}
);

const port = 3000;

app.listen(port, async () => {
	try {
		await sequelize.authenticate();
		console.log(`Listening at http://localhost:${port}`);
	} catch (err) {
		console.error(err);
	}
});
