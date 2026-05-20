<script setup lang="ts">
import { ref } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

// Active learning module controller
const activeModule = ref('architecture')

const changeModule = (moduleName: string) => {
  activeModule.value = moduleName
}
</script>

<template>
  <div class="app-container">
    <!-- Sidebar Navigation -->
    <ModuleNavigation 
      :active-module="activeModule" 
      @change-module="changeModule" 
    />

    <!-- Main Content Area -->
    <main class="main-layout">
      <!-- Top Navbar & Progress Bar -->
      <TutorialHeader />

      <!-- Interactive Learning Modules Grid -->
      <div class="content-body">
        
        <!-- Module 1: Architecture Explorer -->
        <div v-if="activeModule === 'architecture'" class="module-wrapper">
          <ModuleArchitecture />
        </div>

        <!-- Module 2: Composition Workbench -->
        <div v-if="activeModule === 'composition'" class="module-wrapper">
          <ModuleComposition />
        </div>

        <!-- Module 3: Request Simulator -->
        <div v-if="activeModule === 'backend'" class="module-wrapper">
          <ModuleBackend />
        </div>

        <!-- Module 4: Live CRUD Dashboard -->
        <div v-if="activeModule === 'crud'" class="module-wrapper">
          <ModuleCrud />
        </div>

        <!-- Module 5: Quiz Hub -->
        <div v-if="activeModule === 'quiz'" class="module-wrapper">
          <ModuleQuiz />
        </div>

      </div>
    </main>
  </div>
</template>

<style>
/* Smooth fade transition for learning modules */
.module-wrapper {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
