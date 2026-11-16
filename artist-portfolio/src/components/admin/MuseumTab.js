import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './AdminIcons';
import { inputStyle, labelStyle, formatCategoryLabel } from './adminStyles';
import ArtworkLivePreview from './ArtworkLivePreview';

/**
 * Tab 1: Quản lý tác phẩm Bảo tàng (/museum).
 */
const MuseumTab = ({
  customCategories,
  showAddCategoryInput,
  setShowAddCategoryInput,
  newCategoryLabel,
  setNewCategoryLabel,
  artworks,
  loadingList,
  submitting,
  editingId,
  formData,
  setFormData,
  previewUrl,
  handleFileChange,
  handleAddNewCategory,
  resetForm,
  handleStartEdit,
  handleSubmit,
  handleDelete,
}) => {
  const currentCategoryObj = customCategories.find((c) => c.key === formData.category);
  const currentCategoryLabel = currentCategoryObj
    ? currentCategoryObj.label
    : formData.category.toUpperCase();

  return (
    <div>
      <div
        style={{
          background: 'var(--surface-low, #f5f3f0)',
          border: '1px solid var(--outline-hairline, #eae5db)',
          padding: '1.2rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--on-surface)' }}>
            <strong>Khu vực biên tập bảo tàng:</strong> Cho phép thêm mới, tùy biến danh mục phân loại,
            bố cục hiển thị và xem trước (Live Preview) thời gian thực theo cấu trúc của{' '}
            <strong>/museum</strong>.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
            Ảnh sẽ được chuyển đổi tự động sang WebP, upload lên CloudFly S3 và đồng bộ Firestore.
          </p>
        </div>
        <Link
          to="/museum"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--secondary-dark, #9d4225)',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          <span>Xem Trang Triển Lãm /museum</span>
          <Icons.ExternalLink />
        </Link>
      </div>

      {/* FORM THÊM MỚI / SỬA */}
      <section
        id="artwork-form-section"
        style={{
          background: '#ffffff',
          border: '1px solid var(--outline-hairline, #eae5db)',
          padding: '2.5rem',
          marginBottom: '3.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--outline-hairline)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: 'var(--secondary)' }}>
              {editingId ? <Icons.Edit /> : <Icons.Plus />}
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: 0 }}>
              {editingId ? 'Cập Nhật Tác Phẩm Đã Chọn' : 'Đăng Tác Phẩm Mới Lên Bảo Tàng (/museum)'}
            </h3>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              style={{
                background: 'none',
                border: '1px solid #d32f2f',
                color: '#d32f2f',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
              }}
            >
              Hủy Thao Tác Sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <label style={labelStyle}>TÊN TÁC PHẨM *</label>
              <input
                type="text"
                placeholder="Ví dụ: Thiền Tọa Vô Cùng / Tĩnh Lặng"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.45rem',
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>DANH MỤC TRƯNG BÀY</label>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--secondary-dark, #9d4225)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-label)',
                    fontWeight: '600',
                    padding: 0,
                  }}
                >
                  {showAddCategoryInput ? 'Đóng' : '+ Thêm Danh Mục Mới'}
                </button>
              </div>

              {!showAddCategoryInput ? (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {customCategories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nhập tên danh mục mới..."
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    style={{ ...inputStyle, padding: '0.6rem 0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    style={{
                      padding: '0.6rem 1rem',
                      background: 'var(--primary, #1a1a1a)',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: 'var(--font-label)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>CHẤT LIỆU</label>
              <input
                type="text"
                placeholder="Khoáng màu & Mực nho giấy Dó"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>KÍCH THƯỚC</label>
              <input
                type="text"
                placeholder="50 × 120 cm (Khung gỗ)"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>MÔ TẢ Ý NIỆM NGHỆ THUẬT</label>
            <textarea
              rows="3"
              placeholder="Mô tả cảm hứng, chất liệu hay ý niệm văn hóa của tác phẩm..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              marginBottom: '2rem',
              padding: '1.8rem',
              border: '1px dashed var(--outline, #747878)',
              background: 'var(--surface-low, #f5f3f0)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: 'var(--on-surface-variant)' }}>
                <Icons.Upload />
              </div>
              <label style={{ ...labelStyle, fontSize: '13px', cursor: 'pointer' }}>
                {editingId
                  ? 'Thay đổi hình ảnh tác phẩm (để trống nếu giữ nguyên)'
                  : 'Chọn tệp hình ảnh tác phẩm (JPG, PNG, WEBP) *'}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          </div>

          <ArtworkLivePreview
            formData={formData}
            previewUrl={previewUrl}
            currentCategoryLabel={currentCategoryLabel}
          />

          <button
            type="submit"
            disabled={submitting}
            className="filter-btn active"
            style={{
              padding: '0.9rem 2.5rem',
              fontSize: '12px',
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {editingId ? <Icons.Edit /> : <Icons.Plus />}
            <span>
              {submitting
                ? 'ĐANG TỐI ƯU WEBP & TẢI LÊN S3...'
                : editingId
                  ? 'LƯU CẬP NHẬT TÁC PHẨM'
                  : 'XUẤT BẢN LÊN BẢO TÀNG (/MUSEUM)'}
            </span>
          </button>
        </form>
      </section>

      {/* DANH SÁCH TÁC PHẨM TRÊN FIRESTORE */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: 0 }}>
            Tất Cả Tác Phẩm Trong Bảo Tàng ({artworks.length})
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
            Hiển thị theo thứ tự mới nhất
          </span>
        </div>

        {loadingList ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Đang tải dữ liệu từ Firestore...</p>
        ) : artworks.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid var(--outline-hairline)',
            }}
          >
            <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
              Chưa có tác phẩm nào. Hãy điền form bên trên để xuất bản tác phẩm đầu tiên lên bảo tàng.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {artworks.map((art) => (
              <div
                key={art.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: '#ffffff',
                  border: '1px solid var(--outline-hairline, #eae5db)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img
                    src={art.thumbUrl || art.displayUrl || art.image}
                    alt={art.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      border: '1px solid var(--outline-hairline)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          background: 'var(--surface-high)',
                          padding: '2px 8px',
                          fontWeight: '600',
                        }}
                      >
                        {formatCategoryLabel(art.category)}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                      {art.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                      {art.material || 'Chưa cập nhật chất liệu'} •{' '}
                      {art.size || 'Chưa cập nhật kích thước'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleStartEdit(art)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--outline-hairline)',
                      background: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'var(--font-label)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                    }}
                  >
                    <Icons.Edit />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(art)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d32f2f',
                      background: 'transparent',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'var(--font-label)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                    }}
                  >
                    <Icons.Trash />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MuseumTab;

