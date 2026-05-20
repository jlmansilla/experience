// In-memory mock database shared between Nitro server handlers
export interface MockItem {
  id: number
  name: string
  category: string
  description: string
}

export let mockItems: MockItem[] = [
  { id: 1, name: 'Configuración de Rutas Nitro', category: 'Backend', description: 'Creación de endpoints RESTful en el directorio server/api/' },
  { id: 2, name: 'Componiendo con ref y reactive', category: 'Frontend', description: 'Gestión de estados reactivos locales usando Vue Composition API' },
  { id: 3, name: 'useFetch y Estados Asíncronos', category: 'Integración', description: 'Consumo eficiente de APIs con soporte para SSR y carga diferida' },
  { id: 4, name: 'Módulos Globales con Pinia', category: 'Estado', description: 'Centralización de estados globales y sincronización reactiva' }
]

export const getItems = () => mockItems

export const addItem = (item: Omit<MockItem, 'id'>) => {
  const newItem = {
    id: mockItems.length > 0 ? Math.max(...mockItems.map(i => i.id)) + 1 : 1,
    ...item
  }
  mockItems.push(newItem)
  return newItem
}

export const updateItem = (id: number, updatedData: Partial<Omit<MockItem, 'id'>>) => {
  const index = mockItems.findIndex(i => i.id === id)
  if (index !== -1) {
    mockItems[index] = { ...mockItems[index], ...updatedData }
    return mockItems[index]
  }
  return null
}

export const deleteItem = (id: number) => {
  const index = mockItems.findIndex(i => i.id === id)
  if (index !== -1) {
    const deleted = mockItems[index]
    mockItems.splice(index, 1)
    return deleted
  }
  return null
}
