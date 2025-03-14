'use client'
import { createPublicationRequest } from '@/apiRequest/publicationRequest'
import { handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
export interface IRegisterPublicationFormProps {}

export default function RegisterPublicationForm(
  props: IRegisterPublicationFormProps
) {
  const { user } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      name: '',
      author: '',
      publisher: '',
      yearOfPublication: 0,
      note: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên tài liệu không được để trống'),
      author: Yup.string().required('Tác giả không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        const res = await createPublicationRequest(values)
        toast.success('Yêu cầu của bạn đã được gửi đi')
        formik.resetForm()
        router.push('/my-account/publication-request')
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })
  return (
    <div>
      <Typography className='!text-red-400 !font-semibold'>
        Người đăng ký:
      </Typography>
      <Box className='my-4'>
        <Box className='flex items-center gap-2'>
          <Typography className='!font-semibold'>Số thẻ: </Typography>
          <Typography>{user.cardRead?.cardId}</Typography>
        </Box>
        <Box className='flex items-center gap-2'>
          <Typography className='!font-semibold'>Họ và tên: </Typography>
          <Typography>{user.fullName}</Typography>
        </Box>
      </Box>
      <Typography className='!text-red-400 !font-semibold'>
        Đăng ký bổ sung tài liệu:
      </Typography>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>(*) Tên tài liệu</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập tên tài liệu'
            name='name'
            className='!mt-1'
            value={formik.values.name}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <Typography fontWeight={400}>(*) Tác giả</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='author'
            type='text'
            name='author'
            placeholder='Nhập tên tác giả'
            className='!mt-1'
            value={formik.values.author}
            onChange={formik.handleChange}
            error={formik.touched.author && Boolean(formik.errors.author)}
            helperText={formik.touched.author && formik.errors.author}
          />
        </FormControl>
        <Typography fontWeight={400}>Nhà xuất bản</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='publisher'
            type='text'
            multiline
            name='publisher'
            maxRows={4}
            placeholder='Nhập nhà xuất bản'
            className='!mt-1'
            value={formik.values.publisher}
            onChange={formik.handleChange}
          />
        </FormControl>
        <Typography fontWeight={400}>Năm xuất bản</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='yearOfPublication'
            type='number'
            multiline
            name='yearOfPublication'
            maxRows={4}
            placeholder='Nhập năm xuất bản'
            className='!mt-1'
            value={formik.values.yearOfPublication}
            onChange={formik.handleChange}
          />
        </FormControl>
        <Typography fontWeight={400}>Ghi chú</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='note'
            type='number'
            multiline
            name='note'
            maxRows={4}
            placeholder='Nhập ghi chú'
            className='!mt-1'
            value={formik.values.note}
            onChange={formik.handleChange}
          />
        </FormControl>
        <Box>
          <Box className='mt-4'>
            <Button type='submit' fullWidth variant='contained' color={'info'}>
              Gửi đăng ký
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  )
}
