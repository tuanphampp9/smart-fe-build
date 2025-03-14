import { Box, Typography } from '@mui/material'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import * as React from 'react'

export interface IDatepickerCustomProps {
  isDisabledDate?: boolean
  minDate?: number
  value: string
  onChange: (date: string) => void
  textErr?: string
  defaultPickerValue?: dayjs.Dayjs
  disableWeekend?: boolean
}

export default function DatepickerCustom(props: IDatepickerCustomProps) {
  const {
    isDisabledDate = false,
    minDate = 0,
    value,
    onChange,
    textErr = '',
    defaultPickerValue = dayjs(),
    disableWeekend = false,
  } = props

  const disabledDate = (current: dayjs.Dayjs | null) => {
    if (!current) return false
    if (isDisabledDate) {
      const disableBeforeDate = current.isBefore(
        dayjs().add(minDate, 'day'),
        'day'
      )
      if (disableBeforeDate) return true
    }
    if (disableWeekend) {
      const dayOfWeek = current.day()
      if ([0, 6].includes(dayOfWeek)) {
        return true
      }
    }

    return false
  }

  return (
    <Box className='w-full'>
      <DatePicker
        format='DD/MM/YYYY'
        className='py-4 bg-grayPrimary border-none w-full hover:bg-grayPrimary'
        disabledDate={disabledDate}
        value={value ? dayjs(value) : undefined}
        onChange={(date) => {
          onChange(date ? date.format('YYYY-MM-DD') : '')
        }}
        defaultPickerValue={defaultPickerValue}
        placeholder='dd/mm/yyyy'
      />
      {textErr && (
        <Typography className='!text-red-600 !text-[12px]'>
          {textErr}
        </Typography>
      )}
    </Box>
  )
}
