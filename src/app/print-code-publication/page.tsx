'use client'
import * as React from 'react'
import PrintCodePublicationCom from './_components/PrintCodePublicationCom'

export interface IPrintCodePublicationPageProps {}

export default function PrintCodePublicationPage(
  props: IPrintCodePublicationPageProps
) {
  return (
    <React.Suspense>
      <PrintCodePublicationCom />
    </React.Suspense>
  )
}
