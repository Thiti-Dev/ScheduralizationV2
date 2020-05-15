'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();

		try {
			await queryInterface.addColumn('Users', 'confirmEmail', {
				type: Sequelize.STRING,
				allowNull: true
			});
			await queryInterface.addColumn('Users', 'confirmedAt', {
				type: Sequelize.DATE,
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
			await queryInterface.removeColumn('Users', 'confirmEmail');
			await queryInterface.removeColumn('Users', 'confirmedAt');
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
