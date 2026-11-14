/**
 * Lọc danh sách tác phẩm theo danh mục và từ khóa (tên hoặc chất liệu).
 */
export const filterMuseumExhibits = (artworks, selectedCategory, searchTerm) => {
  const normalizedQuery = (searchTerm || '').toLowerCase();

  return artworks.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const titleMatch = (item.title || '').toLowerCase().includes(normalizedQuery);
    const materialMatch = (item.material || '').toLowerCase().includes(normalizedQuery);
    return matchesCategory && (titleMatch || materialMatch);
  });
};

