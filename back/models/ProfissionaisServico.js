module.exports = (sequelize, DataTypes) => {
    const ProfissionaisServico = sequelize.define('ProfissionaisServico', {
        servico_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profissional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'ProfissionaisServico'
    });

    ProfissionaisServico.associate = (models) => {
        ProfissionaisServico.belongsTo(models.Servicos, { foreignKey: 'servico_id' });
        ProfissionaisServico.belongsTo(models.Profissionais, { foreignKey: 'profissional_id' });
    };

    return ProfissionaisServico;
};
