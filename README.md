# AutoGestor — Sistema de Gestão para Oficina Mecânica

O **AutoGestor** é uma aplicação web full-stack desenvolvida para facilitar o dia a dia de oficinas mecânicas de pequeno e médio porte. O sistema permite o controle de clientes, veículos, mecânicos, serviços, peças (com controle de estoque) e o ciclo completo de Ordens de Serviço (OS) e pagamentos.

## Tecnologias Utilizadas

- **Back-end:** Node.js + Express
- **Padrão Arquitetural:** MVC (Model-View-Controller)
- **Banco de Dados:** MySQL
- **ORM:** Sequelize
- **Front-end:** EJS (Views) + HTML5 + CSS3 + Vanilla JavaScript
- **Autenticação:** Sessão simples com Express-Session
- **Testes:** Jest + Supertest

## Perfis de Acesso

O sistema possui 3 níveis de acesso:
1. **Recepção:** Acesso a dashboard, clientes, veículos e OS.
2. **Mecânico:** Acesso a dashboard, clientes, veículos e OS (foco no preenchimento do serviço).
3. **Gestor:** Acesso a todo o sistema, incluindo gestão de Mecânicos, Catálogo de Serviços e Peças (estoque e valores).

**Usuários de Teste (Criados pelo Seeder):**
- Gestor: `gestor` / `123456`
- Recepção: `recepcao` / `123456`
- Mecânico: `mecanico` / `123456`

## Instalação e Execução Local

Siga os passos abaixo para rodar o projeto na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd autogestor
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` e ajuste as configurações do seu banco de dados MySQL:
   ```bash
   cp .env.example .env
   ```

4. **Crie o banco de dados no MySQL:**
   Certifique-se de ter um servidor MySQL rodando e crie o banco de dados especificado no `.env` (ex: `autogestor`).
   ```sql
   CREATE DATABASE autogestor;
   ```

5. **Execute as Migrations e os Seeders:**
   Isso criará todas as tabelas necessárias e inserirá os usuários padrão para teste.
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   (Você precisará adicionar `"dev": "nodemon src/server.js"` no `package.json` caso ainda não esteja lá, ou rode com `node src/server.js`).
   A aplicação estará disponível em `http://localhost:3000`.

## Testes

Os testes automatizados foram construídos utilizando Jest e Supertest para testar a integração dos fluxos principais.

Para rodar os testes:
```bash
npm test
```
*Observação: Recomendado ter um banco de dados de teste configurado.*

## Deploy (Render.com)

Para publicar no Render.com:
1. Crie um Web Service apontando para o seu repositório no GitHub.
2. Configure o Build Command: `npm install`
3. Configure o Start Command: `node src/server.js`
4. Nas variáveis de ambiente, adicione a string de conexão ou os dados do banco de dados MySQL hospedado remotamente (como DB_HOST, DB_USER, etc).
5. Certifique-se de executar as migrations após o deploy ou configure-as para rodar antes de iniciar o servidor.

---
Desenvolvido como projeto prático/acadêmico de gestão.
