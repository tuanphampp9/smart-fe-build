import instant from '@/lib/axiosCustom'
import { AuthorType } from '@/lib/types/AuthorType'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListAuthors = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/authors`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const createAuthor = async (data: {
  fullName: string
  penName: string
  homeTown: string
  introduction: string
  avatar: string
  dob: string
  dod: string
}) => {
  const response = await instant.post(`${API_DOMAIN}/v1/authors`, data)
  return response
}

export const updateAuthor = async (data: AuthorType) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/authors/${data.id}`,
    data
  )
  return response
}

export const deleteAuthor = async (id: string) => {
  const response = await instant.delete(`${API_DOMAIN}/v1/authors/${id}`)
  return response
}

export const uploadExcel = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await instant.post(
    `${API_DOMAIN}/v1/authors/import-excel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
