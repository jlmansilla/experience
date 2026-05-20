<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()

// Counter State (ref)
const counter = ref(0)
const increment = () => counter.value++
const decrement = () => counter.value--

// Computed Full Name State (ref inputs)
const firstName = ref('Antigravity')
const lastName = ref('AI')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// Tab comparison state
const comparisonTab = ref('composition')

const markCompleted = () => {
  store.completeModule('composition')
}
</script>

<template>
  <div class="glass-card glow-cyan">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
      <div>
        <span class="badge badge-cyan">Módulo 2</span>
        <h2 style="font-size: 1.8rem; margin-top: 0.5rem;">Vue 3 Composition API & Reactividad</h2>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Domina la reactividad moderna de Vue 3 utilizando <code style="color: var(--accent-cyan); font-weight: 600;">&lt;script setup&gt;</code>,
          declarando estados reactivos con <code style="color: var(--accent-purple);">ref</code> y derivando valores con <code style="color: var(--accent-purple);">computed</code>.
        </p>
      </div>
      
      <button 
        @click="markCompleted" 
        class="btn btn-primary"
        :class="{ 'btn-secondary': store.isModuleCompleted('composition') }"
      >
        {{ store.isModuleCompleted('composition') ? '✓ Completado' : 'Completar Módulo' }}
      </button>
    </div>

    <div class="split-pane">
      <!-- Left side: Interactive Workbench -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          Banco de Reactividad Activo
        </h3>

        <!-- Experiment 1: Live Counter -->
        <div class="glass-card" style="background: rgba(255,255,255,0.01); padding: 1.5rem;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem; font-size: 1rem;">Experimento 1: Estado reactivo mutable con ref()</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
            El valor del contador está encapsulado en un nodo reactivo. Al incrementarlo, el DOM se actualiza instantáneamente de forma automática.
          </p>
          
          <div class="interactive-counter">
            <div class="counter-value">{{ counter }}</div>
            <div style="display: flex; gap: 0.75rem;">
              <button @click="decrement" class="btn btn-secondary" style="font-size: 1.2rem; padding: 0.4rem 1.2rem;">-</button>
              <button @click="increment" class="btn btn-primary" style="font-size: 1.2rem; padding: 0.4rem 1.2rem;">+</button>
            </div>
          </div>
        </div>

        <!-- Experiment 2: Computed FullName -->
        <div class="glass-card" style="background: rgba(255,255,255,0.01); padding: 1.5rem;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem; font-size: 1rem;">Experimento 2: Estados calculados con computed()</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Escribe en los inputs. La propiedad calculada recalculará su valor de manera eficiente únicamente cuando sus dependencias cambien.
          </p>

          <div class="inputs-row">
            <div class="input-group">
              <label for="firstName">Nombre</label>
              <input id="firstName" v-model="firstName" type="text" class="text-input" />
            </div>
            <div class="input-group">
              <label for="lastName">Apellido</label>
              <input id="lastName" v-model="lastName" type="text" class="text-input" />
            </div>
          </div>

          <div class="computed-preview">
            <span style="color: var(--accent-purple); font-weight: 600;">Nombre Completo Calculado (fullName):</span>
            <div style="font-size: 1.2rem; font-weight: 700; margin-top: 0.25rem; color: white;">
              {{ fullName }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Code Comparison -->
      <div style="display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          ¿Por qué Composition API? Comparativa de Sintaxis
        </h3>

        <div class="tab-container">
          <button 
            @click="comparisonTab = 'options'" 
            class="tab-btn"
            :class="{ active: comparisonTab === 'options' }"
          >
            Options API (Tradicional)
          </button>
          <button 
            @click="comparisonTab = 'composition'" 
            class="tab-btn"
            :class="{ active: comparisonTab === 'composition' }"
          >
            Composition API (Moderna)
          </button>
        </div>

        <div v-show="comparisonTab === 'options'" class="code-editor">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="editor-filename">OptionsCounter.vue</span>
          </div>
          <pre class="code-block"><code>&lt;<span class="tag">script</span>&gt;
<span class="keyword">export default</span> {
  <span class="function">data</span>() {
    <span class="keyword">return</span> {
      counter: 0,
      firstName: <span class="string">'Antigravity'</span>,
      lastName: <span class="string">'AI'</span>
    }
  },
  computed: {
    <span class="function">fullName</span>() {
      <span class="keyword">return</span> <span class="keyword">this</span>.firstName + <span class="string">' '</span> + <span class="keyword">this</span>.lastName
    }
  },
  methods: {
    <span class="function">increment</span>() {
      <span class="keyword">this</span>.counter++
    }
  }
}
&lt;/<span class="tag">script</span>&gt;</code></pre>
        </div>

        <div v-show="comparisonTab === 'composition'" class="code-editor">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="editor-filename">CompositionCounter.vue</span>
          </div>
          <pre class="code-block"><code>&lt;<span class="tag">script</span> setup lang="ts"&gt;
<span class="keyword">import</span> { ref, computed } from <span class="string">'vue'</span>

<span class="comment">// Estados reactivos puros con ref()</span>
<span class="keyword">const</span> counter = <span class="function">ref</span>(0)
<span class="keyword">const</span> firstName = <span class="function">ref</span>(<span class="string">'Antigravity'</span>)
<span class="keyword">const</span> lastName = <span class="function">ref</span>(<span class="string">'AI'</span>)

<span class="comment">// Acciones de mutación sencillas</span>
<span class="keyword">const</span> increment = () => counter.value++

<span class="comment">// Propiedad calculada altamente eficiente</span>
<span class="keyword">const</span> fullName = <span class="function">computed</span>(() => {
  <span class="keyword">return</span> \`\${firstName.value} \${lastName.value}\`
})
&lt;/<span class="tag">script</span>&gt;</code></pre>
        </div>

        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
          <p v-show="comparisonTab === 'options'">
            ❌ <strong>Problemas</strong>: La lógica está fragmentada entre múltiples opciones (`data`, `computed`, `methods`). A medida que el componente crece, resulta difícil agrupar lógica relacionada.
          </p>
          <p v-show="comparisonTab === 'composition'">
            ✔ <strong>Ventajas</strong>: Código unificado y legible. Es extremadamente fácil extraer lógica a funciones externas reusable (`composables`) y cuenta con soporte de TypeScript excelente de forma nativa.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
