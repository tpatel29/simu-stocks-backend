
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('user_owns', {
	    email: { primaryKey: true,allowNull: false, type: DataTypes.STRING },
		symbol: { primaryKey: true,allowNull: false, type: DataTypes.STRING},
		amount: { allowNull: false, type: DataTypes.DECIMAL(10,2) },
		averPrice: { allowNull: false, type: DataTypes.DECIMAL(10,2) },
	},{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });
};
