'use client'
import {
  createInventoryDetail,
  getInventoryById,
  updateInventory,
} from '@/apiRequest/inventoryApi'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { setAllRegistrationIds } from '@/store/slices/borrowSlipSlice'
import { RootState } from '@/store/store'
import { Formik, useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { InventoryType } from '@/lib/types/inventoryType'
import TableListRegistrationUnique from '@/components/TableListRegistrationUnique'
import { Select } from 'antd'
import { StyledTextField } from '@/styles/commonStyle'
export interface IRenderPickRegistrationComProps {}

export default function RenderPickRegistrationCom(
  props: IRenderPickRegistrationComProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const inventoryId = params.get('inventoryId') ?? ''
  const [inventory, setInventory] = React.useState<InventoryType>()
  const [loading, setLoading] = React.useState(true)
  const { registrationIds } = useSelector(
    (state: RootState) => state.borrowSlip || []
  )
  const router = useRouter()
  const dispatch = useDispatch()
  React.useEffect(() => {
    const fetchLiquidation = async () => {
      try {
        const response = await getInventoryById(inventoryId)
        setInventory(response.data)
        dispatch(
          setAllRegistrationIds(
            response.data.inventoryCheckDetails.map(
              (item: any) => item.registrationUnique.registrationId
            )
          )
        )
      } catch (error: any) {
        console.log(error)
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (inventoryId) fetchLiquidation()
  }, [inventoryId])
  if (loading || !inventory) {
    return <div>Loading...</div>
  }

  const handleUpdateInventory = async (
    warehouseId: string,
    note: string,
    status: string
  ) => {
    try {
      if (inventoryId) {
        // call api update inventory
        const res = await updateInventory(
          {
            warehouseId: warehouseId,
            note: note,
            status: status,
          },
          inventoryId
        )
        setInventory(res.data)
        console.log(res)
        router.push('/admin/inventory')
        toast.success('Cập nhật phiếu kiểm kê thành công')
      }
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  return (
    <div>
      <ArrowBackIcon className='cursor-pointer' onClick={() => router.back()} />
      <div className='w-1/2 shadow-md p-4 rounded-md'>
        <Typography fontWeight={500} className='text-sm !text-red-800'>
          Thông tin chung phiếu kiểm kê: {inventory?.id}
        </Typography>
        <Typography fontWeight={500} className='text-sm'>
          Ngày lập: {formatDateTime(inventory.createdAt)}
        </Typography>
        <Typography fontWeight={500} className='text-sm'>
          Kho: {inventory.warehouse.name}
        </Typography>
        <Typography fontWeight={500} className='text-sm'>
          Người lập: {inventory.user.fullName}
        </Typography>
        <Typography fontWeight={500} className='text-sm'>
          Ghi chú: {inventory.note}
        </Typography>
      </div>
      <Formik
        initialValues={{
          listRegistrations: registrationIds.map((item) => {
            const detail: any = inventory.inventoryCheckDetails.find(
              (detail: any) => detail.registrationUnique.registrationId === item
            )
            return {
              registrationId: item,
              note: detail?.note,
              status: detail?.registrationUnique.status,
            }
          }),
        }}
        onSubmit={async (values) => {
          console.log(values)
          try {
            if (inventoryId) {
              // call api create reader
              const res = await createInventoryDetail(
                values.listRegistrations,
                Number(inventoryId)
              )
              toast.success('Cập nhật phiếu kiểm kê thành công')
            }
          } catch (error: any) {
            handleErrorCode(error)
          }
        }}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          handleChange,
          errors,
          touched,
        }) => (
          <>
            <div className='mt-10'>
              <TableListRegistrationUnique
                onChangeRegistrationIds={(registrationId, isCheck) => {
                  console.log(registrationId, isCheck)
                  if (isCheck) {
                    setFieldValue('listRegistrations', [
                      ...values.listRegistrations,
                      {
                        registrationId,
                        note: '',
                        status: 'AVAILABLE',
                      },
                    ])
                  } else {
                    setFieldValue(
                      'listRegistrations',
                      values.listRegistrations.filter(
                        (item: any) => item.registrationId !== registrationId
                      )
                    )
                  }
                }}
              />
            </div>
            {
              // list selected publications
              inventory.inventoryCheckDetails.length > 0 &&
                inventory.status === 'ONGOING' && (
                  <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Typography
                      fontWeight={600}
                      className='text-sm !text-red-800'
                    >
                      Chi tiết phiếu kiểm kê:
                    </Typography>
                    <Box>
                      {inventory.inventoryCheckDetails.map((item, index) => (
                        <Box key={index} className='flex gap-7 items-start'>
                          <Box>
                            <Typography className='!font-semibold'>
                              Mã ĐKCB
                            </Typography>
                            <Typography className='!mt-3'>
                              {item.registrationUnique.registrationId}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              fontWeight={600}
                              className='text-sm !mb-2'
                            >
                              Trạng thái:
                            </Typography>
                            <Select
                              style={{ width: 120 }}
                              onChange={(value) => {
                                const newValue = value
                                setFieldValue(
                                  'listRegistrations',
                                  values.listRegistrations.map(
                                    (detail: any) => {
                                      if (
                                        detail.registrationId ===
                                        item.registrationUnique.registrationId
                                      ) {
                                        return {
                                          ...detail,
                                          status: newValue,
                                        }
                                      }
                                      return detail
                                    }
                                  )
                                )
                              }}
                              value={
                                values.listRegistrations.find(
                                  (detail: any) =>
                                    detail.registrationId ===
                                    item.registrationUnique.registrationId
                                )?.status
                              }
                              options={[
                                { value: 'AVAILABLE', label: 'Sẵn sàng' },
                                { value: 'BORROWED', label: 'Đang mượn' },
                                {
                                  value: 'LOST',
                                  label: 'Thất lạc',
                                },
                                { value: 'DAMAGED', label: 'Hư hại' },
                                { value: 'NEED_REPAIR', label: 'Cần sửa lại' },
                              ]}
                            />
                          </Box>
                          <Box>
                            <Typography className='!font-semibold'>
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
                                value={
                                  values.listRegistrations.find(
                                    (detail: any) =>
                                      detail.registrationId ===
                                      item.registrationUnique.registrationId
                                  )?.note
                                }
                                onChange={(e) => {
                                  setFieldValue(
                                    'listRegistrations',
                                    values.listRegistrations.map(
                                      (detail: any) => {
                                        if (
                                          detail.registrationId ===
                                          item.registrationUnique.registrationId
                                        ) {
                                          return {
                                            ...detail,
                                            note: e.target.value,
                                          }
                                        }
                                        return detail
                                      }
                                    )
                                  )
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Button variant='contained' color='warning' type='submit'>
                      Cập nhật
                    </Button>
                  </Box>
                )
            }
          </>
        )}
      </Formik>
      <div className='mt-5 flex justify-end'>
        <Button
          variant='contained'
          color='info'
          onClick={() =>
            handleUpdateInventory(
              inventory.warehouse.id,
              inventory.note,
              'FINISHED'
            )
          }
          disabled={inventory.status === 'FINISHED'}
        >
          Đã xong
        </Button>
      </div>
    </div>
  )
}
