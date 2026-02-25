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
        }
    })
    return Profissionais;
}