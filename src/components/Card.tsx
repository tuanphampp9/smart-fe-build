import { UserType } from '@/lib/types/userType'
import * as React from 'react'
import BarCode from './BarCodeCustom'
import { formatDate } from '@/lib/utils/common'

export interface ICardProps {
  reader: UserType
}

export default function Card(props: ICardProps) {
  const { reader } = props
  console.log(reader)
  return (
    <div className='w-[420px] h-[300px] shadow-lg rounded-md p-4'>
      <div className='flex items-center gap-2 w-full'>
        <img
          src={reader?.portraitImg ?? ''}
          alt='ảnh chân dung'
          width={70}
          height={80}
        />
        <div className='flex-1'>
          <h3 className='text-blue-400 py-1 border-b-2 border-b-gray-500 text-center'>
            Thư viện TH
          </h3>
          <h3 className='mt-2 font-semibold uppercase text-center'>
            Thẻ mượn - đọc
          </h3>
          <div>
            Họ tên: <span className='font-semibold'>{reader?.fullName}</span>
          </div>
          <div>
            Năm sinh: <span>{formatDate(reader?.dob ?? '')}</span>
          </div>
          <div>
            Địa chỉ: <span>{reader?.address}</span>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <BarCode value={reader?.cardRead.cardId} width={1.2} height={50} />
        <span>HSD: {formatDate(reader?.cardRead.expiredAt ?? '')}</span>
      </div>
    </div>
  )
}
