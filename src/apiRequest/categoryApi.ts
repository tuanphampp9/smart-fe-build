import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListCategories = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/categories`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createCategory = async (data: {
  name: string
  description: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/categories`, data)
  return response
}

export const updateCategory = async (data: {
  id: string
  name: string
  description: string
}) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/categories/${data.id}`,
    data
  )
  return response
}

export const deleteCategory = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/categories/${id}`)
  return response
}

export const uploadExcel = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await instant.post(
    `${API_DOMAIN}/v1/categories/import-excel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
