'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('UserSchedules', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			courseID: {
				type: Sequelize.STRING
			},
			day: {
				type: Sequelize.STRING
			},
			start: {
				type: Sequelize.STRING
			},
			end: {
				type: Sequelize.STRING
			},
			classroom: {
				type: Sequelize.STRING,
				allowNull: false
			},
			section: {
				type: Sequelize.STRING,
				allowNull: false
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
		return queryInterface.dropTable('UserSchedules');
	}
};
