import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import "@/styles/global.css";
export const metadata = {
  title: '🔪',
  description: 'Nextjs + Typescript + tailwind + daisyUI. Uses no backend.',
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
