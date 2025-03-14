'use client'
import {
  createInventory,
  getInventoryById,
  updateInventory,
} from '@/apiRequest/inventoryApi'
import { handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { StyledTextField } from '@/styles/commonStyle'
import AutoCompleteCustom from '@/components/AutocompleteCustom'
import { WarehouseType } from '@/lib/types/warehouseType'
import { getListWarehouses } from '@/apiRequest/warehouseApi'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
export interface IRenderDetailInventoryProps {}

export default function RenderDetailInventory(
  props: IRenderDetailInventoryProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const inventoryId = params.get('inventoryId') ?? ''
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user.user)
  const [warehouses, setWarehouses] = React.useState<WarehouseType[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      warehouseId: '',
      note: '',
      status: '',
    },
    validationSchema: Yup.object().shape({
      warehouseId: Yup.string().required('Vui lòng chọn kho'),
      note: Yup.string().required('Vui lòng nhập ghi chú'),
    }),
    onSubmit: async (values) => {
      try {
        if (inventoryId) {
          // call api update reader
          const res = await updateInventory(
            {
              ...values,
            },
            inventoryId
          )
          console.log(res)
          toast.success('Cập nhật phiếu kiểm kê thành công')
        } else {
          // call api create reader
          const res = await createInventory({
            ...values,
            userId: user.id ?? '',
          })
          formik.resetForm()
          toast.success('Thêm phiếu kiểm kê thành công')
          router.push(
            `/admin/inventory/pickRegistrationId?inventoryId=${res.data.id}`
          )
        }
      } catch (error: any) {
        handleErrorCode(error)
      }
    },
  })

  const fetchListWarehouses = async () => {
    try {
      setLoading(true)
      // call api get list warehouses
      const res = await getListWarehouses(1, 1000, '')
      setWarehouses(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const fetchLiquidation = async () => {
      try {
        const res = await getInventoryById(inventoryId)
        console.log(res)
        formik.setValues({
          warehouseId: res.data.warehouse.id,
          note: res.data.note,
          status: res.data.status,
        })
      } catch (error: any) {
        handleErrorCode(error)
      }
    }
    if (inventoryId) {
      fetchLiquidation()
    }
    fetchListWarehouses()
  }, [inventoryId])
  if (loading) {
    return <div>Loading...</div>
  }
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
          Thông tin Phiếu kiểm kê
        </Typography>
        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Kho
          </Typography>
          <Box>
            <AutoCompleteCustom
              listData={warehouses}
              fieldShow='name'
              value={warehouses.find(
                (warehouse) => warehouse.id === formik.values.warehouseId
              )} // Set giá trị mặc định
              placeholder='Chọn kho lưu trữ'
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  'warehouseId',
                  newValue !== null ? newValue.id : ''
                )
              }}
            />
            {formik.touched.warehouseId && (
              <Typography className='text-xs !mt-2 !text-red-800'>
                {formik.errors.warehouseId}
              </Typography>
            )}
          </Box>
        </Box>

        <Box className='flex items-start gap-3 mt-4'>
          <Typography fontWeight={600} className='text-sm min-w-[180px]'>
            Ghi chú
          </Typography>
          <FormControl variant='outlined' fullWidth>
            <StyledTextField
              margin='normal'
              fullWidth
              id='note'
              placeholder='Nhập ghi chú'
              name='note'
              className='!mt-1'
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </FormControl>
        </Box>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{
            my: 3,
            py: 2,
            '&.Mui-disabled': {
              backgroundColor: 'gray', // Màu nền khi button bị disabled
            },
            maxWidth: '200px',
          }}
        >
          <Typography variant='body1' fontWeight={400} className='!text-white'>
            {inventoryId ? 'Cập nhật phiếu kiểm kê' : 'Thêm phiếu kiểm kê'}
          </Typography>
        </Button>
      </Box>
      <div className='flex justify-end mt-5'>
        <Tooltip title='Đi đến chi tiết phiếu kiểm kê'>
          <ArrowForwardIcon
            className='cursor-pointer'
            onClick={() =>
              router.push(
                `/admin/inventory/pickRegistrationId?inventoryId=${inventoryId}`
              )
            }
          />
        </Tooltip>
      </div>
    </div>
  )
}
