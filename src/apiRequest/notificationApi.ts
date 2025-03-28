import instant from '@/lib/axiosCustom'

const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListNotificationsByUser = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/notifications/user`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const numberUnreadNotifications = async () => {
  const response = await instant.get(`${API_DOMAIN}/v1/notifications/unread`)
  return response
}

export const readNotification = async (id: number) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/notifications/read/${id}`
  )
  return response
}
