module.exports = (sequelize, DataTypes) => {
    const Financeiro = sequelize.define('Financeiro', {
        tipo: {
            type: DataTypes.ENUM('Receita', 'Despesa'),
            allowNull: false,
            comment: 'Receita para entradas/serviços, Despesa para saídas/compras'
        },
        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        forma_pagamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pago', 'Pendente'),
            defaultValue: 'Pago'
        },
        data_pagamento: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },

        //transacao complexa
        fornecedor: {
            type: DataTypes.STRING,
            allowNull: true, // compra do adm
        },
        agendamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // FK para ligar ao agendamento e mudar o status para concluído, depois de ter confirmado o pagamento
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // quem registrou (Secretária ou adm)
        }
    });

    return Financeiro;
};