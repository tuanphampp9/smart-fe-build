import instant from '@/lib/axiosCustom'
import { postType } from '@/lib/types/postType'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const createPost = async (data: {
  title: string
  postType: string
  content: string
  bannerImg: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/posts`, data)
  return response
}

export const getListPosts = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/posts`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const getPost = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/posts/${id}`)
  return response
}

export const getPostForClient = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/posts/client/${id}`)
  return response
}
export const updatePost = async (
  id: string,
  data: {
    title: string
    postType: string
    content: string
    bannerImg: string
  }
) => {
  const response = await instant.put(`${API_DOMAIN}/v1/posts/${id}`, data)
  return response
}

export const deletePost = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/posts/${id}`)
  return response
}
