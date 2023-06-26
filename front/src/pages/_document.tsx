import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;600&display=swap" rel="stylesheet"/>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/eye.css' rel='stylesheet'/>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/eye-alt.css' rel='stylesheet'/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
