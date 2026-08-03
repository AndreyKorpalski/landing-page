# Registro de Ferro

Site estático (HTML/CSS/JS puro, sem build e sem login) para acompanhar
treinos: escolha exercícios de uma biblioteca curada, registre séries de
repetições e peso, salve o treino do dia e acompanhe seu histórico e
recordes pessoais.

## Fonte dos exercícios

Nomes traduzidos para pt-BR e imagens (pose inicial/final, usadas no efeito
de hover) vêm do dataset público [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)
(Unlicense / domínio público — sem exigência de atribuição), carregadas em
tempo real via `raw.githubusercontent.com`. A curadoria de ~50 exercícios
está em `js/exercises-data.js`.

## Persistência

Todo o progresso (treino em andamento e histórico de sessões) fica salvo
apenas no `localStorage` do navegador, sob as chaves `registroDeFerro.*`.
Não há backend nem envio de dados a nenhum servidor.

## Como rodar localmente

```bash
cd registro-de-ferro
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.
