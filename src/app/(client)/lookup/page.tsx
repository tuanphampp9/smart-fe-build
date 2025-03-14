'use client'
import { getListPublications } from '@/apiRequest/publicationApi'
import { PublicationTypeResponse } from '@/lib/types/PublicationType'
import { convertSlugify, handleErrorCode } from '@/lib/utils/common'
import * as React from 'react'
import { Box, CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic'
import { StyledTextField } from '@/styles/commonStyle'
import debounce from 'debounce'
import SearchIcon from '@mui/icons-material/Search'
import { getListAuthors } from '@/apiRequest/authorApi'
import { AuthorType } from '@/lib/types/AuthorType'
import { getListPublishers } from '@/apiRequest/publisherApi'
import { PublisherType } from '@/lib/types/publisherType'
import { getListWarehouses } from '@/apiRequest/warehouseApi'
import { getListLanguages } from '@/apiRequest/languageApi'
import { WarehouseType } from '@/lib/types/warehouseType'
import { LanguageType } from '@/lib/types/languageType'
import AutoCompleteCustom from '@/components/AutocompleteCustom'
import { useRouter } from 'next/navigation'
import { pageInfo } from '@/lib/types/commonType'
const InfiniteScroll = dynamic(
  () => import('react-infinite-scroll-component'),
  { ssr: false }
)
export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [listPublications, setListPublications] = React.useState<
    PublicationTypeResponse[]
  >([])
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 10,
    totalItem: 0,
    totalPage: 0,
  })
  const [loading, setLoading] = React.useState<boolean>(true)
  const [hasMore, setHasMore] = React.useState<boolean>(true)
  const [authors, setAuthors] = React.useState<AuthorType[]>([])
  const [publishers, setPublishers] = React.useState<PublisherType[]>([])
  const [warehouses, setWarehouses] = React.useState<WarehouseType[]>([])
  const [languages, setLanguages] = React.useState<LanguageType[]>([])
  const [namePublication, setNamePublication] = React.useState<string>('')
  const router = useRouter()
  const [filter, setFilter] = React.useState<any>({
    nameLanguage: '',
    nameAuthor: '',
    nameWarehouse: '',
    namePublisher: '',
  })
  const fetchListPublications = async (
    page: number,
    size: number,
    filter: string,
    isFilter: boolean = false
  ) => {
    try {
      const res = await getListPublications(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      if (isFilter) {
        setListPublications(res.data.result)
      } else {
        setListPublications((prev) => [...prev, ...res.data.result])
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
    fetchListPublications(
      pageInfo.page,
      pageInfo.itemPerPage,
      buildSearchFilter(namePublication),
      true
    )
  }, [filter])
  React.useEffect(() => {
    fetchListAuthors()
    fetchListPublishers()
    fetchListWarehouses()
    fetchListLanguages()
  }, [])
  const fetchListAuthors = async () => {
    try {
      // call api get list authors
      const res = await getListAuthors(1, 1000, '')
      setAuthors(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const fetchListPublishers = async () => {
    try {
      // call api get list publishers
      const res = await getListPublishers(1, 1000, '')
      setPublishers(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const fetchListWarehouses = async () => {
    try {
      // call api get list warehouses
      const res = await getListWarehouses(1, 1000, '')
      setWarehouses(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListLanguages = async () => {
    try {
      // call api get list languages
      const res = await getListLanguages(1, 1000, '')
      setLanguages(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
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
        <div>
          {listPublications.length === 0 ? (
            <Box className='flex justify-center items-center h-80'>
              <p>Không có dữ liệu</p>
            </Box>
          ) : (
            <InfiniteScroll
              dataLength={listPublications.length}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              next={() => {
                let page = pageInfo.page + 1
                fetchListPublications(
                  page,
                  pageInfo.itemPerPage,
                  buildSearchFilter(namePublication)
                )
              }}
            >
              <div className='grid grid-cols-5 gap-4'>
                {listPublications.map((item, index) => (
                  <div
                    key={index}
                    className='w-[250px] cursor-pointer shadow-sm p-3 transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-md'
                    onClick={() => {
                      router.push(
                        `/publication/${convertSlugify(item.name)}-${item.id}.html`
                      )
                    }}
                  >
                    <img
                      src={item.bannerImg}
                      alt={item.name}
                      className='w-[175px] h-[170px] object-contain'
                    />
                    <h4 className='text-center font-semibold mt-3'>
                      {item.name}
                    </h4>
                    <h4>
                      Tác giả:{' '}
                      {item.authors
                        .map((author, index) => author.fullName)
                        .join(', ')}
                    </h4>
                    <h4>
                      Nhà xuất bản:{' '}
                      {item.publisher?.name !== null
                        ? item.publisher?.name
                        : ''}
                    </h4>
                    <h4>Ngôn ngữ: {item.language.name}</h4>
                    <h4>Kho: {item.warehouse.name}</h4>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )
    )
  }
  const handleSearchPublication = React.useCallback(
    debounce((name: string) => {
      fetchListPublications(
        1,
        pageInfo.itemPerPage,
        buildSearchFilter(name),
        true
      )
    }, 500),
    [filter]
  )
  const buildSearchFilter = (namePublication: string) => {
    let stringQuery = namePublication ? `name like '%${namePublication}%'` : ''
    let prefix = namePublication ? ' and' : ''
    if (filter.nameAuthor) {
      stringQuery += `${prefix} authors.fullName: '${filter.nameAuthor}'`
    }
    if (filter.namePublisher) {
      stringQuery += `${prefix} publisher.name: '${filter.namePublisher}'`
    }
    if (filter.nameLanguage) {
      stringQuery += `${prefix} language.name: '${filter.nameLanguage}'`
    }
    if (filter.nameWarehouse) {
      stringQuery += `${prefix} warehouse.name: '${filter.nameWarehouse}'`
    }
    return stringQuery
  }
  return (
    <div>
      <div className='flex justify-center'>
        <Box className='container flex items-center justify-between mb-5 gap-3'>
          <StyledTextField
            margin='normal'
            fullWidth
            type='text'
            placeholder='Nhập tên ấn phẩm muốn tìm kiếm'
            className='!mt-1'
            sx={{
              maxWidth: '400px',
            }}
            value={filter.namePublication}
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
          <AutoCompleteCustom
            listData={authors}
            fieldShow='fullName'
            value={
              authors.find((author) => author.fullName === filter.nameAuthor) ||
              null
            } // Set giá trị mặc định
            placeholder='Chọn tác giả'
            onChange={(event, newValue) => {
              setFilter({
                ...filter,
                nameAuthor: newValue?.fullName ?? '',
              })
            }}
          />
          <AutoCompleteCustom
            listData={publishers}
            fieldShow='name'
            value={
              publishers.find(
                (publisher) => publisher.name === filter.namePublisher
              ) || null
            } // Set giá trị mặc định
            placeholder='Chọn nhà xuất bản'
            onChange={(event, newValue) => {
              setFilter({
                ...filter,
                namePublisher: newValue?.name ?? '',
              })
            }}
          />

          <AutoCompleteCustom
            listData={languages}
            fieldShow='description'
            value={
              languages.find(
                (language) => language.name === filter.nameLanguage
              ) || null
            } // Set giá trị mặc định
            placeholder='Chọn ngôn ngữ'
            onChange={(event, newValue) => {
              setFilter({
                ...filter,
                nameLanguage: newValue?.name ?? '',
              })
            }}
          />
          <AutoCompleteCustom
            listData={warehouses}
            fieldShow='name'
            value={
              warehouses.find(
                (warehouse) => warehouse.name === filter.nameWarehouse
              ) || null
            } // Set giá trị mặc định
            placeholder='Chọn kho'
            onChange={(event, newValue) => {
              setFilter({
                ...filter,
                nameWarehouse: newValue?.name ?? '',
              })
            }}
          />
        </Box>
      </div>
      <div className='flex justify-center'>
        <div className='container'>{handleView()}</div>
      </div>
    </div>
  )
}
