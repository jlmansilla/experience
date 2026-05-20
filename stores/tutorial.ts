import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTutorialStore = defineStore('tutorial', () => {
  // Global States
  const completedModules = ref<string[]>([])
  const quizScore = ref<number>(0)
  const totalQuestions = ref<number>(5)
  const currentStep = ref<number>(1)

  // Getters
  const isModuleCompleted = computed(() => {
    return (moduleName: string) => completedModules.value.includes(moduleName)
  })

  const progressPercentage = computed(() => {
    const totalModules = 5 // architecture, composition, backend, pinia/crud, quiz
    const uniqueCompleted = new Set(completedModules.value).size
    return Math.min(Math.round((uniqueCompleted / totalModules) * 100), 100)
  })

  // Actions
  function completeModule(moduleName: string) {
    if (!completedModules.value.includes(moduleName)) {
      completedModules.value.push(moduleName)
    }
  }

  function setQuizScore(score: number) {
    quizScore.value = score
  }

  function resetProgress() {
    completedModules.value = []
    quizScore.value = 0
    currentStep.value = 1
  }

  return {
    completedModules,
    quizScore,
    totalQuestions,
    currentStep,
    isModuleCompleted,
    progressPercentage,
    completeModule,
    setQuizScore,
    resetProgress
  }
})
