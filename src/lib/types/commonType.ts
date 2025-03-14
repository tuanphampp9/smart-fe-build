import { JSX } from 'react'

export type baseMenu = {
  id: number
  title: string
  path?: string
  subMenuItems?: baseMenu[]
  subMenu?: boolean
  icon?: JSX.Element
}

export type pageInfo = {
  page: number
  itemPerPage: number
  totalItem: number
  totalPage: number
}
