import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const createPublicationRequest = async (data: {
  name: string
  author: string
  publisher: string
  yearOfPublication: number
  note: string
}) => {
  const response = await instant.post(
    `${API_DOMAIN}/v1/publication-requests`,
    data
  )
  return response
}

export const getListPublicationRequestsForClient = async (
  userId: string,
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(
    `${API_DOMAIN}/v1/publication-requests/user/${userId}`,
    {
      params: {
        page,
        size: itemPerPage,
        filter,
        sort: 'createdAt,desc',
      },
    }
  )
  return response
}

export const getListPublicationRequestsForAdmin = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/publication-requests`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const deletePublicationRequest = async (id: string) => {
  const response = await instant.delete(
    `${API_DOMAIN}/v1/publication-requests/${id}`
  )
  return response
}

export const responsePublicationRequest = async (
  id: number,
  data: {
    status: string
    response: string
  }
) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/publication-requests/${id}`,
    data
  )
  return response
}
