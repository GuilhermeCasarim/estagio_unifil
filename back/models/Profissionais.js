module.exports = (sequelize, DataTypes) => {
    const Profissionais = sequelize.define('Profissionais', { //nome tabela
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        horario_inicio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        horario_fim: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dias_ativos: {
            type: DataTypes.STRING,
            allowNull: false
        },
        especialidades: {
            type: DataTypes.STRING,
            allowNull: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    })
    Profissionais.associate = (models) => {
        Profissionais.belongsTo(models.Usuarios, {
            foreignKey: 'usuario_id',
            as: 'Usuario'
        });
        Profissionais.belongsToMany(models.Servicos, {
            through: models.ProfissionaisServico,
            foreignKey: 'profissional_id',
            otherKey: 'servico_id'
        });
        Profissionais.belongsToMany(models.NomesServico, {
            through: models.ProfissionaisNomesServico,
            foreignKey: 'profissional_id',
            otherKey: 'nome_servico_id'
        });
    };
    return Profissionais;
}