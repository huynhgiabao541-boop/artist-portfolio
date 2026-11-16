import React, { useState } from 'react';
import { useMuseumArtworks } from '../hooks/useMuseumArtworks';
import { filterMuseumExhibits } from '../utils/museumFilter';
import { useLanguage } from '../context/LanguageContext';
import { MUSEUM_CATEGORIES } from '../data';
import MuseumHeader from '../components/museum/MuseumHeader';
import { ContainerScroll } from '../components/container-scroll-animation';
import MorphGallery from '../components/morph-gallery';

const Museum = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  const { artworks, loading } = useMuseumArtworks();

  const filteredExhibits = filterMuseumExhibits(artworks, selectedCategory, searchTerm);

  const displayArtworks = filteredExhibits.filter(
    (art) => art.displayUrl || art.thumbUrl || art.imageUrl || art.image || art.url
  );

  const morphItems =
    displayArtworks.length > 0
      ? displayArtworks.map((art) => {
          const src = art.displayUrl || art.thumbUrl || art.imageUrl || art.image || art.url;
          const thumb = art.thumbUrl || art.thumbnailUrl || src;
          return {
            src,
            thumb,
            alt: art.title || 'Artwork',
            title: art.title,
            category: art.category,
            material: art.material,
            size: art.size,
            description: art.description,
            displayUrl: art.displayUrl || art.image,
          };
        })
      : [
          {
            src: '/museum-art-1.jpg',
            thumb: '/museum-art-1.jpg',
            alt: 'Selected Work 01',
            title: 'DÒNG THỜI GIAN',
            category: 'Tranh màu nước & mực',
            material: 'Màu nước, Gold leaf & Lụa tơ',
            size: '50 × 120 cm (Khung gỗ)',
            description: 'Khám phá sự chuyển biến của thời gian và không gian qua những nét vẽ tinh tế, hòa quyện giữa chất liệu truyền thống và tư duy thị giác đương đại.',
          },
          {
            src: '/museum-art-2.jpg',
            thumb: '/museum-art-2.jpg',
            alt: 'Selected Work 02',
            title: 'VỌNG CẢNH',
            category: 'Minh họa ý niệm',
            material: 'Khoáng màu & Mực nho giấy Dó',
            size: '68 × 98 cm',
            description: 'Sắc độ đất nung và vệt loang sơn thủy, tái hiện dòng vang an yên giữa dòng thời gian.',
          },
          {
            src: '/museum-art-3.jpg',
            thumb: '/museum-art-3.jpg',
            alt: 'Selected Work 03',
            title: 'KÝ ỨC ĐÔ THỊ',
            category: 'Tranh màu nước & mực',
            material: 'Mực sắt & Màu nước Winsor',
            size: '70 × 100 cm',
            description: 'Nét ký họa đan xen lớp mái ngói phố cổ, khắc họa nhịp thở hoài niệm và sức sống bền bỉ.',
          },
        ];

  return (
    <main className="museum-page museum-page--immersive">
      {/* Khung 3D Scroll dẫn vào Morph Gallery chứa ảnh, thông tin tác phẩm & bộ lọc danh mục bên trong */}
      <ContainerScroll titleComponent={<MuseumHeader />}>
        {loading && displayArtworks.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <i
              className="fas fa-circle-notch fa-spin"
              style={{ fontSize: '24px', marginRight: '10px' }}
            ></i>
            {t('LOADING MUSEUM COLLECTION...', 'ĐANG TẢI BỘ SƯU TẬP BẢO TÀNG...')}
          </div>
        ) : (
          <MorphGallery
            items={morphItems}
            height="100%"
            autoplay={5000}
            loop
            arrows
            thumbnails
            categories={MUSEUM_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={t('SEARCH ARTWORKS...', 'TÌM TÁC PHẨM...')}
          />
        )}
      </ContainerScroll>
    </main>
  );
};

export default Museum;
