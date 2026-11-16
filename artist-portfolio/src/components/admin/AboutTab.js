import React from 'react';
import { Icons } from './AdminIcons';
import { inputStyle, labelStyle } from './adminStyles';

const TimelineArraySection = ({
  heading,
  addLabel,
  items,
  field,
  titlePlaceholder,
  subtitlePlaceholder,
  template,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}) => (
  <div style={{ marginBottom: '2rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.8rem',
      }}
    >
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0, color: 'var(--secondary)' }}>
        {heading}
      </h4>
      <button
        type="button"
        onClick={() => onAddItem(field, template)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--secondary-dark)',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {addLabel}
      </button>
    </div>

    <div style={{ display: 'grid', gap: '0.8rem' }}>
      {(items || []).map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: '10px',
            alignItems: 'center',
            background: 'var(--surface-low)',
            padding: '10px 14px',
          }}
        >
          <input
            type="text"
            placeholder={titlePlaceholder}
            value={item.title}
            onChange={(e) => onChangeItem(field, idx, 'title', e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder={subtitlePlaceholder}
            value={item.subtitle}
            onChange={(e) => onChangeItem(field, idx, 'subtitle', e.target.value)}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => onRemoveItem(field, idx)}
            style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
          >
            <Icons.Trash />
          </button>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Tab 2: Quản lý trang Hồ sơ Tác giả (/about).
 */
const AboutTab = ({
  aboutForm,
  setAboutForm,
  savingAbout,
  heroPreviewUrl,
  onHeroFileChange,
  onSaveAbout,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
}) => (
  <form
    onSubmit={onSaveAbout}
    style={{
      background: '#ffffff',
      border: '1px solid var(--outline-hairline, #eae5db)',
      padding: '2.5rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--outline-hairline)',
      }}
    >
      <div>
        <span className="section-tag">CHỈNH SỬA NỘI DUNG TOÀN DIỆN</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '4px 0 0 0' }}>
          Hồ Sơ Họa Sĩ & Trang Giới Thiệu (/about)
        </h3>
      </div>
      <button
        type="submit"
        disabled={savingAbout}
        className="filter-btn active"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.8rem' }}
      >
        <Icons.Save />
        <span>{savingAbout ? 'ĐANG LƯU FIRESTORE...' : 'LƯU THAY ĐỔI /ABOUT'}</span>
      </button>
    </div>

    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
      1. Thông Tin Nghệ Sĩ & Studio
    </h4>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <div>
        <label style={labelStyle}>HỌ TÊN NGHỆ SĨ *</label>
        <input
          type="text"
          value={aboutForm.name || ''}
          onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>TÊN STUDIO</label>
        <input
          type="text"
          value={aboutForm.studio || ''}
          onChange={(e) => setAboutForm({ ...aboutForm, studio: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>DÒNG NIÊN ĐẠI TUYỂN CHỌN</label>
        <input
          type="text"
          value={aboutForm.selectedWorks || ''}
          onChange={(e) => setAboutForm({ ...aboutForm, selectedWorks: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>EMAIL LIÊN HỆ CHÍNH</label>
        <input
          type="email"
          value={aboutForm.email || ''}
          onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>SỐ ĐIỆN THOẠI</label>
        <input
          type="text"
          value={aboutForm.phone || ''}
          onChange={(e) => setAboutForm({ ...aboutForm, phone: e.target.value })}
          style={inputStyle}
        />
      </div>
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <label style={labelStyle}>TIỂU SỬ NGHỆ THUẬT (ARTIST BIO)</label>
      <textarea
        rows="4"
        value={aboutForm.bio || ''}
        onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    </div>

    <div
      style={{
        marginBottom: '2.5rem',
        padding: '1.8rem',
        border: '1px dashed var(--outline, #747878)',
        background: 'var(--surface-low, #f5f3f0)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0, color: 'var(--secondary)' }}>
          Ảnh Đại Diện Portfolio (Bức Tranh Lớn Cạnh Chữ PORTFOLIO)
        </h4>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        <div>
          <label style={{ ...labelStyle, marginBottom: '0.4rem', cursor: 'pointer' }}>
            Chọn Tệp Ảnh Mới (JPG, PNG, WEBP)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onHeroFileChange}
            style={{ marginBottom: '1rem', width: '100%' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Caption Trái</label>
              <input
                type="text"
                value={aboutForm.heroTagLeft || ''}
                onChange={(e) => setAboutForm({ ...aboutForm, heroTagLeft: e.target.value })}
                placeholder="FIGURATIVE ARCHIVE"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Caption Phải</label>
              <input
                type="text"
                value={aboutForm.heroTagRight || ''}
                onChange={(e) => setAboutForm({ ...aboutForm, heroTagRight: e.target.value })}
                placeholder="GIKA STUDIO"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            background: '#ffffff',
            padding: '15px',
            border: '1px solid var(--outline-hairline)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--on-surface-variant)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            ẢNH HIỆN TẠI / XEM TRƯỚC:
          </span>
          {heroPreviewUrl ? (
            <img
              src={heroPreviewUrl}
              alt="Hero Preview"
              style={{
                maxHeight: '180px',
                maxWidth: '100%',
                objectFit: 'contain',
                border: '1px solid var(--outline-hairline)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            />
          ) : (
            <span style={{ fontStyle: 'italic', fontSize: '12px', color: '#888' }}>Chưa có ảnh</span>
          )}
        </div>
      </div>
    </div>

    <TimelineArraySection
      heading="2. Học Vấn (Education)"
      addLabel="+ Thêm Mục Học Vấn"
      items={aboutForm.education}
      field="education"
      titlePlaceholder="Tên bằng cấp / Chứng chỉ"
      subtitlePlaceholder="Phụ đề: Chuyên ngành • Năm"
      template={{ title: 'Bằng cấp / Khóa học mới', subtitle: 'CHUYÊN NGÀNH • NĂM' }}
      onChangeItem={onArrayChange}
      onAddItem={onAddArrayItem}
      onRemoveItem={onRemoveArrayItem}
    />

    <TimelineArraySection
      heading="3. Kinh Nghiệm (Experience)"
      addLabel="+ Thêm Mục Kinh Nghiệm"
      items={aboutForm.experience}
      field="experience"
      titlePlaceholder="Vị trí công việc"
      subtitlePlaceholder="Phụ đề: Nơi làm việc • Thời gian"
      template={{ title: 'Vị trí công tác', subtitle: 'TỔ CHỨC / NƠI LÀM VIỆC • NĂM' }}
      onChangeItem={onArrayChange}
      onAddItem={onAddArrayItem}
      onRemoveItem={onRemoveArrayItem}
    />

    <div style={{ marginBottom: '2.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.8rem',
        }}
      >
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0, color: 'var(--secondary)' }}>
          4. Thành Tích & Giải Thưởng (Honors & Awards)
        </h4>
        <button
          type="button"
          onClick={() =>
            onAddArrayItem('awards', {
              year: '2024',
              title: 'Tên giải thưởng mới',
              description: 'Mô tả vinh danh ngắn gọn',
            })
          }
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--secondary-dark)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          + Thêm Giải Thưởng
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {(aboutForm.awards || []).map((award, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1.5fr 2fr auto',
              gap: '10px',
              alignItems: 'center',
              background: 'var(--surface-low)',
              padding: '10px 14px',
            }}
          >
            <input
              type="text"
              placeholder="Năm (VD: 2024)"
              value={award.year}
              onChange={(e) => onArrayChange('awards', idx, 'year', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Tên giải thưởng"
              value={award.title}
              onChange={(e) => onArrayChange('awards', idx, 'title', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Mô tả chi tiết"
              value={award.description}
              onChange={(e) => onArrayChange('awards', idx, 'description', e.target.value)}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => onRemoveArrayItem('awards', idx)}
              style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>
    </div>

    <button
      type="submit"
      disabled={savingAbout}
      className="filter-btn active"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.9rem 2.2rem' }}
    >
      <Icons.Save />
      <span>{savingAbout ? 'ĐANG LƯU DỮ LIỆU...' : 'LƯU TẤT CẢ NỘI DUNG /ABOUT'}</span>
    </button>
  </form>
);

export default AboutTab;

