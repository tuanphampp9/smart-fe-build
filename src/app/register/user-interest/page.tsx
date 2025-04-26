'use client'
import { getListAuthors } from '@/apiRequest/authorApi'
import { getListCategories } from '@/apiRequest/categoryApi'
import { getListTopics } from '@/apiRequest/topicApi'
import { addUserInterest } from '@/apiRequest/userApi'
import { AuthorType } from '@/lib/types/AuthorType'
import { CategoryType } from '@/lib/types/categoryType'
import { TopicType } from '@/lib/types/topicType'
import { handleErrorCode } from '@/lib/utils/common'
import { Checkbox } from 'antd'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'

export interface IUserInterestProps {}

export default function UserInterest(props: IUserInterestProps) {
  const [authors, setAuthors] = React.useState<AuthorType[]>([])
  const [categories, setCategories] = React.useState<CategoryType[]>([])
  const [topics, setTopics] = React.useState<TopicType[]>([])
  const [checkedValues, setCheckedValues] = React.useState<{
    authors: string[]
    categories: string[]
    topics: string[]
  }>({
    authors: [],
    categories: [],
    topics: [],
  })
  const router = useRouter()
  React.useEffect(() => {
    const fetchListAuthors = async () => {
      try {
        // call api get list authors
        const res = await getListAuthors(1, 1000, '')
        setAuthors(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }

    const fetchListCategories = async () => {
      try {
        // call api get list categories
        const res = await getListCategories(1, 1000, '')
        setCategories(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }

    const fetchListTopics = async () => {
      try {
        // call api get list topics
        const res = await getListTopics(1, 1000, '')
        setTopics(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }
    fetchListAuthors()
    fetchListCategories()
    fetchListTopics()
  }, [])

  const handleChange = (
    group: 'authors' | 'categories' | 'topics',
    vals: string[]
  ) => {
    //combined 3 group checkedValue into one array
    const newCheckedValues: any = {
      ...checkedValues,
      [group]: vals,
    }
    setCheckedValues(newCheckedValues)
  }
  const handleSubmit = async () => {
    try {
      const res = await addUserInterest({
        userId: localStorage.getItem('userId') || '',
        interests: JSON.stringify([
          ...checkedValues.authors,
          ...checkedValues.categories,
          ...checkedValues.topics,
        ]),
      })
      toast.success('Thêm sở thích thành công')
      router.push('/login')
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <div className='flex justify-center items-center w-screen mx-auto h-screen'>
      <div className='max-w-[800px] min-h-[650px] border border-gray-300 rounded-md p-5'>
        <h3>
          Chúc mừng bạn đã đăng ký tạo thẻ thư viện thành công, để chúng tôi
          hiểu hơn về bạn hãy cho chúng tôi thêm các thông tin bên dưới nha.
        </h3>
        <div className='mt-4'>
          <h3>Tác giả yêu thích</h3>
          <div>
            <Checkbox.Group
              options={authors.map((author) => ({
                label: author.fullName,
                value: author.fullName,
              }))}
              onChange={(vals) => handleChange('authors', vals)}
            />
          </div>
        </div>
        <div className='mt-4'>
          <h3>Thể loại yêu thích</h3>
          <div>
            <Checkbox.Group
              options={categories.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              onChange={(vals) => handleChange('categories', vals)}
            />
          </div>
        </div>
        <div className='mt-4'>
          <h3>Chủ đề yêu thích</h3>
          <div>
            <Checkbox.Group
              options={topics.map((topic) => ({
                label: topic.name,
                value: topic.name,
              }))}
              onChange={(vals) => handleChange('topics', vals)}
            />
          </div>
        </div>
        <div className='flex justify-center items-center mt-5'>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  )
}
