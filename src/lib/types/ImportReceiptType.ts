import { PublicationTypeResponse } from './PublicationType'

export interface ImportReceiptResponseType {
  id: string
  inputSource: string
  deliveryPerson: string
  deliveryRepresentative: string
  note: string
  importReceiptDetails: ImportReceiptDetailResponseType[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ImportReceiptDetailResponseType {
  id: string
  price: number
  quantity: number
  publication: PublicationTypeResponse
  registrationUniques: RegistrationUniqueResponseType[]
}

export interface RegistrationUniqueResponseType {
  id: number
  registrationId: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ImportReceiptReqType {
  inputSource: string
  deliveryPerson: string
  deliveryRepresentative: string
  note: string
  importReceiptDetailReqs: ImportReceiptDetailReqType[]
}

export interface ImportReceiptDetailReqType {
  price: number
  quantity: number
  publicationId: number
}
