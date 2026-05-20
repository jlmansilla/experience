<script setup lang="ts">
import { ref } from 'vue'
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()

// State
const packetState = ref<'idle' | 'sending' | 'processing' | 'returning' | 'done'>('idle')
const delayType = ref<'success' | 'delay' | 'error'>('success')
const responseJson = ref(null as any)
const requestStatus = ref<number | null>(null)
const codeTab = ref<'client' | 'server'>('client')

const markCompleted = () => {
  store.completeModule('backend')
}

const runSimulation = async () => {
  if (packetState.value !== 'idle' && packetState.value !== 'done') return

  packetState.value = 'sending'
  responseJson.value = null
  requestStatus.value = null

  // 1. Send phase (1200ms animation)
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  packetState.value = 'processing'
  
  // 2. Server processing phase
  const processingTime = delayType.value === 'delay' ? 2500 : 800
  await new Promise(resolve => setTimeout(resolve, processingTime))
  
  packetState.value = 'returning'

  // 3. Return phase (1200ms animation)
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  packetState.value = 'done'

  // Set mock responses
  if (delayType.value === 'success') {
    requestStatus.value = 200
    responseJson.value = {
      success: true,
      message: 'Conexión establecida con éxito.',
      timestamp: new Date().toISOString(),
      payload: [
        { id: 1, name: 'Curso de Nuxt 3', price: 0.00 }
      ]
    }
  } else if (delayType.value === 'delay') {
    requestStatus.value = 200
    responseJson.value = {
      success: true,
      message: 'Respuesta retrasada devuelta.',
      delayMs: 2500,
      timestamp: new Date().toISOString(),
      payload: [
        { id: 1, name: 'Curso de Nuxt 3', price: 0.00 }
      ]
    }
  } else {
    requestStatus.value = 500
    responseJson.value = {
      success: false,
      error: 'Internal Server Error',
      message: 'Fallo simulado del servidor en Nitro engine.'
    }
  }
}
</script>

<template>
  <div class="glass-card glow-purple">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
      <div>
        <span class="badge badge-purple">Módulo 3</span>
        <h2 style="font-size: 1.8rem; margin-top: 0.5rem;">Simulador de Integración Backend</h2>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Aprende cómo interactúan el cliente (Composition API) y el backend (servidor Nitro) mediante peticiones HTTP estructuradas.
        </p>
      </div>
      
      <button 
        @click="markCompleted" 
        class="btn btn-primary"
        :class="{ 'btn-secondary': store.isModuleCompleted('backend') }"
      >
        {{ store.isModuleCompleted('backend') ? '✓ Completado' : 'Completar Módulo' }}
      </button>
    </div>

    <div class="split-pane">
      <!-- Left side: Interactive Flowchart -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          Flujo de Peticiones en Tiempo Real
        </h3>

        <div class="simulator-container">
          <!-- Flow simulator visual board -->
          <div class="network-flow">
            <!-- Client card -->
            <div class="client-node">
              <span>🖥️ Cliente</span>
              <p style="font-size: 0.75rem; font-weight: normal; margin-top: 0.25rem;">Vue frontend</p>
            </div>

            <!-- Animated channel -->
            <div class="network-pipe">
              <!-- Request packet moving right -->
              <div 
                class="request-packet" 
                :class="{ sending: packetState === 'sending' || packetState === 'processing' }"
              ></div>
              <!-- Response packet moving left -->
              <div 
                class="request-packet" 
                :class="{ returning: packetState === 'returning' }"
                :style="{ background: delayType === 'error' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }"
              ></div>
            </div>

            <!-- Server card -->
            <div class="server-node">
              <span>⚙️ Servidor</span>
              <p style="font-size: 0.75rem; font-weight: normal; margin-top: 0.25rem;">Nitro engine</p>
            </div>
          </div>

          <!-- Network status indicator -->
          <div style="text-align: center; font-size: 0.9rem; font-weight: 600;">
            <span v-if="packetState === 'idle'">Listo para iniciar petición HTTP</span>
            <span v-else-if="packetState === 'sending'" style="color: var(--accent-indigo);">Enviando petición HTTP: POST/GET /api/items...</span>
            <span v-else-if="packetState === 'processing'" style="color: var(--accent-cyan);">Servidor procesando petición... ¡Ejecutando lógica de backend!</span>
            <span v-else-if="packetState === 'returning'" style="color: var(--accent-emerald);">Petición finalizada. Retornando respuesta HTTP JSON...</span>
            <span v-else-if="packetState === 'done'" style="color: var(--accent-emerald);">
              Completado. Estado HTTP: 
              <span :style="{ color: requestStatus === 200 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }">
                {{ requestStatus }}
              </span>
            </span>
          </div>

          <!-- Configuration selector -->
          <div class="simulator-options">
            <div 
              @click="delayType = 'success'" 
              class="sim-option-card"
              :class="{ active: delayType === 'success' }"
            >
              <h4 style="color: var(--accent-emerald);">Petición Directa</h4>
              <p>Respuesta inmediata</p>
            </div>
            
            <div 
              @click="delayType = 'delay'" 
              class="sim-option-card"
              :class="{ active: delayType === 'delay' }"
            >
              <h4 style="color: var(--accent-amber);">Petición Retrasada</h4>
              <p>Simula 2.5s de retardo</p>
            </div>

            <div 
              @click="delayType = 'error'" 
              class="sim-option-card"
              :class="{ active: delayType === 'error' }"
            >
              <h4 style="color: var(--accent-rose);">Petición Fallida</h4>
              <p>Simula error 500</p>
            </div>
          </div>

          <!-- Button trigger -->
          <button 
            @click="runSimulation" 
            class="btn btn-primary" 
            style="width: 100%; justify-content: center; padding: 0.85rem;"
            :disabled="packetState !== 'idle' && packetState !== 'done'"
          >
            <span v-if="packetState === 'idle' || packetState === 'done'">🚀 Iniciar Petición Simulación</span>
            <span v-else>Cargando...</span>
          </button>
        </div>
      </div>

      <!-- Right side: JSON and Code Codeblock -->
      <div style="display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          Líneas de Código & Carga Útil JSON
        </h3>

        <div class="tab-container">
          <button 
            @click="codeTab = 'client'" 
            class="tab-btn"
            :class="{ active: codeTab === 'client' }"
          >
            Frontend (useFetch)
          </button>
          <button 
            @click="codeTab = 'server'" 
            class="tab-btn"
            :class="{ active: codeTab === 'server' }"
          >
            Backend (Nitro Route)
          </button>
        </div>

        <div v-show="codeTab === 'client'" class="code-editor" style="margin-bottom: 1.5rem;">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="editor-filename">composables/fetch.ts</span>
          </div>
          <pre class="code-block" style="font-size: 0.8rem;"><code><span class="keyword">const</span> url = <span class="string">'/api/items'</span>
