'use client'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { Button, Chip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Popconfirm, Select } from 'antd'
import { useSelector } from 'react-redux'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  deletePublicationRequest,
  getListPublicationRequestsForClient,
} from '@/apiRequest/publicationRequest'
import { toast } from 'react-toastify'
import TableCustom from '@/components/TableCustom'
import { PublicationRequestType } from '@/lib/types/PublicationRequestType'
import { useCallback, useEffect, useState } from 'react'
import { pageInfo } from '@/lib/types/commonType'
import PaginationCustom from '@/components/PaginationCustom'
import { StyledTextField } from '@/styles/commonStyle'
import debounce from 'debounce'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'
export interface IPublicationRequestProps {}

export default function PublicationRequest(props: IPublicationRequestProps) {
  const { user } = useSelector((state: RootState) => state.user)
  const [listPublicationRequest, setListPublicationRequest] = useState<
    PublicationRequestType[]
  >([])
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
      const res = await getListPublicationRequestsForClient(
        user.id ?? '',
        page,
        size,
        filter
      )
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
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'PENDING')
          return (
            <Popconfirm
              title='Thông báo'
              description={`Bạn có chắc chắn muốn xóa yêu cầu bổ sung tài liệu này không?`}
              okText='Có'
              cancelText='Không'
              overlayStyle={{
                maxWidth: '300px',
              }}
              onConfirm={() => handleDeletePublicationRequest(params.row.id)}
            >
              <DeleteOutlineIcon className='cursor-pointer' color='error' />
            </Popconfirm>
          )
      },
    },
  ]

  const handleDeletePublicationRequest = async (id: string) => {
    try {
      const res = await deletePublicationRequest(id)
      toast.success('Xóa yêu cầu bổ sung tài liệu thành công')
      fetchListPublicationRequests(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      console.log(error.response)
      handleErrorCode(error)
    }
  }
  useEffect(() => {
    if (user.id) fetchListPublicationRequests(1, pageInfo.itemPerPage)
  }, [user.id, status])
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
      <Typography variant='h5' className='border-b-4 border-b-red-800 w-fit'>
        Đăng ký yêu cầu bổ sung tài liệu
      </Typography>
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
      <div className='flex justify-end my-4'>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/my-account/publication-request/register')
          }}
        >
          Thêm yêu cầu bổ sung tài liệu
        </Button>
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
    </div>
  )
}
