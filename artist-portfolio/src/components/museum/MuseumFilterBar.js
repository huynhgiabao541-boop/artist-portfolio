import React from 'react';
import { MUSEUM_CATEGORIES } from '../../data';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Thanh lọc danh mục và tìm kiếm tác phẩm trong bảo tàng.
 */
const MuseumFilterBar = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="museum-filter-bar">
      <div className="filter-pills">
        {MUSEUM_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="museum-search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder={t('SEARCH ARTWORKS...', 'TÌM TÁC PHẨM...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MuseumFilterBar;

