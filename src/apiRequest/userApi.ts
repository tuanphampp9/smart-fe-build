import instant from '@/lib/axiosCustom'
import { UserType } from '@/lib/types/userType'
import axios from 'axios'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListReaders = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/users`, {
    params: {
      page,
      size: itemPerPage,
      filter,
    },
  })
  return response
}

export const getReader = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/users/${id}`)
  return response
}

export const changePassword = async (data: {
  email: string
  oldPassword: string
  newPassword: string
}) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/users/change-password`,
    data
  )
  return response
}

export const createUser = async (user: UserType) => {
  const response = await instant.post(`${API_DOMAIN}/v1/users`, user)
  return response
}

export const updateUser = async (user: UserType) => {
  const response = await instant.put(`${API_DOMAIN}/v1/users`, user)
  return response
}

export const createRating = async (data: {
  userId: string
  publicationId: string
  rating: number | null
  borrowSlipDetailId: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/users/ratings`, data)
  return response
}

export const getRating = async (userId: string, publicationId: string) => {
  const response = await instant.get(
    `${API_DOMAIN}/v1/users/${userId}/ratings/${publicationId}`
  )
  return response
}

export const deletePubFromCart = async (cardId: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/users/cart/${cardId}`)
  return response
}

export const addPubToCart = async (data: {
  userId: string
  publicationId: number
  quantity: number
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/users/cart`, data)
  return response
}

export const minusPubFromCart = async (cardId: string) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/users/cart/minus/${cardId}`
  )
  return response
}

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_DOMAIN}/v1/users/forget-password`, {
    email,
  })
  return response
}

export const renewCard = async (cardId: string) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/card-readers/renew/${cardId}`
  )
  return response
}
