import { RegistrationUniqueResType } from './RegistrationUniqueType'
import { UserType } from './userType'
import { WarehouseType } from './warehouseType'

export interface InventoryType {
  id: number
  status: string
  warehouse: WarehouseType
  inventoryCheckDetails: InventoryDetailType[]
  note: string
  user: UserType
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface InventoryDetailType {
  id: number
  registrationUnique: RegistrationUniqueResType
  note: string
}
