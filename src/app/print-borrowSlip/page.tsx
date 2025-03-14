'use client'
import * as React from 'react'
import PrintBorrowSlipCom from './_components/PrintBorrowSlipCom'

export interface IPrintBorrowSlipPageProps {}

export default function PrintBorrowSlipPage(props: IPrintBorrowSlipPageProps) {
  return (
    <React.Suspense>
      <PrintBorrowSlipCom />
    </React.Suspense>
  )
}
