import { memo } from 'react';

const Header = memo(() => (
  <div className='relative bg-white'>
    <div className='mx-auto px-4 sm:px-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10'>
        <div className='flex justify-start lg:w-0 lg:flex-1'>
          <h1>最強防御セキュリティのサポートツール</h1>
        </div>
      </div>
    </div>
  </div>
));

export default Header;
