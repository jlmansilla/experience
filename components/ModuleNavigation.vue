<script setup lang="ts">
import { useTutorialStore } from '~/stores/tutorial'

defineProps<{
  activeModule: string
}>()

const emit = defineEmits<{
  (e: 'change-module', moduleName: string): void
}>()

const store = useTutorialStore()

const modules = [
  { id: 'architecture', label: 'Estructura de Nuxt', icon: '📂', badge: 'Conceptos' },
  { id: 'composition', label: 'Composition API', icon: '⚡', badge: 'Reactividad' },
  { id: 'backend', label: 'Peticiones Backend', icon: '🔄', badge: 'Flujo API' },
  { id: 'crud', label: 'Integración CRUD', icon: '💾', badge: 'Full-Stack' },
  { id: 'quiz', label: 'Evaluación Quiz', icon: '🏆', badge: 'Quiz' }
]
</script>

<template>
  <aside class="sidebar">
    <!-- Brand Info -->
    <div class="brand-section">
      <div class="brand-logo">N3</div>
      <div class="brand-name">
        <h2>Nuxt Lab</h2>
        <p>Interactive Guide</p>
      </div>
    </div>

    <!-- Navigation List -->
    <nav style="flex-grow: 1;">
      <ul class="nav-list">
        <li v-for="mod in modules" :key="mod.id" class="nav-item">
          <button 
            @click="emit('change-module', mod.id)"
            class="nav-button"
            :class="{ active: activeModule === mod.id }"
          >
            <span>{{ mod.icon }}</span>
            <span style="flex-grow: 1;">{{ mod.label }}</span>
            
            <!-- Checkmark if completed -->
            <span v-if="store.isModuleCompleted(mod.id)" style="color: var(--accent-emerald); font-weight: bold; font-size: 0.9rem;">
              ✓
            </span>
            <span v-else class="badge badge-purple" style="font-size: 0.6rem; padding: 0.1rem 0.4rem;">
              {{ mod.badge }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Versión del Curso: v3.0</span>
        <button 
          @click="store.resetProgress()" 
          class="btn btn-secondary" 
          style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
          title="Reiniciar todo el progreso"
        >
          Reiniciar
        </button>
      </div>
      <p style="font-size: 0.7rem; line-height: 1.3; margin-top: 0.5rem;">
        Creado con Nuxt 3, Vue 3 Composition API & Nitro Engine.
      </p>
    </div>
  </aside>
</template>
