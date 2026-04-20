module.exports = (sequelize, DataTypes) => {
    const NomesServico = sequelize.define('NomesServico', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })

    NomesServico.associate = (models) => {
        NomesServico.hasMany(models.Servicos, {
            foreignKey: 'nome_servico_id',
            as: 'servicos'
        })
        NomesServico.belongsToMany(models.Profissionais, {
            through: models.ProfissionaisNomesServico,
            foreignKey: 'nome_servico_id',
            otherKey: 'profissional_id'
        })
    }

    return NomesServico
}
