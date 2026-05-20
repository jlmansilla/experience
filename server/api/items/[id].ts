import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import { updateItem, deleteItem } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method
  const idParam = event.context.params?.id
  const id = parseInt(idParam as string)
  const query = getQuery(event)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido en la petición.'
    })
  }

  // Artificial Delay Simulator to showcase frontend loading states
  if (query.delay) {
    const delayMs = parseInt(query.delay as string) || 1000
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  // Handle PUT request (Update)
  if (method === 'PUT') {
    const body = await readBody(event)
    const updated = updateItem(id, {
      name: body.name,
      category: body.category,
      description: body.description
    })

    if (!updated) {
      throw createError({
        statusCode: 444,
        statusMessage: `No se encontró ningún item con el ID ${id}.`
      })
    }

    return {
      success: true,
      message: 'Item modificado correctamente en el Backend.',
      data: updated
    }
  }

  // Handle DELETE request (Delete)
  if (method === 'DELETE') {
    const deleted = deleteItem(id)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: `No se encontró ningún item con el ID ${id} para eliminar.`
      })
    }

    return {
      success: true,
      message: 'Item eliminado correctamente en el Backend.',
      data: deleted
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: `Método ${method} no permitido en esta ruta.`
  })
})
