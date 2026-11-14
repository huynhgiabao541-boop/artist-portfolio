import React, { useState } from 'react';
import { GALLERY_CATEGORIES, GALLERY_WORKS } from '../data';

function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredWorks = activeCategory === 'all'
        ? GALLERY_WORKS
        : GALLERY_WORKS.filter(work => work.category === activeCategory);

    return (
        <section className="gallery-section" id="gallery">
            <div className="site-container">
                {/* Filter and Curatorial Controls */}
                <div className="gallery-filter-bar">
                    <div className="filter-pills">
                        {GALLERY_CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="curatorial-sort">
                        <span>ARRANGED BY CURATORIAL ENTRY</span>
                        <i className="fas fa-sliders-h"></i>
                    </div>
                </div>

                {/* Museum Card Grid */}
                <div className="gallery-grid">
                    {filteredWorks.map(work => (
                        <article key={work.id} className="work-card">
                            <div className="work-image-wrapper">
                                <img 
                                    src={work.image} 
                                    alt={work.title} 
                                    className="work-img"
                                    loading="lazy"
                                />
                            </div>

                            <div className="work-info">
                                <div className="work-meta-top">
                                    <span>{work.year} • {work.category.replace('-', ' ')}</span>
                                    <span className="work-status-badge">{work.status}</span>
                                </div>
                                <h4 className="work-title">{work.title}</h4>
                                <div className="work-specs">
                                    <p>{work.medium}</p>
                                    <p>{work.dimensions}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
