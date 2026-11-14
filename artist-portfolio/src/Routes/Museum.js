import React, { useState } from 'react';
import { useMuseumArtworks } from '../hooks/useMuseumArtworks';
import { filterMuseumExhibits } from '../utils/museumFilter';
import MuseumHeader from '../components/museum/MuseumHeader';
import MuseumFilterBar from '../components/museum/MuseumFilterBar';
import ExhibitCard from '../components/museum/ExhibitCard';
import FineArtStandards from '../components/museum/FineArtStandards';

const Museum = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDossier, setExpandedDossier] = useState(null);

  const { artworks, lastDoc, loading, loadingMore, handleLoadMore } = useMuseumArtworks();
  const filteredExhibits = filterMuseumExhibits(artworks, selectedCategory, searchTerm);

  const toggleDossier = (id) => {
    setExpandedDossier((prev) => (prev === id ? null : id));
  };

  return (
    <main className="museum-page">
      <div className="site-container">
        <MuseumHeader />

        <MuseumFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i
              className="fas fa-circle-notch fa-spin"
              style={{ fontSize: '24px', marginRight: '10px' }}
            ></i>
            ĐANG TẢI BỘ SƯU TẬP BẢO TÀNG...
          </div>
        ) : (
          <>
            <div className="exhibition-list">
              {filteredExhibits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                  Không tìm thấy tác phẩm phù hợp.
                </div>
              ) : (
                filteredExhibits.map((item) => (
                  <ExhibitCard
                    key={item.id}
                    item={item}
                    isExpanded={expandedDossier === item.id}
                    onToggleDossier={toggleDossier}
                  />
                ))
              )}
            </div>

            {lastDoc && (
              <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <button
                  className="filter-btn active"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{ padding: '12px 30px', fontSize: '13px', letterSpacing: '1.5px' }}
                >
                  {loadingMore ? 'ĐANG TẢI THÊM...' : 'XEM THÊM TÁC PHẨM'}
                </button>
              </div>
            )}
          </>
        )}

        <FineArtStandards />
      </div>
    </main>
  );
};

export default Museum;
