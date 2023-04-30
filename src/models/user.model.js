const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('user', {
		firstName:{
            allowNull: false,
            type: DataTypes.STRING
		},

		lastName:{
            allowNull: false,
            type: DataTypes.STRING
        },
        email:{
            primaryKey: true,
            allowNull: false,
            type: DataTypes.STRING
        },
        password:{
            allowNull: false,
            type: DataTypes.STRING
        },
        balance:{
			allowNull: false,
			type: DataTypes.DECIMAL(10,2)
        },
	},{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });
};
