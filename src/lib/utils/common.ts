import { toast } from 'react-toastify'
import { GENDER_ENUM } from '../constant/common'
import dayjs from 'dayjs'
import slugify from 'slugify'
export const handleErrorCode = (error: any, customActionErr?: () => void) => {
  const errorMessage = `${error.response?.data?.statusCode}: ${error.response?.data?.message}`
  toast.error(errorMessage)
  if (customActionErr) {
    customActionErr()
  }
}

export const showGender: Record<GENDER_ENUM, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  const formats = ['DD-MM-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'] // format date
  let parsedDate

  // try parse with every format
  for (const format of formats) {
    const date = dayjs(dateString, format, true) // 'true' to ensure accurate parsing according to format
    if (date.isValid()) {
      parsedDate = date
      break
    }
  }

  // Check if the input is a valid ISO datetime
  if (!parsedDate && dayjs(dateString).isValid()) {
    parsedDate = dayjs(dateString) // Parse ISO datetime
  }
  // if parsed then format to 'DD/MM/YYYY', if not then return 'Invalid Date'
  return parsedDate ? parsedDate.format('DD/MM/YYYY') : 'Invalid Date'
}

export const formatDateTime = (dateString: string): string => {
  const day = dayjs(dateString)
  const roundedSeconds = Math.round(day.second()).toString().padStart(2, '0') // Làm tròn giây
  const formattedDate = `${day.format('HH:mm')}:${roundedSeconds} ${day.format('DD/MM/YYYY')}`
  return formattedDate
}

export const convertSlugify = (str: string): string => {
  if (!str) return ''
  return slugify(str, { lower: true, locale: 'vi' })
}
