'use client'
import { uploadImage } from '@/apiRequest/commonApi'
import {
  createPublication,
  getPublication,
  updatePublication,
} from '@/apiRequest/publicationApi'
import { AuthorType } from '@/lib/types/AuthorType'
import { CategoryType } from '@/lib/types/categoryType'
import { TopicType } from '@/lib/types/topicType'
import { handleErrorCode } from '@/lib/utils/common'
import { Box, FormControl, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CloseIcon from '@mui/icons-material/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { StyledTextField, VisuallyHiddenInput } from '@/styles/commonStyle'
import { getListAuthors } from '@/apiRequest/authorApi'
import { getListCategories } from '@/apiRequest/categoryApi'
import { getListTopics } from '@/apiRequest/topicApi'
import { getListPublishers } from '@/apiRequest/publisherApi'
import { PublisherType } from '@/lib/types/publisherType'
import { getListWarehouses } from '@/apiRequest/warehouseApi'
import { WarehouseType } from '@/lib/types/warehouseType'
import AutoCompleteMultipleCustomized from '@/components/AutocompleteMultipleCustom'
import AutoCompleteCustom from '@/components/AutocompleteCustom'
import { LanguageType } from '@/lib/types/languageType'
import { getListLanguages } from '@/apiRequest/languageApi'
export interface IPublicationDetailComProps {}

export default function PublicationDetailCom(
  props: IPublicationDetailComProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const publicationId = params.get('publicationId') ?? ''
  const router = useRouter()
  const [bannerImg, setBannerImg] = React.useState<{
    url: string
    loading: boolean
  }>({
    url: '',
    loading: false,
  })
  const fileInputIdCardRef = React.useRef<HTMLInputElement>(null)
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false)
  const [authors, setAuthors] = React.useState<AuthorType[]>([])
  const [categories, setCategories] = React.useState<CategoryType[]>([])
  const [topics, setTopics] = React.useState<TopicType[]>([])
  const [publishers, setPublishers] = React.useState<PublisherType[]>([])
  const [warehouses, setWarehouses] = React.useState<WarehouseType[]>([])
  const [languages, setLanguages] = React.useState<LanguageType[]>([])
  const [loadingGetPublication, setLoadingGetPublication] =
    React.useState<boolean>(true)
  const formik = useFormik({
    initialValues: {
      name: '',
      placeOfPublication: '',
      yearOfPublication: 0,
      pageCount: 0,
      size: '',
      bannerImg: '',
      classify: '',
      isbn: '',
      issn: '',
      description: '',
      authors: [],
      publisher: {
        id: '',
      },
      categories: [],
      language: {
        id: '',
      },
      warehouse: {
        id: '',
      },
      topics: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Vui lòng nhập tên sách'),
      placeOfPublication: Yup.string().required('Vui lòng nhập nơi xuất bản'),
      yearOfPublication: Yup.number().required('Vui lòng nhập năm xuất bản'),
      pageCount: Yup.number().required('Vui lòng nhập số trang'),
      size: Yup.string().required('Vui lòng nhập kích thước'),
      classify: Yup.string().required('Vui lòng nhập phân loại'),
      isbn: Yup.string().required('Vui lòng nhập ISBN'),
      description: Yup.string().required('Vui lòng nhập mô tả'),
      authors: Yup.array().min(1, 'Vui lòng chọn tác giả'),
      publisher: Yup.object().shape({
        id: Yup.string().required('Vui lòng chọn nhà xuất bản'),
      }),
      categories: Yup.array().min(1, 'Vui lòng chọn danh mục'),
      topics: Yup.array().min(1, 'Vui lòng chọn chủ đề'),
      warehouse: Yup.object().shape({
        id: Yup.string().required('Vui lòng chọn kho'),
      }),
      language: Yup.object().shape({
        id: Yup.string().required('Vui lòng chọn ngôn ngữ'),
      }),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        setLoadingSubmit(true)
        if (publicationId) {
          // call api update reader
          const res = await updatePublication(values, publicationId)
          toast.success('Cập nhật ấn phẩm thành công')
        } else {
          // call api create reader
          const res = await createPublication(values)
          toast.success('Thêm mới ấn phẩm thành công')
          formik.resetForm()
          router.push('/admin/publications')
          //reset input file
          setBannerImg({ url: '', loading: false })
          if (fileInputIdCardRef.current) {
            fileInputIdCardRef.current.value = ''
          }
        }
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoadingSubmit(false)
      }
    },
  })
  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileInputRef: any,
    fieldName: string
  ) => {
    setBannerImg((prev) => ({ ...prev, loading: true }))
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file, 'publications')
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

  const fetchListAuthors = async () => {
    try {
      // call api get list authors
      const res = await getListAuthors(1, 1000, '')
      setAuthors(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListCategories = async () => {
    try {
      // call api get list categories
      const res = await getListCategories(1, 1000, '')
      setCategories(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListTopics = async () => {
    try {
      // call api get list topics
      const res = await getListTopics(1, 1000, '')
      setTopics(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListPublishers = async () => {
    try {
      // call api get list publishers
      const res = await getListPublishers(1, 1000, '')
      setPublishers(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListWarehouses = async () => {
    try {
      // call api get list warehouses
      const res = await getListWarehouses(1, 1000, '')
      setWarehouses(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListLanguages = async () => {
    try {
      // call api get list languages
      const res = await getListLanguages(1, 1000, '')
      setLanguages(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingGetPublication(true) // Bật trạng thái loading
        // Gọi tất cả API song song
        await Promise.all([
          fetchListAuthors(),
          fetchListCategories(),
          fetchListTopics(),
          fetchListPublishers(),
          fetchListWarehouses(),
          fetchListLanguages(),
        ])

        // Gọi API lấy thông tin publication theo ID
        if (publicationId) {
          const res = await getPublication(publicationId)
          console.log(res)
          formik.setValues({
            name: res.data.name,
            placeOfPublication: res.data.placeOfPublication,
            yearOfPublication: res.data.yearOfPublication,
            pageCount: res.data.pageCount,
            size: res.data.size,
            classify: res.data.classify,
            isbn: res.data.isbn,
            issn: res.data.issn,
            description: res.data.description,
            bannerImg: res.data.bannerImg,
            authors:
              res.data?.authors !== null
                ? res.data.authors.map((author: AuthorType) => ({
                    id: author.id,
                  }))
                : [],
            publisher:
              res.data.publisher !== null
                ? { id: res.data.publisher.id }
                : { id: '' },
            categories:
              res.data?.categories !== null
                ? res.data.categories.map((category: CategoryType) => ({
                    id: category.id,
                  }))
                : [],
            topics:
              res.data?.topics !== null
                ? res.data.topics.map((topic: TopicType) => ({
                    id: topic.id,
                  }))
                : [],
            warehouse:
              res.data.warehouse !== null
                ? { id: res.data.warehouse.id }
                : { id: '' },
            language:
              res.data.language !== null
                ? { id: res.data.language.id }
                : { id: '' },
          })
          setBannerImg({ url: res.data.bannerImg, loading: false })
        }
      } catch (error: any) {
        handleErrorCode(error) // Xử lý lỗi nếu có
      } finally {
        setLoadingGetPublication(false) // Tắt trạng thái loading
      }
    }

    fetchAllData()
  }, [publicationId])

  if (loadingGetPublication) return <div>Loading...</div>
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
          Thông tin cơ bản:
        </Typography>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Ảnh bìa:
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
                    ref={fileInputIdCardRef}
                    onChange={(e) =>
                      handleChooseFile(e, fileInputIdCardRef, 'bannerImg')
                    }
                  />
                </LoadingButton>
                <Typography className='!text-sm italic !mt-2'>
                  Yêu cầu chọn Ảnh bìa có kích thước: 3x2; định dạng:
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
            Tên ấn phẩm:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='name'
              placeholder='Nhập tên ấn phẩm'
              name='name'
              className='!mt-1'
              value={formik.values.name}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>
        </Box>
        <FormControl className='!flex items-center gap-3 !flex-row'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Tác giả:
          </Typography>
          <AutoCompleteMultipleCustomized
            listData={authors}
            fieldShow='fullName'
            placeholder='Chọn tác giả'
            value={authors.filter((author) =>
              formik.values.authors.find(
                (authorSelected: AuthorType) => authorSelected.id === author.id
              )
            )}
            onChange={(event, newValue) => {
              formik.setFieldValue(
                'authors',
                newValue.map((author: AuthorType) => ({
                  id: author.id,
                }))
              )
            }}
          />
        </FormControl>
        <FormControl className='!flex items-center gap-3 !flex-row !mt-2'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Nhà xuất bản:
          </Typography>
          <AutoCompleteCustom
            listData={publishers}
            fieldShow='name'
            value={publishers.find(
              (publisher) => publisher.id === formik.values.publisher.id
            )} // Set giá trị mặc định
            placeholder='Chọn nhà xuất bản'
            onChange={(event, newValue) => {
              formik.setFieldValue('publisher', {
                id: newValue !== null ? newValue.id : '',
              })
            }}
          />
        </FormControl>
        <Box className='flex items-center gap-3 mt-2'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Năm xuất bản:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='yearOfPublication'
              placeholder='Nhập năm xuất bản'
              name='yearOfPublication'
              type='number'
              className='!mt-1'
              value={formik.values.yearOfPublication}
              onChange={formik.handleChange}
              error={
                formik.touched.yearOfPublication &&
                Boolean(formik.errors.yearOfPublication)
              }
              helperText={
                formik.touched.yearOfPublication &&
                formik.errors.yearOfPublication
              }
            />
          </FormControl>
        </Box>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Ký hiệu phân loại:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='classify'
              placeholder='Ký hiệu phân loại'
              name='classify'
              type='text'
              className='!mt-1'
              value={formik.values.classify}
              onChange={formik.handleChange}
              error={formik.touched.classify && Boolean(formik.errors.classify)}
              helperText={formik.touched.classify && formik.errors.classify}
            />
          </FormControl>
        </Box>
        <FormControl className='!flex items-center gap-3 !flex-row !mt-2'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Kho lưu trữ:
          </Typography>
          <AutoCompleteCustom
            listData={warehouses}
            fieldShow='name'
            value={warehouses.find(
              (warehouse) => warehouse.id === formik.values.warehouse.id
            )} // Set giá trị mặc định
            placeholder='Chọn kho lưu trữ'
            onChange={(event, newValue) => {
              formik.setFieldValue('warehouse', {
                id: newValue !== null ? newValue.id : '',
              })
            }}
          />
        </FormControl>
        <FormControl className='!flex items-center gap-3 !flex-row !mt-2'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Ngôn ngữ:
          </Typography>
          <AutoCompleteCustom
            listData={languages}
            fieldShow='description'
            value={languages.find(
              (language) => language.id === formik.values.language.id
            )} // Set giá trị mặc định
            placeholder='Chọn ngôn ngữ'
            onChange={(event, newValue) => {
              formik.setFieldValue('language', {
                id: newValue !== null ? newValue.id : '',
              })
            }}
          />
        </FormControl>
        <Typography fontWeight={600} className='text-sm !text-red-800'>
          Thông tin chi tiết:
        </Typography>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Nơi xuất bản:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='placeOfPublication'
              placeholder='Nhập nơi xuất bản'
              name='placeOfPublication'
              className='!mt-1'
              value={formik.values.placeOfPublication}
              onChange={formik.handleChange}
              error={
                formik.touched.placeOfPublication &&
                Boolean(formik.errors.placeOfPublication)
              }
              helperText={
                formik.touched.placeOfPublication &&
                formik.errors.placeOfPublication
              }
            />
          </FormControl>
        </Box>
        <FormControl className='!flex items-center gap-3 !flex-row'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Chủ đề:
          </Typography>
          <AutoCompleteMultipleCustomized
            listData={topics}
            fieldShow='name'
            placeholder='Chọn chủ đề'
            value={topics.filter((topic) =>
              formik.values.topics.find(
                (topicSelected: TopicType) => topicSelected.id === topic.id
              )
            )}
            onChange={(event, newValue) => {
              formik.setFieldValue(
                'topics',
                newValue.map((topic: TopicType) => ({
                  id: topic.id,
                }))
              )
            }}
          />
        </FormControl>
        <FormControl className='!flex items-center gap-3 !flex-row !mt-2'>
          <Typography
            className='text-sm whitespace-nowrap min-w-[180px] !text-black'
            fontWeight={600}
          >
            Thể loại:
          </Typography>
          <AutoCompleteMultipleCustomized
            listData={categories}
            fieldShow='name'
            placeholder='Chọn thể loại'
            value={categories.filter((category) =>
              formik.values.categories.find(
                (categorySelected: CategoryType) =>
                  categorySelected.id === category.id
              )
            )}
            onChange={(event, newValue) => {
              formik.setFieldValue(
                'categories',
                newValue.map((category: CategoryType) => ({
                  id: category.id,
                }))
              )
            }}
          />
        </FormControl>
        <Typography fontWeight={600} className='text-sm !text-red-800'>
          Thông tin khác:
        </Typography>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            ISBN:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='isbn'
              placeholder='Nhập mã số tiêu chuẩn quốc tế'
              name='isbn'
              className='!mt-1'
              value={formik.values.isbn}
              onChange={formik.handleChange}
              error={formik.touched.isbn && Boolean(formik.errors.isbn)}
              helperText={formik.touched.isbn && formik.errors.isbn}
            />
          </FormControl>
        </Box>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            ISSN:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='issn'
              placeholder='Nhập số serial tiêu chuẩn quốc tế'
              name='issn'
              className='!mt-1'
              value={formik.values.issn}
              onChange={formik.handleChange}
              error={formik.touched.issn && Boolean(formik.errors.issn)}
              helperText={formik.touched.issn && formik.errors.issn}
            />
          </FormControl>
        </Box>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Số trang:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='pageCount'
              placeholder='Nhập số trang'
              name='pageCount'
              type='number'
              className='!mt-1'
              value={formik.values.pageCount}
              onChange={formik.handleChange}
              error={
                formik.touched.pageCount && Boolean(formik.errors.pageCount)
              }
              helperText={formik.touched.pageCount && formik.errors.pageCount}
            />
          </FormControl>
        </Box>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Kích thước:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='size'
              placeholder='Nhập kích thước'
              name='size'
              className='!mt-1'
              value={formik.values.size}
              onChange={formik.handleChange}
              error={formik.touched.size && Boolean(formik.errors.size)}
              helperText={formik.touched.size && formik.errors.size}
            />
          </FormControl>
        </Box>
        <Box className='flex items-center gap-3'>
          <Typography
            fontWeight={600}
            className='text-sm whitespace-nowrap min-w-[180px]'
          >
            Mô tả:
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='description'
              placeholder='Nhập mô tả'
              name='description'
              className='!mt-1'
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formik.touched.description && formik.errors.size}
            />
          </FormControl>
        </Box>
        <LoadingButton
          type='submit'
          fullWidth
          variant='contained'
          loading={loadingSubmit}
          color={
            publicationId
              ? 'warning' // Màu button khi cập nhật ấn phẩm
              : 'primary' // Màu button khi thêm mới ấn phẩm
          }
          sx={{
            my: 3,
            py: 2,
            '&.Mui-disabled': {
              backgroundColor: 'gray', // Màu nền khi button bị disabled
            },
            maxWidth: '200px',
          }}
        >
          {!loadingSubmit && (
            <Typography
              variant='body1'
              fontWeight={400}
              className='!text-white'
            >
              {publicationId ? 'Cập nhật ấn phẩm' : 'Thêm ấn phẩm'}
            </Typography>
          )}
        </LoadingButton>
      </Box>
    </div>
  )
}
