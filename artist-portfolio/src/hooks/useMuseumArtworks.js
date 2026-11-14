import { useState, useEffect } from 'react';
import { MUSEUM_EXHIBITS } from '../data';
import { fetchInitialArtworks, fetchMoreArtworks } from '../services/artworkService';

/**
 * Custom hook quản lý tải danh sách tác phẩm bảo tàng và phân trang.
 */
export const useMuseumArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const { items, lastDoc: nextDoc } = await fetchInitialArtworks();

      if (isMounted) {
        if (items && items.length > 0) {
          setArtworks(items);
          setLastDoc(nextDoc);
        } else {
          setArtworks(MUSEUM_EXHIBITS);
          setLastDoc(null);
        }
        setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    const { items, lastDoc: nextDoc } = await fetchMoreArtworks(lastDoc);
    if (items && items.length > 0) {
      setArtworks((prev) => [...prev, ...items]);
      setLastDoc(nextDoc);
    } else {
      setLastDoc(null);
    }
    setLoadingMore(false);
  };

  return { artworks, lastDoc, loading, loadingMore, handleLoadMore };
};

