'use strict';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: true
				},
				unique: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			firstName: {
				type: DataTypes.STRING(50),
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING(50),
				allowNull: false
			},
			studentID: {
				type: DataTypes.STRING(15),
				allowNull: false
			},
			confirmEmail: {
				type: DataTypes.STRING,
				allowNull: true
			},
			confirmedAt: {
				type: DataTypes.DATE,
				allowNull: true
			}
		},
		{
			hooks: {
				async beforeCreate(user) {
					//
					// ─── ENCRYPT REGISTERED PASSWORD Using [bcrypt] ────────────────────────────────────────────────
					//
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
					// • • • • •
				}
			}
		}
	);
	//
	// ─── INSTANCE METHOD ────────────────────────────────────────────────────────────
	//

	User.prototype.matchPassword = async function(enteredPassword) {
		console.log(`[CHECKING]: ${enteredPassword} with ${this.password}`);
		return await bcrypt.compare(enteredPassword, this.password);
	};

	User.prototype.getSignedJwtToken = function() {
		return jwt.sign({ id: this.id, email: this.username, studentID: this.studentID }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE
		});
	};

	User.prototype.getConfirmToken = async function() {
		const confirmToken = crypto.randomBytes(20).toString('hex');
		this.confirmEmail = crypto.createHash('sha256').update(confirmToken).digest('hex');
		return confirmToken;
	};
	// ────────────────────────────────────────────────────────────────────────────────

	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
