export interface WarehousePubType {
  id: string
  name: string
  publications: PublicationWarehouseType[]
}

interface PublicationWarehouseType {
  id: number
  publicationName: string
  quantity: number
  availableQuantity: number
  borrowedQuantity: number
  lostQuantity: number
}
