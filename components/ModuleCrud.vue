<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()

interface Item {
  id: number
  name: string
  category: string
  description: string
}

// Local reactive state
const items = ref([] as Item[])
const pending = ref(false)
const errorMsg = ref<string | null>(null)

// Modal states
const showModal = ref(false)
const modalAction = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const formName = ref('')
const formCategory = ref('Frontend')
const formDescription = ref('')

// Delay setting for visual demo
const apiDelay = ref(1000)

// Load items from our real Nitro Server API
const fetchItems = async () => {
  pending.value = true
  errorMsg.value = null
  try {
    const res = await $fetch<{ success: boolean; data: Item[] }>(`/api/items?delay=${apiDelay.value}`)
    if (res.success) {
      items.value = res.data
    }
  } catch (err: any) {
    errorMsg.value = err.statusMessage || 'Fallo al conectar con el servidor.'
  } finally {
    pending.value = false
  }
}

// Create or Update handler
const saveItem = async () => {
  if (!formName.value || !formCategory.value) return

  pending.value = true
  try {
    if (modalAction.value === 'create') {
      const res = await $fetch<{ success: boolean; data: Item }>('/api/items', {
        method: 'POST',
        body: {
          name: formName.value,
          category: formCategory.value,
          description: formDescription.value
        }
      })
      if (res.success) {
        items.value.push(res.data)
      }
    } else if (modalAction.value === 'edit' && editingId.value !== null) {
      const res = await $fetch<{ success: boolean; data: Item }>(`/api/items/${editingId.value}`, {
        method: 'PUT',
        body: {
          name: formName.value,
          category: formCategory.value,
          description: formDescription.value
        }
      })
      if (res.success) {
        const idx = items.value.findIndex(item => item.id === editingId.value)
        if (idx !== -1) {
          items.value[idx] = res.data
        }
      }
    }
    closeModal()
  } catch (err: any) {
    alert(err.statusMessage || 'Hubo un error al guardar.')
  } finally {
    pending.value = false
  }
}

// Delete handler
const deleteItemRecord = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro del backend?')) return
  pending.value = true
  try {
    const res = await $fetch<{ success: boolean }>(`/api/items/${id}`, {
      method: 'DELETE'
    })
    if (res.success) {
      items.value = items.value.filter(item => item.id !== id)
    }
  } catch (err: any) {
    alert(err.statusMessage || 'Error al eliminar.')
  } finally {
    pending.value = false
  }
}

// Modal open/close helpers
const openCreateModal = () => {
  modalAction.value = 'create'
  formName.value = ''
  formCategory.value = 'Frontend'
  formDescription.value = ''
  showModal.value = true
}

