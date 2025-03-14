'use client'
import * as React from 'react'
import RenderDetailReader from './_components/RenderDetailReader'

export interface IPageDetailReaderProps {}

export default function PageDetailReader(props: IPageDetailReaderProps) {
  return (
    <React.Suspense>
      <RenderDetailReader />
    </React.Suspense>
  )
}
