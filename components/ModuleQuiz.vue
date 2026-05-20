<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()

interface Question {
  id: number
  text: string
  options: string[]
  answerIdx: number
  explanation: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: '¿Cuál es la función del directorio server/api/ en un proyecto Nuxt 3?',
    options: [
      'Almacenar componentes de Vue que solo se ejecutan en el servidor.',
      'Configurar las rutas estáticas del frontend de la aplicación.',
      'Definir rutas API backend RESTful que Nitro compila automáticamente en funciones ligeras.',
      'Guardar las configuraciones globales de base de datos como Postgres o MongoDB.'
    ],
    answerIdx: 2,
    explanation: '¡Correcto! En Nuxt 3, todo archivo colocado en server/api/ es compilado automáticamente por el motor Nitro como un endpoint de backend (con soporte para SSR, middleware, y ejecuciones serverless).'
  },
  {
    id: 2,
    text: '¿Cómo declaras una propiedad reactiva calculada eficiente que dependa de un ref() en Vue 3 Composition API?',
    options: [
      'Declarando una función común y llamándola con paréntesis en el template.',
      'Utilizando la función computed() pasando un callback que retorne el cálculo.',
      'Utilizando watch() y mutando una variable auxiliar de forma síncrona.',
      'Pasándolo como prop al componente hijo en el layout.'
    ],
    answerIdx: 1,
    explanation: '¡Excelente! computed() crea un getter reactivo de solo lectura que memoriza su valor y solo se vuelve a evaluar cuando sus dependencias reactivas cambian.'
  },
  {
    id: 3,
    text: '¿Cuál es el hook de composición recomendado en Nuxt 3 para realizar consultas asíncronas seguras con soporte SSR y prevención de duplicidad?',
    options: [
      'fetch() nativo de Javascript',
      'axios.get() dentro de onMounted()',
      'useFetch()',
      'useAsyncData() sin callback'
    ],
    answerIdx: 2,
    explanation: '¡Así es! useFetch() es el envoltorio premium de Nuxt para realizar peticiones de red asíncronas limpias, gestionando estados como error, pending y data, evitando peticiones duplicadas durante la hidratación del SSR.'
  },
  {
    id: 4,
    text: '¿Qué método es el apropiado para realizar mutaciones de base de datos tras acciones del usuario (como clics en botones de borrado)?',
    options: [
      'Llamar a useFetch() con watchers reactivos dinámicos.',
      'Utilizar $fetch() pasándole el método HTTP correspondiente.',
      'Modificar el store local de Pinia sin hacer peticiones externas.',
      'Redireccionar con navigateTo() forzando un refresco total de página.'
    ],
    answerIdx: 1,
    explanation: '¡Correcto! $fetch() es la utilidad subyacente recomendada para peticiones imperativas disparadas por eventos de usuario (POST, PUT, DELETE), evitando los overheads de reactividad pasiva de useFetch.'
  },
  {
    id: 5,
    text: '¿Cómo se definen los estados y las acciones globales en un store de Pinia utilizando la sintaxis Setup?',
    options: [
      'Los estados se definen en state() y las acciones en actions: {} de forma separada.',
      'Los estados se declaran con ref(), y las acciones se declaran como funciones de javascript comunes, retornándolos en un objeto.',
      'Los estados se declaran en getters: {} y las acciones con computed().',
      'Los stores no admiten sintaxis Setup y deben definirse siempre con Options API.'
    ],
    answerIdx: 1,
    explanation: '¡Exacto! Usando la sintaxis Setup en Pinia, los refs actúan como state, las propiedades computed() actúan como getters, y las funciones actúan como acciones, simplificando significativamente el código.'
  }
]

// Local state
const currentQuestionIdx = ref(0)
const selectedOptionIdx = ref<number | null>(null)
const answerConfirmed = ref(false)
const quizFinished = ref(false)
const correctAnswersCount = ref(0)

const currentQuestion = computed(() => quizQuestions[currentQuestionIdx.value])

const selectOption = (idx: number) => {
  if (answerConfirmed.value) return
  selectedOptionIdx.value = idx
}

const confirmAnswer = () => {
  if (selectedOptionIdx.value === null || answerConfirmed.value) return
  
  answerConfirmed.value = true
  if (selectedOptionIdx.value === currentQuestion.value.answerIdx) {
    correctAnswersCount.value++
  }
}

const nextQuestion = () => {
  if (currentQuestionIdx.value < quizQuestions.length - 1) {
    currentQuestionIdx.value++
    selectedOptionIdx.value = null
    answerConfirmed.value = false
  } else {
    quizFinished.value = true
    store.setQuizScore(correctAnswersCount.value)
    store.completeModule('quiz')
  }
}

const restartQuiz = () => {
  currentQuestionIdx.value = 0
  selectedOptionIdx.value = null
  answerConfirmed.value = false
  quizFinished.value = false
  correctAnswersCount.value = 0
}
</script>

