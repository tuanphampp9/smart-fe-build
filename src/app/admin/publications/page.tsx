'use client'
import {
  deletePublication,
  getListPublications,
} from '@/apiRequest/publicationApi'
import { pageInfo } from '@/lib/types/commonType'
import { handleErrorCode } from '@/lib/utils/common'
import { Box, Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { PublicationTypeResponse } from '@/lib/types/PublicationType'
import { StyledTextField } from '@/styles/commonStyle'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import { Popconfirm } from 'antd'
import { toast } from 'react-toastify'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
export interface IPublicationsProps {}

export default function Publications(props: IPublicationsProps) {
  const router = useRouter()
  const [namePublication, setNamePublication] = React.useState<string>('')
  const [listPublications, setListPublications] = React.useState<
    PublicationTypeResponse[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
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
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListPublications(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListPublications(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListPublications(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListPublications(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'bannerImg',
      headerName: 'Ảnh bìa',
      width: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div className='p-4'>
            <img
              src={params.value}
              alt={params.row.name}
              style={{ width: '150px' }}
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
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 300,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'commonInfo',
      headerName: 'Thông tin chung',
      headerAlign: 'left',
      align: 'left',
      minWidth: 300,
      renderCell: (params) => {
        return (
          <div>
            <div>Nơi xuất bản: {params.row.placeOfPublication}</div>
            <div>Năm xuất bản: {params.row.yearOfPublication}</div>
            <div>Số trang: {params.row.pageCount} trang</div>
            <div>Kích thước: {params.row.size}</div>
            <div>Phân loại: {params.row.classify}</div>
          </div>
        )
      },
    },
    {
      field: 'detailInfo',
      headerName: 'Thông tin chi tiết',
      headerAlign: 'left',
      align: 'left',
      minWidth: 400,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <div>
              Tác giả:{' '}
              {params.row.authors !== null
                ? params.row.authors
                    ?.map((author: any) => author.fullName)
                    .join(', ')
                : ''}
            </div>
            <div>
              Nhà xuất bản:{' '}
              {params.row.publisher !== null ? params.row.publisher.name : ''}
            </div>
            <div>
              Thể loại:{' '}
              {params.row.categories !== null
                ? params.row.categories
                    ?.map((category: any) => category.name)
                    .join(', ')
                : ''}
            </div>
            <div>
              Ngôn ngữ:{' '}
              {params.row.language !== null
                ? params.row.language?.description
                : ''}
            </div>
            <div>
              Kho:{' '}
              {params.row.warehouse !== null ? params.row.warehouse?.name : ''}
            </div>
            <div>
              Chủ đề:{' '}
              {params.row.topics !== null
                ? params.row.topics?.map((topic: any) => topic.name).join(', ')
                : ''}
            </div>
          </div>
        )
      },
    },
    {
      field: 'isbn',
      headerName: 'ISBN',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
    },
    {
      field: 'issn',
      headerName: 'ISSN',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
    },
    {
      field: 'totalQuantity',
      headerName: 'Tổng số lượng',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
    },
    {
      field: 'edit',
      headerName: 'Sửa',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              router.push(
                `/admin/publications/detail?publicationId=${params.row.id}`
              )
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <Popconfirm
            title='Thông báo'
            description={`Bạn có chắc chắn muốn xóa ấn phẩm: ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeletePublication(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeletePublication = async (id: string) => {
    try {
      // call api delete publication
      const res = await deletePublication(id)
      // show message delete success
      toast.success('Xóa ấn phẩm thành công')
      // fetch list publications
      fetchListPublications(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <div>
      <div className='flex justify-between items-center'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập tên ấn phẩm muốn tìm kiếm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListPublications(1, pageInfo.itemPerPage, namePublication)
            }
          }}
          sx={{
            maxWidth: '400px',
          }}
          value={namePublication}
          onChange={(e) => setNamePublication(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <SearchIcon />,
            },
          }}
        />
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/publications/detail')
          }}
        >
          Thêm ấn phẩm
        </Button>
      </div>
      <div>
        <Box>
          <TableCustom
            rows={listPublications}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listPublications.length}
          />
        </Box>
      </div>
    </div>
  )
}
