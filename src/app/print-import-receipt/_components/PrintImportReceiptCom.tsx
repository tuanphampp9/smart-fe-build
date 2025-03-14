'use client'
import { getImportReceipt } from '@/apiRequest/importReceiptApi'
import { ImportReceiptResponseType } from '@/lib/types/ImportReceiptType'
import { formatDate, handleErrorCode } from '@/lib/utils/common'
import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import dayjs from 'dayjs'
export interface IPrintImportReceiptComProps {}

export default function PrintImportReceiptCom(
  props: IPrintImportReceiptComProps
) {
  const [importReceipt, setImportReceipt] =
    React.useState<ImportReceiptResponseType>({} as ImportReceiptResponseType)
  const searchParam = useSearchParams()
  const params = new URLSearchParams(searchParam.toString())
  const importReceiptId = params.get('importReceiptId') ?? ''
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchImportReceipt = async () => {
      try {
        setLoading(true)
        const res = await getImportReceipt(importReceiptId)
        console.log(res)
        setImportReceipt(res.data)
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (importReceiptId) {
      fetchImportReceipt()
    }
  }, [importReceiptId])

  return (
    <div className='flex h-screen w-screen justify-center items-center'>
      {loading ? (
        <Box className='flex justify-center items-center w-[310px] h-[200px]'>
          <CircularProgress />
        </Box>
      ) : (
        <div className='w-[800px]'>
          <div className='flex justify-between'>
            <div className='py-1 border-b-2 border-black'>
              <h4 className='uppercase font-semibold'>Thư viện điện tử</h4>
              <h4 className='uppercase font-semibold text-center'>THLIB</h4>
            </div>
            <div className='py-1 border-b-2 border-black'>
              <h4 className='uppercase font-semibold'>
                Cộng hoà xã hội chủ nghĩa việt nam
              </h4>
              <h4 className='font-semibold text-center'>
                Độc lập - Tự do - Hạnh phúc
              </h4>
            </div>
          </div>
          <div className='mt-3'>
            <h4 className='italic text-sm text-end'>
              Hà Nội, ngày... tháng ... năm {dayjs().get('year')}
            </h4>
            <h3 className='uppercase text-xl font-semibold mt-4 text-center'>
              Phiếu nhập ấn phẩm
            </h3>
          </div>
          <div className='mt-3'>
            <div>
              <h4 className='font-semibold'>I. Thông tin phiếu</h4>
              <div className='flex justify-between'>
                <div>
                  <p>
                    Mã phiếu nhập:{' '}
                    <span className='font-semibold'>{importReceipt.id}</span>
                  </p>
                  <p>
                    Ngày nhập:{' '}
                    <span className='font-semibold'>
                      {formatDate(importReceipt.createdAt)}
                    </span>
                  </p>
                  <p>
                    Nguồn nhập:{' '}
                    <span className='font-semibold'>
                      {importReceipt.inputSource}
                    </span>
                  </p>
                  <p>Ghi chú: {importReceipt.note}</p>
                </div>
                <div>
                  <p>
                    Người giao:{' '}
                    <span className='font-semibold'>
                      {importReceipt.deliveryPerson}
                    </span>
                  </p>
                  <p>
                    Đại diện bên giao:{' '}
                    <span className='font-semibold'>
                      {importReceipt.deliveryRepresentative}
                    </span>
                  </p>
                  <p>
                    Người nhận:
                    <span className='font-semibold'>
                      {importReceipt.createdBy}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-3'>
              <h4>II. Thông tin ấn phẩm nhập</h4>
              <div className='mt-3'>
                <table>
                  <tr>
                    <th>STT</th>
                    <th>Tên ấn phẩm</th>
                    <th>Kho lưu trữ</th>
                    <th>Nhà xuất bản</th>
                    <th>Giá tiền</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                  {importReceipt.importReceiptDetails.map(
                    (detail, index: number) => (
                      <tr key={detail.id}>
                        <td>{index + 1}</td>
                        <td>{detail.publication.name}</td>
                        <td>{detail.publication.warehouse.name}</td>
                        <td>
                          {detail.publication.publisher?.name !== null
                            ? detail.publication.publisher?.name
                            : ''}
                        </td>
                        <td>{detail.price}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.price * detail.quantity}</td>
                      </tr>
                    )
                  )}
                </table>
              </div>
            </div>
            <h4 className='font-semibold text-end mt-3'>Cán bộ thư viện</h4>
          </div>
        </div>
      )}
    </div>
  )
}
