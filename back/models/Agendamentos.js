module.exports = (sequelize, DataTypes) => {
    const Agendamentos = sequelize.define('Agendamentos', {
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        servico_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profissional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data_hora: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('agendado', 'em andamento', 'concluido'),
            allowNull: false,
            defaultValue: 'agendado'
        }
    });

    Agendamentos.associate = (models) => {
        Agendamentos.belongsTo(models.Clientes, { foreignKey: 'cliente_id' });
        Agendamentos.belongsTo(models.Servicos, { foreignKey: 'servico_id' });
        Agendamentos.belongsTo(models.Profissionais, { foreignKey: 'profissional_id', as: 'Profissional' });
    };
    return Agendamentos;
}
