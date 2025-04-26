'use client'
import { getListAuthors } from '@/apiRequest/authorApi'
import { getListCategories } from '@/apiRequest/categoryApi'
import { getListTopics } from '@/apiRequest/topicApi'
import { addUserInterest } from '@/apiRequest/userApi'
import { AuthorType } from '@/lib/types/AuthorType'
import { CategoryType } from '@/lib/types/categoryType'
import { TopicType } from '@/lib/types/topicType'
import { handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { Box, Typography } from '@mui/material'
import { Checkbox } from 'antd'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export interface IUserInterestUpdateProps {}

export default function UserInterestUpdate(props: IUserInterestUpdateProps) {
  const [authors, setAuthors] = React.useState<AuthorType[]>([])
  const [categories, setCategories] = React.useState<CategoryType[]>([])
  const [topics, setTopics] = React.useState<TopicType[]>([])
  const { user } = useSelector((state: RootState) => state.user)

  const [checkedValues, setCheckedValues] = React.useState<{
    authors: string[]
    categories: string[]
    topics: string[]
  }>({
    authors: [],
    categories: [],
    topics: [],
  })
  React.useEffect(() => {
    if (!user) return
    const interests = user?.interests ? JSON.parse(user.interests || '[]') : []
    const fetchListAuthors = async () => {
      try {
        // call api get list authors
        const res = await getListAuthors(1, 1000, '')
        //add user interest to authors
        interests.forEach((interest: string) => {
          if (
            res.data.result.find(
              (author: AuthorType) => author.fullName === interest
            )
          ) {
            setCheckedValues((prev) => ({
              ...prev,
              authors: [...prev.authors, interest],
            }))
          }
        })
        setAuthors(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }

    const fetchListCategories = async () => {
      try {
        // call api get list categories
        const res = await getListCategories(1, 1000, '')
        // add user interest to categories
        interests.forEach((interest: string) => {
          if (
            res.data.result.find(
              (category: CategoryType) => category.name === interest
            )
          ) {
            setCheckedValues((prev) => ({
              ...prev,
              categories: [...prev.categories, interest],
            }))
          }
        })
        setCategories(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }

    const fetchListTopics = async () => {
      try {
        // call api get list topics
        const res = await getListTopics(1, 1000, '')
        // add user interest to topics
        interests.forEach((interest: string) => {
          if (
            res.data.result.find((topic: TopicType) => topic.name === interest)
          ) {
            setCheckedValues((prev) => ({
              ...prev,
              topics: [...prev.topics, interest],
            }))
          }
        })
        setTopics(res.data.result)
      } catch (error: any) {
        handleErrorCode(error)
      }
    }
    fetchListAuthors()
    fetchListCategories()
    fetchListTopics()
  }, [user])
  console.log('checkedValues', checkedValues)

  // console.log('user', JSON.parse(user?.interests))

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
        userId: user.id || '',
        interests: JSON.stringify([
          ...checkedValues.authors,
          ...checkedValues.categories,
          ...checkedValues.topics,
        ]),
      })
      toast.success('Cập nhật sở thích thành công')
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <Box>
      <Typography variant='h5' className='border-b-4 border-b-red-800 w-fit'>
        Sở thích
      </Typography>
      <Box>
        <div className='mt-4'>
          <h3>Tác giả yêu thích</h3>
          <div>
            <Checkbox.Group
              options={authors.map((author) => ({
                label: author.fullName,
                value: author.fullName,
              }))}
              value={checkedValues.authors}
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
              value={checkedValues.categories}
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
              value={checkedValues.topics}
              onChange={(vals) => handleChange('topics', vals)}
            />
          </div>
        </div>
        <div className='flex justify-center items-center mt-5'>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Cập nhật sở thích
          </button>
        </div>
      </Box>
    </Box>
  )
}
