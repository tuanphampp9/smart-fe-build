import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const createCard = async (email: string) => {
  const response = await instant.post(`${API_DOMAIN}/v1/create-card-reader`, {
    email,
  })
  return response
}

export const checkInCheckOut = async (cardId: string) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/serves/check-in-check-out`,
    {
      cardId,
    }
  )
  return response
}

export const getListCardReaders = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/card-readers`, {
    params: {
      page,
      size: itemPerPage,
      filter,
    },
  })
  return response
}

export const changeStatusCard = async (cardId: string) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/card-readers/change-status/${cardId}`
  )
  return response
}
