import { DEFAULT_ABOUT_DATA, DEFAULT_CONTACT_DATA } from './site/siteDefaults';
import { fetchSiteSetting, saveSiteSetting } from './site/siteSettingsRepository';

export { DEFAULT_ABOUT_DATA, DEFAULT_CONTACT_DATA };

export const fetchAboutData = () =>
  fetchSiteSetting('about', DEFAULT_ABOUT_DATA, 'About');

export const saveAboutData = (aboutData) =>
  saveSiteSetting('about', aboutData, '/about', 'Dữ liệu hồ sơ /about không hợp lệ.');

export const fetchContactData = () =>
  fetchSiteSetting('contact', DEFAULT_CONTACT_DATA, 'Contact');

export const saveContactData = (contactData) =>
  saveSiteSetting('contact', contactData, '/contact', 'Dữ liệu liên hệ /contact không hợp lệ.');
