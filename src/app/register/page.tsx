'use client'
import { register } from '@/apiRequest/authApi'
import { uploadImage } from '@/apiRequest/commonApi'
import DatepickerCustom from '@/components/DatepickerCustom'
import { handleErrorCode } from '@/lib/utils/common'
import { StyledTextField, VisuallyHiddenInput } from '@/styles/commonStyle'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
export interface IRegisterProps {}

export default function Register(props: IRegisterProps) {
  const router = useRouter()
  const [cfPolicy, setCfPolicy] = React.useState<boolean>(false)
  const fileInputIdCardRef = React.useRef<HTMLInputElement>(null)
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false)
  const [cardID, setCardID] = React.useState<{
    url: string
    loading: boolean
  }>({
    url: '',
    loading: false,
  })
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      portraitImg: '',
      dob: '',
      phone: '',
      identityCardNumber: '',
      address: '',
      gender: 'MALE',
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required('Họ và tên không được để trống'),
      email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),
      portraitImg: Yup.string().required('Ảnh chân dung không được để trống'),
      dob: Yup.string().required('Ngày sinh không được để trống'),
      phone: Yup.string().required('Số điện thoại không được để trống'),
      identityCardNumber: Yup.string().required('Số CMND không được để trống'),
      address: Yup.string().required('Địa chỉ không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        const response = await register(values)
        if (response.status === 201) {
          toast.success('Đăng ký thành công')
          router.push('/register/user-interest')
          //set userId into localstorage
          localStorage.setItem('userId', response.data.data.id)
        }
        console.log(response)
      } catch (error: any) {
        handleErrorCode(error)
      }
    },
  })

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileInputRef: any,
    fieldName: string
  ) => {
    setCardID((prev) => ({ ...prev, loading: true }))
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file, 'IdentityCards')
      console.log(res)
      setCardID((prev) => ({ ...prev, url: res.data.url }))
      formik.setFieldValue(fieldName, res.data.url)
    } catch (error: any) {
    } finally {
      setCardID((prev) => ({ ...prev, loading: false }))
      //reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  const handleFillData = () => {
    formik.setValues({
      fullName: 'test2',
      email: 'tuantest18@gmail.com',
      portraitImg:
        'http://res.cloudinary.com/dph5psbpr/image/upload/v1745000460/IdentityCards/mfjw0pnjouuxjd99lbs0.jpg',
      dob: '12/12/2000',
      phone: '0123456789',
      identityCardNumber: '123456789',
      address: '123 Đường ABC, Phường XYZ, Quận 1',
      gender: 'MALE',
    })
    setCardID({
      url: 'http://res.cloudinary.com/dph5psbpr/image/upload/v1745000460/IdentityCards/mfjw0pnjouuxjd99lbs0.jpg',
      loading: false,
    })
  }
  return (
    <Box className='w-screen h-screen flex justify-center items-center'>
      <Image src='/assets/book_bg.jpg' layout='fill' alt='background book' />
      <Box className='relative rounded-sm overflow-hidden'>
        <Box className='border-b-4 border-red-800 flex justify-between items-center'>
          <Typography
            variant='h5'
            fontWeight={500}
            className='px-4 py-3 bg-red-800 w-fit !text-white rounded-tl-md rounded-tr-md'
          >
            Thông tin đăng ký thẻ đọc
          </Typography>
          <Button onClick={handleFillData}>Fill</Button>
        </Box>
        <Box className='w-[900px] rounded-sm shadow-2xl p-4'>
          <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <Typography fontWeight={600} className='text-sm !text-red-800'>
              Thông tin cá nhân:
            </Typography>
            <Box className='flex items-start gap-3 mt-4'>
              <Typography fontWeight={600} className='text-sm min-w-[180px]'>
                Ảnh chân dung (ảnh thẻ):
              </Typography>
              <Box>
                {cardID.url ? (
                  <Box className='relative flex w-72 h-48'>
                    <img
                      src={cardID.url}
                      alt='image_def'
                      className='object-contain max-h-full max-w-full object-center m-auto'
                    />
                    <Box
                      onClick={() => {
                        setCardID({ url: '', loading: false })
                        formik.setFieldValue('portraitImg', '')
                      }}
                      className='absolute top-2 right-2 rounded-full z-10 !w-9 !h-9 cursor-pointer flex justify-center items-center text-black !bg-gray-200'
                    >
                      <CloseIcon fontSize='medium' />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <LoadingButton
                      component='label'
                      role={undefined}
                      variant='contained'
                      tabIndex={-1}
                      loading={cardID.loading}
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        '&.Mui-disabled': {
                          backgroundColor: 'gray', // Màu nền khi button bị disabled
                        },
                      }}
                    >
                      Upload files
                      <VisuallyHiddenInput
                        type='file'
                        ref={fileInputIdCardRef}
                        onChange={(e) =>
                          handleChooseFile(e, fileInputIdCardRef, 'portraitImg')
                        }
                      />
                    </LoadingButton>
                    <Typography className='!text-sm italic !mt-2'>
                      Yêu cầu chọn Ảnh chân dung có kích thước: 3x2; định dạng:
                      .png;.jpg;.jpeg; dung lượng nhỏ hơn 6 MB
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Họ tên:
              </Typography>
              <FormControl variant='outlined' fullWidth>
                <StyledTextField
                  margin='normal'
                  fullWidth
                  id='fullName'
                  placeholder='Nhập họ tên của bạn'
                  name='fullName'
                  className='!mt-1'
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  autoFocus
                  error={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </FormControl>
            </Box>
            <FormControl className='!flex items-center gap-3 !flex-row'>
              <Typography
                id='demo-radio-buttons-group-label'
                className='text-sm whitespace-nowrap min-w-[180px] !text-black'
                fontWeight={600}
              >
                Giới tính:
              </Typography>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                defaultValue='MALE'
                name='radio-buttons-group'
                row
                value={formik.values.gender}
                onChange={(e) => {
                  formik.setFieldValue('gender', e.target.value)
                }}
              >
                <FormControlLabel
                  value='MALE'
                  control={<Radio />}
                  label='Nam'
                />
                <FormControlLabel
                  value='FEMALE'
                  control={<Radio />}
                  label='Nữ'
                />
                <FormControlLabel
                  value='OTHER'
                  control={<Radio />}
                  label='Khác'
                />
              </RadioGroup>
            </FormControl>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Ngày sinh:
              </Typography>
              <DatepickerCustom
                value={formik.values.dob ?? ''}
                onChange={(date) => {
                  formik.setFieldValue('dob', date)
                }}
                textErr={formik.touched.dob ? formik.errors.dob : ''}
              />
            </Box>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Căn cước công dân:
              </Typography>
              <StyledTextField
                margin='normal'
                fullWidth
                id='identityCardNumber'
                placeholder='Nhập CMND/CCCD/HC của bạn đọc'
                name='identityCardNumber'
                className='!mt-1'
                value={formik.values.identityCardNumber}
                onChange={formik.handleChange}
                autoFocus
                error={
                  formik.touched.identityCardNumber &&
                  Boolean(formik.errors.identityCardNumber)
                }
                helperText={
                  formik.touched.identityCardNumber &&
                  formik.errors.identityCardNumber
                }
              />
            </Box>
            <Typography fontWeight={600} className='text-sm !text-red-800'>
              Thông tin liên hệ:
            </Typography>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Email:
              </Typography>
              <StyledTextField
                margin='normal'
                fullWidth
                id='email'
                placeholder='Nhập email của bạn'
                name='email'
                className='!mt-1'
                value={formik.values.email}
                onChange={formik.handleChange}
                autoFocus
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Điện thoại:
              </Typography>
              <StyledTextField
                margin='normal'
                fullWidth
                id='phone'
                placeholder='Nhập số điện thoại của bạn'
                name='phone'
                className='!mt-1'
                value={formik.values.phone}
                onChange={formik.handleChange}
                autoFocus
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Box>
            <Box className='flex items-center gap-3'>
              <Typography
                fontWeight={600}
                className='text-sm whitespace-nowrap min-w-[180px]'
              >
                Địa chỉ hiện tại:
              </Typography>
              <StyledTextField
                margin='normal'
                fullWidth
                id='address'
                placeholder='Nhập địa chỉ của bạn'
                name='address'
                className='!mt-1'
                value={formik.values.address}
                onChange={formik.handleChange}
                autoFocus
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Box>
            <div className='flex items-start gap-1'>
              <FormControlLabel
                control={
                  <Checkbox
                    value={cfPolicy}
                    onClick={() => setCfPolicy((prev) => !prev)}
                    className='!p-0'
                    sx={{
                      color: 'gray',
                    }}
                  />
                }
                label='Tôi xin cam đoan thông tin đăng ký hoàn toàn chính xác.'
              />
            </div>
            <LoadingButton
              type='submit'
              fullWidth
              variant='contained'
              loading={loadingSubmit}
              sx={{
                my: 3,
                py: 2,
                '&.Mui-disabled': {
                  backgroundColor: 'gray', // Màu nền khi button bị disabled
                },
              }}
              disabled={!cfPolicy}
            >
              {!loadingSubmit && (
                <Typography variant='body1' fontWeight={400}>
                  Đăng ký
                </Typography>
              )}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
