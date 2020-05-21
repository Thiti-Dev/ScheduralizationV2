'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();

		try {
			await queryInterface.addColumn('Users', 'semester', {
				type: Sequelize.INTEGER,
				allowNull: true
			});
			await queryInterface.addColumn('Users', 'studentGroup', {
				type: Sequelize.STRING(10),
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
			await queryInterface.removeColumn('Users', 'semester');
			await queryInterface.removeColumn('Users', 'studentGroup');
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
