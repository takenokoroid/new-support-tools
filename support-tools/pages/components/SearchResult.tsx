import { Item } from '../../type/lib';
import css from '../../styles/SearchResult.module.css';
const SearchResult = ({ result }: { result: Item }) => (
  <div className={`container mx-auto ${css.card__wrapper} md:flex flex-rows w-96`}>
    <div className={`md:flex flex-col ${css.card__userwrapper}`}>
      <div className={`${css.card__userid}`} aria-label={`ユーザIDは${result?.user.cgg_id}`}>
        ID : {result?.user.cgg_id}
      </div>
      <h2 aria-label={`ユーザIDは${result?.user.name}`}>{result?.user.name}</h2>
    </div>
    <div className={`${css.card__deletedwrapper} relative group`}>
      <span
        className={[
          'whitespace-nowrap',
          'rounded',
          'bg-black',
          'px-2',
          'py-1',
          'text-white',
          'absolute',
          '-top-12',
          'left-1/2',
          '-translate-x-1/2',
          "before:content-['']",
          'before:absolute',
          'before:-translate-x-1/2',
          'before:left-1/2',
          'before:top-full',
          'before:border-4',
          'before:border-transparent',
          'before:border-t-black',
          'opacity-0',
          'group-hover:opacity-100',
          'transition',
          'pointer-events-none',
        ].join(' ')}
      >
        {result?.service.allowServiceSentence}
      </span>
      <img alt={result?.service.allowServiceSentence} src={result?.service.allowServiceImage} />
    </div>
  </div>
);

export default SearchResult;
