import Head from 'next/head';
import { Suspense } from 'react';
import Header from './components/Header';
import SearchWrapper from './components/SearchWrapper';

export default function Home() {
  return (
    <div>
      <Head>
        <title>最強防御セキュリティのサポートツール</title>
        <meta name='description' content='最強防御セキュリティのサポートツール' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Header />
        <Suspense fallback={<div>Loading</div>}>
          <SearchWrapper />
        </Suspense>
      </main>
    </div>
  );
}
