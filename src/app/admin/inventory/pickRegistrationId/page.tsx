import * as React from 'react'
import RenderPickRegistrationCom from './_components/RenderPickRegistrationCom'

export interface IPagePickRegistrationInventoryProps {}

export default function PagePickRegistrationInventory(
  props: IPagePickRegistrationInventoryProps
) {
  return (
    <React.Suspense>
      <RenderPickRegistrationCom />
    </React.Suspense>
  )
}
