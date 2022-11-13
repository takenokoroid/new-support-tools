import Head from 'next/head';
import { useSearch } from 'customHooks';
import SearchResult from './SearchResult';
const SearchWrapper = () => {
  const { disabled, userId, errorMessage, errorStatus, results, validMessage, onSearch, onIdChange } = useSearch();
  return (
    <div>
      <Head>
        <title>最強防御セキュリティのサポートツール</title>
        <meta name='description' content='最強防御セキュリティのサポートツール' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='relative bg-white'>
        <div className='mx-auto px-4 sm:px-6'>
          <div className='flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10'>
            <div className='flex justify-start lg:w-0 lg:flex-1'>
              <h1>最強防御セキュリティのサポートツール</h1>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className='md:flex md:items-center justify-center flex-col mt-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2 text-xl' htmlFor='userid'>
            検索したいユーザID
          </label>
          <div className='md:flex'>
            <input
              className='w-64 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              id='userid'
              type='text'
              value={userId}
              onChange={onIdChange}
            />
            <button
              className='w-32 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline text-white font-bold py-2 px-4 rounded disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:shadow-none'
              disabled={disabled}
              onClick={() => onSearch()}
            >
              検索
            </button>
          </div>
          <span role='alert'>{validMessage}</span>
        </div>

        {!errorStatus ? (
          results.map((result) => <SearchResult key={result.user.cgg_id} result={result} />)
        ) : (
          <>{errorMessage}</>
        )}
      </main>
    </div>
  );
};

export default SearchWrapper;