<span class="comment">// Petición asíncrona reactiva en Nuxt 3</span>
<span class="keyword">const</span> { data, pending, error } = <span class="keyword">await</span> <span class="function">useFetch</span>(url, {
  query: { delay: {{ delayType === 'delay' ? 2500 : 0 }} }
})</code></pre>
        </div>

        <div v-show="codeTab === 'server'" class="code-editor" style="margin-bottom: 1.5rem;">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="editor-filename">server/api/items.ts</span>
          </div>
          <pre class="code-block" style="font-size: 0.8rem;"><code><span class="keyword">import</span> { defineEventHandler, getQuery } <span class="keyword">from</span> <span class="string">'h3'</span>

<span class="keyword">export default</span> <span class="function">defineEventHandler</span>(<span class="keyword">async</span> (event) => {
  <span class="keyword">const</span> query = <span class="function">getQuery</span>(event)
  <span class="keyword">if</span> (query.delay) {
    <span class="keyword">await</span> <span class="keyword">new</span> <span class="function">Promise</span>(r => <span class="function">setTimeout</span>(r, Number(query.delay)))
  }
  <span class="keyword">return</span> { success: <span class="keyword">true</span> }
})</code></pre>
        </div>

        <!-- Simulated Response JSON Console -->
        <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-secondary);">Consola del Navegador (JSON Retornado)</h4>
        <div class="code-editor" style="background: #000; flex-grow: 1; min-height: 180px;">
          <div class="editor-header" style="background: #09090c; padding: 0.4rem 1rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">Console HTTP Payload</span>
          </div>
          <pre class="code-block" style="color: #6ee7b7; font-size: 0.8rem;"><code v-if="responseJson">{{ JSON.stringify(responseJson, null, 2) }}</code><code v-else-if="packetState === 'sending' || packetState === 'processing'" style="color: var(--accent-cyan); font-style: italic;">Esperando flujo HTTP...</code><code v-else style="color: var(--text-muted); font-style: italic;">Inicia la simulación para inspeccionar la carga JSON devuelta por el servidor.</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
