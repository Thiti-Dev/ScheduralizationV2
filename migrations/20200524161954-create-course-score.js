'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('CourseScores', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			courseID: {
				type: Sequelize.STRING,
				allowNull: false
			},
			score: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			description: {
				type: Sequelize.STRING,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('CourseScores');
	}
};
