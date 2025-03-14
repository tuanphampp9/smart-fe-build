import { CardReaderType } from './CardReaderType'
import { RegistrationUniqueResponseType } from './ImportReceiptType'

export interface BorrowSlipType {
  id: string
  borrowDate: string
  registerDate: string
  dueDate: string
  expiredRegisterDate: string
  returnDate: string
  status: string
  borrowSlipDetails: BorrowSlipDetail[]
  cardRead: CardReaderType
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  note: string
  renewDueDate: number
}

export interface BorrowSlipDetail {
  id: '0642efb9-1be6-4442-b978-ffb1829d20a4'
  registrationUnique: RegistrationUniqueResponseType
  nameBook: string
  publicationId: number
}
