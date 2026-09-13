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
