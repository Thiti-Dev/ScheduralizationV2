'use strict';
module.exports = (sequelize, DataTypes) => {
	const CourseScore = sequelize.define(
		'CourseScore',
		{
			courseID: {
				type: DataTypes.STRING,
				allowNull: false
			},
			score: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{}
	);
	CourseScore.associate = function(models) {
		// associations can be defined here
		CourseScore.belongsTo(models.User, {
			foreignKey: {
				name: 'userId',
				allowNull: false
			},
			as: 'userData',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		});
	};
	return CourseScore;
};
