module.exports = (sequelize, DataTypes) => {
    const ConsumoAgendamento = sequelize.define('ConsumoAgendamento', {
        id_agendamento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_produto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantidade_utilizada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        freezeTableName: true,
        tableName: 'ConsumoAgendamento'
    });

    ConsumoAgendamento.associate = (models) => {
        ConsumoAgendamento.belongsTo(models.Agendamentos, { foreignKey: 'id_agendamento', as: 'Agendamento' });
        ConsumoAgendamento.belongsTo(models.Produtos, { foreignKey: 'id_produto', as: 'Produto' });
    };

    return ConsumoAgendamento;
};