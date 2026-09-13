# Prompt Mestre StartPromos

Use este prompt para continuar ou reconstruir o projeto StartPromos com o mesmo contexto.

## Contexto do projeto

StartPromos é um site brasileiro de curadoria de ofertas. A proposta pública não deve falar em comissão, afiliado ou bastidores comerciais. A comunicação deve ser: "encontramos, comparamos e organizamos os melhores preços". O site usa o conceito do Sistema Cardinal, uma IA interna que observa ofertas, entende categorias, compara sinais e destaca achados.

O site não é limitado à SHEIN. Ele deve aceitar ofertas de redes diferentes, incluindo SHEIN, TikTok Shop, Shopee e futuros marketplaces. As categorias só devem aparecer quando existirem produtos publicados dentro delas. Não criar categoria vazia.

## Estética atual

Manter um visual dark premium, com energia de marketplace moderno:

- Fundo preto/grafite.
- Destaques em laranja quente.
- Cards com borda fina, glow, hover com movimento e sensação de app.
- Imagens grandes e bem enquadradas.
- Microanimações discretas: brilho, pulso, flutuação, entrada suave.
- Não transformar em landing page genérica; a primeira tela já precisa mostrar uma oferta real.
- Evitar textos explicando demais o funcionamento dentro da UI.

Referências visuais usadas:

- Dashboards escuros com painéis premium, gráficos e cards densos.
- Apps mobile de oferta/gamificação com gradientes quentes, selos chamativos e recompensa visual.
- Marketplaces limpos com produto grande, preço claro e CTA direto.
- Fashion apps com cards flutuantes e imagem como protagonista.

## O que já foi feito

- Site em Next.js com App Router.
- Catálogo de produtos em `lib/products.ts`.
- Suporte a redes permitidas em `lib/affiliate-networks.ts`.
- Produtos da SHEIN adicionados com preço, imagem, histórico e links.
- Produtos do TikTok Shop adicionados com nome, imagem 800x800 e link curto original.
- Quando o TikTok não expõe o preço de forma pública, o site mostra "Preço surpresa" e uma chamada atrativa, sem inventar valor.
- Cards com pop-ups diferentes por produto, calculados a partir do slug.
- Pop-ups com tons visuais variados: flame, gold, rose, electric e lime.
- Pop-ups com animação de brilho e pulso.
- Página inicial começa com uma oferta em destaque.
- Categorias dinâmicas: aparecem somente se houver produto publicado.
- Textos públicos removidos sobre comissão/afiliado.
- Menu mobile sem duplicidade em Salvos.
- Seção de blocos de categoria removida da home.
- Hero ajustada para manter texto, CTA e pop-up dentro do primeiro enquadramento.

## Regras importantes

- Não mencionar comissão, afiliado ou link de afiliado no conteúdo público.
- Não inventar preço, avaliação ou vendas.
- Se o preço não for capturado com segurança, usar uma chamada atrativa sem número falso.
- Se avaliações ou vendas forem capturadas, mostrar como prova social.
- Se não houver avaliações ou vendas, esconder esses campos.
- Cada produto sem preço deve ter um pop-up diferente e chamativo.
- O pop-up precisa estar dentro do card/enquadramento, nunca cortado.
- Categoria vazia não aparece.
- Preservar alta qualidade das imagens.
- Manter o site rápido e responsivo.

## O que falta ou pode melhorar

- Criar coletor real de metadados para TikTok Shop, Shopee e outros marketplaces.
- Capturar preço, avaliações, vendas, frete e cupom quando a página permitir.
- Criar painel administrativo para importar links em lote.
- Adicionar status por produto: preço confirmado, preço oculto, revisão pendente, publicado.
- Criar ranking Cardinal com score mais completo: desconto, urgência, vendas, reputação, preço histórico e tendência.
- Criar banners sazonais automáticos por categoria.
- Melhorar a página de produto com variações, tamanhos, cores e mais prova social quando houver dados.
- Adicionar testes visuais com screenshots desktop/mobile para evitar pop-ups cortados.
- Criar página "TikTok Shop" ou filtros por loja quando houver volume suficiente.
- Adicionar monitoramento agendado para revalidar links e preços.
- Criar fallback visual quando imagem externa falhar.
- Criar sitemap apenas com categorias realmente acessíveis.
- Melhorar SEO de produto com dados estruturados completos quando preço estiver confirmado.

## Prompt de continuação

Você é um agente de desenvolvimento trabalhando no projeto StartPromos em Next.js. Continue o site mantendo o conceito do Sistema Cardinal: uma IA que encontra, compara e organiza ofertas. Não fale publicamente sobre comissão, afiliado ou links de afiliado. O usuário quer um site bonito, vivo, com estética dark premium, cards modernos, imagens grandes, animações sutis, pop-ups chamativos e ofertas aparecendo logo na primeira tela.

Antes de editar, leia o código existente e siga os padrões do projeto. Corrija bugs reais, preserve as melhorias já feitas e valide com lint, testes e build. Se adicionar produtos, use dados reais extraídos dos links. Não invente preço, avaliações ou vendas. Quando o preço não estiver disponível, use chamadas atrativas variadas, sem número falso. Garanta que pop-ups e textos não fiquem cortados em desktop nem mobile. Categorias só aparecem quando existem produtos publicados.

Priorize:

- Primeira dobra com oferta visível e CTA claro.
- Cards de produto bonitos e responsivos.
- Pop-ups diferentes por produto.
- Prova social real quando existir.
- Performance, acessibilidade e build sem erro.
- Código simples, consistente e fácil de manter.
