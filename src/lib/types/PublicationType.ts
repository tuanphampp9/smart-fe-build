import { AuthorType } from './AuthorType'
import { CategoryType } from './categoryType'
import { LanguageType } from './languageType'
import { PublisherType } from './publisherType'
import { TopicType } from './topicType'
import { WarehouseType } from './warehouseType'

export interface PublicationTypeBase {
  name: string
  placeOfPublication: string
  yearOfPublication: number
  bannerImg: string
  pageCount: number
  size: string
  classify: string
  isbn: string
  issn: string
  description: string
}

export interface PublicationTypeResponse extends PublicationTypeBase {
  id: number
  authors: AuthorType[]
  publisher: PublisherType
  categories: CategoryType[]
  language: LanguageType
  warehouse: WarehouseType
  topics: TopicType[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface PublicationTypeRequest extends PublicationTypeBase {
  authors: {
    id: string
  }[]
  publisher: {
    id: string
  }
  categories: {
    id: string
  }[]
  language: {
    id: string
  }
  warehouse: {
    id: string
  }
  topics: {
    id: string
  }[]
}
