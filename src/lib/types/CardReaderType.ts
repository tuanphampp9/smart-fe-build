export interface CardReaderType {
  id: string
  cardId: string
  activeAt: string
  expiredAt: string
  serves: ServeType[]
}

export interface ServeType {
  id: string
  checkInTime: string
  checkOutTime: string
  status: string
}
