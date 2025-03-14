import { handleErrorCode } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import UndoIcon from '@mui/icons-material/Undo'
import {
  setLanguageSelected,
  setListLanguages,
} from '@/store/slices/languageSlice'
import { createLanguage, updateLanguage } from '@/apiRequest/languageApi'
import { toast } from 'react-toastify'
import { GET_LIST_LANGUAGES } from '@/store/action-saga/common'
export interface IFormLanguageProps {}

export default function FormLanguage(props: IFormLanguageProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.language.pageInfo)
  const languageSelected = useSelector(
    (state: RootState) => state.language.language
  )
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Ký hiệu ngôn ngữ không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (languageSelected) {
          //update language
          const res = await updateLanguage({
            id: languageSelected.id,
            ...values,
          })
          console.log(res)
          toast.success('Cập nhật ngôn ngữ thành công')
          dispatch({
            type: GET_LIST_LANGUAGES,
            payload: {
              page: pageInfo.page,
              itemPerPage: pageInfo.itemPerPage,
              filter: '',
            },
          })
        } else {
          //create language
          const res = await createLanguage(values)
          console.log(res)
          toast.success('Thêm nhà ngôn ngữ thành công')
          formik.resetForm()
          dispatch({
            type: GET_LIST_LANGUAGES,
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
    if (languageSelected) {
      formik.setValues({
        name: languageSelected.name,
        description: languageSelected.description,
      })
    }
  }, [languageSelected])

  return (
    <div className='flex justify-between shadow-lg p-5'>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        sx={{ mt: 1 }}
        className='flex-1 mt-3'
      >
        <Typography fontWeight={400}>Ký hiệu ngôn ngữ</Typography>
        <FormControl variant='outlined' fullWidth>
          <StyledTextField
            margin='normal'
            fullWidth
            id='name'
            placeholder='Nhập ký hiệu ngôn ngữ'
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
              color={languageSelected ? 'warning' : 'info'}
            >
              {languageSelected ? 'Cập nhật ngôn ngữ' : 'Thêm ngôn ngữ'}
            </Button>
          </Box>
        </Box>
      </Box>
      <UndoIcon
        color='info'
        className='cursor-pointer'
        onClick={() => {
          formik.resetForm()
          dispatch(setLanguageSelected(null))
        }}
      />
    </div>
  )
}
