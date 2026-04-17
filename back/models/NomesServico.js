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
    }

    return NomesServico
}
