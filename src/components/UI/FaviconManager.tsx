import React, { useEffect } from 'react';
import { useAppConfig } from '../../contexts/AppConfigContext';
import API_CONFIG from '../../config/api';

const FaviconManager: React.FC = () => {
  const { logoUrl, appName } = useAppConfig();

  const getAbsoluteLogoUrl = (logoFileName: string) => {
    if (!logoFileName) return '/vite.svg'; // fallback ke favicon default
    let apiBase = API_CONFIG.getApiBaseURL();
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      apiBase = 'http://localhost:3000/api';
    } else {
      apiBase = apiBase.replace(/\/api\/?$/, '/api');
    }
    return `${apiBase}/file/logo/${logoFileName}`;
  };

  // Fungsi untuk menambahkan CSS untuk favicon bulat
  const addCircularFaviconCSS = () => {
    // Hapus CSS yang sudah ada jika ada
    const existingCSS = document.getElementById('circular-favicon-css');
    if (existingCSS) {
      existingCSS.remove();
    }

    // Tambahkan CSS untuk favicon bulat
    const style = document.createElement('style');
    style.id = 'circular-favicon-css';
    style.textContent = `
      link[rel="icon"] {
        border-radius: 50% !important;
        background: white !important;
        padding: 2px !important;
        box-shadow: 0 0 0 1px #e5e7eb !important;
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    const updateFavicon = () => {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (logoUrl) {
        try {
          console.log('Updating favicon with logo:', logoUrl);
          const logoUrlAbsolute = getAbsoluteLogoUrl(logoUrl);
          console.log('Logo URL absolute:', logoUrlAbsolute);
          
          if (faviconLink) {
            faviconLink.href = logoUrlAbsolute;
            console.log('Updated existing favicon link with logo');
          } else {
            // Jika belum ada link favicon, buat baru
            const newFaviconLink = document.createElement('link');
            newFaviconLink.rel = 'icon';
            newFaviconLink.type = 'image/png';
            newFaviconLink.href = logoUrlAbsolute;
            document.head.appendChild(newFaviconLink);
            console.log('Created new favicon link with logo');
          }

          // Tambahkan CSS untuk favicon bulat
          addCircularFaviconCSS();
        } catch (error) {
          console.error('Error updating favicon:', error);
          // Fallback ke favicon default jika ada error
          if (faviconLink) {
            faviconLink.href = '/vite.svg';
          }
        }
      } else {
        console.log('No logo URL, using default favicon');
        // Jika tidak ada logo, gunakan favicon default
        if (faviconLink) {
          faviconLink.href = '/vite.svg';
        }
        
        // Hapus CSS favicon bulat
        const existingCSS = document.getElementById('circular-favicon-css');
        if (existingCSS) {
          existingCSS.remove();
        }
      }
    };

    updateFavicon();
  }, [logoUrl]);

  // Komponen ini tidak me-render apapun, hanya mengatur favicon
  return null;
};

export default FaviconManager; 