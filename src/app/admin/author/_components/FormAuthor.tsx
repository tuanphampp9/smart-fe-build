import { handleErrorCode } from '@/lib/utils/common'
import { setAuthorSelected } from '@/store/slices/authorSlice'
import { RootState } from '@/store/store'
import { StyledTextField, VisuallyHiddenInput } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import UndoIcon from '@mui/icons-material/Undo'
import CloseIcon from '@mui/icons-material/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { uploadImage } from '@/apiRequest/commonApi'
import DatepickerCustom from '@/components/DatepickerCustom'
import { createAuthor, updateAuthor } from '@/apiRequest/authorApi'
import { toast } from 'react-toastify'
import { GET_LIST_AUTHORS } from '@/store/action-saga/common'
export interface IFormAuthorProps {}

export default function FormAuthor(props: IFormAuthorProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.author.pageInfo)
  const authorSelected = useSelector((state: RootState) => state.author.author)
  const fileInputAvatarRef = React.useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = React.useState<{
    url: string
    loading: boolean
  }>({
    url: '',
    loading: false,
  })
  const formik = useFormik({
    initialValues: {
      fullName: '',
      penName: '',
      homeTown: '',
      introduction: '',
      avatar: '',
      dob: '',
      dod: '',
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required('Tên tác giả không được để trống'),
      homeTown: Yup.string().required('Quê quán không được để trống'),
      avatar: Yup.string().required('Ảnh đại diện không được để trống'),
      dob: Yup.string().required('Ngày sinh không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (authorSelected) {
          //update author
          const res = await updateAuthor({
            id: authorSelected.id,
            ...values,
          })
          console.log(res)
          toast.success('Cập nhật tác giả thành công')
          dispatch({
            type: GET_LIST_AUTHORS,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create author
          const res = await createAuthor(values)
          console.log(res)
          toast.success('Thêm chủ đề thành công')
          formik.resetForm()
          setAvatar({ url: '', loading: false })
          dispatch({
            type: GET_LIST_AUTHORS,
            payload: { page: 1, itemPerPage: pageInfo.itemPerPage, filter: '' },
          })
        }
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })

  React.useEffect(() => {
    if (authorSelected) {
      formik.setValues({
        fullName: authorSelected.fullName,
        penName: authorSelected.penName,
        homeTown: authorSelected.homeTown,
        introduction: authorSelected.introduction,
        avatar: authorSelected.avatar,
        dob: authorSelected.dob,
        dod: authorSelected.dod,
      })
      setAvatar({ url: authorSelected.avatar, loading: false }) //set avatar
    }
  }, [authorSelected])

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileInputRef: any,
    fieldName: string
  ) => {
    setAvatar((prev) => ({ ...prev, loading: true }))
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file, 'authors')
      console.log(res)
      setAvatar((prev) => ({ ...prev, url: res.data.url }))
      formik.setFieldValue(fieldName, res.data.url)
    } catch (error: any) {
    } finally {
      setAvatar((prev) => ({ ...prev, loading: false }))
      //reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Ảnh chân dung:
          </Typography>
          <Box>
            {avatar.url ? (
              <Box className='relative flex h-48'>
                <img
                  src={avatar.url}
                  alt='image_def'
                  className='object-contain object-center'
                />
                <Box
                  onClick={() => {
                    setAvatar({ url: '', loading: false })
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
                  loading={avatar.loading}
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
                    ref={fileInputAvatarRef}
                    onChange={(e) =>
                      handleChooseFile(e, fileInputAvatarRef, 'avatar')
                    }
                  />
                </LoadingButton>
              </Box>
            )}
          </Box>
        </Box>
        <Typography fontWeight={400}>Họ và tên</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='fullName'
            placeholder='Nhập tên tác giả'
            name='fullName'
            className='!mt-1'
            value={formik.values.fullName}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
        </FormControl>
        <Typography fontWeight={400}>Bút danh</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='penName'
            type='text'
            name='penName'
            placeholder='Nhập bút danh'
            className='!mt-1'
            value={formik.values.penName}
            onChange={formik.handleChange}
            error={formik.touched.penName && Boolean(formik.errors.penName)}
            helperText={formik.touched.penName && formik.errors.penName}
          />
        </FormControl>
        <Typography fontWeight={400}>Quê</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='homeTown'
            type='text'
            multiline
            name='homeTown'
            maxRows={4}
            placeholder='Quê quán'
            className='!mt-1'
            value={formik.values.homeTown}
            onChange={formik.handleChange}
            error={formik.touched.homeTown && Boolean(formik.errors.homeTown)}
            helperText={formik.touched.homeTown && formik.errors.homeTown}
          />
        </FormControl>
        <Typography fontWeight={400}>Giới thiệu</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='introduction'
            type='text'
            multiline
            name='introduction'
            maxRows={4}
            placeholder='Nhập giới thiệu'
            className='!mt-1'
            value={formik.values.introduction}
            onChange={formik.handleChange}
            error={
              formik.touched.introduction && Boolean(formik.errors.introduction)
            }
            helperText={
              formik.touched.introduction && formik.errors.introduction
            }
          />
        </FormControl>
        <Box>
          <Box>
            <Typography fontWeight={400}>Ngày sinh</Typography>
            <DatepickerCustom
              value={formik.values.dob ?? ''}
              onChange={(date) => {
                formik.setFieldValue('dob', date)
              }}
              textErr={formik.touched.dob ? formik.errors.dob : ''}
            />
          </Box>
          <Box>
            <Typography fontWeight={400}>Ngày mất</Typography>
            <DatepickerCustom
              value={formik.values.dod ?? ''}
              onChange={(date) => {
                formik.setFieldValue('dod', date)
              }}
              textErr={formik.touched.dod ? formik.errors.dod : ''}
            />
          </Box>
        </Box>
        <Box>
          <Box className='mt-4'>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color={authorSelected ? 'warning' : 'info'}
            >
              {authorSelected ? 'Cập nhật tác giả' : 'Thêm tác giả'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setAuthorSelected(null))
          setAvatar({ url: '', loading: false })
        }}
      />
    </div>
  )
}
