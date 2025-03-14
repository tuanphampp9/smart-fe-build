import { Box } from '@mui/material'
import * as React from 'react'
import SideBarMyAccount from './_components/SidebarMyAccount'

export interface ILayoutProps {
  children: React.ReactNode
}

export default function Layout(props: ILayoutProps) {
  const { children } = props
  return (
    <Box className='flex justify-center'>
      <div className='container'>
        <div className='flex gap-4'>
          <div className='w-1/4'>
            <SideBarMyAccount />
          </div>
          <div className='w-3/4 rounded-md shadow-md border-2 border-red p-4'>
            {children}
          </div>
        </div>
      </div>
    </Box>
  )
}
