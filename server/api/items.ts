import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import { getItems, addItem } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  // Artificial Delay Simulator to showcase frontend loading states
  if (query.delay) {
    const delayMs = parseInt(query.delay as string) || 1000
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  // Handle GET request
  if (method === 'GET') {
    return {
      success: true,
      data: getItems(),
      timestamp: new Date().toISOString()
    }
  }

  // Handle POST request (Create new item)
  if (method === 'POST') {
    const body = await readBody(event)
    
    if (!body.name || !body.category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos obligatorios: name y category son necesarios.'
      })
    }

    const newItem = addItem({
      name: body.name,
      category: body.category,
      description: body.description || ''
    })
    
    return {
      success: true,
      message: 'Item creado correctamente en el Backend.',
      data: newItem
    }
  }

  // If method not supported
  throw createError({
    statusCode: 405,
    statusMessage: `Método ${method} no permitido.`
  })
})
