const { Produtos } = require('../models');
const { Op } = require('sequelize');

class ProdutoController {
    async getAll(req, res) {
        try {
            const produtos = await Produtos.findAll({
                order: [['nome', 'ASC']]
            });
            if (produtos.length === 0) {
                return res.status(200).json({
                    message: "Nenhum produto encontrado.",
                    data: []
                });
            }
            return res.status(200).json(produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            return res.status(500).json({
                error: "Erro interno no servidor ao tentar buscar os produtos.",
                details: error.message
            });
        }
    };

    async getById(req, res) {
        const id = req.params.id;
        try {
            const produto = await Produtos.findByPk(id);
            if (produto) {
                return res.json(produto);
            }
            return res.status(404).json({ error: 'Produto não encontrado' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar produto.' });
        }
    }

    async create(req, res) {
        const produto = req.body;
        try {
            const novoProduto = await Produtos.create(produto);
            return res.status(201).json(novoProduto);
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar produto.' });
        }
    }

    async update(req, res) {
        const idProduto = req.params.id;
        const { nome, marca, categoria, observacoes, estoque_minimo, estoque_atual } = req.body;
        try {
            const [updated] = await Produtos.update(
                { nome, marca, categoria, observacoes, estoque_minimo, estoque_atual },
                { where: { id: idProduto } }
            );
            
            if (updated) {
                res.json('Produto atualizado');
            } else {
                res.status(404).json({ error: 'Produto não encontrado' });
            }
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
    }

    async delete(req, res) {
        const idProduto = req.params.id;
        try {
            const resultado = await Produtos.destroy({
                where: {
                    id: idProduto
                }
            });
            if (resultado > 0) {
                res.json('Produto deletado');
            } else {
                res.json('Produto não encontrado ou já deletado');
            }
        } catch (e) {
            res.status(500).json({ error: 'Erro ao deletar produto' });
        }
    }

    // fazzer botao pra atualizar estoque, tipo +1 ou -1
    async updateEstoque(req, res) {
        const { id } = req.params;
        const { quantidade } = req.body; // pode ser 1 ou -1
        try {
            const produto = await Produtos.findByPk(id);
            if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

            produto.estoque_atual += quantidade;
            
            // Impede estoque negativo(colocar isso no front?)
            if (produto.estoque_atual < 0) produto.estoque_atual = 0;

            await produto.save();
            return res.json(produto);
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar quantidade.' });
        }
    }
}

module.exports = new ProdutoController();