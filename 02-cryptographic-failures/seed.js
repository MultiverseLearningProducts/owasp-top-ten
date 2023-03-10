"use strict";

const crypto = require("crypto");
const { User, sequelize } = require("./sequelize");

(async function () {
	// Pretend these came from a POST request
	const email = "kieran.barker@multiverse.io";
	const password = "opensesame";

	try {
		await sequelize.sync({ force: true });
		// MD5 is not good enough, and the lack of a salt is terrible too
		const hash = crypto.createHash("md5").update(password).digest("hex");
		await User.create({ email, hash });
	} catch (error) {
		console.error(error);
	}
})();
