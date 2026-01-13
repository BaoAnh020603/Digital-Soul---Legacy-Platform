import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Images
export const uploadImages = async (files: File[]) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  
  const response = await api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const curateImages = async (topN: number = 50) => {
  const response = await api.post(`/images/curate?top_n=${topN}`)
  return response.data
}

// Gallery
export const getTimeline = async () => {
  const response = await api.get('/gallery/timeline')
  return response.data
}

export const getHighlights = async (limit: number = 20) => {
  const response = await api.get(`/gallery/highlights?limit=${limit}`)
  return response.data
}

// Life Reel
export const createLifeReel = async () => {
  const response = await api.post('/life-reel/create')
  return response.data
}

export const getJobStatus = async (jobId: number) => {
  const response = await api.get(`/life-reel/status/${jobId}`)
  return response.data
}

// Style Transfer
export const trainStyle = async (
  name: string,
  stylePrompt: string,
  files: File[],
  numEpochs: number = 100
) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', 'Personal style')
  formData.append('style_prompt', stylePrompt)
  formData.append('num_epochs', numEpochs.toString())
  files.forEach(file => formData.append('files', file))
  
  const response = await api.post('/style/train', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const generateInStyle = async (
  modelId: number,
  prompt: string,
  numImages: number = 1
) => {
  const response = await api.post('/style/generate', {
    model_id: modelId,
    prompt,
    num_images: numImages
  })
  return response.data
}
