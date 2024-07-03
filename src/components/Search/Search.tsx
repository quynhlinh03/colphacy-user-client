import { IconSearch, IconX } from '@tabler/icons-react';
import { useState, useRef } from 'react';

function Search({ onSearch, keyword }) {
  const [searchValue, setSearchValue] = useState(keyword || '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    setSearchValue('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchValue);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  return (
    <div className="search">
      <input
        ref={inputRef}
        value={searchValue}
        placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
        spellCheck={false}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      {searchValue && (
        <button className="clear" onClick={handleClear}>
          <IconX size="1rem"></IconX>
        </button>
      )}

      <button className="search-btn" onMouseDown={(e) => e.preventDefault()}>
        <IconSearch size="1.3rem"></IconSearch>
      </button>
    </div>
  );
}

export default Search;
