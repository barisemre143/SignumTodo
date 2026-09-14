import { apiClient } from '../http/apiClient'

export const taskService = {
  async getTasks(params = {}) {
    const response = await apiClient.get('/api/tasks', { params })

    return response.data
  },

  async createTask(payload) {
    const response = await apiClient.post('/api/tasks', payload)

    return response.data
  },

  async updateTask(id, payload) {
    const response = await apiClient.put(`/api/tasks/${id}`, payload)

    return response.data
  },

  async patchTask(id, payload) {
    const response = await apiClient.patch(`/api/tasks/${id}`, payload)

    return response.data
  },

  async deleteTask(id) {
    await apiClient.delete(`/api/tasks/${id}`)
  },
}
