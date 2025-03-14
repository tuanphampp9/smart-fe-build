'use client'
import * as React from 'react'
import ImportReceiptDetailCom from './_components/ImportReceiptDetailCom'

export interface IImportReceiptDetailPageProps {}

export default function ImportReceiptDetailPage(
  props: IImportReceiptDetailPageProps
) {
  return (
    <React.Suspense>
      <ImportReceiptDetailCom />
    </React.Suspense>
  )
}
