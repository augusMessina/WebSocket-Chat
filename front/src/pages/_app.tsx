import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { ApolloProvider } from "@apollo/client";
import { clientCSR } from '@/utils/apolloclient';
import UserContextProvider from '@/context/UserContext';

export default function App({ Component, pageProps }: AppProps) {
  const client = clientCSR;

  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ApolloProvider>
  );
}