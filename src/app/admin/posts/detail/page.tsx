'use client'
import * as React from 'react'
import DetailPostCom from './_components/DetailPostCom'

export interface IDetailPostPageProps {}

export default function DetailPostPage(props: IDetailPostPageProps) {
  return (
    <React.Suspense>
      <DetailPostCom />
    </React.Suspense>
  )
}
