import { handleErrorCode } from '@/lib/utils/common'
import { setWarehouseSelected } from '@/store/slices/warehouseSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import UndoIcon from '@mui/icons-material/Undo'
import { createWarehouse, updateWarehouse } from '@/apiRequest/warehouseApi'
import { toast } from 'react-toastify'
import { GET_LIST_WAREHOUSES } from '@/store/action-saga/common'
export interface IFormWarehouseProps {}

export default function FormWarehouse(props: IFormWarehouseProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.warehouse.pageInfo)
  const warehouseSelected = useSelector(
    (state: RootState) => state.warehouse.warehouse
  )
  const formik = useFormik({
    initialValues: {
      type: '',
      name: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên kho không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
      type: Yup.string().required('Loại không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (warehouseSelected) {
          //update category
          const res = await updateWarehouse({
            id: warehouseSelected.id,
            ...values,
          })
          console.log(res)
          toast.success('Cập nhật chủ đề thành công')
          dispatch({
            type: GET_LIST_WAREHOUSES,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create category
          const res = await createWarehouse(values)
          console.log(res)
          toast.success('Thêm kho thành công')
          formik.resetForm()
          dispatch({
            type: GET_LIST_WAREHOUSES,
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
    if (warehouseSelected) {
      formik.setValues({
        name: warehouseSelected.name,
        description: warehouseSelected.description,
        type: warehouseSelected.type,
      })
    }
  }, [warehouseSelected])

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>Tên kho</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập tên kho'
            name='name'
            className='!mt-1'
            value={formik.values.name}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <Typography fontWeight={400}>Loại kho</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='type'
            placeholder='Nhập loại kho'
            name='type'
            className='!mt-1'
            value={formik.values.type}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
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
              color={warehouseSelected ? 'warning' : 'info'}
            >
              {warehouseSelected ? 'Cập nhật kho' : 'Thêm kho'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setWarehouseSelected(null))
        }}
      />
    </div>
  )
}
