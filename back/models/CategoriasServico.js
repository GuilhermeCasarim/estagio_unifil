module.exports = (sequelize, DataTypes) => {
    const CategoriasServico = sequelize.define('CategoriasServico', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })

    CategoriasServico.associate = (models) => {
        CategoriasServico.hasMany(models.Servicos, {
            foreignKey: 'categoria_servico_id'
        })
    }

    return CategoriasServico
}
