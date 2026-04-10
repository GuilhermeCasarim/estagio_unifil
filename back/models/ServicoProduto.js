module.exports = (sequelize, DataTypes) => {
    const ServicoProduto = sequelize.define('ServicoProduto', {
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
        tableName: 'ServicoProduto'
    });

    ServicoProduto.associate = (models) => {
        ServicoProduto.belongsTo(models.Servicos, { foreignKey: 'servico_id' });
        ServicoProduto.belongsTo(models.Produtos, { foreignKey: 'produto_id' });
    };

    return ServicoProduto;
};
