// File path: /config/platform.js
// Purpose: Platform identity, contact info, locale settings
// Change these values to customize the platform branding

module.exports = {
  // Platform identity
  name: 'EthioDomestic',
  tagline: 'Verified Domestic Workers for Ethiopian Families',
  description: 'A trusted platform connecting Ethiopian families with verified domestic workers',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  
  // Contact information
  contact: {
    phone: '+251-XXX-XXX-XXX',
    email: 'hello@ethiodomestic.com',
    address: 'Addis Ababa, Ethiopia',
    officeHours: 'Mon-Sat, 9:00 AM - 6:00 PM'
  },
  
  // Locale and regional settings
  locale: 'en', // 'en' for English, 'am' for Amharic (Phase 3)
  currency: 'ETB',
  currencySymbol: 'Br',
  timezone: 'Africa/Addis_Ababa',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  
  // URLs
  urls: {
    website: 'https://ethiodomestic.com',
    api: 'https://api.ethiodomestic.com',
    support: 'https://ethiodomestic.com/support'
  },
  
  // Social media (optional)
  social: {
    facebook: 'https://facebook.com/ethiodomestic',
    telegram: 'https://t.me/ethiodomestic',
    instagram: 'https://instagram.com/ethiodomestic'
  },
  
  // Legal
  legal: {
    privacyPolicy: '/privacy',
    termsOfService: '/terms',
    cookiePolicy: '/cookies'
  }
};