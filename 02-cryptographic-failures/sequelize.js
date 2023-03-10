"use strict";

const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	logging: false,
	storage: path.join(__dirname, "db.sqlite"),
});

const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: { isEmail: true },
	},
	hash: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = exports = { sequelize, User };
