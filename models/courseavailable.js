'use strict';
module.exports = (sequelize, DataTypes) => {
	const CourseAvailable = sequelize.define(
		'CourseAvailable',
		{
			courseID: {
				type: DataTypes.STRING,
				allowNull: false
			},
			semester: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			totalSeat: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			section: {
				type: DataTypes.STRING,
				allowNull: false
			},
			allowedGroup: {
				type: DataTypes.STRING,
				allowNull: false
			},
			day: {
				type: DataTypes.STRING,
				allowNull: false
			},
			start: {
				type: DataTypes.STRING,
				allowNull: true
			},
			end: {
				type: DataTypes.STRING,
				allowNull: true
			},
			classroom: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{}
	);
	CourseAvailable.associate = function(models) {
		//associations can be defined here
		CourseAvailable.belongsTo(models.Course, {
			foreignKey: {
				name: 'courseID',
				allowNull: false
			},
			targetKey: 'courseID',
			as: 'courseData',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		});
	};
	return CourseAvailable;
};