const openEditModal = (item: Item) => {
  modalAction.value = 'edit'
  editingId.value = item.id
  formName.value = item.name
  formCategory.value = item.category
  formDescription.value = item.description
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const markCompleted = () => {
  store.completeModule('crud')
}

// Load automatically on mount
onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="glass-card glow-emerald">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
      <div>
        <span class="badge badge-emerald">Módulo 4</span>
        <h2 style="font-size: 1.8rem; margin-top: 0.5rem;">Integración Full-Stack CRUD Real</h2>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Este panel se comunica con los endpoints reales en <code style="color: var(--accent-emerald);">server/api/items</code>.
          Agrega, edita y elimina datos directamente del servidor utilizando Composition API y hooks.
        </p>
      </div>
      
      <button 
        @click="markCompleted" 
        class="btn btn-primary"
        :class="{ 'btn-secondary': store.isModuleCompleted('crud') }"
      >
        {{ store.isModuleCompleted('crud') ? '✓ Completado' : 'Completar Módulo' }}
      </button>
    </div>

    <div class="split-pane">
      <!-- Left side: Live CRUD Panel -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="crud-controls">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button @click="fetchItems" class="btn btn-secondary">
              🔄 Recargar
            </button>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary);">
              <span>Retardo:</span>
              <select v-model="apiDelay" class="text-input" style="padding: 0.25rem 0.5rem; background: var(--bg-primary);">
                <option :value="0">Sin retardo (0ms)</option>
                <option :value="1000">Normal (1000ms)</option>
                <option :value="2500">Lento (2500ms)</option>
              </select>
            </div>
          </div>

          <button @click="openCreateModal" class="btn btn-primary">
            ➕ Nuevo Item
          </button>
        </div>

        <!-- Pending state loader -->
        <div v-if="pending" class="loader-container glass-card" style="background: rgba(255,255,255,0.01);">
          <div class="spinner"></div>
          <p>Consumiendo API en el Servidor Nitro...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="errorMsg" class="glass-card" style="background: rgba(244, 63, 94, 0.05); border-color: var(--accent-rose); padding: 1.5rem; text-align: center;">
          <p style="color: #fecdd3; font-weight: 600;">⚠️ Error en el Backend</p>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">{{ errorMsg }}</p>
          <button @click="fetchItems" class="btn btn-secondary" style="margin-top: 1rem; font-size: 0.8rem;">Reintentar</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="items.length === 0" class="glass-card" style="background: rgba(255,255,255,0.01); text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary);">No hay registros en la base de datos del servidor.</p>
          <button @click="openCreateModal" class="btn btn-primary" style="margin-top: 1rem; font-size: 0.85rem;">Crear Primer Registro</button>
        </div>

        <!-- Grid of items -->
        <div v-else class="crud-grid">
          <div v-for="item in items" :key="item.id" class="crud-card">
            <div class="crud-card-header">
              <span class="badge" :class="item.category === 'Backend' ? 'badge-purple' : item.category === 'Frontend' ? 'badge-cyan' : 'badge-emerald'">
                {{ item.category }}
              </span>
              <h3 style="margin-top: 0.5rem;">{{ item.name }}</h3>
              <p>{{ item.description }}</p>
            </div>
            
            <div class="crud-actions">
              <button @click="openEditModal(item)" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                ✏️ Editar
              </button>
              <button @click="deleteItemRecord(item.id)" class="btn btn-danger" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                🗑️ Borrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Pinia Global State Console and Code explanation -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          Visualizador de Estado Centralizado (Pinia)
        </h3>

        <!-- Pinia Visualizer Box -->
        <div class="store-box">
          <div class="store-section-title">🍍 Pinia Store: useTutorialStore()</div>
          <div class="store-data">
            <div><span style="color: #60a5fa;">completedModules:</span> {{ JSON.stringify(store.completedModules) }}</div>
            <div style="margin-top: 0.5rem;"><span style="color: #34d399;">progressPercentage:</span> {{ store.progressPercentage }}%</div>
            <div style="margin-top: 0.5rem;"><span style="color: #f59e0b;">itemsInDatabase:</span> {{ items.length }} (Locales)</div>
            <div style="margin-top: 0.5rem;"><span style="color: #f43f5e;">completedModulesCount:</span> {{ store.completedModules.length }}</div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3;">
            Al presionar "Completar Módulo" en la parte superior, los componentes modifican el estado de Pinia globalmente. 
            El sidebar y el header se actualizan al instante de forma reactiva gracias al store.
          </p>
        </div>

        <!-- Composition API Fetch instructions -->
        <div class="glass-card" style="background: rgba(255,255,255,0.01); padding: 1.25rem;">
          <h4 style="color: var(--accent-emerald); font-size: 0.95rem; margin-bottom: 0.5rem;">Mejores Prácticas de Integración:</h4>
          <ul style="font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem; padding-left: 1.2rem;">
            <li>Utiliza <code style="color: white;">$fetch</code> para acciones disparadas por botones (POST/PUT/DELETE) para evitar bloqueos SSR.</li>
            <li>Usa variables reactivas como <code style="color: white;">pending</code> para informar al usuario de cargas en red.</li>
            <li>Centraliza tu base de datos en utilidades del lado del servidor (`server/utils/`) para compartir datos entre llamadas de API.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal overlay -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3 style="font-size: 1.3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          {{ modalAction === 'create' ? 'Agregar Registro al Servidor' : 'Editar Registro' }}
        </h3>

        <!-- Form fields -->
        <div class="input-group">
          <label for="itemName">Nombre del Elemento</label>
          <input id="itemName" v-model="formName" type="text" class="text-input" placeholder="Ej. Modularización de stores" />
        </div>

        <div class="input-group">
          <label for="itemCategory">Categoría</label>
          <select id="itemCategory" v-model="formCategory" class="text-input" style="background: var(--bg-primary);">
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Integración">Integración</option>
            <option value="Estado">Estado</option>
          </select>
        </div>

        <div class="input-group">
          <label for="itemDesc">Descripción corta</label>
          <textarea id="itemDesc" v-model="formDescription" class="text-input" style="resize: vertical; min-height: 80px;" placeholder="Detalles de la funcionalidad..."></textarea>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button 
            @click="saveItem" 
            class="btn btn-primary"
            :disabled="!formName"
          >
            Guardar en Backend
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
