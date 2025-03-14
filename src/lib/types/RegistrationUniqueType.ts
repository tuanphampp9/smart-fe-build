export interface RegistrationUniqueResType {
  id: number
  registrationId: string
  status: string
  publicationName: string
  createdAt: string
  historyBorrows: HistoryBorrows[]
}

export interface HistoryBorrows {
  cardId: string
  borrowDate: string
  returnDate: string
  note: string
  borrowSlipId: string
  borrowSlipStatus: string
}
