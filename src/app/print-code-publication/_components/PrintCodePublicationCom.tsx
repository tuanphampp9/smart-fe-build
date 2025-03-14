'use client'
import { getImportReceipt } from '@/apiRequest/importReceiptApi'
import BarCode from '@/components/BarCodeCustom'
import { ImportReceiptResponseType } from '@/lib/types/ImportReceiptType'
import { handleErrorCode } from '@/lib/utils/common'
import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

export interface IPrintCodePublicationComProps {}

export default function PrintCodePublicationCom(
  props: IPrintCodePublicationComProps
) {
  const [importReceipt, setImportReceipt] =
    React.useState<ImportReceiptResponseType>({} as ImportReceiptResponseType)
  const searchParam = useSearchParams()
  const params = new URLSearchParams(searchParam.toString())
  const importReceiptId = params.get('importReceiptId') ?? ''
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchImportReceipt = async () => {
      try {
        setLoading(true)
        const res = await getImportReceipt(importReceiptId)
        console.log(res)
        setImportReceipt(res.data)
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (importReceiptId) {
      fetchImportReceipt()
    }
  }, [importReceiptId])

  return (
    <div>
      {loading ? (
        <Box className='flex justify-center items-center w-[310px] h-[200px]'>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          {importReceipt.importReceiptDetails?.map((item, index) => (
            <div>
              <h4 className='font-semibold'>
                Ấn phẩm: {item.publication.name}
              </h4>
              <p>1. Nhãn với bìa trước</p>
              <div className='flex gap-3 flex-wrap'>
                {item.registrationUniques?.map((registrationUnique, index) => (
                  <div className='w-[200px] border border-black'>
                    <h4 className='text-center border-b border-b-black'>
                      Thư viên điện tử TH
                    </h4>
                    <h4 className='text-center'>{item.publication.classify}</h4>
                    <BarCode
                      value={registrationUnique.registrationId}
                      width={1.2}
                      height={50}
                    />
                  </div>
                ))}
              </div>
              <p>2. Nhãn với bìa sau</p>
              <div className='w-[200px] border border-black'>
                <h4 className='text-center'>ISBN: {item.publication.isbn}</h4>
                <BarCode
                  value={item.publication.isbn}
                  width={1.2}
                  height={50}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
