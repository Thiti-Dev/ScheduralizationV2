'use strict';
module.exports = (sequelize, DataTypes) => {
	const Course = sequelize.define(
		'Course',
		{
			courseID: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			courseName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			required: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{}
	);
	Course.associate = function(models) {
		// associations can be defined here
	};
	return Course;
};
