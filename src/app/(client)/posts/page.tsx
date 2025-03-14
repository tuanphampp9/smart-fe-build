'use client'
import { getListPosts } from '@/apiRequest/postApi'
import { pageInfo } from '@/lib/types/commonType'
import { postType } from '@/lib/types/postType'
import { convertSlugify, handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, CircularProgress } from '@mui/material'
import debounce from 'debounce'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import SearchIcon from '@mui/icons-material/Search'
import { Select } from 'antd'

export interface IPostPageProps {}

export default function PostPage(props: IPostPageProps) {
  const [listPosts, setListPosts] = React.useState<postType[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [title, setTitle] = React.useState('')
  const [hasMore, setHasMore] = React.useState<boolean>(true)
  const [filter, setFilter] = React.useState<{
    postType: string
  }>({
    postType: '',
  })
  const router = useRouter()
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 10,
    totalItem: 0,
    totalPage: 0,
  })
  const renderType: Record<string, string> = {
    INTRODUCTION_PUBLICATION: 'Giới thiệu ấn phẩm',
    EVENTS: 'Sự kiện',
    NEWS: 'Tin tức',
  }
  const fetchListPosts = async (
    page: number,
    size: number,
    filter: string,
    isFilter: boolean = false
  ) => {
    try {
      const res = await getListPosts(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      if (isFilter) {
        setListPosts(res.data.result)
      } else {
        setListPosts((prev) => [...prev, ...res.data.result])
      }
      if (res.data.result.length < size) {
        setHasMore(false)
      }
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    // call api get list news
    fetchListPosts(1, pageInfo.itemPerPage, buildQuery(title), true)
  }, [filter])
  const buildQuery = (title: string) => {
    let query = title ? `title like '%${title}%'` : ''
    let prefix = title ? ' and' : ''
    if (filter.postType) {
      query += `${prefix} postType: '${filter.postType}'`
    }
    return query
  }
  const handleSearchPost = React.useCallback(
    debounce((title: string) => {
      fetchListPosts(
        pageInfo.page,
        pageInfo.itemPerPage,
        buildQuery(title),
        true
      )
    }, 500),
    [filter]
  )
  const handleView = () => {
    if (loading) {
      return (
        <Box className='flex justify-center items-center h-80'>
          <CircularProgress />
        </Box>
      )
    }
    return (
      typeof window !== 'undefined' && (
        <div className='container mx-auto'>
          <div className='flex items-center gap-3'>
            <StyledTextField
              margin='normal'
              fullWidth
              type='text'
              placeholder='Nhập tiêu đề'
              className='!mt-1'
              sx={{
                maxWidth: '400px',
              }}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                handleSearchPost(e.target.value)
              }}
              slotProps={{
                input: {
                  endAdornment: <SearchIcon />,
                },
              }}
            />
            <Select
              style={{ width: 300 }}
              onChange={(value) => {
                setFilter({ ...filter, postType: value })
              }}
              defaultValue={''}
              options={[
                { value: '', label: 'Tất cả' },
                {
                  value: 'INTRODUCTION_PUBLICATION',
                  label: 'Giới thiệu ấn phẩm',
                },
                { value: 'EVENTS', label: 'Sự kiện' },
                { value: 'NEWS', label: 'Tin tức' },
              ]}
            />
          </div>
          {listPosts.length === 0 ? (
            <Box className='flex justify-center items-center h-80'>
              <p>Không có dữ liệu</p>
            </Box>
          ) : (
            <InfiniteScroll
              dataLength={listPosts.length}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              next={() => {
                let page = pageInfo.page + 1
                fetchListPosts(page, pageInfo.itemPerPage, buildQuery(title))
              }}
            >
              <div className='flex items-start w-full flex-wrap gap-4'>
                {listPosts.map((item, index) => (
                  <div
                    key={index}
                    className='flex w-full gap-4 cursor-pointer shadow-sm p-3 transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-md'
                    onClick={() => {
                      router.push(
                        `/posts/${convertSlugify(item.title)}-${item.id}.html`
                      )
                    }}
                  >
                    <img
                      src={item.bannerImg}
                      alt={item.title}
                      className='w-[175px] h-[208px] object-contain'
                    />
                    <div>
                      <h4 className='mt-3'>{item.title}</h4>
                      <h4 className='mt-3'>
                        Loại tin: {renderType[item.postType]}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )
    )
  }
  return <div>{handleView()}</div>
}
