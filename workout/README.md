# Treino - Exercícios por Musculatura

Site estático (HTML/CSS/JS puro, sem build e sem login) que permite escolher
um grupo muscular e ver todos os exercícios daquele grupo, com animação do
movimento ao clicar em cada exercício.

## Fonte dos dados

Os dados dos exercícios e as animações/thumbnails vêm do dataset público
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset),
carregados em tempo real direto do GitHub (`raw.githubusercontent.com`),
lendo `data/exercises.json` e as pastas `images/`/`videos/`. Nenhuma mídia é
copiada para este repositório.

**Atribuição obrigatória:** as imagens e GIFs são © Gym visual —
https://gymvisual.com/, exibida no rodapé do site. As instruções de cada
exercício estão disponíveis apenas em inglês no dataset original; os nomes
das categorias, alvos musculares e equipamentos são traduzidos para
português na própria interface.

## Como rodar localmente

Como o app faz `fetch` de um JSON remoto, é preciso servir os arquivos por
HTTP (não abrir o `index.html` direto com `file://`):

```bash
cd workout
python3 -m http.server 8000
# ou: npx serve .
```

Depois acesse `http://localhost:8000`.

## Estrutura

- `index.html` — estrutura da página (categorias, lista de exercícios, modal)
- `css/styles.css` — layout responsivo
- `js/app.js` — busca o dataset, traduções e toda a lógica de navegação/filtro/modal
