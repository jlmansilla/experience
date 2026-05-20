<script setup lang="ts">
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()
</script>

<template>
  <header class="header-bar">
    <div class="header-title">
      <h1>Dashboard de Aprendizaje Nuxt 3</h1>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
        Integración de Vue 3 Composition API & Backend Nitro Server Engine
      </p>
    </div>
    
    <div class="progress-container">
      <span class="progress-text">Progreso Global</span>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: store.progressPercentage + '%' }"></div>
      </div>
      <span class="progress-text">{{ store.progressPercentage }}%</span>
    </div>
  </header>
</template>
