'use client'
import { Box, Button, FormControl, Typography } from '@mui/material'
import * as React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { StyledTextField } from '@/styles/commonStyle'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useRouter } from 'next/navigation'
import { login, setTokenNextServer } from '@/apiRequest/authApi'
import { handleErrorCode } from '@/lib/utils/common'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setInfoUser } from '@/store/slices/userSlice'
import DialogCustom from '@/components/DialogCustom'
import { forgotPassword } from '@/apiRequest/userApi'
import LoadingButton from '@mui/lab/LoadingButton'
import Image from 'next/image'
export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const [openModalForgotPassword, setOpenModalForgotPassword] =
    React.useState<boolean>(false)
  const [loadingForgotPassword, setLoadingForgotPassword] =
    React.useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Tên đăng nhập không được để trống'),
      password: Yup.string()
        .required('Mật khẩu không được để trống')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        const res = await login(values.username, values.password)
        if (res.status === 200) {
          localStorage.setItem('token', res.data.data.access_token)
          //set token into next server
          await setTokenNextServer(res.data.data.access_token)
          toast.success('Đăng nhập thành công')
          if (res.data.data.user.role.name === 'ADMIN') {
            router.push('/admin')
          } else if (res.data.data.user.role.name === 'READER') {
            router.push('/lookup')
          }
          dispatch(
            setInfoUser({
              user: res.data.data.user,
            })
          )
        }
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })
  const formikForgotPassword = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),
    }),
    onSubmit: async (values) => {
      try {
        setLoadingForgotPassword(true)
        const res = await forgotPassword(values.email)
        toast.success('Vui lòng kiểm tra email để lấy lại mật khẩu')
        setOpenModalForgotPassword(false)
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      } finally {
        setLoadingForgotPassword(false)
      }
    },
  })
  return (
    <Box className='w-screen h-screen flex justify-center items-center'>
      <Image src='/assets/book_bg.jpg' layout='fill' alt='background book' />
      <Box className='relative rounded-sm overflow-hidden'>
        <Box className='border-b-4 border-red-800'>
          <Typography
            variant='h5'
            fontWeight={500}
            className='px-4 py-3 bg-red-800 w-fit !text-white rounded-tl-md rounded-tr-md'
          >
            Đăng nhập
          </Typography>
        </Box>
        <Box className='lg:w-[800px] w-[600px] rounded-sm shadow-2xl p-4'>
          <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <Typography fontWeight={400}>Tên đăng nhập</Typography>
            <FormControl variant='outlined' fullWidth>
              <StyledTextField
                margin='normal'
                fullWidth
                id='username'
                placeholder={'Nhập tên đăng nhập'}
                name='username'
                className='!mt-1'
                value={formik.values.username}
                onChange={formik.handleChange}
                autoFocus
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </FormControl>
            <Typography fontWeight={400}>Mật khẩu</Typography>
            <FormControl variant='outlined' fullWidth>
              <StyledTextField
                margin='normal'
                fullWidth
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder={'Nhập mật khẩu'}
                className='!mt-1'
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Box
                        className='cursor-pointer'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <RemoveRedEyeIcon />
                        )}
                      </Box>
                    ),
                  },
                }}
              />
            </FormControl>
            <Box>
              <Box className='mt-4 flex justify-center gap-3'>
                <Button
                  type='submit'
                  className='!bg-red-800 !text-white rounded-md w-fit !px-6 !py-3 hover:!bg-red-500'
                >
                  Đăng nhập
                </Button>
                <Button
                  onClick={() => {
                    setOpenModalForgotPassword(true)
                  }}
                  className='!bg-blue-800 !text-white rounded-md w-fit !px-6 !py-3 hover:!bg-blue-500'
                >
                  Quên mật khẩu
                </Button>
              </Box>
              <Box className='mt-4'>
                <Typography>
                  Bạn chưa có tài khoản?
                  <Button
                    onClick={() => {
                      router.push('/register')
                    }}
                    className='!text-blue-800'
                  >
                    Đăng ký
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {openModalForgotPassword && (
        <DialogCustom
          title='Thông tin địa chỉ email của bạn'
          isModalOpen={openModalForgotPassword}
          setIsModalOpen={setOpenModalForgotPassword}
          handleLogicCancel={() => console.log('cancel')}
          width={600}
          children={
            <Box
              component='form'
              onSubmit={formikForgotPassword.handleSubmit}
              sx={{ mt: 1 }}
            >
              <FormControl variant='outlined' fullWidth>
                <StyledTextField
                  margin='normal'
                  fullWidth
                  id='email'
                  name='email'
                  placeholder={'Nhập email'}
                  type='text'
                  className='!mt-1'
                  value={formikForgotPassword.values.email}
                  onChange={formikForgotPassword.handleChange}
                  error={
                    formikForgotPassword.touched.email &&
                    Boolean(formikForgotPassword.errors.email)
                  }
                  helperText={
                    formikForgotPassword.touched.email &&
                    formikForgotPassword.errors.email
                  }
                />
              </FormControl>
              <LoadingButton
                type='submit'
                loading={loadingForgotPassword}
                sx={{
                  py: 2,
                  px: 4,
                  '&.Mui-disabled': {
                    backgroundColor: 'gray', // Màu nền khi button bị disabled
                  },
                }}
                className='!bg-blue-800 !text-white rounded-md w-fit !px-6 !py-3 hover:!bg-blue-500'
              >
                {loadingForgotPassword ? '' : 'Gửi'}
              </LoadingButton>
            </Box>
          }
        />
      )}
    </Box>
  )
}
