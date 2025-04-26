export interface UserType {
  id?: string
  fullName: string
  email: string
  portraitImg: string
  dob: string
  phone: string
  identityCardNumber: string
  address: string
  password?: string
  gender: string
  cardRead?: any
  cartUsers?: CartUserType[]
  interests?: string
}
export interface CartUserType {
  id: string
  userId: string
  publicationId: string
  quantity: number
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  publication: {
    name: string
    bannerImg: string
  }
}
