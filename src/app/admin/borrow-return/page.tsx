'use client'
import { getListBorrowSlips } from '@/apiRequest/borrowSlipApi'
import { BorrowSlipType } from '@/lib/types/BorrowSlipsType'
import { formatDate, handleErrorCode } from '@/lib/utils/common'
import * as React from 'react'

export interface IBorrowReturnProps {}

export default function BorrowReturn(props: IBorrowReturnProps) {
  const [listBorrowSlips, setListBorrowSlips] = React.useState<
    BorrowSlipType[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const fetchListBorrowSlips = async (page: number, size: number) => {
    try {
      const res = await getListBorrowSlips(page, size, '')
      setListBorrowSlips(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    fetchListBorrowSlips(1, 1000)
  }, [])
  const renderLabelStatus: Record<string, string> = {
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    OVER_DUE: 'Quá hạn',
    NOT_BORROWED: 'Chưa mượn',
  }
  return (
    <div>
      {loading ? (
        <div className='text-center'>Loading...</div>
      ) : (
        <div>
          <h2>Sổ mượn trả</h2>
          <table>
            <tr>
              <th rowSpan={2}>STT</th>
              <th rowSpan={2}>Mã thẻ</th>
              <th rowSpan={2}>Tên ấn phẩm</th>
              <th rowSpan={2}>Số ĐKCB</th>
              <th colSpan={2}>Ngày mượn</th>
              <th colSpan={2}>Ngày trả</th>
              <th rowSpan={2}>Trạng thái</th>
            </tr>
            <tr>
              <td>Ngày</td>
              <td>Ký</td>
              <td>Ngày</td>
              <td>Ký</td>
            </tr>
            {listBorrowSlips.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td colSpan={9}>
                    Mã phiếu: <span className='font-semibold'>{item.id}</span>
                  </td>
                </tr>
                {item.borrowSlipDetails.map((detail, index) => (
                  <tr key={detail.id}>
                    <td>{index + 1}</td>
                    <td>{item.cardRead.cardId}</td>
                    <td>{detail.nameBook}</td>
                    <td>{detail.registrationUnique.registrationId}</td>
                    <td>{formatDate(item.borrowDate)}</td>
                    <td></td>
                    <td>{formatDate(item.returnDate)}</td>
                    <td></td>
                    <td>{renderLabelStatus[item.status]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </table>
        </div>
      )}
    </div>
  )
}
