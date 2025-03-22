import ThemeRegistry from '@/components/ThemeRegistry'
import { StoreProvider } from '@/store/StoreProvider'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Account from './(client)/_components/Account'
import NotificationPopup from '@/components/NotificationPopup'
import { WebSocketProvider } from '@/components/WebSocketProvider'
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <StoreProvider>
          <ThemeRegistry>
            <Account />
            <WebSocketProvider>
              <NotificationPopup />
              <AntdRegistry>{children}</AntdRegistry>
            </WebSocketProvider>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Thư viện điện tử TH',
  description:
    ' Để khuyến khích văn hoá đọc của người dân, các thư viện ở Hà Nội ngày càng được đầu tư to đẹp và hoàn toàn miễn phí',
}
