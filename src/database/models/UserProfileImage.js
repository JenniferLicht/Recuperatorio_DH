module.exports = (sequelize, DataTypes) => {
    let alias = "UserProfileImage";
    let cols = {
        imageID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ubicacion: {
            type: DataTypes.STRING,
        },
        bajaLogica: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    };
    let config = {
        tableName: "UserProfileImage",
        timestamps: false
    };

    const UserProfileImage = sequelize.define(alias, cols, config);

    UserProfileImage.associate = function (models) {
         UserProfileImage.belongsTo(models.User, {
             as: "User",
             foreignKey: "userID"
         });
    };

    return UserProfileImage;
};