const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('transactions', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id:{
		    allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
		},
		email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
		symbol: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		price: {
			allowNull: false,
			type: DataTypes.DECIMAL(10,2)
		},
		amount: {
            allowNull: false,
            type: DataTypes.DECIMAL(10,2)
        },
        action: {
            allowNull: false,
            type: DataTypes.STRING,
        }
	},{
//         timestamps: false,
        createdAt: false,
//         updatedAt: false,
    });
};
