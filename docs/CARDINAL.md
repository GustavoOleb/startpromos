# Sistema Cardinal

O Cardinal e a camada operacional da StartPromos para validar dados, explicar sinais e conter falhas sem reescrever producao automaticamente.

## Limites

- Nenhum login automatizado em redes parceiras.
- Nenhum uso de senha, cookie, QR code ou sessao de terceiros.
- Nenhuma publicacao automatica de item sem dados minimos verificaveis.
- Nenhuma alteracao de preco, estoque, avaliacao ou link por inferencia.
- Nenhuma conta de usuario e necessaria para usar a plataforma.

## Importacao

Itens importados devem conter nome, imagem HTTPS, preco atual positivo, link afiliado HTTPS permitido, `lastVerifiedAt` e `source`. O resultado inicial e sempre um rascunho. Itens incompletos, duplicados ou incoerentes ficam rejeitados para revisao.

A validacao fica em `lib/affiliate-import.ts`; a allowlist de redes fica em `lib/affiliate-networks.ts`.

## Sinais de preco

O radar atual usa dados locais verificaveis: desconto, historico, avaliacao e recencia. Ele pode classificar uma oferta como queda forte, boa janela ou em observacao. O sinal deve ser explicado em linguagem humana e nao deve afirmar estoque ou urgencia sem fonte.

## Observabilidade

`lib/observability.ts` define nomes de eventos e sanitiza o payload antes de qualquer transporte futuro. Nao ha envio de analytics de terceiros por padrao. O mesmo modulo registra metas iniciais de disponibilidade, saude de links, validacao de importacao e idade maxima de preco.

## Evolucao autorizada

A automacao de feed, revalidacao de links, monitoramento de disponibilidade, alertas internos e rollback depende de infraestrutura server-side, logs estruturados, jobs idempotentes, credenciais oficiais e uma politica de deploy com preview, testes e rollback. A implementacao deve permanecer em rascunho ate que essas fontes sejam autorizadas.

## Ambiente

Copie `.env.example` para o ambiente de deploy. Tokens de redes afiliadas sao exclusivamente server-side e permanecem vazios ate existir uma integracao oficial aprovada.
# Cardinal 24/7

O Cardinal é o agente invisível do StartPromos. Ele deve buscar ofertas, validar dados, comparar preço, enriquecer produtos e manter o catálogo pronto para publicação sem expor nada disso ao visitante.

## Fluxo atual

- `/dashadmin` abre o painel privado.
- `/dashadmin/login` autentica com variáveis `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET`.
- `/api/dashadmin/import` recebe blocos de texto com nomes e links e devolve rascunhos validados.
- `/api/cardinal/scan` é o endpoint preparado para Vercel Cron. Use `Authorization: Bearer CARDINAL_CRON_SECRET`.
- `docs/supabase-schema.sql` define as tabelas de produtos, execuções e rascunhos.

## Regra de publicação

Um produto só deve virar público quando tiver, no mínimo:

- nome confiável;
- imagem HTTPS de boa qualidade;
- link permitido;
- origem e data de verificação;
- preço real ou, quando o marketplace esconder o preço, copy de preço surpresa sem inventar valor.

Avaliações, vendas e notas só entram quando forem dados reais.

## Próximos conectores

- TikTok Shop: expandir link curto, coletar metadados e preço quando expostos.
- SHEIN: usar API/parceiro ou parser autorizado para preço, imagem e rating.
- Shopee e outros marketplaces: normalizar por rede, com fallback por busca do nome.
- Supabase: trocar catálogo local por consulta server-side com cache e revalidação.
- Vercel Cron: chamar o Cardinal em intervalos curtos e registrar cada execução.
