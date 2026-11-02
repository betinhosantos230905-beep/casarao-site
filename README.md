# CASARÃO Bar & Restaurante — site

Site do CASARÃO (Vassouras - RJ): página inicial, cardápio, reservas e painel administrativo.

## O que tem aqui

- **Páginas públicas**: `/` (inicial), `/cardápio` (cardapio), `/reservas`
- **Painel administrativo**: `/admin` — protegido por uma senha única (`SITE_PASSWORD`)
  - Reservas: confirmar, cancelar, apagar
  - Cardápio: incluir, editar, excluir pratos e preços
  - Fotos: trocar logo e fotos
  - Dados: endereço, telefone, WhatsApp, Instagram, horários
- **Banco de dados**: reservas, itens do cardápio, fotos e dados do restaurante

## Como rodar no computador

1. Instale o [Node.js](https://nodejs.org) (18 ou mais novo).
2. Na pasta do projeto:

```sh
npm install
npm run dev
```

3. Abra o endereço que aparece no terminal (normalmente `http://localhost:8080`).

## Arquivo .env

O arquivo `.env` não vai no ZIP (tem chaves do backend). Crie um `.env` na raiz com os
valores do seu projeto:

```
SUPABASE_URL=<url do backend>
SUPABASE_PROJECT_ID=<id do projeto>
SUPABASE_PUBLISHABLE_KEY=<chave pública>
VITE_SUPABASE_URL=<mesma url>
VITE_SUPABASE_PROJECT_ID=<mesmo id>
VITE_SUPABASE_PUBLISHABLE_KEY=<mesma chave>
```

As variáveis `VITE_` são lidas pelo navegador; as outras só pelo servidor.

## Senha do painel

A senha do painel é a variável secreta `SITE_PASSWORD`, definida no ambiente
(deploy/nuvem), e não no código. Para trocar, atualize essa variável e reinicie o servidor.

## Testes

```sh
npm test
```

## Feito com

- TanStack Start (React + TypeScript)
- Tailwind CSS v4
- Lovable Cloud (banco de dados, arquivos)
