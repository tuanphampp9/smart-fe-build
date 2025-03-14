'use client'
import * as React from 'react'
import TableListReadCard from './_components/TableListReadCard'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import LoadingButton from '@mui/lab/LoadingButton'
import { handleErrorCode } from '@/lib/utils/common'
import { createBorrowSlipForAdmin } from '@/apiRequest/borrowSlipApi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import {
  removeAllRegistrationIds,
  setCardId,
} from '@/store/slices/borrowSlipSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TableListRegistrationUnique from '@/components/TableListRegistrationUnique'

export interface IBorrowPublicationDetailProps {}

export default function BorrowPublicationDetail(
  props: IBorrowPublicationDetailProps
) {
  const { cardId, registrationIds } = useSelector(
    (state: RootState) => state.borrowSlip
  )
  const [loadingCreateBorrowSlip, setLoadingCreateBorrowSlip] =
    React.useState<boolean>(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const handleCreateBorrowSlip = async () => {
    try {
      setLoadingCreateBorrowSlip(true)
      if (registrationIds.length === 0) {
        toast.error('Chưa chọn ấn phẩm muốn mượn')
        return
      }
      if (!cardId) {
        toast.error('Chưa chọn thẻ đọc')
        return
      }
      if (registrationIds.length > 3) {
        toast.error('Chỉ được mượn tối đa 3 ấn phẩm')
        return
      }
      const res = await createBorrowSlipForAdmin({
        cardId,
        registrationIds,
      })
      toast.success('Tạo phiếu mượn thành công')
      router.push('/admin/borrow-publications')
      dispatch(setCardId(''))
      dispatch(removeAllRegistrationIds())
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoadingCreateBorrowSlip(false)
    }
  }
  return (
    <div>
      <ArrowBackIcon
        className='cursor-pointer'
        onClick={() => router.push('/admin/borrow-publications')}
      />
      <div className='flex gap-4 mt-4'>
        <div className='w-1/2'>
          <TableListRegistrationUnique />
        </div>
        <div className='w-1/2'>
          <TableListReadCard />
        </div>
      </div>
      <LoadingButton
        variant='contained'
        loading={loadingCreateBorrowSlip}
        sx={{
          py: 2,
          px: 4,
          '&.Mui-disabled': {
            backgroundColor: 'gray', // Màu nền khi button bị disabled
          },
        }}
        onClick={handleCreateBorrowSlip}
      >
        Xác nhận
      </LoadingButton>
    </div>
  )
}
