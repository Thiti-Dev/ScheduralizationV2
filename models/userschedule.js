'use strict';
module.exports = (sequelize, DataTypes) => {
	const UserSchedule = sequelize.define(
		'UserSchedule',
		{
			courseID: {
				type: DataTypes.STRING,
				allowNull: false
			},
			day: {
				type: DataTypes.STRING,
				allowNull: false
			},
			start: {
				type: DataTypes.STRING,
				allowNull: false
			},
			end: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{}
	);
	UserSchedule.associate = function(models) {
		// associations can be defined here
		UserSchedule.belongsTo(models.User, {
			foreignKey: {
				name: 'userId',
				allowNull: false
			},
			as: 'userData',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		});

		UserSchedule.belongsTo(models.Course, {
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
	return UserSchedule;
};
