import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import "@/styles/global.css";
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

// import 'antd/dist/reset.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} >{children}</body>
    </html>
  )
}