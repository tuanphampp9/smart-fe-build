'use client'

import React from 'react'
import RenderDetailLiquidation from './_components/RenderDetailLiquidation'
export interface ILiquidationDetailPageProps {}

export default function LiquidationDetailPage(
  props: ILiquidationDetailPageProps
) {
  return (
    <React.Suspense>
      <RenderDetailLiquidation />
    </React.Suspense>
  )
}
