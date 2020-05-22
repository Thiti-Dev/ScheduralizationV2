'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();

		try {
			await queryInterface.addColumn('Users', 'learnedCourses', {
				type: Sequelize.TEXT,
				allowNull: true
			});
			await transaction.commit();
			return Promise.resolve();
		} catch (err) {
			if (transaction) {
				await transaction.rollback();
			}
			return Promise.reject(err);
		}
	},

	down: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.removeColumn('Users', 'learnedCourses');
			await transaction.commit();
			return Promise.resolve();
		} catch (err) {
			if (transaction) {
				await transaction.rollback();
			}
			return Promise.reject(err);
		}
	}
};
