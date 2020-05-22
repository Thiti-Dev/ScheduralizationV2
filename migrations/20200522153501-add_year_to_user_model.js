'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();

		try {
			await queryInterface.addColumn('Users', 'year', {
				type: Sequelize.INTEGER,
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
			await queryInterface.removeColumn('Users', 'year');
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
