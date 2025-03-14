import instant from '@/lib/axiosCustom'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const uploadImage = async (file: File, folderName: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folderName)
  const response = await instant.post(
    `${API_DOMAIN}/files/upload/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
