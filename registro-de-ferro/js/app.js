(function () {
    'use strict';

    var STORAGE_TREINO = 'registroDeFerro.treinoAtual';
    var STORAGE_HISTORICO = 'registroDeFerro.historico';

    var GROUP_LABELS = {
        peito: 'Peito',
        costas: 'Costas',
        pernas: 'Pernas',
        ombros: 'Ombros',
        bracos: 'Braços',
        abdomen: 'Abdômen',
        cardio: 'Cardio'
    };

    var GROUP_ORDER = ['peito', 'costas', 'pernas', 'ombros', 'bracos', 'abdomen', 'cardio'];

    var state = {
        activeGroup: 'todos',
        searchQuery: '',
        treinoAtual: loadTreino(),
        historico: loadHistorico()
    };

    function loadTreino() {
        try {
            var raw = localStorage.getItem(STORAGE_TREINO);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function loadHistorico() {
        try {
            var raw = localStorage.getItem(STORAGE_HISTORICO);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveTreino() {
        localStorage.setItem(STORAGE_TREINO, JSON.stringify(state.treinoAtual));
    }

    function saveHistorico() {
        localStorage.setItem(STORAGE_HISTORICO, JSON.stringify(state.historico));
    }

    function findExercise(id) {
        for (var i = 0; i < EXERCISES.length; i++) {
            if (EXERCISES[i].id === id) return EXERCISES[i];
        }
        return null;
    }

    // ---------- Navegação por abas ----------

    var tabButtons = document.querySelectorAll('.tab-btn');
    var views = {
        biblioteca: document.getElementById('view-biblioteca'),
        treino: document.getElementById('view-treino'),
        historico: document.getElementById('view-historico'),
        painel: document.getElementById('view-painel')
    };

    function showView(name) {
        Object.keys(views).forEach(function (key) {
            views[key].style.display = key === name ? 'block' : 'none';
        });
        tabButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.view === name);
        });
        if (name === 'treino') renderTreino();
        if (name === 'historico') renderHistorico();
        if (name === 'painel') renderPainel();
    }

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showView(btn.dataset.view);
        });
    });

    // ---------- Biblioteca ----------

    var groupTabsEl = document.getElementById('group-tabs');
    var exercisesGrid = document.getElementById('exercises-grid');
    var noResultsEl = document.getElementById('no-results');
    var searchInput = document.getElementById('search-input');

    function renderGroupTabs() {
        var groups = ['todos'].concat(GROUP_ORDER);
        groupTabsEl.innerHTML = '';
        groups.forEach(function (g) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'group-tab' + (state.activeGroup === g ? ' active' : '');
            btn.textContent = g === 'todos' ? 'Todos' : GROUP_LABELS[g];
            btn.addEventListener('click', function () {
                state.activeGroup = g;
                renderGroupTabs();
                renderExercises();
            });
            groupTabsEl.appendChild(btn);
        });
    }

    function renderExercises() {
        var query = state.searchQuery.trim().toLowerCase();
        var filtered = EXERCISES.filter(function (ex) {
            if (state.activeGroup !== 'todos' && ex.grupo !== state.activeGroup) return false;
            if (query && ex.nome.toLowerCase().indexOf(query) === -1 && ex.equipamento.toLowerCase().indexOf(query) === -1) {
                return false;
            }
            return true;
        });

        exercisesGrid.innerHTML = '';
        noResultsEl.style.display = filtered.length ? 'none' : 'block';

        filtered.forEach(function (ex) {
            var card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML =
                '<button type="button" class="thumb-btn"><img src="' + ex.imagens[0] + '" alt="' + ex.nome + '" loading="lazy"></button>' +
                '<div class="card-body">' +
                    '<div class="ex-name">' + ex.nome + '</div>' +
                    '<div class="ex-meta">' +
                        '<span class="tag">' + GROUP_LABELS[ex.grupo] + '</span>' +
                        '<span class="tag">' + ex.equipamento + '</span>' +
                        '<span class="tag tag-level">' + ex.nivel + '</span>' +
                    '</div>' +
                    '<button type="button" class="add-btn">+ Adicionar ao treino</button>' +
                '</div>';

            var img = card.querySelector('img');
            img.addEventListener('mouseenter', function () { img.src = ex.imagens[1]; });
            img.addEventListener('mouseleave', function () { img.src = ex.imagens[0]; });

            card.querySelector('.thumb-btn').addEventListener('click', function () {
                openDetail(ex);
            });
            card.querySelector('.add-btn').addEventListener('click', function () {
                addToTreino(ex.id);
            });

            exercisesGrid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', function () {
        state.searchQuery = searchInput.value;
        renderExercises();
    });

    // ---------- Modal de detalhe ----------

    var detailOverlay = document.getElementById('exercise-detail-overlay');
    var detailImg = document.getElementById('detail-img');
    var detailName = document.getElementById('detail-name');
    var detailGroup = document.getElementById('detail-group');
    var detailEquipment = document.getElementById('detail-equipment');
    var detailLevel = document.getElementById('detail-level');
    var detailAdd = document.getElementById('detail-add');
    var detailCurrentId = null;

    function openDetail(ex) {
        detailCurrentId = ex.id;
        detailImg.src = ex.imagens[0];
        detailImg.alt = ex.nome;
        detailName.textContent = ex.nome;
        detailGroup.textContent = GROUP_LABELS[ex.grupo];
        detailEquipment.textContent = ex.equipamento;
        detailLevel.textContent = ex.nivel;
        detailOverlay.style.display = 'flex';
    }

    function closeDetail() {
        detailOverlay.style.display = 'none';
        detailImg.src = '';
    }

    document.getElementById('detail-close').addEventListener('click', closeDetail);
    detailOverlay.addEventListener('click', function (e) {
        if (e.target === detailOverlay) closeDetail();
    });
    detailAdd.addEventListener('click', function () {
        addToTreino(detailCurrentId);
        closeDetail();
    });

    // ---------- Treino de hoje ----------

    var treinoListEl = document.getElementById('treino-list');
    var treinoEmptyEl = document.getElementById('treino-empty');
    var treinoCountEl = document.getElementById('treino-count');

    function addToTreino(exerciseId) {
        var existing = state.treinoAtual.filter(function (item) { return item.exerciseId === exerciseId; })[0];
        if (!existing) {
            state.treinoAtual.push({
                exerciseId: exerciseId,
                series: [{ reps: '', peso: '' }]
            });
            saveTreino();
            updateTreinoBadge();
            if (views.treino.style.display !== 'none') renderTreino();
        }
    }

    function removeFromTreino(exerciseId) {
        state.treinoAtual = state.treinoAtual.filter(function (item) { return item.exerciseId !== exerciseId; });
        saveTreino();
        updateTreinoBadge();
        renderTreino();
    }

    function updateTreinoBadge() {
        var count = state.treinoAtual.length;
        treinoCountEl.textContent = String(count);
        treinoCountEl.style.display = count ? 'inline-block' : 'none';
    }

    function renderTreino() {
        treinoListEl.innerHTML = '';
        treinoEmptyEl.style.display = state.treinoAtual.length ? 'none' : 'block';

        state.treinoAtual.forEach(function (item) {
            var ex = findExercise(item.exerciseId);
            if (!ex) return;

            var card = document.createElement('div');
            card.className = 'treino-card';

            var header = document.createElement('div');
            header.className = 'treino-card-header';
            header.innerHTML = '<h3>' + ex.nome + '</h3>';
            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-exercise-btn';
            removeBtn.textContent = 'Remover exercício';
            removeBtn.addEventListener('click', function () { removeFromTreino(item.exerciseId); });
            header.appendChild(removeBtn);
            card.appendChild(header);

            item.series.forEach(function (serie, idx) {
                var row = document.createElement('div');
                row.className = 'series-row';

                var indexEl = document.createElement('span');
                indexEl.className = 'series-index';
                indexEl.textContent = (idx + 1) + 'ª';

                var repsInput = document.createElement('input');
                repsInput.type = 'number';
                repsInput.min = '0';
                repsInput.placeholder = 'Repetições';
                repsInput.value = serie.reps;
                repsInput.addEventListener('input', function () {
                    serie.reps = repsInput.value;
                    saveTreino();
                });

                var pesoInput = document.createElement('input');
                pesoInput.type = 'number';
                pesoInput.min = '0';
                pesoInput.step = '0.5';
                pesoInput.placeholder = 'Peso (kg)';
                pesoInput.value = serie.peso;
                pesoInput.addEventListener('input', function () {
                    serie.peso = pesoInput.value;
                    saveTreino();
                });

                var removeSerieBtn = document.createElement('button');
                removeSerieBtn.type = 'button';
                removeSerieBtn.className = 'series-remove';
                removeSerieBtn.textContent = '×';
                removeSerieBtn.addEventListener('click', function () {
                    item.series.splice(idx, 1);
                    if (item.series.length === 0) {
                        item.series.push({ reps: '', peso: '' });
                    }
                    saveTreino();
                    renderTreino();
                });

                row.appendChild(indexEl);
                row.appendChild(repsInput);
                row.appendChild(pesoInput);
                row.appendChild(removeSerieBtn);
                card.appendChild(row);
            });

            var addSerieBtn = document.createElement('button');
            addSerieBtn.type = 'button';
            addSerieBtn.className = 'add-series-btn';
            addSerieBtn.textContent = '+ série';
            addSerieBtn.addEventListener('click', function () {
                item.series.push({ reps: '', peso: '' });
                saveTreino();
                renderTreino();
            });
            card.appendChild(addSerieBtn);

            treinoListEl.appendChild(card);
        });
    }

    document.getElementById('save-workout').addEventListener('click', function () {
        var exerciciosValidos = state.treinoAtual
            .map(function (item) {
                var ex = findExercise(item.exerciseId);
                var seriesValidas = item.series.filter(function (s) {
                    return s.reps !== '' && s.peso !== '' && Number(s.reps) > 0 && Number(s.peso) >= 0;
                }).map(function (s) {
                    return { reps: Number(s.reps), peso: Number(s.peso) };
                });
                return ex ? { nome: ex.nome, grupo: ex.grupo, series: seriesValidas } : null;
            })
            .filter(function (item) { return item && item.series.length > 0; });

        if (exerciciosValidos.length === 0) {
            alert('Adicione ao menos um exercício com repetições e peso preenchidos antes de salvar.');
            return;
        }

        state.historico.unshift({
            data: new Date().toISOString(),
            exercicios: exerciciosValidos
        });
        saveHistorico();

        state.treinoAtual = [];
        saveTreino();
        updateTreinoBadge();
        renderTreino();
        showView('historico');
    });

    // ---------- Histórico ----------

    var historicoListEl = document.getElementById('historico-list');
    var historicoEmptyEl = document.getElementById('historico-empty');

    function formatDate(iso) {
        var d = new Date(iso);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function renderHistorico() {
        historicoListEl.innerHTML = '';
        historicoEmptyEl.style.display = state.historico.length ? 'none' : 'block';

        state.historico.forEach(function (sessao) {
            var day = document.createElement('div');
            day.className = 'historico-day';
            var title = document.createElement('h3');
            title.textContent = formatDate(sessao.data);
            day.appendChild(title);

            sessao.exercicios.forEach(function (ex) {
                var row = document.createElement('div');
                row.className = 'historico-exercise';
                var seriesText = ex.series.map(function (s) {
                    return s.reps + '×' + s.peso + ' kg';
                }).join(', ');
                row.innerHTML = '<span class="h-name">' + ex.nome + '</span><span class="h-series">' + seriesText + '</span>';
                day.appendChild(row);
            });

            historicoListEl.appendChild(day);
        });
    }

    // ---------- Painel ----------

    function startOfWeek(date) {
        var d = new Date(date);
        var day = d.getDay();
        var diff = (day === 0 ? -6 : 1) - day; // segunda-feira como início
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function renderPainel() {
        var totalTreinos = state.historico.length;
        var inicioSemana = startOfWeek(new Date());
        var treinosSemana = state.historico.filter(function (s) {
            return new Date(s.data) >= inicioSemana;
        }).length;

        var totalSeries = 0;
        var contagemExercicio = {};
        var prPorExercicio = {};

        state.historico.forEach(function (sessao) {
            sessao.exercicios.forEach(function (ex) {
                totalSeries += ex.series.length;
                contagemExercicio[ex.nome] = (contagemExercicio[ex.nome] || 0) + 1;
                ex.series.forEach(function (s) {
                    if (!prPorExercicio[ex.nome] || s.peso > prPorExercicio[ex.nome]) {
                        prPorExercicio[ex.nome] = s.peso;
                    }
                });
            });
        });

        var favorito = '—';
        var maxCount = 0;
        Object.keys(contagemExercicio).forEach(function (nome) {
            if (contagemExercicio[nome] > maxCount) {
                maxCount = contagemExercicio[nome];
                favorito = nome;
            }
        });

        document.getElementById('stat-total-treinos').textContent = String(totalTreinos);
        document.getElementById('stat-semana').textContent = String(treinosSemana);
        document.getElementById('stat-series').textContent = String(totalSeries);
        document.getElementById('stat-favorito').textContent = favorito;

        var prListEl = document.getElementById('pr-list');
        var prEmptyEl = document.getElementById('pr-empty');
        var nomesPr = Object.keys(prPorExercicio);
        prEmptyEl.style.display = nomesPr.length ? 'none' : 'block';
        prListEl.innerHTML = '';

        var maxPeso = Math.max.apply(null, nomesPr.map(function (n) { return prPorExercicio[n]; }).concat([1]));

        nomesPr
            .sort(function (a, b) { return prPorExercicio[b] - prPorExercicio[a]; })
            .forEach(function (nome) {
                var peso = prPorExercicio[nome];
                var row = document.createElement('div');
                row.className = 'pr-row';
                row.innerHTML =
                    '<div class="pr-row-top"><span class="pr-name">' + nome + '</span><span class="pr-weight">' + peso + ' kg</span></div>' +
                    '<div class="pr-bar-track"><div class="pr-bar-fill" style="width:' + Math.round((peso / maxPeso) * 100) + '%"></div></div>';
                prListEl.appendChild(row);
            });
    }

    // ---------- Inicialização ----------

    renderGroupTabs();
    renderExercises();
    updateTreinoBadge();
})();
