import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const createBorrowSlipForClient = async (data: {
  cardId: string
  cartIds: string[]
}) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/client/borrow-slips`,
    data
  )
  return response
}

export const getListBorrowSlips = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/borrow-slips`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const deleteBorrowSlip = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/borrow-slips/${id}`)
  return response
}

export const acceptBorrowSlip = async (id: string) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/borrow-slips/${id}/accept`
  )
  return response
}

export const returnBorrowSlip = async (data: {
  borrowSlipId: string
  registrationUniqueStatuses: {
    registrationId: string
    status: string
  }[]
  note: string
}) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/borrow-slips/${data.borrowSlipId}/return`,
    data
  )
  return response
}

export const createBorrowSlipForAdmin = async (data: {
  cardId: string
  registrationIds: string[]
}) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/admin/borrow-slips`,
    data
  )
  return response
}

export const getBorrowSlipById = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/borrow-slips/${id}`)
  return response
}

export const renewBorrowSlip = async (id: string) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/borrow-slips/${id}/renew`
  )
  return response
}
