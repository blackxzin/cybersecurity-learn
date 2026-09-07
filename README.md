# Escola Perímetro

Formação prática e gratuita em cibersegurança, em português. Uma única página, sem
back-end e sem cadastro: todo o progresso fica salvo no seu próprio navegador.

## Demo ao vivo

**https://blackxzin.github.io/cybersecurity-learn/**

## O que tem dentro

- **72 aulas** escritas, distribuídas em 6 trilhas encadeadas — Fundamentos, Redes,
  Criptografia, Segurança Web, Ofensiva e Defesa. Cada aula traz a explicação do
  mecanismo, o comando real que se usa na prática e o erro mais comum.
- **Referência rápida de comandos** com abas por área (recon, rede, web, cripto,
  escalada de privilégio, defesa) e botão de copiar.
- **Laboratório de entropia de senha** — cálculo local de bits, tempo de quebra e
  penalização de padrões fracos. Nada sai do navegador.
- **OWASP Top 10 : 2025** com cartões que viram (vetor de ataque + mitigação).
- **Quiz** de 12 questões com explicação em cada resposta.
- **Trilha de carreira** de 12 meses e **glossário** com filtro.
- Conquistas, tema claro/escuro, e exportação do progresso em JSON.

## Como rodar

É um arquivo estático. Basta abrir o `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Aviso legal

Todo o conteúdo ofensivo existe para fins de defesa e educação. Testar sistemas de
terceiros sem autorização por escrito é crime no Brasil (Lei 12.737/2012, art. 154-A do
Código Penal) e na maioria das jurisdições. Pratique apenas em laboratórios feitos para
isso (TryHackMe, Hack The Box, PortSwigger Web Security Academy, OWASP Juice Shop,
OverTheWire) ou no seu próprio ambiente isolado.

## Licença

[MIT](LICENSE).
