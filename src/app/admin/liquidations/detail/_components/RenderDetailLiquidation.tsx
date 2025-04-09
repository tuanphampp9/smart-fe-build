'use client'
import {
  createLiquidation,
  getLiquidationById,
  updateLiquidation,
} from '@/apiRequest/liquidationApi'
import { handleErrorCode } from '@/lib/utils/common'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { StyledTextField } from '@/styles/commonStyle'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
export interface IRenderDetailLiquidationProps {}

export default function RenderDetailLiquidation(
  props: IRenderDetailLiquidationProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const liquidationId = params.get('liquidationId') ?? ''
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user.user)
  const formik = useFormik({
    initialValues: {
      receiverName: '',
      receiverContact: '',
      note: '',
      status: '',
    },
    validationSchema: Yup.object().shape({
      receiverName: Yup.string().required('Tên người nhận không được để trống'),
      receiverContact: Yup.string().required('Liên hệ không được để trống'),
    }),
    onSubmit: async (values) => {
      try {
        if (liquidationId) {
          // call api update reader
          const res = await updateLiquidation(values, liquidationId)
          console.log(res)
          toast.success('Cập nhật phiếu thanh lý thành công')
        } else {
          // call api create reader
          const res = await createLiquidation({
            ...values,
            userId: user.id ?? '',
          })
          console.log(res)
          formik.resetForm()
          toast.success('Thêm phiếu thanh lý thành công')
          router.push(
            `/admin/liquidations/pickRegistrationId?liquidationId=${res.data.id}`
          )
        }
      } catch (error: any) {
        handleErrorCode(error)
      }
    },
  })
  React.useEffect(() => {
    const fetchLiquidation = async () => {
      try {
        const res = await getLiquidationById(liquidationId)
        formik.setValues({
          receiverName: res.data.receiverName,
          receiverContact: res.data.receiverContact,
          note: res.data.note,
          status: res.data.status,
        })
      } catch (error: any) {
        handleErrorCode(error)
      }
    }
    if (liquidationId) {
      fetchLiquidation()
    }
  }, [liquidationId])
  return (
    <div className='w-3/4'>
      <IconButton
        onClick={() => {
          router.back()
        }}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
      <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <Typography fontWeight={600} className='text-sm !text-red-800'>
          Tạo mới Phiếu thanh lý
        </Typography>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Tên tổ chức
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='receiverName'
              placeholder='Nhập tên tổ chức'
              name='receiverName'
              className='!mt-1'
              value={formik.values.receiverName}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.receiverName &&
                Boolean(formik.errors.receiverName)
              }
              helperText={
                formik.touched.receiverName && formik.errors.receiverName
              }
            />
          </FormControl>
        </Box>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Thông tin liên hệ tổ chức
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='receiverContact'
              placeholder='Nhập thông tin liên hệ'
              name='receiverContact'
              className='!mt-1'
              value={formik.values.receiverContact}
              onChange={formik.handleChange}
              error={
                formik.touched.receiverContact &&
                Boolean(formik.errors.receiverContact)
              }
              helperText={
                formik.touched.receiverContact && formik.errors.receiverContact
              }
            />
          </FormControl>
        </Box>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Ghi chú
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='note'
              placeholder='Nhập ghi chú'
              name='note'
              multiline
              rows={4}
              className='!mt-1'
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </FormControl>
        </Box>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{
            my: 3,
            py: 2,
            '&.Mui-disabled': {
              backgroundColor: 'gray', // Màu nền khi button bị disabled
            },
            maxWidth: '200px',
          }}
        >
          <Typography variant='body1' fontWeight={400} className='!text-white'>
            {liquidationId ? 'Cập nhật phiếu thanh lý' : 'Thêm phiếu thanh lý'}
          </Typography>
        </Button>
      </Box>
      {liquidationId && (
        <div className='flex justify-end mt-5'>
          <Tooltip title='Đi đến chi tiết phiếu thanh lý'>
            <ArrowForwardIcon
              className='cursor-pointer'
              onClick={() =>
                router.push(
                  `/admin/liquidations/pickRegistrationId?liquidationId=${liquidationId}`
                )
              }
            />
          </Tooltip>
        </div>
      )}
    </div>
  )
}
