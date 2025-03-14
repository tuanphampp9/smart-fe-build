'use client'
import { getBorrowSlipById } from '@/apiRequest/borrowSlipApi'
import { createRating } from '@/apiRequest/userApi'
import RatingCustom from '@/components/RatingCustom'
import TableCustom from '@/components/TableCustom'
import { BorrowSlipType } from '@/lib/types/BorrowSlipsType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { Box, Chip, CircularProgress, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export interface IRenderBorrowSlipProps {
  borrowSlipId: string
}

export default function RenderBorrowSlip(props: IRenderBorrowSlipProps) {
  const { borrowSlipId } = props
  const [borrowSlip, setBorrowSlip] = React.useState<BorrowSlipType>(
    {} as BorrowSlipType
  )
  const user = useSelector((state: RootState) => state.user.user)
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchBorrowSlip = async () => {
      try {
        const response = await getBorrowSlipById(borrowSlipId)
        setBorrowSlip(response.data)
      } catch (error: any) {
        console.log(error)
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (borrowSlipId) fetchBorrowSlip()
  }, [borrowSlipId])
  const renderLabelStatus: Record<string, string> = {
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    OVER_DUE: 'Quá hạn',
    NOT_BORROWED: 'Chưa mượn',
  }

  const handleCreateRating = async (
    value: number | null,
    publicationId: string,
    returnDate: string,
    isRated: boolean,
    borrowSlipDetailId: string
  ) => {
    try {
      if (!isRated) {
        toast.warning('Bạn đã đánh giá rồi')
        return
      }
      //if returnDate + 3 day < now => can not rating
      const dateReturn = new Date(returnDate)
      const dateNow = new Date()
      dateReturn.setDate(dateReturn.getDate() + 3)
      if (dateNow > dateReturn) {
        toast.warning('Bạn chỉ có thể đánh giá trong vòng 3 ngày trả ấn phẩm')
        return
      }
      const res = await createRating({
        userId: user.id ?? '',
        publicationId: publicationId,
        rating: value,
        borrowSlipDetailId,
      })
      // setRating(value)
      toast.success('Đánh giá thành công')
      console.log(res)
      setBorrowSlip(res.data.data)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const columnBorrowSlipDetails: GridColDef[] = [
    {
      field: 'registrationId',
      headerName: 'ĐKKB',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.registrationUnique.registrationId
      },
    },
    {
      field: 'nameBook',
      headerName: 'Tên ấn phẩm',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      renderCell: (params) => {
        return params.value
      },
    },
    {
      field: 'rating',
      headerName: 'Đánh giá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <RatingCustom
            value={params.row?.publicationRating?.rating ?? 0}
            onchange={(newValue) => {
              handleCreateRating(
                newValue,
                params.row.publicationId,
                borrowSlip.returnDate,
                !Boolean(params.row.publicationRating),
                params.row.id
              )
            }}
          />
        )
      },
    },
  ]
  return (
    <div>
      {loading ? (
        <Box className='flex justify-center items-center w-full h-full'>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography className='!font-semibold !text-xl'>
            Mã phiếu mượn: {borrowSlipId}
          </Typography>
          <Box className='flex justify-between mt-4'>
            <Box>
              <Typography>
                Ngày đăng kí: {formatDateTime(borrowSlip.registerDate)}
              </Typography>
              <Typography>
                Ngày hết hạn đăng kí:{' '}
                {formatDateTime(borrowSlip.expiredRegisterDate)}
              </Typography>
              <Typography>
                Ngày mượn: {formatDateTime(borrowSlip.borrowDate)}
              </Typography>
              <Typography>
                Ghi chú: {borrowSlip ? borrowSlip.note : 'Không có'}
              </Typography>
            </Box>
            <Box>
              <Typography>
                Ngày hẹn trả: {formatDateTime(borrowSlip.dueDate)}
              </Typography>
              <Typography>
                Ngày trả: {formatDateTime(borrowSlip.returnDate)}
              </Typography>
              <Typography>
                Trạng thái:{' '}
                <Chip
                  label={renderLabelStatus[borrowSlip.status]}
                  variant='filled'
                  color={'primary'}
                />
              </Typography>
            </Box>
          </Box>
          <Box className='my-4'>
            <Typography>Đánh giá ấn phẩm đã mượn</Typography>
            <TableCustom
              rows={borrowSlip.borrowSlipDetails ?? []}
              columns={columnBorrowSlipDetails}
              checkboxSelection={false}
              isLoading={loading}
            />
          </Box>
        </Box>
      )}
    </div>
  )
}
