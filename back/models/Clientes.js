module.exports = (sequelize, DataTypes) => {
    const Clientes = sequelize.define('Clientes', { //nome tabela
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: true
        },
        data_nascimento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        observacoes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return Clientes;
}