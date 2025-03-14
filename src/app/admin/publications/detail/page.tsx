'use client'
import * as React from 'react'
import PublicationDetailCom from './_components/PublicationDetailCom'

export interface IPublicationDetailPageProps {}

export default function PublicationDetailPage(
  props: IPublicationDetailPageProps
) {
  return (
    <React.Suspense>
      <PublicationDetailCom />
    </React.Suspense>
  )
}
