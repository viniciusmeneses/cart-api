<h1 align="center">
  Loja Integrada - Carrinho
</h1>

<h4 align="center">
  Desafio técnico de back-end da Loja Integrada 
</h4>

<p align="center">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/viniciusmeneses/donation-chain">
  
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/viniciusmeneses/donation-chain">
    
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/viniciusmeneses/donation-chain">

  <img alt="Coverage" src="./badges/badge-lines.svg">
</p>

## 🛒 Projeto

API REST desenvolvida como desafio técnico da Loja Integrada que representa o funcionamento de um carrinho de compras. O projeto foi desenvolvido com a stack Typescript + Node.js + PostgreSQL e aplicando os conceitos da Clean Architecture e os princípios SOLID.

## 💡 Funcionalidades

- [x] Persistir o carrinho
- [x] Recuperar o carrinho
- [x] Adicionar um item no carrinho
- [x] Remover um item do carrinho
- [x] Atualizar a quantidade de um item no carrinho
- [x] Limpar o carrinho
- [x] Adicionar um cupom de desconto ao carrinho
- [x] Gerar totais e subtotais
- [x] Retornar um JSON com o carrinho completo (para ser usado no front-end)

## 🎲 Executando

Para executar a API em ambiente de desenvolvimento, é preciso ter no mínimo as seguintes ferramentas instaladas: [Git](https://git-scm.com), [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/install/). Além disso, é preciso ter algum editor de texto como o [VSCode](https://code.visualstudio.com/).

```bash
# Clona o repositório
$ git clone git@github.com:viniciusmeneses/loja-integrada-carrinho.git

# Acessa a pasta do projeto
$ cd loja-integrada-carrinho

# Faz uma cópia arquivo de exemplo de configuração das envs
$ cp .env.sample .env

# Inicializa o banco de dados e executa a aplicação
$ docker-compose up -d

# Roda as migrações do banco de dados
$ docker exec -t loja-integrada-carrinho-api yarn migration:run
```

Por padrão, a aplicação será servida na porta 3000 e poderá ser acessada pela URL http://localhost:3000, mas a porta pode ser alterada editando o arquivo `.env` criado na raiz do projeto.

## 📄 Documentação

As requisições para a API devem ser feitas a partir do caminho `/api`.

Todos os endpoints, seus parâmetros e retornos foram documentados utilizando o Swagger e está disponível na rota `/docs`.

#### Dados para teste

Os seguintes dados são inseridos no banco de dados ao rodar as migrações para serem utilizados em endpoints que precisam de dados de produtos ou cupons de desconto cadastrados:

```js
// Produtos
{ id: "779d7f21-05b7-4a74-82e5-68b43c7d42d4", name: "Camiseta", price: 45.0, stock: 10 }
{ id: "a5d66c1a-b540-45ec-aab7-1e7dc932c38f", name: "Calça", price: 90.0, stock: 10 }
{ id: "c2f6dd0e-763e-4600-ad6f-0699be6ba5ae", name: "Tênis", price: 199.99, stock: 3 }
{ id: "c98b3118-677d-4aec-9b06-d20f0015a5ac", name: "Moletom", price: 149.99, stock: 5 }
{ id: "9450ea85-ab39-4d06-ae9f-8cd7f20ed4e6", name: "Boné", price: 20.0, stock: 4 }

// Cupons de desconto
{ id: "f99458a3-918e-4275-83bc-f62d5a891480", code: "GHW2O", percentage: 10.0 }
{ id: "695ba12a-7b9d-4c5d-8d70-649583590a34", code: "VEFJY", percentage: 5.0 }
{ id: "c4a9f80d-8ecc-4870-82f1-c436ac18581f", code: "D0JNN", percentage: 2.5 }
```