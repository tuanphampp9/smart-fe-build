'use client'
import { getBorrowSlipById } from '@/apiRequest/borrowSlipApi'
import { BorrowSlipType } from '@/lib/types/BorrowSlipsType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

export interface IPrintBorrowSlipComProps {}

export default function PrintBorrowSlipCom(props: IPrintBorrowSlipComProps) {
  const [borrowSlip, setBorrowSlip] = React.useState<BorrowSlipType>(
    {} as BorrowSlipType
  )
  const searchParam = useSearchParams()
  const params = new URLSearchParams(searchParam.toString())
  const borrowSlipId = params.get('borrowSlipId') ?? ''
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchReader = async () => {
      try {
        setLoading(true)
        const res = await getBorrowSlipById(borrowSlipId)
        console.log(res)
        setBorrowSlip(res.data)
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (borrowSlipId) {
      fetchReader()
    }
  }, [borrowSlipId])

  return (
    <div className='flex h-screen w-screen justify-center items-center'>
      {loading ? (
        <Box className='flex justify-center items-center w-[310px]'>
          <CircularProgress />
        </Box>
      ) : (
        <div className='h-fit shadow-md p-4'>
          <h4 className='uppercase font-semibold tracking-wider'>
            Thư viện TH
          </h4>
          <h3>Địa chỉ: 47 Bà Triệu - Hoàn Kiếm - Hà Nội</h3>
          <h4 className='uppercase mt-4'>Biên lai mượn sách</h4>
          <h4>Số thẻ: {borrowSlip.cardRead.cardId}</h4>
          <h4>Thời gian mượn: {formatDateTime(borrowSlip.borrowDate)}</h4>
          <h4>
            -----------------------------------------------------------------
            ----------
          </h4>
          {borrowSlip.borrowSlipDetails.map((item, index) => (
            <div key={item.id} className='mt-3'>
              <h3>
                {index + 1}. {item.nameBook}
              </h3>
              <h3>ĐKCB: {item.registrationUnique.registrationId}</h3>
              <h3>Ngày hết hạn: {formatDateTime(borrowSlip.dueDate)}</h3>
            </div>
          ))}
          <h4 className='mt-4'>
            Số lượng tài liệu mượn {borrowSlip.borrowSlipDetails.length}
          </h4>
        </div>
      )}
    </div>
  )
}
