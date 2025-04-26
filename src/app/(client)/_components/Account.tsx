'use client'
import { getMe } from '@/apiRequest/authApi'
import { handleErrorCode } from '@/lib/utils/common'
import { setInfoUser } from '@/store/slices/userSlice'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useDispatch } from 'react-redux'

export interface IAccountProps {}

export default function Account(props: IAccountProps) {
  const dispatch = useDispatch()
  const pathName = usePathname()
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe()
        console.log(res)
        dispatch(
          setInfoUser({
            user: res.data,
          })
        )
      } catch (error: any) {
        handleErrorCode(error)
      }
    }
    if (['/register', '/login', '/register/user-interest'].includes(pathName))
      return
    fetchMe()
  }, [])
  return <div></div>
}
