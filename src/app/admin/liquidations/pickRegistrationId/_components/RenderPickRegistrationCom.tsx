'use client'
import {
  createLiquidationDetail,
  getLiquidationById,
  updateLiquidation,
} from '@/apiRequest/liquidationApi'
import TableListRegistrationUnique from '@/components/TableListRegistrationUnique'
import { LiquidationType } from '@/lib/types/liquidationType'
import { RegistrationUniqueResType } from '@/lib/types/RegistrationUniqueType'
import { handleErrorCode } from '@/lib/utils/common'
import { setAllRegistrationIds } from '@/store/slices/borrowSlipSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { Select } from 'antd'
import { Formik, useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
export interface IRenderPickRegistrationComProps {}

export default function RenderPickRegistrationCom(
  props: IRenderPickRegistrationComProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const liquidationId = params.get('liquidationId') ?? ''
  const [liquidation, setLiquidation] = React.useState<LiquidationType>()
  const [loading, setLoading] = React.useState(true)
  const { registrationIds } = useSelector(
    (state: RootState) => state.borrowSlip || []
  )
  const router = useRouter()
  const dispatch = useDispatch()
  React.useEffect(() => {
    const fetchLiquidation = async () => {
      try {
        const response = await getLiquidationById(liquidationId)
        setLiquidation(response.data)
        console.log()
        dispatch(
          setAllRegistrationIds(
            response.data.liquidationDetails.map(
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
    if (liquidationId) fetchLiquidation()
  }, [liquidationId])
  if (loading || !liquidation) {
    return <div>Loading...</div>
  }

  const handleUpdateLiquidation = async () => {
    try {
      if (liquidationId) {
        // call api create reader
        const res = await updateLiquidation(
          {
            status: 'DONE',
            receiverName: liquidation.receiverName,
            receiverContact: liquidation.receiverContact,
            note: liquidation.note,
          },
          liquidationId
        )
        setLiquidation(res.data)
        console.log(res)
        router.push('/admin/liquidations')
        toast.success('Cập nhật trạng thái phiếu thanh lý thành công')
      }
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  return (
    <div>
      <ArrowBackIcon className='cursor-pointer' onClick={() => router.back()} />
      <div className='w-1/2 shadow-md p-4 rounded-md'>
        <div>
          <Typography fontWeight={500} className='text-sm !text-red-800'>
            Thông tin chung phiếu thanh lý: {liquidation?.id}
          </Typography>
          <Typography fontWeight={500} className='text-sm'>
            Người nhận: {liquidation?.receiverName}
          </Typography>
          <Typography fontWeight={500} className='text-sm'>
            Liên hệ: {liquidation?.receiverContact}
          </Typography>
          <Typography fontWeight={500} className='text-sm'>
            Ghi chú: {liquidation?.note}
          </Typography>
        </div>
        <div className='mt-5 flex justify-end'>
          <Button
            variant='contained'
            color='info'
            onClick={handleUpdateLiquidation}
            disabled={liquidation.status === 'DONE'}
          >
            Đã thanh lý
          </Button>
        </div>
      </div>
      <Formik
        initialValues={{
          listRegistrations: registrationIds.map((item) => {
            const detail: any = liquidation.liquidationDetails.find(
              (detail: any) => detail.registrationUnique.registrationId === item
            )
            return {
              registrationId: item,
              price: detail?.price,
              conditionStatus: detail?.conditionStatus,
              note: detail?.note,
            }
          }),
        }}
        onSubmit={async (values) => {
          console.log(values)
          try {
            if (liquidationId) {
              // call api create reader
              const res = await createLiquidationDetail(
                values.listRegistrations,
                Number(liquidationId)
              )
              console.log(res)
              toast.success('Cập nhật phiếu thanh lý thành công')
            }
          } catch (error: any) {
            handleErrorCode(error)
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
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
                        price: 0,
                        conditionStatus: 'DAMAGED',
                        note: '',
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
              registrationIds.length > 0 &&
                liquidation.status === 'PENDING' && (
                  <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Typography
                      fontWeight={600}
                      className='text-sm !text-red-800'
                    >
                      Chi tiết phiếu thanh lý:
                    </Typography>
                    <Box>
                      {registrationIds.map((item, index) => (
                        <Box key={index} className='flex gap-7 items-start'>
                          <Box>
                            <Typography className='!font-semibold'>
                              Mã ĐKCB
                            </Typography>
                            <Typography className='!mt-4'>{item}</Typography>
                          </Box>
                          <Box>
                            <Typography
                              fontWeight={600}
                              className='text-sm min-w-[180px]'
                            >
                              Giá:
                            </Typography>
                            <FormControl variant='outlined' fullWidth>
                              <StyledTextField
                                margin='normal'
                                fullWidth
                                id={`price-${index}`}
                                placeholder='Nhập giá'
                                className='!mt-1'
                                type='number'
                                value={
                                  (
                                    values.listRegistrations.find(
                                      (detail: any) =>
                                        detail.registrationId === item
                                    ) as any
                                  )?.price
                                }
                                onChange={(e) => {
                                  const newValue = e.target.value.replace(
                                    /^0+(?=\d)/,
                                    ''
                                  )
                                  setFieldValue(
                                    'listRegistrations',
                                    values.listRegistrations.map(
                                      (detail: any) => {
                                        if (detail.registrationId === item) {
                                          return {
                                            ...detail,
                                            price: Number(newValue),
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
                          <Box>
                            <Typography className='!font-semibold !mb-2'>
                              Điều kiện thanh lý
                            </Typography>
                            <Select
                              style={{ width: 120 }}
                              onChange={(value) => {
                                const newValue = value
                                setFieldValue(
                                  'listRegistrations',
                                  values.listRegistrations.map(
                                    (detail: any) => {
                                      if (detail.registrationId === item) {
                                        return {
                                          ...detail,
                                          conditionStatus: newValue,
                                        }
                                      }
                                      return detail
                                    }
                                  )
                                )
                              }}
                              value={
                                (
                                  values.listRegistrations.find(
                                    (detail: any) =>
                                      detail.registrationId === item
                                  ) as any
                                )?.conditionStatus
                              }
                              defaultValue={'DAMAGED'}
                              options={[
                                { value: 'DAMAGED', label: 'Hư hại' },
                                { value: 'OBSOLETE', label: 'Lỗi thời' },
                                { value: 'OTHER', label: 'Khác' },
                              ]}
                            />
                          </Box>
                          <Box>
                            <Typography
                              fontWeight={600}
                              className='text-sm min-w-[180px]'
                            >
                              Ghi chú:
                            </Typography>
                            <FormControl variant='outlined' fullWidth>
                              <StyledTextField
                                margin='normal'
                                fullWidth
                                id={`note-${index}`}
                                placeholder='Nhập ghi chú'
                                className='!mt-1'
                                type='text'
                                value={
                                  (
                                    values.listRegistrations.find(
                                      (detail: any) =>
                                        detail.registrationId === item
                                    ) as any
                                  )?.note
                                }
                                onChange={(e) => {
                                  const newValue = e.target.value.replace(
                                    /^0+(?=\d)/,
                                    ''
                                  )
                                  setFieldValue(
                                    'listRegistrations',
                                    values.listRegistrations.map(
                                      (detail: any) => {
                                        if (detail.registrationId === item) {
                                          return {
                                            ...detail,
                                            note: newValue,
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
    </div>
  )
}
