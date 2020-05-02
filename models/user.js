'use strict';
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
		{}
	);
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
