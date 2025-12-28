# API Desafio Tec

API REST para autenticação de usuários e gestão de pedidos (orders), construída com **Node.js**, **TypeScript**, **Express** e **MongoDB (Mongoose)**.

## Sumário
- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como rodar](#como-rodar)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Orders](#orders)
- [Erros e status](#erros-e-status)
- [Modelos de dados](#modelos-de-dados)
- [Scripts úteis](#scripts-úteis)

## Visão geral
Esta API oferece:
- **Cadastro e login** de usuários com JWT.
- **CRUD parcial** de pedidos: listar, criar e avançar o estado do pedido.

## Tecnologias
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- JWT
- Zod (validação)

## Pré-requisitos
- Node.js 18+
- npm
- MongoDB Atlas (ou compatível com o cluster configurado)

## Configuração
Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
USERNAMEDB=seu_usuario
PASSWORDDB=sua_senha
JWT_SECRET=sua_chave_secreta
```

> **Observação:** a conexão está definida em `src/config/database.ts` e utiliza o cluster `cluster0.rz202ai.mongodb.net`.

## Como rodar
Instale as dependências e inicie em modo desenvolvimento:

```bash
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3333` (ou a porta definida em `PORT`).

## Autenticação
A autenticação é feita via **Bearer Token** no header `Authorization`:

```
Authorization: Bearer <token>
```

O token é gerado no cadastro e no login.

## Endpoints
Base URL: `http://localhost:3333`

### Auth
#### **POST /authentication/register**
Cria um novo usuário e retorna um token.

**Body**
```json
{
  "email": "user@email.com",
  "password": "minimo8caracteres"
}
```

**Resposta (201)**
```json
{
  "token": "jwt_token"
}
```

---

#### **POST /authentication/login**
Autentica um usuário e retorna um token.

**Body**
```json
{
  "email": "user@email.com",
  "password": "minimo8caracteres"
}
```

**Resposta (200)**
```json
{
  "token": "jwt_token"
}
```

### Orders
> Todos os endpoints de orders exigem **Authorization: Bearer <token>**.

#### **GET /orders**
Lista pedidos com paginação e filtro opcional por estado.

**Query params**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `state` (string: `CREATED` | `ANALYSIS` | `COMPLETED`)

**Resposta (200)**
```json
{
  "data": [
    {
      "id": "...",
      "lab": "Lab A",
      "patient": "Paciente 1",
      "customer": "Cliente 1",
      "total": 120,
      "state": "CREATED",
      "status": "ACTIVE",
      "services": [
        { "name": "Raio X", "value": 120, "status": "PENDING" }
      ]
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### **POST /orders**
Cria um pedido.

**Body**
```json
{
  "lab": "Lab A",
  "patient": "Paciente 1",
  "customer": "Cliente 1",
  "state": "CREATED",
  "status": "ACTIVE",
  "services": [
    { "name": "Raio X", "value": 120, "status": "PENDING" }
  ]
}
```

**Resposta (201)**
```json
{
  "id": "...",
  "patient": "Paciente 1",
  "customer": "Cliente 1"
}
```

---

#### **PATCH /orders/:id/advance**
Avança o estado do pedido no fluxo:
`CREATED -> ANALYSIS -> COMPLETED`.

**Resposta (200)**
```json
{
  "id": "...",
  "lab": "Lab A",
  "patient": "Paciente 1",
  "customer": "Cliente 1",
  "total": 120,
  "state": "ANALYSIS",
  "status": "ACTIVE",
  "services": [
    { "name": "Raio X", "value": 120, "status": "PENDING" }
  ]
}
```

## Erros e status
- **400**: validação inválida / estado inválido.
- **401**: token ausente ou inválido.
- **404**: pedido não encontrado.
- **500**: erro interno.

## Modelos de dados
### User
- `email` (string, único)
- `password` (string, hash)

### Order
- `ownerId` (string)
- `lab` (string)
- `patient` (string)
- `customer` (string)
- `total` (number)
- `state` (`CREATED` | `ANALYSIS` | `COMPLETED`)
- `status` (`ACTIVE` | `DELETED`)
- `services` (array)
  - `name` (string)
  - `value` (number)
  - `status` (`PENDING` | `DONE`)

## Scripts úteis
- `npm run dev` — inicia em modo desenvolvimento
- `npm run build` — compila para `dist`
- `npm run start` — inicia em produção
- `npm test` — executa os testes