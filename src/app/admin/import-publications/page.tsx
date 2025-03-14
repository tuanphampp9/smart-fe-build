'use client'
import { getListImportReceipts } from '@/apiRequest/importReceiptApi'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { pageInfo } from '@/lib/types/commonType'
import {
  ImportReceiptDetailResponseType,
  ImportReceiptResponseType,
} from '@/lib/types/ImportReceiptType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PrintIcon from '@mui/icons-material/Print'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
export interface IImportPublicationsProps {}

export default function ImportPublications(props: IImportPublicationsProps) {
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const router = useRouter()
  const [listImportReceipts, setListImportReceipts] = React.useState<
    ImportReceiptResponseType[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const fetchListImportReceipts = async (page: number, size: number) => {
    try {
      setLoading(true)
      const res = await getListImportReceipts(page, size, '')
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListImportReceipts(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    fetchListImportReceipts(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Ngày nhập',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'createdBy',
      headerName: 'Người nhập',
      width: 220,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'id',
      headerName: 'Mã phiếu nhập',
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'publicationImported',
      headerName: 'Các ấn phẩm đã nhập',
      minWidth: 200,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div>
            {params.row.importReceiptDetails.map(
              (detail: ImportReceiptDetailResponseType, index: number) => (
                <div key={detail.id}>
                  {index + 1}. {detail.publication.name}: {detail.quantity}{' '}
                  quyển (giá: {detail.price}đ)
                </div>
              )
            )}
          </div>
        )
      },
    },
    {
      field: 'printReceipt',
      headerName: 'In phiếu',
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              // handle print receipt
              console.log('print receipt')
              window.open(
                `/print-import-receipt?importReceiptId=${params.row.id}`,
                '_blank'
              )
            }}
          >
            <ReceiptIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'printPublication',
      headerName: 'In mã ấn phẩm',
      minWidth: 200,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              // handle print publication
              console.log('print publication')
              window.open(
                `/print-code-publication?importReceiptId=${params.row.id}`,
                '_blank'
              )
            }}
          >
            <PrintIcon />
          </IconButton>
        )
      },
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
                `/admin/import-publications/detail?importReceiptId=${params.row.id}`
              )
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
  ]

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListImportReceipts(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListImportReceipts(1, perPage)
  }
  return (
    <div>
      <div className='flex justify-end my-4'>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/import-publications/detail')
          }}
        >
          Thêm phiếu nhập
        </Button>
      </div>
      <Box>
        <TableCustom
          rows={listImportReceipts}
          columns={columns}
          checkboxSelection={false}
          isLoading={loading}
        />
        <PaginationCustom
          pageInfo={pageInfo}
          getPaginatedTableRows={getPaginatedTableRows}
          onChangePerPage={handleChangePerPage}
          lengthItem={listImportReceipts.length}
        />
      </Box>
    </div>
  )
}
