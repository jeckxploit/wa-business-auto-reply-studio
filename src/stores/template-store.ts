import { create } from 'zustand'

export type Template = {
  id: string
  customerName: string | null
  businessName: string | null
  operationalHours: string | null
  status: string
  tone: string
  category: string
  content: string
  createdAt: string
  updatedAt: string
}

interface TemplateStore {
  templates: Template[]
  isLoading: boolean
  fetchTemplates: () => Promise<void>
  addTemplate: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  isLoading: false,

  fetchTemplates: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) throw new Error('Failed to fetch templates')
      
      const templates = await response.json()
      set({ templates, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      set({ isLoading: false })
    }
  },

  addTemplate: async (data) => {
    try {
      console.log('📤 Sending to API:', data)

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      console.log('📥 API Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || `Failed to add template (${response.status})`)
      }

      const newTemplate = await response.json()
      console.log('✅ Template added:', newTemplate)

      set((state) => ({
        templates: [newTemplate, ...state.templates]
      }))
    } catch (error) {
      console.error('❌ Failed to add template:', error)
      throw error
    }
  },

  deleteTemplate: async (id) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete template')
      
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id)
      }))
    } catch (error) {
      console.error('Failed to delete template:', error)
      throw error
    }
  },
}))
