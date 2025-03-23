'use client'
import { getAllWarehousePub } from '@/apiRequest/warehouseApi'
import { WarehousePubType } from '@/lib/types/WarehousePubType'
import { handleErrorCode } from '@/lib/utils/common'
import * as React from 'react'

export interface IPublicationReportProps {}

export default function PublicationReport(props: IPublicationReportProps) {
  const [warehousePub, setWarehousePub] = React.useState<WarehousePubType[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchWarehousePub = async () => {
      try {
        const res = await getAllWarehousePub()
        setWarehousePub(res.data)
      } catch (error) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    fetchWarehousePub()
  }, [])
  return (
    <div className='w-[800px] mx-auto'>
      <div className='border-b border-gray-300 pb-3'>
        <h3 className='font-semibold'>Thư viện điện tử TH</h3>
      </div>
      <div className='mt-5'>
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <div>
            <table>
              <tr>
                <th rowSpan={2}>STT</th>
                <th rowSpan={2}>Tên ấn phẩm</th>
                <th rowSpan={2}>Tổng số</th>
                <th colSpan={3}>Trạng thái</th>
              </tr>
              <tr>
                <th>Sẵn có</th>
                <th>Đang mượn</th>
                <th>Thất lạc</th>
              </tr>
              {warehousePub.length > 0 &&
                warehousePub.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td colSpan={6} className='font-semibold'>
                        Kho: {item.name}
                      </td>
                    </tr>
                    {item.publications.length === 0 && (
                      <tr>
                        <td colSpan={6} className='text-center'>
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                    {item.publications.map((pub, index) => (
                      <React.Fragment key={pub.id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{pub.publicationName}</td>
                          <td>{pub.quantity}</td>
                          <td>{pub.availableQuantity}</td>
                          <td>{pub.borrowedQuantity}</td>
                          <td>{pub.lostQuantity}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
