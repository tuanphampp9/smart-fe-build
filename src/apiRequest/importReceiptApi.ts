import instant from '@/lib/axiosCustom'
import { ImportReceiptReqType } from '@/lib/types/ImportReceiptType'
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL
export const getListImportReceipts = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(`${API_DOMAIN}/v1/import-receipts`, {
    params: {
      page,
      size: itemPerPage,
      filter,
      sort: 'createdAt,desc',
    },
  })
  return response
}

export const getImportReceipt = async (id: string) => {
  const response = await instant.get(`${API_DOMAIN}/v1/import-receipts/${id}`)
  return response
}

export const createImportReceipt = async (data: ImportReceiptReqType) => {
  const response = await instant.post(`${API_DOMAIN}/v1/import-receipts`, data)
  return response
}

export const updateImportReceipt = async (
  id: string,
  data: ImportReceiptReqType
) => {
  const response = await instant.put(
    `${API_DOMAIN}/v1/import-receipts/${id}`,
    data
  )
  return response
}

export const getListImportReceiptDetails = async (
  page: number,
  itemPerPage: number,
  filter: string
) => {
  const response = await instant.get(
    `${API_DOMAIN}/v1/import-receipts/import-receipt-details`,
    {
      params: {
        page,
        size: itemPerPage,
        filter,
      },
    }
  )
  return response
}