<template>
  <div class="glass-card glow-purple">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
      <div>
        <span class="badge badge-purple">Evaluación Final</span>
        <h2 style="font-size: 1.8rem; margin-top: 0.5rem;">Prueba de Conocimientos Nuxt 3</h2>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Pon a prueba lo aprendido sobre arquitectura Nuxt 3, Composition API, llamadas asíncronas y stores globales.
        </p>
      </div>
      
      <button 
        @click="store.completeModule('quiz')" 
        class="btn btn-primary"
        :class="{ 'btn-secondary': store.isModuleCompleted('quiz') }"
        v-if="quizFinished"
      >
        ✓ Completado
      </button>
    </div>

    <!-- Quiz Workbench -->
    <div class="quiz-container">
      
      <!-- Quiz not finished -->
      <div v-if="!quizFinished" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Progress Indicator -->
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
          <span>Pregunta {{ currentQuestionIdx + 1 }} de {{ quizQuestions.length }}</span>
          <span style="color: var(--accent-purple); font-weight: 600;">Correctas: {{ correctAnswersCount }}</span>
        </div>

        <div class="progress-track" style="width: 100%; height: 4px;">
          <div class="progress-bar" :style="{ width: ((currentQuestionIdx + 1) / quizQuestions.length * 100) + '%' }"></div>
        </div>

        <!-- Question Text -->
        <h3 style="font-size: 1.25rem; font-family: var(--font-heading); line-height: 1.4; color: white;">
          {{ currentQuestion.text }}
        </h3>

        <!-- Options list -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div 
            v-for="(option, idx) in currentQuestion.options" 
            :key="idx"
            @click="selectOption(idx)"
            class="quiz-option"
            :class="{ 
              selected: selectedOptionIdx === idx && !answerConfirmed,
              correct: answerConfirmed && idx === currentQuestion.answerIdx,
              incorrect: answerConfirmed && selectedOptionIdx === idx && idx !== currentQuestion.answerIdx
            }"
          >
            <div class="option-dot">
              <span v-if="selectedOptionIdx === idx && !answerConfirmed" style="width: 8px; height: 8px; border-radius: 50%; background: white;"></span>
              <span v-if="answerConfirmed && idx === currentQuestion.answerIdx" style="color: white; font-size: 0.75rem; font-weight: 900;">✓</span>
              <span v-if="answerConfirmed && selectedOptionIdx === idx && idx !== currentQuestion.answerIdx" style="color: white; font-size: 0.75rem; font-weight: 900;">✗</span>
            </div>
            <span style="font-size: 0.95rem;">{{ option }}</span>
          </div>
        </div>

        <!-- Confirms / Next action buttons -->
        <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
          <button 
            v-if="!answerConfirmed"
            @click="confirmAnswer" 
            class="btn btn-primary"
            :disabled="selectedOptionIdx === null"
            style="padding: 0.75rem 2rem;"
          >
            Confirmar Respuesta
          </button>
          
          <button 
            v-else
            @click="nextQuestion" 
            class="btn btn-primary"
            style="padding: 0.75rem 2rem; background: var(--grad-cyan); box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);"
          >
            {{ currentQuestionIdx === quizQuestions.length - 1 ? 'Finalizar Cuestionario' : 'Siguiente Pregunta ➔' }}
          </button>
        </div>

        <!-- Feedback details -->
        <div 
          v-if="answerConfirmed" 
          class="quiz-feedback"
          :class="selectedOptionIdx === currentQuestion.answerIdx ? 'feedback-success' : 'feedback-error'"
        >
          <div style="font-weight: 700; margin-bottom: 0.25rem;">
            {{ selectedOptionIdx === currentQuestion.answerIdx ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta' }}
          </div>
          <p style="font-size: 0.85rem; line-height: 1.4;">{{ currentQuestion.explanation }}</p>
        </div>
      </div>

      <!-- Quiz Finished screen -->
      <div v-else style="text-align: center; display: flex; flex-direction: column; gap: 1.5rem; align-items: center; padding: 2rem 0;">
        <span style="font-size: 4rem;">🏆</span>
        <h3 style="font-size: 1.8rem; font-family: var(--font-heading);">¡Cuestionario Completado!</h3>
        <p style="color: var(--text-secondary); max-width: 500px; line-height: 1.5; font-size: 0.95rem;">
          Has respondido correctamente <strong style="color: var(--accent-cyan); font-size: 1.15rem;">{{ correctAnswersCount }} de {{ quizQuestions.length }}</strong> preguntas. 
          Tu progreso ha sido registrado globalmente y tu medalla del módulo ha sido activada en el store.
        </p>

        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button @click="restartQuiz" class="btn btn-secondary">
            🔄 Intentar de Nuevo
          </button>
          <button @click="store.completeModule('quiz')" class="btn btn-primary">
            Aceptar Progreso
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
