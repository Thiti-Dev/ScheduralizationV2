'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Courses', {
			courseID: {
				allowNull: false,
				type: Sequelize.STRING,
				primaryKey: true
			},
			courseName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			required: {
				type: Sequelize.STRING,
				allowNull: true
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
