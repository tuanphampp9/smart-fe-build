import { Autocomplete, TextField } from '@mui/material'
import * as React from 'react'

export interface IAutoCompleteCustomProps {
  listData: any[]
  fieldShow: string
  placeholder?: string
  onChange: (event: any, newValue: any) => void
  value: any
}

export default function AutoCompleteCustom(props: IAutoCompleteCustomProps) {
  const { listData, fieldShow, placeholder, onChange, value } = props
  return (
    <Autocomplete
      options={listData}
      value={value}
      getOptionLabel={(option) => option[fieldShow]}
      sx={{
        width: 300,
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} />
      )}
      onChange={(event, newValue) => {
        console.log(newValue)
        onChange(event, newValue)
      }}
      slotProps={{
        popupIndicator: { sx: { display: 'none' } }, // Ẩn icon mũi tên
      }}
    />
  )
}
