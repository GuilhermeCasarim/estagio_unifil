module.exports = (sequelize, DataTypes) => {
    const Produtos = sequelize.define('Produtos', { //nome tabela
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        observacoes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estoque_minimo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estoque_atual: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        volume_unidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unidade_medida: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ml'
        },
        quantidade_formatada: {
            type: DataTypes.VIRTUAL,
            get() {
                //caso campo nao exista no objeto
                if (this.estoque_atual === undefined || !this.volume_unidade) {
                    return "0";
                }

                // evitar divisão por zero
                if (this.volume_unidade === 0) return "0";

                const qtd = this.estoque_atual / this.volume_unidade;
                const medida = this.unidade_medida || 'ml';

                //ex: "2,00 un (1000ml)"
                return `${qtd.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} un (${this.estoque_atual}${medida})`;
            }
        }
    })

    Produtos.associate = (models) => {
        Produtos.belongsToMany(models.Servicos, {
            through: models.ServicosProduto,
            foreignKey: 'produto_id',
            otherKey: 'servico_id'
        });
    };
    return Produtos;
}