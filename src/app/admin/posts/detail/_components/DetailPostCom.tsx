'use client'
import { createPost, getPost, updatePost } from '@/apiRequest/postApi'
import QuillEditor from '@/components/QuillEditor'
import { handleErrorCode } from '@/lib/utils/common'
import { StyledTextField, VisuallyHiddenInput } from '@/styles/commonStyle'
import { Box, FormControl, IconButton, Typography } from '@mui/material'
import { Select } from 'antd'
import { useFormik } from 'formik'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import CloseIcon from '@mui/icons-material/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { uploadImage } from '@/apiRequest/commonApi'
import { useRouter, useSearchParams } from 'next/navigation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useWebSocket } from '@/components/WebSocketProvider'
export interface IDetailPostComProps {}

export default function DetailPostCom(props: IDetailPostComProps) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const postId = params.get('postId') ?? ''
  const [loadingSubmit, setLoadingSubmit] = React.useState(false)
  const [bannerImg, setBannerImg] = React.useState({
    url: '',
    loading: false,
  })
  const [loadingGetPost, setLoadingGetPost] = React.useState(false)
  const router = useRouter()
  const fileInputBannerImageRef = React.useRef<HTMLInputElement>(null)
  const stompClient: any = useWebSocket()
  console.log(stompClient)
  const formik = useFormik({
    initialValues: {
      title: '',
      postType: 'EVENTS',
      content: '',
      bannerImg: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Tiêu đề không được để trống'),
      postType: Yup.string().required('Loại bài đăng không được để trống'),
      content: Yup.string().required('Nội dung không được để trống'),
      bannerImg: Yup.string().required('Ảnh bìa không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        setLoadingSubmit(true)
        if (postId) {
          // call api update post
          const res = await updatePost(postId, values)
          toast.success('Cập nhật bài đăng thành công')
          router.push('/admin/posts')
        } else {
          const res = await createPost(values)
          if (stompClient && stompClient?.connected) {
            stompClient.publish({
              destination: `/app/send-notification`,
              body: JSON.stringify({
                id: res.data.id,
                title: `Thủ thư vừa đăng tin mới: ${res.data.title}`,
                type: 'posts',
              }),
            })
          }
          toast.success('Đăng bài thành công')
          formik.resetForm()
          setBannerImg({ url: '', loading: false })
          router.push('/admin/posts')
        }
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      } finally {
        setLoadingSubmit(false)
      }
    },
  })
  React.useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoadingGetPost(true)
        const res = await getPost(postId)
        formik.setValues({
          title: res.data.title,
          postType: res.data.postType,
          content: res.data.content,
          bannerImg: res.data.bannerImg,
        })
        setBannerImg({ url: res.data.bannerImg, loading: false })
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoadingGetPost(false)
      }
    }
    if (postId) {
      // call api get post detail
      fetchPostDetail()
    }
  }, [postId])

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileInputRef: any,
    fieldName: string
  ) => {
    setBannerImg((prev) => ({ ...prev, loading: true }))
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file, 'posts')
      console.log(res)
      setBannerImg((prev) => ({ ...prev, url: res.data.url }))
      formik.setFieldValue(fieldName, res.data.url)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setBannerImg((prev) => ({ ...prev, loading: false }))
      //reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  if (loadingGetPost) return <div>Loading...</div>

  return (
    <Box component='form' onSubmit={formik.handleSubmit}>
      <IconButton
        onClick={() => {
          router.back()
        }}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
      <h4>Thông tin bài đăng</h4>
      <Typography fontWeight={400}>Tiêu đề</Typography>
      <FormControl variant='outlined' fullWidth>
        <StyledTextField
          margin='normal'
          fullWidth
          id='title'
          placeholder='Nhập tiêu đề'
          name='title'
          className='!mt-1'
          value={formik.values.title}
          onChange={formik.handleChange}
          autoFocus
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
      </FormControl>
      <Typography fontWeight={400}>Loại bài đăng</Typography>
      <Select
        style={{ width: 300 }}
        onChange={(value) => formik.setFieldValue('postType', value)}
        defaultValue={'EVENTS'}
        value={formik.values.postType}
        options={[
          { value: 'INTRODUCTION_PUBLICATION', label: 'Giới thiệu ấn phẩm' },
          { value: 'EVENTS', label: 'Sự kiện' },
          { value: 'NEWS', label: 'Tin tức' },
        ]}
      />
      <Box>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Ảnh bìa bài đăng
          </Typography>
          <Box>
            {bannerImg.url ? (
              <Box className='relative flex w-72 h-48'>
                <img
                  src={bannerImg.url}
                  alt='image_def'
                  className='object-contain max-h-full max-w-full object-center m-auto'
                />
                <Box
                  onClick={() => {
                    setBannerImg({ url: '', loading: false })
                    formik.setFieldValue('bannerImg', '')
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
                  loading={bannerImg.loading}
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
                    ref={fileInputBannerImageRef}
                    onChange={(e) =>
                      handleChooseFile(e, fileInputBannerImageRef, 'bannerImg')
                    }
                  />
                </LoadingButton>
              </Box>
            )}
          </Box>
        </Box>
        <Typography
          className='!text-red-500 !mt-4'
          variant='caption'
          component='div'
        >
          {formik.touched.bannerImg && formik.errors.bannerImg}
        </Typography>
      </Box>
      <Box className='mt-4'>
        <QuillEditor
          value={formik.values.content}
          onChange={(value) => formik.setFieldValue('content', value)}
          textError={formik.errors.content ?? ''}
        />
      </Box>
      <LoadingButton
        type='submit'
        fullWidth
        variant='contained'
        loading={loadingSubmit}
        sx={{
          my: 5,
          py: 2,
          '&.Mui-disabled': {
            backgroundColor: 'gray', // Màu nền khi button bị disabled
          },
          maxWidth: '200px',
        }}
      >
        {!loadingSubmit && (
          <Typography variant='body1' fontWeight={400} className='!text-white'>
            {postId ? 'Cập nhật' : 'Thêm tin'}
          </Typography>
        )}
      </LoadingButton>
    </Box>
  )
}
