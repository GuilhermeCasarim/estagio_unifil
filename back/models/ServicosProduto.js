module.exports = (sequelize, DataTypes) => {
    const ServicosProduto = sequelize.define('ServicosProduto', {
        servico_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        produto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quant: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        data_hora: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        freezeTableName: true,
        tableName: 'ServicosProduto'
    });

    ServicosProduto.associate = (models) => {
        ServicosProduto.belongsTo(models.Servicos, { foreignKey: 'servico_id' });
        ServicosProduto.belongsTo(models.Produtos, { foreignKey: 'produto_id' });
    };

    return ServicosProduto;
};
