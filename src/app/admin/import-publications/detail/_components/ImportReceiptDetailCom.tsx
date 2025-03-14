'use client'
import {
  createImportReceipt,
  getImportReceipt,
  updateImportReceipt,
} from '@/apiRequest/importReceiptApi'
import { ImportReceiptDetailResponseType } from '@/lib/types/ImportReceiptType'
import { handleErrorCode } from '@/lib/utils/common'
import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { StyledTextField } from '@/styles/commonStyle'
import LoadingButton from '@mui/lab/LoadingButton'
import { PublicationTypeResponse } from '@/lib/types/PublicationType'
import { getListPublications } from '@/apiRequest/publicationApi'
import { GridColDef } from '@mui/x-data-grid'
import SearchIcon from '@mui/icons-material/Search'
import TableCustom from '@/components/TableCustom'
import debounce from 'debounce'
export interface IImportReceiptDetailComProps {}

export default function ImportReceiptDetailCom(
  props: IImportReceiptDetailComProps
) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const importReceiptId = params.get('importReceiptId') ?? ''
  const router = useRouter()
  const [listPublications, setListPublications] = React.useState<
    PublicationTypeResponse[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [namePublication, setNamePublication] = React.useState<string>('')
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false)
  const [listSelectedPublications, setListSelectedPublications] =
    React.useState<PublicationTypeResponse[]>([])
  const formik = useFormik({
    initialValues: {
      inputSource: '',
      deliveryPerson: '',
      deliveryRepresentative: '',
      note: '',
      importReceiptDetailReqs: [],
    },
    validationSchema: Yup.object().shape({
      inputSource: Yup.string().required('Nguồn nhập không được để trống'),
      deliveryPerson: Yup.string().required('Người giao không được để trống'),
      deliveryRepresentative: Yup.string().required(
        'Đại diện bên giao không được để trống'
      ),
      importReceiptDetailReqs: Yup.array().of(
        Yup.object()
          .shape({
            price: Yup.number()
              .required('Giá không được để trống')
              .min(1, 'Giá phải lớn hơn 0'),
            quantity: Yup.number()
              .required('Số lượng không được để trống')
              .min(1, 'Số lượng phải lớn hơn 0'),
          })
          .required('Chưa chọn ấn phẩm')
      ),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        setLoadingSubmit(true)
        if (importReceiptId) {
          // call api update reader
          const res = await updateImportReceipt(importReceiptId, values)
          console.log(res)
          toast.success('Cập nhật phiếu nhập thành công')
        } else {
          // call api create reader
          const res = await createImportReceipt(values)
          console.log(res)
          toast.success('Thêm phiếu nhập thành công')
          formik.resetForm()
          setListSelectedPublications([])
        }
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoadingSubmit(false)
      }
    },
  })

  const fetchListPublications = async (
    page: number,
    size: number,
    namePublication: string = ''
  ) => {
    try {
      setLoading(true)
      const res = await getListPublications(
        page,
        size,
        `name like '%${namePublication}%'`
      )
      console.log(res)
      setListPublications(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    // call api get reader by id
    const fetchImportReceiptById = async () => {
      try {
        const res = await getImportReceipt(importReceiptId)
        console.log(res)
        formik.setValues({
          inputSource: res.data.inputSource,
          deliveryPerson: res.data.deliveryPerson,
          deliveryRepresentative: res.data.deliveryRepresentative,
          note: res.data.note,
          importReceiptDetailReqs: res.data.importReceiptDetails.map(
            (detail: ImportReceiptDetailResponseType) => ({
              price: detail.price,
              quantity: detail.quantity,
              publicationId: detail.publication.id,
            })
          ),
        })
        setListSelectedPublications(
          res.data.importReceiptDetails.map(
            (detail: ImportReceiptDetailResponseType) => detail.publication
          )
        )
      } catch (error: any) {
        console.log(error)
        handleErrorCode(error)
      }
    }
    fetchListPublications(1, 10000)
    if (importReceiptId) {
      fetchImportReceiptById()
    }
  }, [importReceiptId])

  const columns: GridColDef[] = [
    {
      field: 'bannerImg',
      headerName: 'Ảnh bìa',
      width: 100,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div className='p-4'>
            <img
              src={params.value}
              alt={params.row.name}
              style={{ width: '100px' }}
            />
          </div>
        )
      },
    },
    {
      field: 'name',
      headerName: 'Tên ấn phẩm',
      flex: 1,
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'publisher',
      headerName: 'Nhà xuất bản',
      flex: 1,
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.value?.name
      },
    },
    {
      field: 'option',
      headerName: 'Lựa chọn',
      minWidth: 100,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Checkbox
            checked={listSelectedPublications.some(
              (publication) => publication.id === params.row.id
            )}
            onChange={(e) => {
              console.log('e', e.target.checked)
              if (e.target.checked) {
                formik.setFieldValue('importReceiptDetailReqs', [
                  ...formik.values.importReceiptDetailReqs,
                  {
                    price: '',
                    quantity: '',
                    publicationId: params.row.id,
                  },
                ])
                //add publication to list selected
                setListSelectedPublications([
                  ...listSelectedPublications,
                  params.row,
                ])
              } else {
                formik.setFieldValue(
                  'importReceiptDetailReqs',
                  formik.values.importReceiptDetailReqs.filter(
                    (detail: any) => detail.publicationId !== params.row.id
                  )
                )
                //remove publication from list selected
                setListSelectedPublications(
                  listSelectedPublications.filter(
                    (publication) => publication.id !== params.row.id
                  )
                )
              }
            }}
          />
        )
      },
    },
  ]
  const handleSearchPublication = React.useCallback(
    debounce((name: string) => {
      fetchListPublications(1, 10000, name)
    }, 500),
    []
  )
  return (
    <div>
      <IconButton
        onClick={() => {
          router.back()
        }}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
      <Box component='form' onSubmit={formik.handleSubmit} className='w-full'>
        <Box className='flex gap-4 w-full'>
          <Box className='w-1/2'>
            <Box>
              <Typography fontWeight={600} className='text-sm !text-red-800'>
                Thông tin phiếu nhập:
              </Typography>
              <Box className='flex items-start gap-3 mt-4'>
                <Typography fontWeight={600} className='text-sm min-w-[180px]'>
                  Đại iện bên giao:
                </Typography>
                <FormControl variant='outlined' fullWidth>
                  <StyledTextField
                    margin='normal'
                    fullWidth
                    id='deliveryRepresentative'
                    placeholder='Nhập họ tên đại diện bên giao'
                    name='deliveryRepresentative'
                    className='!mt-1'
                    value={formik.values.deliveryRepresentative}
                    onChange={formik.handleChange}
                    autoFocus
                    error={
                      formik.touched.deliveryRepresentative &&
                      Boolean(formik.errors.deliveryRepresentative)
                    }
                    helperText={
                      formik.touched.deliveryRepresentative &&
                      formik.errors.deliveryRepresentative
                    }
                  />
                </FormControl>
              </Box>
              <Box className='flex items-start gap-3 mt-4'>
                <Typography fontWeight={600} className='text-sm min-w-[180px]'>
                  Người giao:
                </Typography>
                <FormControl variant='outlined' fullWidth>
                  <StyledTextField
                    margin='normal'
                    fullWidth
                    id='deliveryPerson'
                    placeholder='Nhập họ tên người giao'
                    name='deliveryPerson'
                    className='!mt-1'
                    value={formik.values.deliveryPerson}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.deliveryPerson &&
                      Boolean(formik.errors.deliveryPerson)
                    }
                    helperText={
                      formik.touched.deliveryPerson &&
                      formik.errors.deliveryPerson
                    }
                  />
                </FormControl>
              </Box>
              <Box className='flex items-start gap-3 mt-4'>
                <Typography fontWeight={600} className='text-sm min-w-[180px]'>
                  Nguồn nhập:
                </Typography>
                <FormControl variant='outlined' fullWidth>
                  <StyledTextField
                    margin='normal'
                    fullWidth
                    id='inputSource'
                    placeholder='Nhập nguồn nhập'
                    name='inputSource'
                    className='!mt-1'
                    value={formik.values.inputSource}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.inputSource &&
                      Boolean(formik.errors.inputSource)
                    }
                    helperText={
                      formik.touched.inputSource && formik.errors.inputSource
                    }
                  />
                </FormControl>
              </Box>
              <Box className='flex items-start gap-3 mt-4'>
                <Typography fontWeight={600} className='text-sm min-w-[180px]'>
                  Ghi chú:
                </Typography>
                <FormControl variant='outlined' fullWidth>
                  <StyledTextField
                    margin='normal'
                    fullWidth
                    id='note'
                    placeholder='Nhập ghi chú'
                    name='note'
                    className='!mt-1'
                    multiline
                    rows={4}
                    value={formik.values.note}
                    onChange={formik.handleChange}
                    error={formik.touched.note && Boolean(formik.errors.note)}
                    helperText={formik.touched.note && formik.errors.note}
                  />
                </FormControl>
              </Box>
              <Box>
                {
                  // list selected publications
                  listSelectedPublications.length > 0 && (
                    <Box>
                      <Typography
                        fontWeight={600}
                        className='text-sm !text-red-800'
                      >
                        Chi tiết phiếu nhập:
                      </Typography>
                      <Box>
                        {listSelectedPublications.map((publication) => (
                          <Box key={publication.id} className='flex gap-3'>
                            <Box className='flex-1'>
                              <Typography className='!font-semibold'>
                                Tên ấn phẩm
                              </Typography>
                              <Typography>{publication.name}</Typography>
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
                                  id={`price-${publication.id}`}
                                  placeholder='Nhập giá'
                                  className='!mt-1'
                                  type='number'
                                  value={
                                    (
                                      formik.values.importReceiptDetailReqs.find(
                                        (detail: any) =>
                                          detail.publicationId ===
                                          publication.id
                                      ) as any
                                    )?.price
                                  }
                                  onChange={(e) => {
                                    const newValue = e.target.value.replace(
                                      /^0+(?=\d)/,
                                      ''
                                    )
                                    formik.setFieldValue(
                                      'importReceiptDetailReqs',
                                      formik.values.importReceiptDetailReqs.map(
                                        (detail: any) => {
                                          if (
                                            detail.publicationId ===
                                            publication.id
                                          ) {
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
                              <Typography
                                fontWeight={600}
                                className='text-sm min-w-[180px]'
                              >
                                Số lượng:
                              </Typography>
                              <FormControl variant='outlined' fullWidth>
                                <StyledTextField
                                  margin='normal'
                                  fullWidth
                                  id={`price-${publication.id}`}
                                  placeholder='Nhập số lượng'
                                  className='!mt-1'
                                  type='number'
                                  value={
                                    (
                                      formik.values.importReceiptDetailReqs.find(
                                        (detail: any) =>
                                          detail.publicationId ===
                                          publication.id
                                      ) as any
                                    )?.quantity
                                  }
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      'importReceiptDetailReqs',
                                      formik.values.importReceiptDetailReqs.map(
                                        (detail: any) => {
                                          if (
                                            detail.publicationId ===
                                            publication.id
                                          ) {
                                            return {
                                              ...detail,
                                              quantity: Number(e.target.value),
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
                    </Box>
                  )
                }
              </Box>
            </Box>
          </Box>
          <Box className='w-1/2'>
            {/* list publications */}
            <StyledTextField
              margin='normal'
              fullWidth
              type='text'
              placeholder='Nhập tên ấn phẩm muốn tìm kiếm'
              className='!mt-1'
              sx={{
                maxWidth: '400px',
              }}
              value={namePublication}
              onChange={(e) => {
                setNamePublication(e.target.value)
                handleSearchPublication(e.target.value)
              }}
              slotProps={{
                input: {
                  endAdornment: <SearchIcon />,
                },
              }}
            />
            <Box className='h-[400px] overflow-y-auto'>
              <TableCustom
                rows={listPublications}
                columns={columns}
                checkboxSelection={false}
                isLoading={loading}
              />
            </Box>
          </Box>
        </Box>

        <LoadingButton
          type='submit'
          fullWidth
          variant='contained'
          color={importReceiptId ? 'warning' : 'primary'}
          loading={loadingSubmit}
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
              {importReceiptId ? 'Cập nhật' : 'Thêm mới phiếu nhập'}
            </Typography>
          )}
        </LoadingButton>
      </Box>
    </div>
  )
}
