'use client'
import { createTopic, updateTopic } from '@/apiRequest/topicApi'
import { handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_TOPICS } from '@/store/action-saga/common'
import { setTopicSelected } from '@/store/slices/topicSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import UndoIcon from '@mui/icons-material/Undo'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

export interface IFormTopicProps {}

export default function FormTopic(props: IFormTopicProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.topic.pageInfo)
  const topicSelected = useSelector((state: RootState) => state.topic.topic)
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên chủ đề không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (topicSelected) {
          //update topic
          const res = await updateTopic({ id: topicSelected.id, ...values })
          console.log(res)
          toast.success('Cập nhật chủ đề thành công')
          dispatch({
            type: GET_LIST_TOPICS,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create topic
          const res = await createTopic(values)
          console.log(res)
          toast.success('Thêm chủ đề thành công')
          formik.resetForm()
          dispatch({
            type: GET_LIST_TOPICS,
            payload: { page: 1, itemPerPage: pageInfo.itemPerPage, filter: '' },
          })
        }
      } catch (error: any) {
        console.log(error.response)
        handleErrorCode(error)
      }
    },
  })

  React.useEffect(() => {
    if (topicSelected) {
      formik.setValues({
        name: topicSelected.name,
        description: topicSelected.description,
      })
    }
  }, [topicSelected])

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>Tên chủ đề</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập tên chủ đề'
            name='name'
            className='!mt-1'
            value={formik.values.name}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <Typography fontWeight={400}>Mô tả</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='description'
            type='text'
            multiline
            name='description'
            maxRows={4}
            placeholder='Nhập mô tả'
            className='!mt-1'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </FormControl>
        <Box>
          <Box className='mt-4'>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color={topicSelected ? 'warning' : 'info'}
            >
              {topicSelected ? 'Cập nhật chủ đề' : 'Thêm chủ đề'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setTopicSelected(null))
        }}
      />
    </div>
  )
}
