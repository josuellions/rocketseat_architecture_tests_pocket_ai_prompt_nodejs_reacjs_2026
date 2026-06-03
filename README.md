<img width="1763" height="758" alt="2026-06-03_prompt_manager" src="https://github.com/user-attachments/assets/7b26e5c1-6bce-45bc-813d-a965b50194e2" />


### Project - pocket-ai - JS

- [Link application web](https://rocketseat-architecture-tests-pocke.vercel.app/)

---

##### Data: 21/05/2026

##### Developer: Josuel A. Lopes

<br/>

##### About

---

Desenvolvimento acadêmico aplicando arquitetura de softwares e testes em uma aplicação Prompt Manager em NodeJS, NextJS e ReactJS , conceitos de integração com API REST, uma aplicação web prática e intuitiva que permite organizar todos os seus prompts de inteligência artificial em um só lugar.

Aplicado na pratica conceitos de arquitetura de software, SOLID, Fundamentos de teste, testes unitários, testes de integração, testes e2e, Jest, React Testing Library,Playwright, mocks, TDD, Poly ll, deploy.

<br/>

##### Tecnologias

---

- ReactJS,
- NextJS,
- NodeJS,
- Playwright,
- Prettier,
- ESLint,
- Docker,
- CI/CD,
- Jest

<br/>

#### Projeto: `pocket-ai`

---

<br/>

#### 📋 Sumário

---

- [📋 Sumário](#-sumário)
- [📂 Arquitetura e diretórios](#-arquitetura-e-diretórios)
- [📦 Pacotes](#-pacotes)
- [🧰 Dependências](#-dependências)
- [♻️ Variáveis de Ambiente](#-variáveis-de-ambiente)
- [🔥 Como executar](#-como-executar)
- [📑 Padronização](#-padronização)
- [🧪 Testes](#-testes)
- [⚙️ CI/CD](#-CI/CD)
- [🚀 Build](#-build)
- [🔖 Version](#-version)
- [📜 Licença](#-licença)

<br/>

#### 📂 Arquitetura e diretórios

---

- MVC (Model View Controller)

```txt
  📦 src
  ┣ 📂 app
  ┃ ┗ 📜 page.tsx
  ┣ 📂 core
  ┃ ┗ 📜 use-case.ts
  ┣ 📂 infra
  ┃ ┣ 📜 doker-compose.yml
  ┃ ┗ 📂 repository
  ┗  📂 tests

```

#### 📦 Pacotes

---

- Versão do node
  - `lts/jod`

- Padronização do código
  - Configurações
    - `.github/workflows/dependabot.yml`
    - `.github/workflows/ci.yml`
    - `infra/docker-compose.yml`
    - `playwright.config.ts`
    - `prisma.config.ts`
    - `.prettierignore`
    - `.eslintrc.json`
    - `jest.config.js`
    - `jest.config.ts`
    - `jest.setup.ts`
    - `.editorconfig`
    - `lefthook.yml`
    - `jsconfig.js`
    - `.gitignore`

- [npm](https://docs.npmjs.com/cli/v10/commands/npm): v10.8.2 - npm is the package manager for the Node JavaScript platform. It puts modules in place so that node can find them, and manages dependency conflicts intelligently.

- [pnpm](https://www.npmjs.com/package/pnpm?activeTab=readme): v8.15.5 - Microsoft uses pnpm in Rush repos with hundreds of projects and hundreds of PRs per day, and we’ve found it to be very fast and reliable..

- [Node.js](https://nodejs.org/en): v18.20.4 - Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.

- [Next.js](https://nextjs.org/) - Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.

- [React](https://react.dev/) - The library for web and native user interfaces

- [ESLint](https://eslint.org/) - Static code analysis to help find problems within a codebase

- [Prettier](https://prettier.io/) - An opinionated code formatter

- [Lefthook](https://lefthook.dev/) - A Git hooks manager for Node.js, Ruby, Python and many other types of projects.

- [Docker](https://hub.docker.com/_/postgres) - Docker Hub is the world's easiest way to create, manage, and deliver your team's container applications.

- [Playwright](https://github.com/commitizen/cz-cli#readme) - One API to drive Chromium, Firefox, and WebKit — in your tests, your scripts, and your agent workflows. Available for TypeScript, Python, .NET, and Java.

- [Jest](https://jestjs.io/) - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

- [CI/CD](https://github.com/features/actions) - GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub. Make code reviews, branch management, and issue triaging work the way you want.

<br/>

- Atualização de pacotes

```bash
pnpm audit
pnpm outdated
npx pnpm-check-updates -i
```

<br/>

#### 🧰 Dependências

---

- Docker
  - Docker Compose
    - Criar e inicializar

```bash
docker compose --file infra/docker-compose.yml -d up
docker ps
```

ou

```bash
pnpm run services:up
```

- Para ou excluir

```bash
docker compose --file infra/docker-compose.yml down
docker ps -a
```

ou

```bash
pnpm run services:down
```

- Banco Dados
  - Postgres (DBMS - Banco Dados relacional)
    - node-pg-migrate (Migrations)

    - pg (Query/Consultas)

```bash
pnpm services:prisma:create
pnpm services:prisma:migrate
pnpm services:prisma:seed
```

<br/>

#### ♻️ Variáveis de Ambiente

---

- Certifique-se de ter configurado o arquivo `.env` ou `.env.development` na raiz do projeto baseado no arquivo `.env.example`, com as variáveis de ambiente necessárias para execução do projeto.

- Caso você não tenha acesso aos valores, solicite ao responsável pelo projeto.

<br/>

#### 🔥 Como executar

---

- Realize o clone ou baixe o projeto localmente.
  - Instalar ou atualizar os pacotes e dependências

```bash
pnpm install
```

- Para executar o projeto em modo de desenvolvimento.

```bash
pnpm run dev
```

<br/>

#### 📑 Padronização

---

- Estilização do código com `Prettier`
  - Analisar e verificar

```bash
pnpm run lint:prettier:check
```

- Corrigir e ajustar

```bash
pnpm run lint:prettier:fix
```

- Qualidade do código `ESLint`

```bash
pnpm run lint:eslint:check
```

- Qualidade do commit

```bash
pnpm lint:type:check
```

<br/>

#### 🧪 Testes

---

- Teste Automatizados / Teste Integração
  - TDD (Test Driven Development)
    - Teste Runner (Jest)

  - Para executar o projeto em modo de test.

```bash
pnpm run test
```

ou

```bash
pnpm test
pnpm test:check
pnpm test:watch
pnpm test:coverage
pnpm test:e2e
pnpm test:e2e:ui
```

<br/>

#### ⚙️ CI/CD

---

- Github Actions (workflow) fluxo de continuous integrations e continuous deploy
  - O fluxo é realizado a cada pull request realizado para branch definida no projeto.

```txt
|-Workflow (Testes Automatizados)
| |-Event: "Pull Request"
| | |-Job: "Jest"
| | | |-Runner: "Ubuntu"
| | | | |-Step: "Instalar dependências"
| | | | |-Step: "Rodar bateria de testes"

```

- Actions
  - Jest Ubuntu
  - Prettier
  - ESLint

<br/>

#### 🚀 Build

---

Para gerar o build do projeto deve-se abrir no `Visual Code` gerando os arquivos e build da aplicação

```bash
pnpm build
```

<br/>

#### 🔖 Version

---

- Padronização da estrutura de versionamento
  - Semantic Versioning:

  - `path`: Ajustes, melhorias e correções que não alteram as funcionalidades e comportamento.

  - `minor`: Alterações nas funcionalidades, mas que são compatíveis entre versões e mantendo a total compatibilidade de funcionalidades e comportamento.

  - `major`: Novas funcionalidades ou alterações que modifica o comportamento, e que podem não ser mais compatíveis com versões anteriores.

  - Exemplo:

```txt
[  ]. [  ].[  ]

major.minor.patch

2.1.0
```

<br/>

#### 📜 Licença

---

Este repositório e projeto possui licença `MIT license`, para maiores informações:

- [License Project](https://github.com/josuellions/rocketseat_architecture_tests_pocket_ai_prompt_nodejs_reacjs_2026/tree/josuellions-patch-2?tab=License-1-ov-file)

- [GitHub Licenses](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository#:~:text=You%27re%20under%20no%20obligation%20to%20choose%20a%20license.%20However%2C%20without%20a%20license%2C%20the%20default%20copyright%20laws%20apply%2C%20meaning%20that%20you%20retain%20all%20rights%20to%20your%20source%20code%20and%20no%20one%20may%20reproduce%2C%20distribute%2C%20or%20create%20derivative%20works%20from%20your%20work.).
