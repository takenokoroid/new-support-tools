import { useSearch } from '../../customHooks';
import SearchResult from './SearchResult';
import { Item } from 'type/lib';
import SearchForm from './SearchForm';
const SearchWrapper = () => {
  const { disabled, userId, errorMessage, errorStatus, results, validMessage, onSearch, onIdChange } = useSearch();
  return (
    <>
      <SearchForm
        disabled={disabled}
        userId={userId}
        validMessage={validMessage}
        onSearch={onSearch}
        onIdChange={onIdChange}
      />
      {!errorStatus ? (
        results.map((result: Item) => <SearchResult key={result.user.cgg_id} result={result} />)
      ) : (
        <div className='text-center mt-6'>{errorMessage}</div>
      )}
    </>
  );
};

export default SearchWrapper;
