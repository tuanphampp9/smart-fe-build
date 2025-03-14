'use client'
import * as React from 'react'
import PrintImportReceiptCom from './_components/PrintImportReceiptCom'

export interface IPrintImportReceiptPageProps {}

export default function PrintImportReceiptPage(
  props: IPrintImportReceiptPageProps
) {
  return (
    <React.Suspense>
      <PrintImportReceiptCom />
    </React.Suspense>
  )
}
