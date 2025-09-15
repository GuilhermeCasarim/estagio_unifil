module.exports = (sequelize, DataTypes) => {
    const Clientes = sequelize.define('Clientes', { //nome tabela
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
        cpf: {
            type: DataTypes.STRING,
            allowNull: true
        },
        data_nascimento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        observacoes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    // Clientes.associate = (models) => {
    //     Clientes.hasMany(models.Agendamentos,{
    //         onDelete: cascade 
    //         //deleta o agendamento se deletar o cliente
    //     })
    // }
    //e cria rota + import para o agendamento
    return Clientes;
}