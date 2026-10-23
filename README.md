# Kurio NFT Marketplace

Marketplace demonstrativo de NFTs desenvolvido com React, TypeScript e Vite. O projeto simula um ambiente de compra e gerenciamento de NFTs, com catálogo, carrinho, autenticação, cupons e checkout.

> **Importante:** este projeto é demonstrativo. A API é simulada com MSW e não há transações financeiras reais.

## 1. Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack React Query
- Axios
- Tailwind CSS
- MSW — simulação de API
- Socket.IO Client — cliente preparado, integração em tempo real pendente
- Playwright — testes automatizados E2E

## 2. Executando o projeto localmente

### Pré-requisitos

- Node.js
- npm

### Instalação

Na raiz do projeto, execute:

```bash
npm install
npm run dev
```

Abra o endereço local informado pelo Vite no terminal.

### Verificação da compilação

```bash
npm run build
```

O comando verifica os tipos do TypeScript e gera a versão de produção na pasta `dist`.

### Testes automatizados

```bash
npm run test:e2e
```

Os testes Playwright existentes verificam a abertura do marketplace, a navegação para os detalhes de uma NFT e a adição de um item ao carrinho.

## 3. Rotas e navegação

Os caminhos abaixo devem ser conferidos na aplicação publicada. Algumas páginas podem existir sem um botão de navegação visível.

| Rota | O que verificar |
|---|---|
| `/` | Página inicial, catálogo, pesquisa e filtros |
| `/nft/1` | Detalhes de uma NFT; testar também outros IDs disponíveis |
| `/cart` | Itens adicionados, quantidades e resumo da compra |
| `/checkout` | Dados do comprador, carteira, validações e confirmação simulada |
| `/login` | Formulário de login e mensagens de validação |
| `/register` | Cadastro de usuário e tratamento de erros |
| `/profile` | Acesso direto ao perfil e edição dos dados, caso a rota esteja implementada |
| `/wallets` | Acesso direto ao gerenciamento de carteiras, caso a rota esteja implementada |

**Observação:** as rotas de perfil, autenticação e carteiras devem ser confirmadas no código ou na aplicação. A existência de uma página não garante que ela esteja acessível por um botão no menu.

## 4. Guia de testes manuais

### 4.1. Página inicial e catálogo

1. Acesse `/`.
2. Verifique se os NFTs são carregados.
3. Confira se cada cartão apresenta imagem, nome, criador e preço.
4. Teste a pesquisa por nome.
5. Teste os filtros de categoria e blockchain, quando disponíveis.
6. Confira a ordenação e a paginação, se implementadas.
7. Clique em **Ver NFT** para abrir os detalhes.

**Resultado esperado:** o catálogo deve carregar sem erros, e as ações disponíveis devem apresentar resultados coerentes.

### 4.2. Detalhes da NFT

1. Acesse `/nft/1` ou abra uma NFT pelo catálogo.
2. Verifique imagem, descrição, preço, blockchain e disponibilidade.
3. Clique em **Adicionar ao carrinho**.
4. Confira se o botão apresenta a confirmação de adição.
5. Utilize o link **Ver carrinho**, quando exibido.
6. Teste um ID inexistente e verifique se a página apresenta uma mensagem apropriada.

**Resultado esperado:** os detalhes devem corresponder à NFT selecionada, e a adição deve refletir no carrinho.

### 4.3. Carrinho

1. Adicione uma NFT ao carrinho.
2. Acesse `/cart`.
3. Verifique se o item aparece corretamente.
4. Teste a alteração da quantidade, se disponível.
5. Teste a remoção de um item.
6. Atualize a página e confira se os dados persistem.
7. Confira subtotal, desconto e total.
8. Teste um carrinho vazio.

**Resultado esperado:** os valores devem acompanhar os itens e quantidades, sem apresentar totais incorretos.

### 4.4. Cupons de desconto

1. Adicione uma NFT ao carrinho.
2. Teste um cupom válido, como `KURIO10`.
3. Confira se o desconto é aplicado.
4. Teste outro cupom válido, como `KURIO20`.
5. Teste um código inválido.
6. Remova o cupom e confira se os valores são atualizados.
7. Altere a quantidade de itens e confira novamente o total.

**Resultado esperado:** o desconto deve ser recalculado corretamente e códigos inválidos não devem gerar descontos indevidos.

### 4.5. Cadastro e login

1. Acesse `/register`.
2. Teste o cadastro com dados válidos.
3. Teste o envio de campos obrigatórios vazios.
4. Tente cadastrar novamente um e-mail já utilizado, se essa validação estiver implementada.
5. Acesse `/login`.
6. Teste as credenciais corretas.
7. Teste credenciais incorretas.
8. Verifique o comportamento após atualizar a página.
9. Teste o logout, caso exista um botão de saída.

