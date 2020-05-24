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
			},
			credit: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{}
	);
	Course.associate = function(models) {
		//associations can be defined here
		Course.hasMany(models.CourseAvailable, {
			foreignKey: {
				name: 'courseID',
				allowNull: false
			},
			sourceKey: 'courseID',
			as: 'courseAvailable'
		});

		Course.hasMany(models.CourseScore, {
			foreignKey: {
				name: 'courseID',
				allowNull: false
			},
			sourceKey: 'courseID',
			as: 'courseScoring'
		});
	};
	return Course;
};
