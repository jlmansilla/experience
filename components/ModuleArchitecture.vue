<script setup lang="ts">
import { ref } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()

// State
const activeNode = ref('root')

interface NodeInfo {
  title: string
  subtitle: string
  description: string
  file: string
  code: string
}

const nodeDetails: Record<string, NodeInfo> = {
  root: {
    title: 'Proyecto Base Nuxt 3',
    subtitle: 'Arquitectura Híbrida Moderna',
    description: 'Nuxt 3 unifica el desarrollo frontend de Vue con un motor de servidor (Nitro) integrado. Explora el árbol de directorios a la izquierda para ver cómo se estructuran las aplicaciones modernas utilizando las últimas librerías y mejores prácticas.',
    file: 'README.md',
    code: `# Estructura Nuxt 3
- Full-Stack listo para producción.
- Renderizado del lado del Servidor (SSR) nativo.
- Carga bajo demanda y optimización automática.
- Vue 3 Composition API en todo el flujo.`
  },
  server: {
    title: 'Directorio server/',
    subtitle: 'El motor del Backend (Nitro)',
    description: 'Aquí reside el backend de tu aplicación. Nitro compila todo lo que coloques en esta carpeta en endpoints API ultrarrápidos y ligeros, sin necesidad de configurar Express o NestJS por separado.',
    file: 'server/api/users.ts',
    code: `// server/api/users.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Aquí puedes consultar bases de datos externas o variables de entorno
  return {
    success: true,
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
})`
  },
  pages: {
    title: 'Directorio pages/',
    subtitle: 'Enrutamiento Automático Basado en Archivos',
    description: 'Cada archivo Vue dentro de esta carpeta crea automáticamente una ruta web. Admite layouts reutilizables, carga diferida y parámetros dinámicos utilizando la sintaxis de corchetes.',
    file: 'pages/items/[id].vue',
    code: `<script setup lang="ts">
// Ruta dinámica: /items/:id
const route = useRoute()
const itemId = route.params.id // Parámetro reactivo de la ruta

// Petición automática del lado del servidor (SSR)
const { data: item } = await useFetch(\`/api/items/\${itemId}\`)
<\/script>

<template>
  <div class="item-detail">
    <h2>Detalle del Producto #{{ itemId }}</h2>
    <p v-if="item">{{ item.name }}</p>
  </div>
</template>`
  },
  components: {
    title: 'Directorio components/',
    subtitle: 'Auto-importación Inteligente',
    description: 'Todos los componentes Vue dentro de esta carpeta se importan automáticamente a lo largo de tu código sin necesidad de usar sentencias "import" explícitas. Admite anidación automática de carpetas.',
    file: 'components/base/CustomButton.vue',
    code: `<script setup lang="ts">
// No necesitas importar nada aquí. ¡Auto-importación de Vue y Nuxt activa!
defineProps<{
  label: string
  variant?: 'primary' | 'secondary'
}>()

const emit = defineEmits(['click'])
<\/script>

<template>
  <button 
    class="btn" 
    :class="variant === 'primary' ? 'btn-primary' : 'btn-secondary'"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>`
  },
  composables: {
    title: 'Directorio composables/',
    subtitle: 'Lógica Compartida Reactiva',
    description: 'En esta carpeta guardas funciones de lógica de Vue Composition API. Nuxt las auto-importa para que puedas reutilizar el estado, los watchers y los event listeners entre múltiples componentes.',
    file: 'composables/useCounter.ts',
    code: `// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const double = computed(() => count.value * 2)
  const increment = () => count.value++
  
  return {
    count,
    double,
    increment
  }
}`
  },
  stores: {
    title: 'Directorio stores/',
    subtitle: 'Gestión de Estado Global (Pinia)',
    description: 'Pinia es la librería recomendada de administración de estados globales. Usando la Composition API dentro de Pinia, puedes declarar estados (refs), getters (computeds) y acciones (funciones) globales y consumirlas en cualquier parte.',
    file: 'stores/cart.ts',
    code: `// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([] as any[])
  
  const totalCount = computed(() => items.value.length)
  
  function addToCart(product: any) {
    items.value.push(product)
  }

  return {
    items,
    totalCount,
    addToCart
  }
})`
  },
  config: {
    title: 'nuxt.config.ts',
    subtitle: 'Archivo de Configuración Global',
    description: 'Aquí puedes orquestar todo tu ecosistema Nuxt: registrar plugins, configurar metas SEO, definir variables de entorno públicas y privadas, habilitar compatibilidad de fechas o añadir librerías como TailwindCSS o Pinia.',
    file: 'nuxt.config.ts',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-05-19',
  devtools: { enabled: true },
  
  // Registrar módulos adicionales
  modules: [
    '@pinia/nuxt'
  ],
  
  // Variables globales del servidor/cliente
  runtimeConfig: {
    apiSecret: 'secreto-del-servidor', // Solo disponible en servidor
    public: {
      apiBase: '/api' // Disponible también en cliente
    }
  }
})`
  }
}

const selectNode = (node: string) => {
  activeNode.value = node
}

const markCompleted = () => {
  store.completeModule('architecture')
}
</script>

<template>
  <div class="glass-card glow-purple">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
      <div>
        <span class="badge badge-purple">Módulo 1</span>
        <h2 style="font-size: 1.8rem; margin-top: 0.5rem;">Estructura del Proyecto en Nuxt 3</h2>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Explora la arquitectura de archivos del framework y aprende cómo cada carpeta organiza tu proyecto de manera intuitiva.
        </p>
      </div>
      
      <button 
        @click="markCompleted" 
        class="btn btn-primary"
        :class="{ 'btn-secondary': store.isModuleCompleted('architecture') }"
      >
        {{ store.isModuleCompleted('architecture') ? '✓ Completado' : 'Completar Módulo' }}
      </button>
    </div>

    <!-- Interactive Workspace Split Layout -->
    <div class="split-pane">
      <!-- Left side: File Explorer -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          Explorador de Directorios
        </h3>
        
        <div class="explorer-tree">
          <div 
            @click="selectNode('root')" 
            class="explorer-node" 
            :class="{ active: activeNode === 'root' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">mi-proyecto-nuxt/</span>
          </div>

          <div 
            @click="selectNode('components')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'components' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">components/</span>
          </div>

          <div 
            @click="selectNode('composables')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'composables' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">composables/</span>
          </div>

          <div 
            @click="selectNode('pages')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'pages' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">pages/</span>
          </div>

          <div 
            @click="selectNode('server')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'server' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">server/api/</span>
          </div>

          <div 
            @click="selectNode('stores')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'stores' }"
          >
            <span class="node-icon">📁</span>
            <span class="node-name">stores/</span>
          </div>

          <div 
            @click="selectNode('config')" 
            class="explorer-node indent-1" 
            :class="{ active: activeNode === 'config' }"
          >
            <span class="node-icon">📄</span>
            <span class="node-name">nuxt.config.ts</span>
          </div>
        </div>

        <!-- Concept Explainer -->
        <div class="glass-card" style="background: rgba(255,255,255,0.01); border-radius: var(--radius-sm); padding: 1.25rem;">
          <h4 style="color: var(--accent-purple); font-size: 1.05rem;">
            {{ nodeDetails[activeNode].title }}
          </h4>
          <p style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 500; margin-top: 0.1rem;">
            {{ nodeDetails[activeNode].subtitle }}
          </p>
          <p class="concept-description">
            {{ nodeDetails[activeNode].description }}
          </p>
        </div>
      </div>

      <!-- Right side: Code Editor -->
      <div style="display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          Plantilla de Código de Ejemplo
        </h3>
        
        <div class="code-editor">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="editor-filename">{{ nodeDetails[activeNode].file }}</span>
          </div>
          
          <pre class="code-block"><code><span v-html="nodeDetails[activeNode].code
            .replace(/(const|let|var|function|export|default|import|from|async|await|return)/g, '<span class=\'keyword\'>$1</span>')
            .replace(/('.*?'|\`.*?\`)/g, '<span class=\'string\'>$1</span>')
            .replace(/(\/\/.*)/g, '<span class=\'comment\'>$1</span>')
            .replace(/(&lt;template&gt;|&lt;\/template&gt;|&lt;script.*?&gt;|&lt;\/script&gt;|&lt;div.*?&gt;|&lt;\/div&gt;|&lt;h2.*?&gt;|&lt;\/h2&gt;|&lt;p.*?&gt;|&lt;\/p&gt;|&lt;button.*?&gt;|&lt;\/button&gt;)/g, '<span class=\'tag\'>$1</span>')
          "></span></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
