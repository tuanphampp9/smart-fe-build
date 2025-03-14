import Header from '@/components/Header'
import * as React from 'react'

export interface ILayoutProps {
  children: React.ReactNode
}

export default function Layout(props: ILayoutProps) {
  const { children } = props
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
