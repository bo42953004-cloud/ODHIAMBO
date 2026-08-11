import React, { useRef, useState } from 'react';
import { useAdminPortal, applyColors } from '../AdminPortalContext';

const SiteCustomization: React.FC = () => {
    const { settings, updateSettings } = useAdminPortal();
    const fileRef = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(false);
    const [local, setLocal] = useState({
        colorActiveTab: settings.colorActiveTab,
        colorInactiveTab: settings.colorInactiveTab,
        colorPrimary: settings.colorPrimary,
        colorBackground: settings.colorBackground,
        siteName: settings.siteName,
        aboutText: settings.aboutText,
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const url = ev.target?.result as string;
            updateSettings({ logoUrl: url });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        updateSettings(local);
        applyColors(local);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const clearLogo = () => updateSettings({ logoUrl: '' });

    const handlePasswordChange = () => {
        const current = prompt('Enter current password:');
        if (current !== settings.password) { alert('Wrong password.'); return; }
        const next = prompt('Enter new password (min 6 chars):');
        if (!next || next.length < 6) { alert('Password too short.'); return; }
        const confirm = prompt('Confirm new password:');
        if (next !== confirm) { alert('Passwords do not match.'); return; }
        updateSettings({ password: next });
        alert('Password updated!');
    };

    return (
        <div className='admin-tab__customize'>
            <div className='admin-tab__header'>
                <h2 className='admin-tab__title'>Site Customization</h2>
                <p className='admin-tab__subtitle'>Control branding, colors, and site identity.</p>
            </div>

            <div className='customize-sections'>
                <section className='customize-section'>
                    <h3 className='customize-section__title'>🖼️ Logo & Branding</h3>
                    <div className='logo-upload'>
                        {settings.logoUrl ? (
                            <div className='logo-preview'>
                                <img src={settings.logoUrl} alt='Site logo' />
                                <button className='admin-btn admin-btn--danger' onClick={clearLogo}>Remove Logo</button>
                            </div>
                        ) : (
                            <div className='logo-placeholder' onClick={() => fileRef.current?.click()}>
                                <span>📷</span>
                                <p>Click to upload logo</p>
                            </div>
                        )}
                        <input ref={fileRef} type='file' accept='image/*' onChange={handleLogoUpload} style={{ display: 'none' }} />
                        <button className='admin-btn admin-btn--secondary' onClick={() => fileRef.current?.click()}>
                            {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                        </button>
                    </div>
                    <div className='admin-form__row'>
                        <label>Site Name</label>
                        <input
                            value={local.siteName}
                            onChange={e => setLocal(p => ({ ...p, siteName: e.target.value }))}
                            placeholder='My Trading Bot'
                        />
                    </div>
                    <div className='admin-form__row'>
                        <label>About / Description</label>
                        <textarea
                            value={local.aboutText}
                            onChange={e => setLocal(p => ({ ...p, aboutText: e.target.value }))}
                            placeholder='Describe your platform...'
                            rows={4}
                        />
                    </div>
                </section>

                <section className='customize-section'>
                    <h3 className='customize-section__title'>🎨 Color Scheme</h3>
                    <div className='color-grid'>
                        {[
                            { key: 'colorActiveTab' as const, label: 'Active Tab Color' },
                            { key: 'colorInactiveTab' as const, label: 'Inactive Tab Color' },
                            { key: 'colorPrimary' as const, label: 'Primary / Accent Color' },
                            { key: 'colorBackground' as const, label: 'Background Color' },
                        ].map(({ key, label }) => (
                            <div key={key} className='color-row'>
                                <label>{label}</label>
                                <div className='color-row__input'>
                                    <input
                                        type='color'
                                        value={local[key]}
                                        onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
                                    />
                                    <input
                                        type='text'
                                        value={local[key]}
                                        onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
                                        maxLength={9}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='color-preview'>
                        <div className='color-swatch' style={{ background: local.colorBackground }}>
                            <span className='color-swatch__tab' style={{ background: local.colorActiveTab }}>Active</span>
                            <span className='color-swatch__tab' style={{ background: local.colorInactiveTab, opacity: 0.7 }}>Inactive</span>
                            <span className='color-swatch__accent' style={{ color: local.colorPrimary }}>● Accent</span>
                        </div>
                    </div>
                </section>

                <section className='customize-section'>
                    <h3 className='customize-section__title'>🔐 Security</h3>
                    <button className='admin-btn admin-btn--secondary' onClick={handlePasswordChange}>
                        Change Admin Password
                    </button>
                </section>
            </div>

            <div className='customize-footer'>
                <button className={`admin-btn admin-btn--primary ${saved ? 'admin-btn--saved' : ''}`} onClick={handleSave}>
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default SiteCustomization;
