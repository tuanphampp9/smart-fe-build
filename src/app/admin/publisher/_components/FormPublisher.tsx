import { handleErrorCode } from '@/lib/utils/common'
import { setPublisherSelected } from '@/store/slices/publisherSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import UndoIcon from '@mui/icons-material/Undo'
import { createPublisher, updatePublisher } from '@/apiRequest/publisherApi'
import { toast } from 'react-toastify'
import { GET_LIST_PUBLISHERS } from '@/store/action-saga/common'
export interface IFormPublisherProps {}

export default function FormPublisher(props: IFormPublisherProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.publisher.pageInfo)
  const publisherSelected = useSelector(
    (state: RootState) => state.publisher.publisher
  )
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên nhà xuất bản không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
      address: Yup.string().required('Địa chỉ không được để trống'),
      phone: Yup.string()
        .required('Số điện thoại không được để trống')
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
          'Số điện thoại không hợp lệ'
        ),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (publisherSelected) {
          //update publisher
          const res = await updatePublisher({
            id: publisherSelected.id,
            ...values,
          })
          console.log(res)
          toast.success('Cập nhật nhà xuất bản thành công')
          dispatch({
            type: GET_LIST_PUBLISHERS,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create publisher
          const res = await createPublisher(values)
          console.log(res)
          toast.success('Thêm nhà xuất bản thành công')
          formik.resetForm()
          dispatch({
            type: GET_LIST_PUBLISHERS,
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
    if (publisherSelected) {
      formik.setValues({
        name: publisherSelected.name,
        description: publisherSelected.description,
        address: publisherSelected.address,
        phone: publisherSelected.phone,
      })
    }
  }, [publisherSelected])

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>Tên nhà xuất bản</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập tên nhà xuất bản'
            name='name'
            className='!mt-1'
            value={formik.values.name}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <Typography fontWeight={400}>Số điện thoại</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='phone'
            placeholder='Nhập số điện thoại của nhà xuất bản'
            name='phone'
            className='!mt-1'
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </FormControl>
        <Typography fontWeight={400}>Địa chỉ</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='address'
            placeholder='Nhập địa chỉ của nhà xuất bản'
            name='address'
            multiline
            maxRows={3}
            className='!mt-1'
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
        </FormControl>

        <Typography fontWeight={400}>Mô tả</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='description'
            type='text'
            multiline
            name='description'
            maxRows={4}
            placeholder='Nhập mô tả'
            className='!mt-1'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </FormControl>
        <Box>
          <Box className='mt-4'>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color={publisherSelected ? 'warning' : 'info'}
            >
              {publisherSelected
                ? 'Cập nhật nhà xuất bản'
                : 'Thêm nhà xuất bản'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setPublisherSelected(null))
        }}
      />
    </div>
  )
}
