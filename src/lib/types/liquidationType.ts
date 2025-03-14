import { UserType } from './userType'

export interface LiquidationType {
  id: number
  status: string
  receiverName: string
  receiverContact: string
  note: string
  user: UserType
  liquidationDetails: []
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
