import instant from '@/lib/axiosCustom'
import { PublicationTypeRequest } from '@/lib/types/PublicationType'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListPublications = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/publications`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createPublication = async (data: PublicationTypeRequest) => {
  const response = await instant.post(`${API_DOMAIN}/v1/publications`, data)
  return response
}

export const getPublication = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/publications/${id}`)
  return response
}

export const updatePublication = async (
  data: PublicationTypeRequest,
  id: string
) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/publications/${id}`,
    data
  )
  return response
}

export const deletePublication = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/publications/${id}`)
  return response
}

export const getListRegistrationUniques = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(
    `${API_DOMAIN}/v1/publications/registration-uniques`,
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

export const getListPublicationSuggestions = async (
  publicationId: string,
  userId: string
) => {
  const response = await instant.get(
    `${API_DOMAIN}/v1/publications/suggestions-books/${publicationId}/user/${userId}`
  )
  return response
}
