import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReviewWala — WhatsApp Reviews for Your Business',
  description: 'Collect WhatsApp reviews from customers and display them as a beautiful social proof widget on your website. Made for Indian small businesses.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
