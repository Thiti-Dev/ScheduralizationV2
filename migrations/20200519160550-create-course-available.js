'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('CourseAvailables', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			courseID: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: 'Courses',
					key: 'courseID',
					as: 'courseID'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			semester: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			totalSeat: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			section: {
				type: Sequelize.STRING,
				allowNull: false
			},
			allowedGroup: {
				type: Sequelize.STRING,
				allowNull: false
			},
			day: {
				type: Sequelize.STRING,
				allowNull: false
			},
			start: {
				type: Sequelize.STRING,
				allowNull: true
			},
			end: {
				type: Sequelize.STRING,
				allowNull: true
			},
			classroom: {
				type: Sequelize.STRING,
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
		return queryInterface.dropTable('CourseAvailables');
	}
};
