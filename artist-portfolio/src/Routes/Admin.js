import React, { useState } from 'react';
import Toast from '../components/Toast';
import { useToastQueue } from '../hooks/useToastQueue';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminMuseum } from '../hooks/useAdminMuseum';
import { useAdminSettings } from '../hooks/useAdminSettings';
import AdminLoginView from '../components/admin/AdminLoginView';
import AdminHeader from '../components/admin/AdminHeader';
import MuseumTab from '../components/admin/MuseumTab';
import AboutTab from '../components/admin/AboutTab';
import ContactTab from '../components/admin/ContactTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('museum');
  const { toasts, showToast, dismissToast } = useToastQueue();
  const museum = useAdminMuseum(showToast);
  const settings = useAdminSettings(showToast);

  const {
    currentUser,
    authChecking,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    loggingIn,
    handleLogin,
    handleLogout,
  } = useAdminAuth(
    () => {
      museum.loadAdminArtworks();
      settings.loadSettingsData();
    },
    () => museum.setArtworks([])
  );

  if (authChecking) {
    return (
      <main className="museum-page" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#666' }}>
          Đang xác thực thông tin quản trị viên...
        </p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <AdminLoginView
        loginEmail={loginEmail}
        onEmailChange={setLoginEmail}
        loginPassword={loginPassword}
        onPasswordChange={setLoginPassword}
        loginError={loginError}
        loggingIn={loggingIn}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <main style={{ padding: '3rem 0 6rem 0', background: 'var(--surface, #fbf9f6)', minHeight: '90vh' }}>
      <div className="site-container">
        <AdminHeader
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          artworkCount={museum.artworks.length}
          onLogout={handleLogout}
        />

        {activeTab === 'museum' && <MuseumTab {...museum} />}

        {activeTab === 'about' && (
          <AboutTab
            aboutForm={settings.aboutForm}
            setAboutForm={settings.setAboutForm}
            savingAbout={settings.savingAbout}
            heroPreviewUrl={settings.heroPreviewUrl}
            onHeroFileChange={settings.handleHeroFileChange}
            onSaveAbout={settings.handleSaveAbout}
            onArrayChange={settings.handleArrayChange}
            onAddArrayItem={settings.handleAddArrayItem}
            onRemoveArrayItem={settings.handleRemoveArrayItem}
          />
        )}

        {activeTab === 'contact' && (
          <ContactTab
            contactForm={settings.contactForm}
            setContactForm={settings.setContactForm}
            savingContact={settings.savingContact}
            onSaveContact={settings.handleSaveContact}
          />
        )}

        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    </main>
  );
};

export default Admin;
