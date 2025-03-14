import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListLiquidations = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/liquidations`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createLiquidation = async (data: {
  receiverName: string
  receiverContact: string
  note: string
  userId: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/liquidations`, data)
  return response
}

export const updateLiquidation = async (
  data: {
    status: string
    receiverName: string
    receiverContact: string
    note: string
  },
  liquidationId: string
) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/liquidations/${liquidationId}`,
    data
  )
  return response
}

export const deleteLiquidation = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/liquidations/${id}`)
  return response
}

export const getLiquidationById = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/liquidations/${id}`)
  return response
}

export const createLiquidationDetail = async (
  data: {
    registrationId: string
    conditionStatus: string
    note: string
    price: number
  }[],
  liquidationId: number
) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/liquidations/${liquidationId}/liquidation-details`,
    data
  )
  return response
}
