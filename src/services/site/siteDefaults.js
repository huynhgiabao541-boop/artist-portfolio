import { ARTIST_INFO, EDUCATION, EXPERIENCE, AWARDS } from '../../data';

export const DEFAULT_ABOUT_DATA = {
  name: ARTIST_INFO.name,
  studio: ARTIST_INFO.studio,
  location: ARTIST_INFO.location,
  selectedWorks: ARTIST_INFO.selectedWorks,
  bio: ARTIST_INFO.bio,
  email: ARTIST_INFO.email,
  phone: ARTIST_INFO.phone,
  heroPainting: ARTIST_INFO.heroPainting,
  heroTagLeft: 'FIGURATIVE ARCHIVE',
  heroTagRight: 'GIKA STUDIO',
  education: EDUCATION,
  experience: EXPERIENCE,
  awards: AWARDS,
};

export const DEFAULT_CONTACT_DATA = {
  tag: 'INQUIRE / ACQUISITIONS',
  title: `Connect with ${ARTIST_INFO.name}`,
  subtitle:
    'For private commissions, editorial assignments, exhibition proposals, or acquisition inquiries regarding available works:',
  thankYouMessage:
    'Thank you for your inquiry. The studio will review your correspondence and respond promptly.',
  email: ARTIST_INFO.email,
  phone: ARTIST_INFO.phone,
  studios: ['GIKA STUDIO: SHIMOGYO WARD', 'PARIS ATELIER: RUE DE TURENNE, 3E'],
};

