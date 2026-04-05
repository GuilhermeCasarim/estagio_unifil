module.exports = (sequelize, DataTypes) => {
    const Produtos = sequelize.define('Produtos', { //nome tabela
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        },
        observacoes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estoque_minimo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estoque_atual: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Produtos;
}