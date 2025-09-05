import './globals.css'

export const metadata = {
  title: '� D&D dos Pirangueiros',
  description: 'O RPG mais épico e brasileiro que você já viu! Aventure-se com os pirangueiros!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}