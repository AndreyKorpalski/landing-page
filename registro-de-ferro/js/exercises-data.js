// Curadoria de exercícios (fonte: yuhonas/free-exercise-db, Unlicense / domínio público)
var EXERCISES = [
  {
    "id": "Barbell_Bench_Press_-_Medium_Grip",
    "nome": "Supino reto com barra",
    "grupo": "peito",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg"
    ]
  },
  {
    "id": "Incline_Dumbbell_Press",
    "nome": "Supino inclinado com halteres",
    "grupo": "peito",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg"
    ]
  },
  {
    "id": "Dumbbell_Bench_Press",
    "nome": "Supino reto com halteres",
    "grupo": "peito",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/1.jpg"
    ]
  },
  {
    "id": "Pushups",
    "nome": "Flexão de braço",
    "grupo": "peito",
    "equipamento": "Peso corporal",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/1.jpg"
    ]
  },
  {
    "id": "Cable_Crossover",
    "nome": "Crucifixo no cabo (crossover)",
    "grupo": "peito",
    "equipamento": "Cabo (polia)",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/1.jpg"
    ]
  },
  {
    "id": "Dumbbell_Flyes",
    "nome": "Crucifixo com halteres",
    "grupo": "peito",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/1.jpg"
    ]
  },
  {
    "id": "Dips_-_Chest_Version",
    "nome": "Paralelas para peito",
    "grupo": "peito",
    "equipamento": "Outro / acessório",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/1.jpg"
    ]
  },
  {
    "id": "Decline_Barbell_Bench_Press",
    "nome": "Supino declinado com barra",
    "grupo": "peito",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/1.jpg"
    ]
  },
  {
    "id": "Pullups",
    "nome": "Barra fixa",
    "grupo": "costas",
    "equipamento": "Peso corporal",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/1.jpg"
    ]
  },
  {
    "id": "Wide-Grip_Lat_Pulldown",
    "nome": "Puxada aberta no pulley",
    "grupo": "costas",
    "equipamento": "Cabo (polia)",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"
    ]
  },
  {
    "id": "Seated_Cable_Rows",
    "nome": "Remada sentada no cabo",
    "grupo": "costas",
    "equipamento": "Cabo (polia)",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"
    ]
  },
  {
    "id": "Bent_Over_Barbell_Row",
    "nome": "Remada curvada com barra",
    "grupo": "costas",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/1.jpg"
    ]
  },
  {
    "id": "One-Arm_Dumbbell_Row",
    "nome": "Remada unilateral com halter",
    "grupo": "costas",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/1.jpg"
    ]
  },
  {
    "id": "Barbell_Deadlift",
    "nome": "Levantamento terra",
    "grupo": "costas",
    "equipamento": "Barra",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/1.jpg"
    ]
  },
  {
    "id": "Barbell_Shrug",
    "nome": "Encolhimento com barra",
    "grupo": "costas",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/1.jpg"
    ]
  },
  {
    "id": "Barbell_Squat",
    "nome": "Agachamento livre com barra",
    "grupo": "pernas",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/1.jpg"
    ]
  },
  {
    "id": "Leg_Press",
    "nome": "Leg press",
    "grupo": "pernas",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg"
    ]
  },
  {
    "id": "Romanian_Deadlift",
    "nome": "Levantamento terra romeno",
    "grupo": "pernas",
    "equipamento": "Barra",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg"
    ]
  },
  {
    "id": "Leg_Extensions",
    "nome": "Cadeira extensora",
    "grupo": "pernas",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/1.jpg"
    ]
  },
  {
    "id": "Standing_Calf_Raises",
    "nome": "Elevação de panturrilha em pé",
    "grupo": "pernas",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg"
    ]
  },
  {
    "id": "Goblet_Squat",
    "nome": "Agachamento goblet",
    "grupo": "pernas",
    "equipamento": "Kettlebell",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/1.jpg"
    ]
  },
  {
    "id": "Seated_Leg_Curl",
    "nome": "Mesa flexora sentado",
    "grupo": "pernas",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/1.jpg"
    ]
  },
  {
    "id": "Barbell_Lunge",
    "nome": "Afundo com barra",
    "grupo": "pernas",
    "equipamento": "Barra",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Lunge/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Lunge/1.jpg"
    ]
  },
  {
    "id": "Standing_Military_Press",
    "nome": "Desenvolvimento militar em pé",
    "grupo": "ombros",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg"
    ]
  },
  {
    "id": "Side_Lateral_Raise",
    "nome": "Elevação lateral",
    "grupo": "ombros",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg"
    ]
  },
  {
    "id": "Front_Dumbbell_Raise",
    "nome": "Elevação frontal com halteres",
    "grupo": "ombros",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/1.jpg"
    ]
  },
  {
    "id": "Face_Pull",
    "nome": "Face pull no cabo",
    "grupo": "ombros",
    "equipamento": "Cabo (polia)",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/1.jpg"
    ]
  },
  {
    "id": "Upright_Barbell_Row",
    "nome": "Remada alta com barra",
    "grupo": "ombros",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/1.jpg"
    ]
  },
  {
    "id": "Reverse_Machine_Flyes",
    "nome": "Crucifixo inverso na máquina",
    "grupo": "ombros",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/1.jpg"
    ]
  },
  {
    "id": "Barbell_Curl",
    "nome": "Rosca direta com barra",
    "grupo": "bracos",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/1.jpg"
    ]
  },
  {
    "id": "Hammer_Curls",
    "nome": "Rosca martelo",
    "grupo": "bracos",
    "equipamento": "Halteres",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/1.jpg"
    ]
  },
  {
    "id": "Triceps_Pushdown",
    "nome": "Tríceps corda no cabo",
    "grupo": "bracos",
    "equipamento": "Cabo (polia)",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/1.jpg"
    ]
  },
  {
    "id": "Close-Grip_Barbell_Bench_Press",
    "nome": "Supino pegada fechada",
    "grupo": "bracos",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/1.jpg"
    ]
  },
  {
    "id": "Lying_Triceps_Press",
    "nome": "Tríceps testa deitado",
    "grupo": "bracos",
    "equipamento": "Barra EZ",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Triceps_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Triceps_Press/1.jpg"
    ]
  },
  {
    "id": "Preacher_Curl",
    "nome": "Rosca scott",
    "grupo": "bracos",
    "equipamento": "Barra",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/1.jpg"
    ]
  },
  {
    "id": "Bench_Dips",
    "nome": "Tríceps no banco (mergulho)",
    "grupo": "bracos",
    "equipamento": "Peso corporal",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/1.jpg"
    ]
  },
  {
    "id": "Crunches",
    "nome": "Abdominal crunch",
    "grupo": "abdomen",
    "equipamento": "Peso corporal",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunches/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunches/1.jpg"
    ]
  },
  {
    "id": "Plank",
    "nome": "Prancha abdominal",
    "grupo": "abdomen",
    "equipamento": "Peso corporal",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/1.jpg"
    ]
  },
  {
    "id": "Hanging_Leg_Raise",
    "nome": "Elevação de pernas na barra",
    "grupo": "abdomen",
    "equipamento": "Peso corporal",
    "nivel": "Avançado",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/1.jpg"
    ]
  },
  {
    "id": "Russian_Twist",
    "nome": "Russian twist",
    "grupo": "abdomen",
    "equipamento": "Peso corporal",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/1.jpg"
    ]
  },
  {
    "id": "Ab_Roller",
    "nome": "Rolete abdominal",
    "grupo": "abdomen",
    "equipamento": "Outro / acessório",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Roller/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Roller/1.jpg"
    ]
  },
  {
    "id": "Cable_Crunch",
    "nome": "Abdominal no cabo (crunch)",
    "grupo": "abdomen",
    "equipamento": "Cabo (polia)",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/1.jpg"
    ]
  },
  {
    "id": "Decline_Crunch",
    "nome": "Abdominal no banco declinado",
    "grupo": "abdomen",
    "equipamento": "Peso corporal",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Crunch/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Crunch/1.jpg"
    ]
  },
  {
    "id": "Bicycling_Stationary",
    "nome": "Bicicleta ergométrica",
    "grupo": "cardio",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/1.jpg"
    ]
  },
  {
    "id": "Jogging_Treadmill",
    "nome": "Corrida leve na esteira",
    "grupo": "cardio",
    "equipamento": "Máquina",
    "nivel": "Iniciante",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jogging_Treadmill/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jogging_Treadmill/1.jpg"
    ]
  },
  {
    "id": "Rope_Jumping",
    "nome": "Pular corda",
    "grupo": "cardio",
    "equipamento": "Outro / acessório",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Jumping/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Jumping/1.jpg"
    ]
  },
  {
    "id": "Rowing_Stationary",
    "nome": "Remo ergométrico",
    "grupo": "cardio",
    "equipamento": "Máquina",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rowing_Stationary/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rowing_Stationary/1.jpg"
    ]
  },
  {
    "id": "Stairmaster",
    "nome": "Escada ergométrica (stairmaster)",
    "grupo": "cardio",
    "equipamento": "Máquina",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stairmaster/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stairmaster/1.jpg"
    ]
  },
  {
    "id": "Elliptical_Trainer",
    "nome": "Elíptico",
    "grupo": "cardio",
    "equipamento": "Máquina",
    "nivel": "Intermediário",
    "imagens": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/1.jpg"
    ]
  }
];
