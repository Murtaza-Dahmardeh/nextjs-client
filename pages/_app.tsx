import '@components/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from "@components/components/Header";
import { Provider } from "react-redux";
import { configureApplicationStore } from './../redux/store';

export default function App({ Component, pageProps }: AppProps) {
  const initialState = {};
  return (
    <Provider store={configureApplicationStore(initialState)}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  )

}
