import { Rating } from '@mui/material'
import * as React from 'react'

export interface IRatingCustomProps {
  value: number | null
  onchange: (newValue: number | null) => void
}

export default function RatingCustom(props: IRatingCustomProps) {
  const { value, onchange } = props
  return (
    <Rating
      name='simple-controlled'
      value={value}
      onChange={(event, newValue) => {
        onchange(newValue)
      }}
    />
  )
}
