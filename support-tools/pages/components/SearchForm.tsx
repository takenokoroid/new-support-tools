import { SearchForm } from '../../type/lib';

const SearchForm = ({ userId, onIdChange, disabled, onSearch, validMessage }: SearchForm) => (
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
    <span className='flex items-center font-medium tracking-wide text-red-500 mt-1 ml-1' role='alert'>
      {validMessage}
    </span>
  </div>
);

export default SearchForm;
