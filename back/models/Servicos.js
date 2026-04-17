module.exports = (sequelize, DataTypes) => {
    const Servicos = sequelize.define('Servicos', { //nome tabela
        nome_servico_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        categoria_servico_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        preco: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
    })

    Servicos.associate = (models) => {
        Servicos.belongsTo(models.NomesServico, {
            foreignKey: 'nome_servico_id',
            as: 'nome_servico'
        })
        Servicos.belongsTo(models.CategoriasServico, {
            foreignKey: 'categoria_servico_id',
            as: 'categoria'
        })
        Servicos.belongsToMany(models.Produtos, {
            through: models.ServicosProduto,
            foreignKey: 'servico_id',
            otherKey: 'produto_id'
        });
        Servicos.belongsToMany(models.Profissionais, {
            through: models.ProfissionaisServico,
            foreignKey: 'servico_id',
            otherKey: 'profissional_id'
        });
    };
    return Servicos;
}