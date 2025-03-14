import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListTopics = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/topics`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createTopic = async (data: {
  name: string
  description: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/topics`, data)
  return response
}

export const updateTopic = async (data: {
  id: string
  name: string
  description: string
}) => {
  const response = await instant.put(`${API_DOMAIN}/v1/topics/${data.id}`, data)
  return response
}

export const deleteTopic = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/topics/${id}`)
  return response
}

export const uploadExcel = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await instant.post(
    `${API_DOMAIN}/v1/topics/import-excel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
