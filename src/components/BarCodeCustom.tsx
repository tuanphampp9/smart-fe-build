import Barcode from 'react-barcode'
import * as React from 'react'

export interface IBarCodeProps {
  value: string
  width: number
  height: number
}

export default function BarCode(props: IBarCodeProps) {
  const { value, width, height } = props
  return <Barcode value={value} width={width} height={height} />
}
