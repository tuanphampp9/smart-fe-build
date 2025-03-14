'use client'
import { handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import UndoIcon from '@mui/icons-material/Undo'
import { setCategorySelected } from '@/store/slices/categorySlice'
import { createCategory, updateCategory } from '@/apiRequest/categoryApi'
import { toast } from 'react-toastify'
import { GET_LIST_CATEGORIES } from '@/store/action-saga/common'
export interface IFormCategoryProps {}

export default function FormCategory(props: IFormCategoryProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.category.pageInfo)
  const categorySelected = useSelector(
    (state: RootState) => state.category.category
  )
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên thể loại không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (categorySelected) {
          //update category
          const res = await updateCategory({
            id: categorySelected.id,
            ...values,
          })
          console.log(res)
          toast.success('Cập nhật chủ đề thành công')
          dispatch({
            type: GET_LIST_CATEGORIES,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create category
          const res = await createCategory(values)
          console.log(res)
          toast.success('Thêm chủ đề thành công')
          formik.resetForm()
          dispatch({
            type: GET_LIST_CATEGORIES,
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
    if (categorySelected) {
      formik.setValues({
        name: categorySelected.name,
        description: categorySelected.description,
      })
    }
  }, [categorySelected])

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>Tên thể loại</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập tên thể loại'
            name='name'
            className='!mt-1'
            value={formik.values.name}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
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
              color={categorySelected ? 'warning' : 'info'}
            >
              {categorySelected ? 'Cập nhật thể loại' : 'Thêm thể loại'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setCategorySelected(null))
        }}
      />
    </div>
  )
}
