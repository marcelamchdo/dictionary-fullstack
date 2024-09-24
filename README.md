# Dictionary App

## Descrição

O Dictionary Fullstack é uma aplicação web que permite ao usuário pesquisar palavras, visualizar definições, fonéticas e adicionar palavras ao histórico e aos favoritos. O projeto foi desenvolvido em uma arquitetura fullstack, utilizando tecnologias modernas para backend e frontend.

![dictionary-app](/img/dictionary.gif)

## Tecnologias Utilizadas

### Front-end

- React
- Zustand (Gerenciamento de estado)
- Mantine (Estilização)
- JavaScript (ES6+)
- HTML5, CSS3 (Flexbox e Grid)

### Back-end

- Node.js
- Express
- MongoDB (MongoDB Atlas)
- Axios (para chamadas HTTP)
- JWT (JSON Web Token)

### Docker

- Docker para orquestração de containers

## Instalação e Uso

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker (opcional, mas recomendado para execução com containers)
- MongoDB Atlas ou local
- Git

### Clonando o repositório

```javascript
git clone https://github.com/marcelamchdo/dictionary_fullstack.git
cd dictionary_fullstack
```

### Backend

1. Configurar Variáveis de Ambiente:

Crie um arquivo .env na pasta raiz do backend com as seguintes variáveis:

```javascript
PORT=3000
MONGODB_URI=<sua_uri_do_mongodb>
JWT_SECRET=<sua_chave_secreta_jwt>
```

2. Instalar Dependências do Backend:

```javascript
cd backend
npm install
```

3. Executar o Backend:

```javascript
npm start
```

### Frontend

1. Instalar Dependências do Frontend:

```javascript
cd frontend
npm install
```

3. Executar o Frontend:

```javascript
npm start
```

### Docker (Execução com Docker)

1. Construir e Subir os Containers (Opcional):

```javascript
docker-compose up --build
```

2. Acesse a aplicação no navegador em http://localhost:3000.

## Rotas do Backend

### Autenticação
POST ```/api/auth/signup```: Registra um novo usuário.

```json
Body: {
    "email": "string",
    "password": "string"
}

Response: {
     "message": "Usuário registrado com sucesso" 
     }
```

POST ```/api/auth/signin```: Realiza o login do usuário.

```json
Body:{ 
    "email": "string", 
    "password": "string" 
    }
Response: {
    "token": "JWT Token" 
    }
```
### Palavras
GET ```/api/entries/en?page={number}```: Retorna a lista de palavras com paginação.

```json
Response: { 
    "results": ["word1", "word2", ...], 
    "hasNext": true, "totalPages": number }
```

GET ```/api/entries/en/:word```:  Pesquisa uma palavra específica e retorna seus detalhes.

```json
Response:{ 
    "word": "string", 
    "phonetics": [ ... ], 
    "meanings": [ ... ] 
    }
```

POST ```/api/entries/en/:word/favorite```:  Adiciona uma palavra aos favoritos do usuário.

```json
Response: { "message": "Palavra adicionada aos favoritos" }
```

DELETE ```/api/entries/en/:word/unfavorite```:  Remove uma palavra dos favoritos do usuário.

```json
Response: { "message": "Palavra removida dos favoritos" }
```

### Usuário

GET ```/api/user/me```: Retorna as informações do perfil do usuário logado.

```json
Response: { 
    "email": "string", 
    "history": [ ... ], 
    "favorites": [ ... ] }
```

GET ```/api/user/me/history```:Retorna o histórico de palavras pesquisadas pelo usuário.

```json
Response: { 
    "email": "string", 
    "history": [ ... ], 
    "favorites": [ ... ] }
```

GET ```/api/user/me/favorites```:Retorna as palavras favoritas do usuário.

```json
{ "results": [ 
    { "word": "string" },
    ... ] 
}
```

##

### .gitignore

Inclua o arquivo .gitignore no seu projeto para evitar o versionamento de arquivos desnecessários, como node_modules, dist, e informações sensíveis.

Exemplo de ```.gitignore```:

```
# Node
node_modules/
.env

# Logs
logs
*.log

# Build
build/
dist/

# Docker
docker-compose.override.yml
```

## Minha Visão do Projeto

Este projeto foi uma experiência desafiadora e, ao mesmo tempo, extremamente enriquecedora. Apesar de não ter conseguido implementar todas as funcionalidades como gostaria, pude aplicar diversos conceitos de frontend e backend e estruturar uma aplicação fullstack funcional.

### Desafios e Limitações

O principal desafio foi o gerenciamento do tempo. Infelizmente, não consegui finalizar alguns aspectos como eu havia planejado inicialmente, como a implementação de testes unitários mais robustos, a otimização de algumas partes do código, e o design responsivo completamente refinado.

A limitação de tempo também impactou na possibilidade de revisar e refatorar certas áreas do código para torná-lo mais eficiente e fácil de escalar. Alguns pontos de performance, como o scroll infinito, poderiam ter sido mais refinados para uma experiência de usuário mais suave.

### Melhorias Futuras

Dado mais tempo, gostaria de fazer os seguintes ajustes e melhorias no projeto:

- **Melhorias no Design Responsivo**: Refinar o layout para dispositivos móveis, garantindo uma experiência consistente em todos os tamanhos de tela.
- **Otimização do Scroll Infinito**: Melhorar o desempenho do scroll infinito e reduzir as chamadas desnecessárias para a API, garantindo um carregamento mais suave das palavras.
- **Melhoria na UX (Experiência do Usuário)**: Adicionar animações mais suaves ao alternar entre palavras e ao carregar detalhes de palavras específicas.
- **Testes Automatizados**: Implementar uma cobertura de testes unitários e testes de integração, garantindo que cada componente do frontend funcione corretamente e a API responda conforme o esperado.
- **Cache de Dados**: Implementar uma estratégia de cache para otimizar a recuperação de dados no frontend, evitando a necessidade de buscar a lista completa de palavras repetidamente.

### Conclusão

Estou satisfeito com o que consegui desenvolver dentro do tempo disponível, mas reconheço que o projeto tem bastante potencial para ser ainda mais aprimorado. Continuarei trabalhando na melhoria do código, revisando a estrutura e buscando otimizações.

Se você tiver qualquer feedback ou sugestões, fique à vontade para abrir uma issue ou entrar em contato comigo! 

Muito obrigado por conferir o projeto.

## Challenge

Este projeto foi desenvolvido como parte de um challenge by Coodesh.
