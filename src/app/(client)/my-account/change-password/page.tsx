'use client'
import { changePassword } from '@/apiRequest/userApi'
import { handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
export interface IChangePasswordProps {}

export default function ChangePassword(props: IChangePasswordProps) {
  const formik = useFormik({
    initialValues: {
      email: '',
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email không được để trống'),
      oldPassword: Yup.string().required('Mật khẩu cũ không được để trống'),
      newPassword: Yup.string()
        .required('Mật khẩu mới không được để trống')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        const res = await changePassword(values)
        toast.success(res.data.data)
        formik.resetForm()
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })
  return (
    <Box>
      <Typography variant='h5' className='border-b-4 border-b-red-800 w-fit'>
        Đổi mật khẩu
      </Typography>
      <Box>
        <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <Typography fontWeight={400}>Email</Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='email'
              placeholder={'Nhập email của bạn'}
              name='email'
              className='!mt-1'
              value={formik.values.email}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>
          <Typography fontWeight={400}>Mật khẩu cũ</Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='oldPassword'
              placeholder={'Nhập mật khẩu cũ'}
              name='oldPassword'
              className='!mt-1'
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
            />
          </FormControl>
          <Typography fontWeight={400}>Mật khẩu mới</Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='newPassword'
              placeholder={'Nhập mật khẩu cũ'}
              name='newPassword'
              className='!mt-1'
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />
          </FormControl>
          <Box>
            <Box className='mt-4 flex justify-center gap-3'>
              <Button
                type='submit'
                className='!bg-blue-800 !text-white rounded-md w-fit !px-6 !py-3 hover:!bg-blue-500'
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
