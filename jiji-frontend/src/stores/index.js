import { createStore } from 'vuex'
import apiClient from '@/lib/api-client'
import {
  GET_FILES_ROUTE,
  CREATE_FILE_ROUTE,
  GET_ID_FILE_ROUTE,
  UPDATE_FILE_ROUTE,
  DELETE_FILE_ROUTE,
  DOWNLOAD_FILE_ROUTE,
} from '@/utils/constants'

export default createStore({
  state: {
    files: [],
    totalRecords: 0,
    currentPage: 1,
    perPage: 50,
  },
  mutations: {
    SET_FILES(state, payload) {
      state.files = payload.data
      state.totalRecords = payload.total
      state.currentPage = payload.current_page
      state.perPage = payload.per_page
    },
    ADD_FILE(state, file) {
      state.files.unshift(file)
    },
    UPDATE_FILE(state, updatedFile) {
      const index = state.files.findIndex((file) => file.id === updatedFile.id)
      if (index !== -1) state.files.splice(index, 1, updatedFile)
    },
    DELETE_FILE(state, id) {
      state.files = state.files.filter((file) => file.id !== id)
    },
  },
  actions: {
    async fetchFiles({ commit }, { search = '', page = 1 } = {}) {
      try {
        const response = await apiClient.get(GET_FILES_ROUTE, {
          params: { search, page },
        })
        commit('SET_FILES', response.data)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    },
    async createFile({ commit }, formData) {
      try {
        const response = await apiClient.post(CREATE_FILE_ROUTE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        commit('ADD_FILE', response.data)
      } catch (error) {
        console.error('Error creating file:', error)
      }
    },
    async fetchFileById(_, id) {
      try {
        const response = await apiClient.get(GET_ID_FILE_ROUTE.replace('{id}', id))
        return response.data
      } catch (error) {
        console.error('Error fetching file by ID:', error)
      }
    },
    async updateFile({ commit }, { id, formData }) {
      try {
        const response = await apiClient.post(UPDATE_FILE_ROUTE.replace('{id}', id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        commit('UPDATE_FILE', response.data)
      } catch (error) {
        console.error('Error updating file:', error)
      }
    },
    async deleteFile({ commit }, id) {
      try {
        await apiClient.delete(DELETE_FILE_ROUTE.replace('{id}', id))
        commit('DELETE_FILE', id)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    },
    async downloadFile(fileId) {
      try {
        const response = await apiClient.get(DOWNLOAD_FILE_ROUTE.replace('{id}', encodeURIComponent(fileId)), {
          responseType: 'blob',
        });

        return response
      } catch (error) {
        console.error('Error downloading file:', error)
        throw error
      }
    },
  },
  getters: {
    files: (state) => state.files,
    totalRecords: (state) => state.totalRecords,
    currentPage: (state) => state.currentPage,
    perPage: (state) => state.perPage,
  },
})
