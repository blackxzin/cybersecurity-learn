# Escola Perímetro

Formação prática e gratuita em cibersegurança, em português. Um site estático, sem
back-end e sem cadastro: todo o progresso fica salvo no seu próprio navegador.

## Demo ao vivo

**https://blackxzin.github.io/cybersecurity-learn/**

## O que tem dentro

- **84 aulas** escritas, distribuídas em 6 trilhas encadeadas — Fundamentos, Redes,
  Criptografia, Segurança Web, Ofensiva e Defesa. Cada aula traz a explicação do
  mecanismo, o comando real que se usa na prática e o erro mais comum.
- **Referência rápida de comandos** com abas por área (recon, rede, web, cripto,
  escalada de privilégio, defesa) e botão de copiar.
- **Laboratório de entropia de senha** — cálculo local de bits, tempo de quebra e
  penalização de padrões fracos. Nada sai do navegador.
- **OWASP Top 10 : 2025** com cartões que viram (vetor de ataque + mitigação).
- **Quiz** de 12 questões com explicação em cada resposta.
- **Trilha de carreira** de 12 meses e **glossário** com filtro.
- **12 novas aulas práticas** com exercícios e critérios de verificação.
- **Biblioteca com 11 materiais selecionados**, incluindo livros, videoaulas e
  laboratórios, com busca, filtros de formato/idioma e favoritos locais.
- Leituras gratuitas nas aulas e botão para continuar os estudos.
- Navegação móvel, busca de aulas sem distinção de acentos e estados sem resultados.
- Conquistas, tema claro/escuro e exportação do progresso em JSON.
- Globo WebGL com contraste nos dois temas e alternativa SVG sem WebGL.

A curadoria e as condições de acesso estão em [docs-sources.md](docs-sources.md).
O currículo mantém os identificadores das aulas antigas, preservando o progresso.
Contadores de aulas, horas estimadas e recursos são calculados a partir dos dados.

## Como rodar

Abra o `index.html` com a pasta `assets/` ao lado, ou sirva a pasta:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Organização e verificação

- `index.html`: currículo original, ferramentas e renderização do globo.
- `assets/study-content.js`: novas aulas e catálogo de materiais.
- `assets/study.js`: biblioteca, favoritos e retomada de aulas.
- `assets/study.css`: ajustes visuais e responsividade.
- `tests/browser.cjs`: regressão funcional com Playwright/Chromium.

Com Playwright disponível e o servidor local ativo:

```bash
TEST_URL=http://127.0.0.1:8000 node tests/browser.cjs
# Se necessário, defina PLAYWRIGHT_PATH apontando para o pacote playwright instalado.
```

Os testes cobrem tema persistido, globo/fallback, aulas, busca, favoritos,
progresso legado, exportação e navegação em 375, 768 e 1440 px.
Capturas e exportação de teste são gravadas em `/tmp/perimetro-qa`.

## Aviso legal

Todo o conteúdo ofensivo existe para fins de defesa e educação. Testar sistemas de
terceiros sem autorização por escrito é crime no Brasil (Lei 12.737/2012, art. 154-A do
Código Penal) e na maioria das jurisdições. Pratique apenas em laboratórios feitos para
isso (TryHackMe, Hack The Box, PortSwigger Web Security Academy, OWASP Juice Shop,
OverTheWire) ou no seu próprio ambiente isolado.

## Licença

[MIT](LICENSE).
