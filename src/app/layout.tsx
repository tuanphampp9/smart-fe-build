import ThemeRegistry from '@/components/ThemeRegistry'
import { StoreProvider } from '@/store/StoreProvider'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Account from './(client)/_components/Account'
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
            <AntdRegistry>{children}</AntdRegistry>
          </ThemeRegistry>
        </StoreProvider>
        <ToastContainer
          position='top-right'
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Thư viện điện tử TH',
  description:
    ' Để khuyến khích văn hoá đọc của người dân, các thư viện ở Hà Nội ngày càng được đầu tư to đẹp và hoàn toàn miễn phí',
}
