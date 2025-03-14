import * as React from 'react'
import {
  DataGrid,
  DataGridProps,
  GridCallbackDetails,
  GridColDef,
  GridEditMode,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
interface ITableCustomProps {
  rows: any[]
  columns: GridColDef[]
  bgHeader?: string
  colorTextHeader?: string
  checkboxSelection?: boolean
  txtEmpty?: string
  getRowId?: (row: any) => string | number
  hasBoldRowLast?: boolean
  height?: string
  hideHeader?: boolean
  isLoading?: boolean
  isRowSelectable?: DataGridProps['isRowSelectable']
  handleEditRow?: (updatedRow: GridRowModel) => Promise<void>
  onRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void
  editMode?: GridEditMode
  rowModesModel?: GridRowModesModel | undefined
  rowSelectionModel?: GridRowSelectionModel
  onRowModesModelChange?:
    | ((rowModesModel: GridRowModesModel, details: GridCallbackDetails) => void)
    | undefined
  onRowClick?: (params: any) => void
}
export default function TableCustom(props: ITableCustomProps) {
  const {
    rows,
    columns,
    bgHeader = '#3f51b5',
    colorTextHeader = '#fff',
    checkboxSelection = true,
    txtEmpty = 'No data',
    getRowId = (row) => row.id,
    hasBoldRowLast = false,
    height = 'auto',
    hideHeader = false,
    isLoading = false,
    isRowSelectable,
    onRowSelectionModelChange,
    handleEditRow,
    editMode = 'row',
    rowModesModel,
    onRowModesModelChange,
    rowSelectionModel,
    onRowClick,
  } = props
  const getCellClassName: DataGridProps['getCellClassName'] = ({
    row,
    field,
  }) => {
    if (row.id === 'total') {
      return 'bold'
    }
    return ''
  }
  return (
    <Box
      className='w-full'
      sx={{
        '& .bold': {
          fontWeight: 400,
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection={checkboxSelection}
        disableColumnMenu
        disableRowSelectionOnClick
        pageSizeOptions={[rows.length]}
        hideFooter
        loading={isLoading}
        getRowId={getRowId}
        editMode={editMode}
        rowModesModel={rowModesModel}
        onRowClick={onRowClick}
        isRowSelectable={isRowSelectable}
        autoHeight
        sx={{
          height,
          '.MuiDataGrid-columnHeader': {
            backgroundColor: bgHeader,
            width: '100%',
            color: colorTextHeader,
            fontSize: '16px',
            display: hideHeader ? 'none' : undefined,
          },
          '& .MuiDataGrid-row--lastVisible > .MuiDataGrid-cell': {
            fontWeight: hasBoldRowLast ? 600 : 400,
          },
          '& .MuiDataGrid-viewport': {
            overflow: 'hidden !important',
          },
          '& .MuiDataGrid-cell': {
            fontSize: '16px',
            whiteSpace: 'break-spaces',
            lineHeight: '18px',
            display: 'flex',
            alignItems: 'center',
          },
          '.MuiDataGrid-cell': {
            borderRight: `1px solid #f0f0f0`,
          },
        }}
        rowSelectionModel={rowSelectionModel}
        onRowModesModelChange={onRowModesModelChange}
        processRowUpdate={handleEditRow}
        onRowSelectionModelChange={onRowSelectionModelChange}
        getCellClassName={getCellClassName}
        getRowHeight={() => 'auto'}
        slots={{
          noRowsOverlay: () => (
            <Box className='flex items-center justify-center h-full'>
              <Typography className='!font-manrope'>{txtEmpty}</Typography>
            </Box>
          ),
        }}
      />
    </Box>
  )
}
