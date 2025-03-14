'use client'
import { Button, Tooltip, Upload } from 'antd'
import * as React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import { UploadOutlined } from '@ant-design/icons'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { IconButton } from '@mui/material'
import { handleErrorCode } from '@/lib/utils/common'
import { toast } from 'react-toastify'
import { RcFile } from 'antd/es/upload'
export interface IFormExcelProps {
  fileName: string
  linkDownload: string
  uploadExcelApi: (file: any) => Promise<any>
  fetchList: () => void
}

export default function FormExcel(props: IFormExcelProps) {
  const [file, setFile] = React.useState<RcFile | null | undefined>(null)
  const { uploadExcelApi, fileName, linkDownload, fetchList } = props
  const handleUploadExcel = async (file: any) => {
    if (file === null) {
      toast.error('Vui lòng chọn file trước khi upload')
      return
    }
    try {
      const response = await uploadExcelApi(file)
      console.log(response)
      toast.success('Upload file thành công')
      fetchList()
    } catch (error) {
      console.log(error)
      handleErrorCode(error)
    }
  }
  return (
    <div className='flex gap-4 items-center'>
      <Tooltip placement='topLeft' title='Tải file excel mẫu'>
        <a download={fileName} href={linkDownload}>
          <DownloadIcon />
        </a>
      </Tooltip>
      <Upload
        maxCount={1}
        onChange={(info) => {
          console.log(info.fileList)
          if (info.fileList.length === 0) {
            setFile(null)
            return
          }
          setFile(info.fileList[0]?.originFileObj)
        }}
      >
        <Button icon={<UploadOutlined />}>Tải file excel</Button>
      </Upload>
      <IconButton
        onClick={async () => {
          await handleUploadExcel(file)
        }}
      >
        <ArrowRightIcon fontSize='large' />
      </IconButton>
    </div>
  )
}
