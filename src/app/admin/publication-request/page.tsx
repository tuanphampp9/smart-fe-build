'use client'
import {
  deletePublicationRequest,
  getListPublicationRequestsForAdmin,
  responsePublicationRequest,
} from '@/apiRequest/publicationRequest'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { pageInfo } from '@/lib/types/commonType'
import { PublicationRequestType } from '@/lib/types/PublicationRequestType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Chip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Select } from 'antd'
import debounce from 'debounce'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import DialogCustom from '@/components/DialogCustom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
export interface IPublicationRequestAdminProps {}

export default function PublicationRequestAdmin(
  props: IPublicationRequestAdminProps
) {
  const [listPublicationRequest, setListPublicationRequest] = useState<
    PublicationRequestType[]
  >([])
  const [openModalResponse, setOpenModalResponse] = useState(false)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageInfo, setPageInfo] = useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const [publicationRequestSelected, setPublicationRequestSelected] =
    useState<PublicationRequestType | null>(null)

  const formik = useFormik({
    initialValues: {
      status: 'ACCEPTED',
      response: '',
    },
    validationSchema: Yup.object().shape({
      response: Yup.string().required('Phản hồi không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        const res = await responsePublicationRequest(
          publicationRequestSelected?.id ?? 0,
          values
        )
        toast.success('Phản hồi yêu cầu thành công')
        formik.resetForm()
        setOpenModalResponse(false)
        fetchListPublicationRequests(pageInfo.page, pageInfo.itemPerPage)
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })
  const renderLabelStatus: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    ACCEPTED: 'Đã duyệt/chờ bổ sung',
    REJECTED: 'Từ chối',
    ADDED: 'Đã bổ sung',
  }
  const fetchListPublicationRequests = async (
    page: number,
    size: number,
    name: string = ''
  ) => {
    try {
      let filter = ''
      let prefix = name ? ' and' : ''
      if (name) {
        filter = `name like '%${name}%'`
      }
      if (status) {
        filter += `${prefix} status: '${status}'`
      }
      setLoading(true)
      const res = await getListPublicationRequestsForAdmin(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListPublicationRequest(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Ngày đăng ký',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'extraInfo',
      headerName: 'Thông tin tài liệu',
      minWidth: 420,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div>
            <div className='flex'>
              <Typography className='!font-semibold !min-w-[110px]'>
                Nhan đề:
              </Typography>
              <Typography>{params.row.name}</Typography>
            </div>
            <div className='flex'>
              <Typography className='!font-semibold !min-w-[110px]'>
                Tác giả:
              </Typography>
              <Typography>{params.row.author}</Typography>
            </div>
            <div className='flex'>
              <Typography className='!font-semibold !min-w-[110px]'>
                Nhà xuât bản:
              </Typography>
              <Typography>{params.row.publisher}</Typography>
            </div>
            <div className='flex'>
              <Typography className='!font-semibold !min-w-[110px]'>
                Năm xuât bản:
              </Typography>
              <Typography>{params.row.yearOfPublication}</Typography>
            </div>
          </div>
        )
      },
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      flex: 1,
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Chip
            label={renderLabelStatus[params.value as string]}
            variant='filled'
            color={'primary'}
          />
        )
      },
    },
    {
      field: 'response',
      headerName: 'Phản hồi',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'PENDING')
          return (
            <PanToolAltIcon
              className='cursor-pointer'
              onClick={() => {
                setPublicationRequestSelected(params.row)
                setOpenModalResponse(true)
              }}
            />
          )
        return params.row.response
      },
    },
  ]

  useEffect(() => {
    fetchListPublicationRequests(1, pageInfo.itemPerPage)
  }, [status])
  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListPublicationRequests(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListPublicationRequests(1, perPage)
  }
  const handleSearchPublicationRequest = useCallback(
    debounce((name: string) => {
      fetchListPublicationRequests(1, pageInfo.itemPerPage, name)
    }, 500),
    [status]
  )
  return (
    <div>
      <div className='flex justify-between my-4'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập tên ấn phẩm muốn tìm kiếm'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            handleSearchPublicationRequest(e.target.value)
          }}
        />
        <Select
          style={{ width: 120 }}
          value={status}
          onChange={(value) => setStatus(value)}
          defaultValue={''}
          options={[
            { value: '', label: 'Tất cả' },
            { value: 'PENDING', label: 'Chờ xử lý' },
            { value: 'ACCEPTED', label: 'Đã duyệt/chờ bổ sung' },
            { value: 'REJECTED', label: 'Từ chối' },
            { value: 'ADDED', label: 'Đã bổ sung' },
          ]}
        />
      </div>

      <TableCustom
        rows={listPublicationRequest}
        columns={columns}
        checkboxSelection={false}
        isLoading={loading}
      />
      <PaginationCustom
        pageInfo={pageInfo}
        getPaginatedTableRows={getPaginatedTableRows}
        onChangePerPage={handleChangePerPage}
        lengthItem={listPublicationRequest.length}
      />
      <DialogCustom
        title={'Phản hồi yêu cầu ấn phẩm'}
        isModalOpen={openModalResponse}
        setIsModalOpen={setOpenModalResponse}
        handleLogicCancel={() => console.log('cancel')}
        width={800}
        children={
          <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <Box className='flex items-center gap-2'>
              <Typography className='!font-semibold !min-w-[120px]'>
                Trạng thái:{' '}
              </Typography>
              <Select
                style={{ width: 240 }}
                value={formik.values.status}
                onChange={(value) => formik.setFieldValue('status', value)}
                options={[
                  { value: 'PENDING', label: 'Chờ xử lý', disabled: true },
                  { value: 'ACCEPTED', label: 'Đã duyệt/chờ bổ sung' },
                  { value: 'REJECTED', label: 'Từ chối' },
                  { value: 'ADDED', label: 'Đã bổ sung' },
                ]}
              />
            </Box>
            <Box className='flex items-center gap-2 mt-5'>
              <Typography className='!font-semibold !min-w-[120px]'>
                Phản hồi:{' '}
              </Typography>
              <StyledTextField
                margin='normal'
                fullWidth
                id='response'
                placeholder='Nhập phản hồi'
                name='response'
                className='!mt-1'
                rows={4}
                multiline
                value={formik.values.response}
                onChange={formik.handleChange}
                autoFocus
                error={
                  formik.touched.response && Boolean(formik.errors.response)
                }
                helperText={formik.touched.response && formik.errors.response}
              />
            </Box>
            <Box className='flex justify-end mt-4'>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color={'info'}
              >
                Phản hồi
              </Button>
            </Box>
          </Box>
        }
      />
    </div>
  )
}
