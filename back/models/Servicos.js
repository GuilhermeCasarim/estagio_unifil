module.exports = (sequelize, DataTypes) => {
    const Servicos = sequelize.define('Servicos', { //nome tabela
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preco: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        profissionais_ativos: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
    })

    Servicos.associate = (models) => {
        Servicos.belongsToMany(models.Produtos, {
            through: models.ServicoProduto,
            foreignKey: 'servico_id',
            otherKey: 'produto_id'
        });
    };
    return Servicos;
}