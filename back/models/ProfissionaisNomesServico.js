module.exports = (sequelize, DataTypes) => {
    const ProfissionaisNomesServico = sequelize.define('ProfissionaisNomesServico', {
        nome_servico_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profissional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'ProfissionaisNomesServico'
    });

    ProfissionaisNomesServico.associate = (models) => {
        ProfissionaisNomesServico.belongsTo(models.NomesServico, { foreignKey: 'nome_servico_id' });
        ProfissionaisNomesServico.belongsTo(models.Profissionais, { foreignKey: 'profissional_id' });
    };

    return ProfissionaisNomesServico;
};
