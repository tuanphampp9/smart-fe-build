'use client'
import {
  getListPublicationSuggestions,
  getPublication,
} from '@/apiRequest/publicationApi'
import { addPubToCart, createRating, getRating } from '@/apiRequest/userApi'
import TabPanelCustom from '@/components/TabPanelCustom'
import { PublicationTypeResponse } from '@/lib/types/PublicationType'
import { convertSlugify, handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { Box, CircularProgress, Rating, Typography } from '@mui/material'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { addPublicationCart } from '@/store/slices/userSlice'
import { useRouter } from 'next/navigation'

export interface IRenderDetailProps {
  publicationId: string
}

export default function RenderDetail(props: IRenderDetailProps) {
  const dispatch = useDispatch()
  const { publicationId } = props
  const [publication, setPublication] = React.useState<PublicationTypeResponse>(
    {} as PublicationTypeResponse
  )
  const { user } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = React.useState<boolean>(true)
  // const [rating, setRating] = React.useState<number | null>(null)
  const [listSuggestions, setListSuggestions] = React.useState<
    PublicationTypeResponse[]
  >([])
  const router = useRouter()
  const fetchPublication = async () => {
    try {
      const res = await getPublication(publicationId)
      setPublication(res.data)
      fetchListSuggestions()
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  const fetchListSuggestions = async () => {
    try {
      const res = await getListPublicationSuggestions(
        publicationId,
        user.id ?? ''
      )
      console.log(res)
      setListSuggestions(res.data)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  React.useEffect(() => {
    if (publicationId && user.id) {
      fetchPublication()
    }
  }, [publicationId, user.id])
  const listTabs = [
    {
      label: 'Thông tin cơ bản',
      value: '1',
      content: (
        <div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Tên ấn phẩm: </h4>
            <span>{publication?.name}</span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Các tác giả: </h4>
            <span>
              {publication?.authors !== null
                ? publication.authors
                    ?.map((author) => author.fullName)
                    .join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Nhà xuất bản: </h4>
            <span>
              {publication?.publisher !== null
                ? publication.publisher?.name
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>ISBN: </h4>
            <span>{publication?.isbn !== null ? publication.isbn : 'N/A'}</span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>ISSN: </h4>
            <span>{publication?.issn !== null ? publication.issn : 'N/A'}</span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Ký hiệu phân loại: </h4>
            <span>
              {publication?.classify !== null ? publication.classify : 'N/A'}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Thông tin chi tiết',
      value: '2',
      content: (
        <div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Ngôn ngữ: </h4>
            <span>
              {publication?.language !== null
                ? publication.language?.description
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Kho: </h4>
            <span>
              {publication?.warehouse !== null
                ? publication.warehouse?.name
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Nơi xuất bản: </h4>
            <span>
              {publication?.placeOfPublication !== null
                ? publication?.placeOfPublication
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Năm xuất bản: </h4>
            <span>
              {publication?.yearOfPublication !== null
                ? publication?.yearOfPublication
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Thể loại: </h4>
            <span>
              {publication?.categories !== null
                ? publication.categories
                    ?.map((category) => category.name)
                    .join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Chủ đề: </h4>
            <span>
              {publication?.topics !== null
                ? publication.topics?.map((topic) => topic.name).join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Kích thước: </h4>
            <span>{publication?.size !== null ? publication.size : 'N/A'}</span>
          </div>
          <div className='flex gap-3'>
            <h4 className='font-semibold'>Số trang: </h4>
            <span>
              {publication?.pageCount !== null ? publication?.pageCount : 'N/A'}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Mô tả',
      value: '3',
      content: <div>{publication?.description}</div>,
    },
  ]

  const fetchRatingByUser = async () => {
    try {
      const res = await getRating(user.id ?? '', publicationId)
      if (res.data.data === 0) {
        // setRating(null)
        return
      }
      // setRating(res.data.data)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  // React.useEffect(() => {
  //   if (user.id) fetchRatingByUser()
  // }, [user.id])
  const handleAddPubToCart = async () => {
    try {
      if (user.cardRead.locked) {
        toast.warning(
          'Thẻ của bạn đã bị khoá! Vui lòng liên hệ thủ thư để mở khoá'
        )
        return
      }
      const res = await addPubToCart({
        userId: user.id ?? '',
        publicationId: parseInt(publicationId),
        quantity: 1,
      })
      console.log(res)
      toast.success('Thêm ấn phẩm vào giỏ hàng thành công')
      dispatch(addPublicationCart(res.data.data))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <div>
      <div className='flex justify-center'>
        <div className='container mt-5'>
          {loading ? (
            <div className='flex justify-center items-center h-screen'>
              <div className='flex justify-center items-center'>
                <CircularProgress />
              </div>
            </div>
          ) : (
            <div>
              <Box className='border-b-4 border-red-800'>
                <Typography
                  variant='h5'
                  fontWeight={500}
                  className='px-4 py-3 bg-red-800 w-fit !text-white rounded-tl-md rounded-tr-md'
                >
                  Thông tin ấn phẩm
                </Typography>
              </Box>
              <div className='flex items-start gap-3'>
                <div>
                  <img
                    src={publication.bannerImg}
                    alt={publication.name}
                    className='w-[200px]'
                  />
                  {/* <RatingCustom
                  value={rating}
                  onchange={async (newValue) => {
                    await handleCreateRating(newValue)
                  }}
                /> */}
                  <div
                    className='p-2 bg-red-800 text-white rounded-md cursor-pointer flex justify-center mt-4'
                    onClick={handleAddPubToCart}
                  >
                    Đặt mượn <AddShoppingCartIcon />
                  </div>
                </div>
                <TabPanelCustom listTabs={listTabs} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='container mt-10'>
          <Box className='border-b-4 border-red-800'>
            <Typography
              variant='h5'
              fontWeight={500}
              className='px-4 py-3 bg-red-800 w-fit !text-white rounded-tl-md rounded-tr-md'
            >
              Những ấn phẩm đề xuất
            </Typography>
          </Box>
          <div>
            {listSuggestions.length > 0 ? (
              <div className='grid grid-cols-5 gap-4'>
                {listSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className='w-[250px] cursor-pointer shadow-sm p-3 transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-md'
                    onClick={() => {
                      window.open(
                        `/publication/${convertSlugify(item.name)}-${item.id}.html`,
                        '_blank'
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
            ) : (
              <Box className='w-full text-center mt-5'>
                <Typography fontWeight={500} variant='h6'>
                  Không có ấn phẩm đề xuất
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
