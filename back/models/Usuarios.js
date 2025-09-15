module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define('Usuarios', { //nome tabela
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo_login: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
    return Usuarios;
}