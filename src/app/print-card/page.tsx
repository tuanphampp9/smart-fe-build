'use client'
import * as React from 'react'
import PrintCardCom from './_components/PrintCardCom'

export interface IPrintCardPageProps {}

export default function PrintCardPage(props: IPrintCardPageProps) {
  return (
    <React.Suspense>
      <PrintCardCom />
    </React.Suspense>
  )
}
