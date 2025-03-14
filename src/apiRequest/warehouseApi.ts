import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListWarehouses = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/warehouses`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createWarehouse = async (data: {
  name: string
  description: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/warehouses`, data)
  return response
}

export const updateWarehouse = async (data: {
  id: string
  name: string
  description: string
}) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/warehouses/${data.id}`,
    data
  )
  return response
}

export const deleteWarehouse = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/warehouses/${id}`)
  return response
}

export const uploadExcel = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await instant.post(
    `${API_DOMAIN}/v1/warehouses/import-excel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
