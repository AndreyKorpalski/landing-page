(function () {
    'use strict';

    var DATA_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
    var MEDIA_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/';

    var BODY_PART_LABELS = {
        'back': 'Costas',
        'cardio': 'Cardio',
        'chest': 'Peito',
        'lower arms': 'Antebraços',
        'lower legs': 'Panturrilhas',
        'neck': 'Pescoço',
        'shoulders': 'Ombros',
        'upper arms': 'Braços',
        'upper legs': 'Pernas',
        'waist': 'Abdômen'
    };

    var BODY_PART_EMOJI = {
        'back': '🔙',
        'cardio': '🏃',
        'chest': '💪',
        'lower arms': '🦾',
        'lower legs': '🦵',
        'neck': '🧍',
        'shoulders': '🏋️',
        'upper arms': '💪',
        'upper legs': '🦵',
        'waist': '🔥'
    };

    var TARGET_LABELS = {
        'abductors': 'Abdutores',
        'abs': 'Abdômen',
        'adductors': 'Adutores',
        'biceps': 'Bíceps',
        'calves': 'Panturrilhas',
        'cardiovascular system': 'Sistema cardiovascular',
        'delts': 'Deltoides',
        'forearms': 'Antebraços',
        'glutes': 'Glúteos',
        'hamstrings': 'Posteriores de coxa',
        'lats': 'Dorsais',
        'levator scapulae': 'Levantador da escápula',
        'pectorals': 'Peitorais',
        'quads': 'Quadríceps',
        'serratus anterior': 'Serrátil anterior',
        'spine': 'Coluna',
        'traps': 'Trapézio',
        'triceps': 'Tríceps',
        'upper back': 'Costas superior'
    };

    var MUSCLE_GROUP_LABELS = {
        'abdominals': 'Abdominais',
        'ankle stabilizers': 'Estabilizadores do tornozelo',
        'ankles': 'Tornozelos',
        'biceps': 'Bíceps',
        'calves': 'Panturrilhas',
        'chest': 'Peito',
        'core': 'Core',
        'deltoids': 'Deltoides',
        'forearms': 'Antebraços',
        'glutes': 'Glúteos',
        'hamstrings': 'Posteriores de coxa',
        'hands': 'Mãos',
        'hip flexors': 'Flexores do quadril',
        'latissimus dorsi': 'Grande dorsal',
        'lats': 'Dorsais',
        'lower back': 'Lombar',
        'obliques': 'Oblíquos',
        'quadriceps': 'Quadríceps',
        'rhomboids': 'Romboides',
        'rotator cuff': 'Manguito rotador',
        'shoulders': 'Ombros',
        'soleus': 'Sóleo',
        'trapezius': 'Trapézio',
        'traps': 'Trapézio',
        'triceps': 'Tríceps',
        'upper back': 'Costas superior',
        'wrist extensors': 'Extensores do punho',
        'wrist flexors': 'Flexores do punho',
        'wrists': 'Punhos'
    };

    var EQUIPMENT_LABELS = {
        'assisted': 'Assistido',
        'band': 'Faixa elástica',
        'barbell': 'Barra',
        'body weight': 'Peso corporal',
        'bosu ball': 'Bosu',
        'cable': 'Cabo (polia)',
        'dumbbell': 'Halteres',
        'elliptical machine': 'Elíptico',
        'ez barbell': 'Barra EZ',
        'hammer': 'Hammer',
        'kettlebell': 'Kettlebell',
        'leverage machine': 'Máquina de alavanca',
        'medicine ball': 'Bola medicinal',
        'olympic barbell': 'Barra olímpica',
        'resistance band': 'Faixa de resistência',
        'roller': 'Rolo',
        'rope': 'Corda',
        'skierg machine': 'Máquina skierg',
        'sled machine': 'Trenó (sled)',
        'smith machine': 'Smith',
        'stability ball': 'Bola de estabilidade',
        'stationary bike': 'Bicicleta ergométrica',
        'stepmill machine': 'Escada ergométrica',
        'tire': 'Pneu',
        'trap bar': 'Barra hexagonal',
        'upper body ergometer': 'Ergômetro de membros superiores',
        'weighted': 'Com peso',
        'wheel roller': 'Roda abdominal'
    };

    function translate(dict, key) {
        return dict[key] || key;
    }

    var state = {
        exercises: [],
        currentBodyPart: null
    };

    var loadingEl = document.getElementById('loading');
    var errorEl = document.getElementById('error');
    var categoriesView = document.getElementById('categories-view');
    var categoriesGrid = document.getElementById('categories-grid');
    var exercisesView = document.getElementById('exercises-view');
    var exercisesGrid = document.getElementById('exercises-grid');
    var categoryTitle = document.getElementById('category-title');
    var backButton = document.getElementById('back-button');
    var searchInput = document.getElementById('search-input');
    var equipmentFilter = document.getElementById('equipment-filter');
    var noResults = document.getElementById('no-results');

    var modalOverlay = document.getElementById('modal-overlay');
    var modalClose = document.getElementById('modal-close');
    var modalGif = document.getElementById('modal-gif');
    var modalTitle = document.getElementById('modal-title');
    var modalTarget = document.getElementById('modal-target');
    var modalMuscleGroup = document.getElementById('modal-muscle-group');
    var modalEquipment = document.getElementById('modal-equipment');
    var modalSecondary = document.getElementById('modal-secondary');
    var modalInstructions = document.getElementById('modal-instructions');

    fetch(DATA_URL)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Falha ao buscar dados: ' + res.status);
            }
            return res.json();
        })
        .then(function (data) {
            state.exercises = data;
            loadingEl.style.display = 'none';
            renderCategories();
            categoriesView.style.display = 'block';
        })
        .catch(function (err) {
            console.error(err);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        });

    function renderCategories() {
        var bodyParts = [];
        state.exercises.forEach(function (ex) {
            if (bodyParts.indexOf(ex.body_part) === -1) {
                bodyParts.push(ex.body_part);
            }
        });
        bodyParts.sort();

        categoriesGrid.innerHTML = '';
        bodyParts.forEach(function (bodyPart) {
            var count = state.exercises.filter(function (ex) {
                return ex.body_part === bodyPart;
            }).length;

            var card = document.createElement('button');
            card.type = 'button';
            card.className = 'category-card';
            card.innerHTML =
                '<span class="emoji">' + (BODY_PART_EMOJI[bodyPart] || '🏋️') + '</span>' +
                '<span>' + translate(BODY_PART_LABELS, bodyPart) + '</span>' +
                '<div style="font-size:0.75rem;color:#a0a5ad;margin-top:4px;">' + count + ' exercícios</div>';
            card.addEventListener('click', function () {
                openCategory(bodyPart);
            });
            categoriesGrid.appendChild(card);
        });
    }

    function openCategory(bodyPart) {
        state.currentBodyPart = bodyPart;
        categoryTitle.textContent = translate(BODY_PART_LABELS, bodyPart);
        searchInput.value = '';

        var exercisesInCategory = state.exercises.filter(function (ex) {
            return ex.body_part === bodyPart;
        });

        var equipmentSet = [];
        exercisesInCategory.forEach(function (ex) {
            if (equipmentSet.indexOf(ex.equipment) === -1) {
                equipmentSet.push(ex.equipment);
            }
        });
        equipmentSet.sort();

        equipmentFilter.innerHTML = '<option value="">Todos os equipamentos</option>';
        equipmentSet.forEach(function (equipment) {
            var option = document.createElement('option');
            option.value = equipment;
            option.textContent = translate(EQUIPMENT_LABELS, equipment);
            equipmentFilter.appendChild(option);
        });

        categoriesView.style.display = 'none';
        exercisesView.style.display = 'block';
        renderExercises();
    }

    function renderExercises() {
        var query = searchInput.value.trim().toLowerCase();
        var equipment = equipmentFilter.value;

        var filtered = state.exercises.filter(function (ex) {
            if (ex.body_part !== state.currentBodyPart) {
                return false;
            }
            if (equipment && ex.equipment !== equipment) {
                return false;
            }
            if (query && ex.name.toLowerCase().indexOf(query) === -1) {
                return false;
            }
            return true;
        });

        exercisesGrid.innerHTML = '';
        noResults.style.display = filtered.length ? 'none' : 'block';

        filtered.forEach(function (ex) {
            var card = document.createElement('button');
            card.type = 'button';
            card.className = 'exercise-card';
            card.innerHTML =
                '<img src="' + MEDIA_BASE + ex.image + '" alt="' + ex.name + '" loading="lazy">' +
                '<div class="exercise-name">' + ex.name + '</div>';
            card.addEventListener('click', function () {
                openExerciseModal(ex);
            });
            exercisesGrid.appendChild(card);
        });
    }

    function openExerciseModal(ex) {
        modalGif.src = MEDIA_BASE + ex.gif_url;
        modalGif.alt = ex.name;
        modalTitle.textContent = ex.name;
        modalTarget.textContent = translate(TARGET_LABELS, ex.target);
        modalMuscleGroup.textContent = translate(MUSCLE_GROUP_LABELS, ex.muscle_group);
        modalEquipment.textContent = translate(EQUIPMENT_LABELS, ex.equipment);

        if (ex.secondary_muscles && ex.secondary_muscles.length) {
            var secondaryLabels = ex.secondary_muscles.map(function (m) {
                return translate(MUSCLE_GROUP_LABELS, m);
            });
            modalSecondary.textContent = 'Músculos secundários: ' + secondaryLabels.join(', ');
        } else {
            modalSecondary.textContent = '';
        }

        modalInstructions.innerHTML = '';
        var steps = ex.instruction_steps && ex.instruction_steps.en;
        if (steps && steps.length) {
            steps.forEach(function (step) {
                var li = document.createElement('li');
                li.textContent = step;
                modalInstructions.appendChild(li);
            });
        } else if (ex.instructions && ex.instructions.en) {
            var li = document.createElement('li');
            li.textContent = ex.instructions.en;
            modalInstructions.appendChild(li);
        }

        modalOverlay.style.display = 'flex';
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
        modalGif.src = '';
    }

    backButton.addEventListener('click', function () {
        exercisesView.style.display = 'none';
        categoriesView.style.display = 'block';
    });

    searchInput.addEventListener('input', renderExercises);
    equipmentFilter.addEventListener('change', renderExercises);

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
})();