**Resultado esperado:** mensagens claras devem ser exibidas para operações bem-sucedidas e falhas. A persistência local não equivale a autenticação segura em um servidor real.

### 4.6. Perfil do usuário

1. Tente acessar `/profile` diretamente.
2. Verifique se a página carrega.
3. Confira os dados exibidos.
4. Teste a edição e o salvamento dos dados, caso disponíveis.
5. Atualize a página e verifique se as alterações persistem.
6. Confira se existe um botão ou link para chegar ao perfil a partir da navegação principal.

**Ponto de atenção:** se a rota funcionar, mas não houver botão de acesso, a navegação está incompleta. Deve-se adicionar um link visível no menu ou na área da conta.

### 4.7. Carteiras

1. Tente acessar `/wallets` diretamente.
2. Verifique se é possível visualizar as carteiras cadastradas.
3. Teste a inclusão ou edição, caso essas operações estejam disponíveis.
4. Confira se os dados persistem após atualizar a página.
5. Acesse o checkout e verifique se a seleção de carteira funciona.

**Resultado esperado:** o checkout deve permitir selecionar uma carteira válida, de acordo com as opções implementadas.

### 4.8. Checkout e confirmação

1. Adicione uma NFT ao carrinho.
2. Acesse `/checkout`.
3. Preencha os dados do comprador.
4. Selecione uma carteira válida.
5. Confira o subtotal, o desconto e o total.
6. Tente enviar o formulário com campos obrigatórios vazios.
7. Finalize uma compra simulada.
8. Confira a tela de confirmação e os dados do pedido.
9. Verifique se os itens comprados são removidos do carrinho após o sucesso.
10. Simule uma falha, se houver um mecanismo de teste para isso, e confira se o carrinho é preservado.

**Resultado esperado:** somente um pedido confirmado pela API simulada deve levar à tela de sucesso. Uma falha não deve apagar os itens do carrinho.

### 4.9. Estoque e consistência dos dados

1. Registre a disponibilidade inicial de uma NFT.
2. Simule uma compra.
3. Confira se o estoque diminui de acordo com a quantidade comprada.
4. Atualize o catálogo e os detalhes da NFT.
5. Tente comprar uma quantidade superior à disponível, caso seja possível informar quantidades.

**Resultado esperado:** catálogo, detalhes e checkout devem apresentar informações consistentes de estoque e preço.

### 4.10. Responsividade e apresentação

Teste o site em diferentes tamanhos de tela:

- Desktop
- Tablet
- Celular

Verifique menus, cartões, imagens, formulários, botões, mensagens de erro e resumos de compra.

Confira também a legibilidade dos textos, o contraste das cores e a possibilidade de navegar utilizando teclado.

## 5. Testes técnicos adicionais

### Build

```bash
npm run build
```

### Testes E2E

```bash
npm run test:e2e
```

### Lighthouse

Executar uma auditoria no navegador para verificar:

- Performance
- Acessibilidade
- Boas práticas
- SEO

Os resultados devem ser registrados após a execução; não se deve presumir uma pontuação antes da auditoria.

## 6. Pendências conhecidas

- Integração completa do Socket.IO com os eventos `nft.updated` e `order.updated`.
- Verificação de todos os links de navegação, incluindo o acesso ao perfil.
- Ampliação dos testes automatizados para erros no checkout, estoque e prevenção de pedidos duplicados.
- Auditoria final de responsividade, acessibilidade e Lighthouse.
- Verificação do comportamento dos mocks de API no ambiente publicado.

## 7. Limitações

- O marketplace utiliza dados e endpoints simulados.
- O checkout não processa pagamentos reais.
- A autenticação demonstrativa com persistência local não substitui um sistema seguro de autenticação.
- O Socket.IO Client foi configurado, mas a comunicação em tempo real ainda precisa ser integrada e validada.
- As funcionalidades descritas como pendentes devem ser verificadas antes de serem consideradas concluídas.

## 8. Checklist final de validação

- [ ] Catálogo carrega no ambiente publicado.
- [ ] Pesquisa e filtros funcionam.
- [ ] Detalhes das NFTs carregam corretamente.
- [ ] Adicionar ao carrinho apresenta confirmação visual.
- [ ] Carrinho persiste e atualiza seus valores.
- [ ] Cupons válidos e inválidos são tratados corretamente.
- [ ] Cadastro e login apresentam respostas coerentes.
- [ ] Perfil e carteiras são acessíveis e funcionam, se implementados.
- [ ] Checkout simulado gera uma confirmação consistente.
- [ ] Estoque é atualizado após uma compra simulada.
- [ ] Testes E2E passam.
- [ ] Build de produção passa.
- [ ] Site foi testado em desktop e celular.

---

**Kurio NFT Marketplace** — projeto demonstrativo de marketplace de NFTs desenvolvido com React e TypeScript.