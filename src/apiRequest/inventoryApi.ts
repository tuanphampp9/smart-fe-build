import instant from '@/lib/axiosCustom'

const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL

export const getListInventory = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/inventory-checks`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createInventory = async (data: {
  warehouseId: string
  userId: string
  note: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/inventory-checks`, data)
  return response
}

export const updateInventory = async (
  data: {
    warehouseId: string
    status: string
    note: string
  },
  inventoryId: string
) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/inventory-checks/${inventoryId}`,
    data
  )
  return response
}

export const deleteInventory = async (id: string) => {
  const response = await instant.delete(
    `${API_DOMAIN}/v1/inventory-checks/${id}`
  )
  return response
}

export const getInventoryById = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/inventory-checks/${id}`)
  return response
}

export const createInventoryDetail = async (
  data: {
    registrationId: string
    status: string
    note: string
  }[],
  inventoryId: number
) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/inventory-checks/${inventoryId}/details`,
    data
  )
  return response
}
