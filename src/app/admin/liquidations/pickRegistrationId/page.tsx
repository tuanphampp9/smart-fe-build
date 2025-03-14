'use client'
import * as React from 'react'
import RenderPickRegistrationCom from './_components/RenderPickRegistrationCom'

export interface IPagePickRegistrationProps {}

export default function PagePickRegistration(
  props: IPagePickRegistrationProps
) {
  return (
    <React.Suspense>
      <RenderPickRegistrationCom />
    </React.Suspense>
  )
}
