Pxgxx.ai - Desafio Backend Senior (Abril/2024)
===================

## Decisão da arquitetura utilizada

O código está estruturado da seguinte forma:

Diretório   | Descrição
--------- | ------
mysql | Diretório que será mapeado para o serviço de banco de dados MySQL quando for iniciado pelo Docker;
api | Contém o código do backend;

## Iniciar os Serviços

1. Clone este repositório;

2. Na raiz do projeto execute o comando ```sudo ./start.sh```. Se apresentar erro permission denied execute o comando ```chmod +x start.sh``` e tente novamente. Se o error persistir, tente ```docker-compose up -d --build```;

3. O endereço da API por padrão é http://localhost:3000;

## Serviço de Banco de Dados
O banco de dados escolhido foi o [MySQL](https://www.mysql.com/). Após subir os serviços docker, as credenciais de acesso estão disponíveis no arquivo [.env](./.env). Em um projeto real não devemos versionar este arquivo por questão de seguraça. Nesse contexto, optei por versionar para que seja possível executar os serviços sem a necessidade de configurar e/ou criar arquivos.

## Serviço de API (Backend)
Conforme requisito, a *Application Programming Interface* (API) foi desenvolvido em [NodeJS](https://nodejs.org/en) com biblioteca [ExpressJS](https://expressjs.com/). A seguir listamos as bibliotecas usadas no projeto:

Biblioteca   | Descrição
--------- | ------
[ExpressJS](https://expressjs.com/) | É um framework para [NodeJS](https://nodejs.org/en) que possibilita a criação de servidores *Representational State Transfer* (REST).
[MySQL](https://www.npmjs.com/package/mysql) | Drive para se trabalhar com banco de dados [MySQL](https://www.mysql.com/);
[knexjs](knexjs.org) | É um *query builder* compatível com vários banco de dados capaz de facilitar interação com bancos de dados relacionais além de implementar *migrations*;
[JestJS](https://jestjs.io/pt-BR/) | Framework de Testes em JavaScript. Permite a prática de desenvolvimento usando *Test Driven Development* (TDD).
[SuperTest](https://github.com/ladjs/supertest) | Biblioteca capaz de realizar testes de integração de APIs HTTP. 
[FakerJS](https://fakerjs.dev) | Biblioteca usado para gerar dados falso para rotina de testes;
[cors](https://www.npmjs.com/package/cors) | Biblioteca que permite que recursos restritos em uma página/API sejam acessados ​​de outro domínio habilitando o [*Cross-origin resource sharing* (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing);
[http-status-codes](https://www.npmjs.com/package/http-status-codes) | Biblioteca de contantes com códigos de status HTTP para uma melhor organização;
[Joi](https://joi.dev) | Biblioteca que permite escrever esquema para validar dados no JavaScript;

No código da API foi usado o TypeScript que implementa a tipagem forte para escrita JavaScript.
Com o uso do [knexjs](knexjs.org) implementamos *migrations* que possibilita mapear mudanças na estrutura do banco de dados e aplicar em tempo de execução, além de possibilitar a troca do banco de dados com pouco esforço.

Foi criado um middlewares [xss_sanitize.js](./api/src/middlewares/xss_sanitize.js) que faz uma limpeza removendo código javascripts enviados pelo usuário a fim de evitar ataque *Cross-site scripting* (XSS). Mais detalhes em [https://www.kaspersky.com.br/resource-center/definitions/what-is-a-cross-site-scripting-attack](https://www.kaspersky.com.br/resource-center/definitions/what-is-a-cross-site-scripting-attack)

Comandos da API:
- ```npm install```: Para instalar as bibliotecas necessárias. Usar versão do Node 20.12.2;
- ```npm run dev```: Permite executar o serviço da API em modo de desenvolvimento;
- ```npm run test```: Permite executar os testes;

## Tesando a API
[Insomnia](https://insomnia.rest) é um framework Open Source para desenvolvimento/teste de API Clients. Faça o [download](https://insomnia.rest/download) e importe o arquivo [Insomnia_2024-04-16.json](./Insomnia_2024-04-16.json) para que consiga testar a API.

## Propostas de melhoria na arquitetura
- Mais cenário de testes nas rotas da API e testes unitários;
- CRUD de usuários com autenticação por [JWT](https://jwt.io/);
- Criação da documentação da API com [https://swagger.io/](https://swagger.io/);

## Quais requisitos obrigatórios que não foram entregues
Todos os requisitos obrigatórios foram implementados.

---
Obrigado!

Desafio entregue em 16/04/2024.