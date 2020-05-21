'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Courses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			courseID: {
				allowNull: false,
				type: Sequelize.STRING,
				primaryKey: true,
				unique: true
			},
			courseName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			required: {
				type: Sequelize.STRING,
				allowNull: true
			},
			credit: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now')
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Courses');
	}
};
