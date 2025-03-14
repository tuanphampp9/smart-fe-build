import * as React from 'react'
import RenderDetailInventory from './_components/RenderDetailInventory'

export interface IPageDetailInventoryProps {}

export default function PageDetailInventory(props: IPageDetailInventoryProps) {
  return (
    <React.Suspense>
      <RenderDetailInventory />
    </React.Suspense>
  )
}
