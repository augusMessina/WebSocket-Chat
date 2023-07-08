import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document';
import { useEffect, useState } from 'react';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;600&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://unpkg.com/css.gg@2.0.0/icons/css/eye.css"
            rel="stylesheet"
          />
          <link
            href="https://unpkg.com/css.gg@2.0.0/icons/css/eye-alt.css"
            rel="stylesheet"
          />
          <link href='https://unpkg.com/css.gg@2.0.0/icons/css/mail.css' rel='stylesheet'/>
          <link href='https://unpkg.com/css.gg@2.0.0/icons/css/more-vertical-alt.css' rel='stylesheet'></link>
          <link href='https://unpkg.com/css.gg@2.0.0/icons/css/user-list.css' rel='stylesheet'></link>
          <link href='https://unpkg.com/css.gg@2.0.0/icons/css/log-in.css' rel='stylesheet'></link>
          <link href='https://unpkg.com/css.gg@2.0.0/icons/css/user-add.css' rel='stylesheet'></link>
          {/* Add other custom stylesheets and meta tags */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
