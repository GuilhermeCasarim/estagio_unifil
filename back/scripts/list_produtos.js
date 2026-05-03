'use strict';

const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));

async function list() {
  try {
    const produtos = await db.Produtos.findAll({ raw: true });
    console.log(JSON.stringify(produtos, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Erro ao listar produtos:', e);
    process.exit(1);
  }
}

list();
