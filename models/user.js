'use strict';
const bcrypt = require('bcryptjs');
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
		return await bcrypt.compare(enteredPassword, this.password);
	};
	// ────────────────────────────────────────────────────────────────────────────────

	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
