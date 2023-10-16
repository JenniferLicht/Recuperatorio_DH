const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    let alias = "User";
    let cols = {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING
        },
        apellido: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
        },
        clave: {
            type: DataTypes.STRING,
            set(value) {
              this.setDataValue('clave', bcryptjs.hashSync(value,10));
            }        
        },
        esAdmin: {
            type: DataTypes.BOOLEAN
        },
        bajaLogica: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fechaRegistro: {
            type: DataTypes.DATE
        }
    };
    let config = {
        tableName: "User",
        timestamps: false
    };

    const User = sequelize.define(alias, cols, config);

    User.associate = function (models) {
        User.hasOne(models.UserProfileImage, {
          foreignKey: 'userID',
          as: 'ProfileImage',
        });
      };

    return User;
};