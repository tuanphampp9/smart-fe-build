import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Box, MenuItem, Select, Typography } from '@mui/material'
import ReactPaginate from 'react-paginate'
import styles from '../styles/paginate.module.scss'
import { useEffect, useState } from 'react'
import { pageInfo } from '@/lib/types/commonType'

export interface IPaginationCustomProps {
  pageInfo: pageInfo
  getPaginatedTableRows: (selected: any) => Promise<any> | void
  onChangePerPage: (perPage: number) => Promise<any> | void
  lengthItem: number
}

export default function PaginationCustom(props: IPaginationCustomProps) {
  const { pageInfo, getPaginatedTableRows, onChangePerPage, lengthItem } = props
  const [hasMounted, setHasMounted] = useState<boolean>(false)
  const handlePageClick = async (e: { selected: number }) => {
    if (!hasMounted) return
    getPaginatedTableRows(e.selected + 1)
  }
  const handleChangePerPage = (e: any) => {
    const perPage = parseInt(e.target.value)
    onChangePerPage(perPage)
  }
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return (
    <Box className='flex justify-between items-center px-5'>
      <Box>
        <Typography>
          Hiển thị {lengthItem} /Tổng {pageInfo.totalItem} bản ghi
        </Typography>
      </Box>
      <Box className='flex items-center'>
        <Box className='flex items-center mr-5'>
          <Typography className='!mr-2'>Hiển thị</Typography>
          <Select
            value={pageInfo.itemPerPage}
            onChange={handleChangePerPage}
            sx={{
              '& .MuiSelect-select': {
                padding: '13px 14px',
              },
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Box>
        <ReactPaginate
          activeClassName={`${styles['item']} ${styles['active']} `}
          breakClassName={`${styles['item']} ${styles['break-me']} `}
          breakLabel={'...'}
          containerClassName={`${styles['pagination']}`}
          disabledClassName={`${styles['disabled-page']}`}
          marginPagesDisplayed={2}
          nextClassName={`${styles['item']} ${styles['next']} `}
          nextLabel={<KeyboardArrowRightIcon />}
          onPageChange={handlePageClick}
          pageCount={pageInfo.totalPage}
          forcePage={pageInfo.page - 1}
          pageClassName={`${styles['item']} ${styles[' pagination-page']}`}
          pageRangeDisplayed={2}
          previousClassName={`${styles['item']} ${styles['previous']}`}
          previousLabel={<KeyboardArrowLeftIcon />}
        />
      </Box>
    </Box>
  )
}
