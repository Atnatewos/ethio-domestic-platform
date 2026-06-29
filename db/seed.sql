-- File path: /db/seed.sql
-- Purpose: Insert default platform settings ONLY
-- SECURITY: No hardcoded credentials - admin users created via setup script

-- =====================================================
-- DEFAULT PLATFORM SETTINGS
-- These are safe to commit to Git (not secrets)
-- Admin can override these at runtime via Platform Settings page
-- =====================================================

INSERT INTO platform_settings (key, value, value_type, description) VALUES
-- Platform Identity
('platform.name', '"EthioDomestic"', 'string', 'Platform name'),
('platform.tagline', '"Verified Domestic Workers for Ethiopian Families"', 'string', 'Platform tagline'),

-- Registration Fees (ETB)
('pricing.registration.worker.amount', '200', 'number', 'Worker registration fee in ETB'),
('pricing.registration.employer.amount', '300', 'number', 'Employer registration fee in ETB'),

-- Commission Rates (percentage of first month salary)
('pricing.commission.worker.percent', '15', 'number', 'Worker commission percentage'),
('pricing.commission.employer.percent', '15', 'number', 'Employer commission percentage'),

-- Premium Features
('pricing.urgentHire.amount', '200', 'number', 'Urgent hire badge fee in ETB'),
('pricing.urgentHire.durationHours', '48', 'number', 'Urgent badge duration in hours'),
('pricing.officeService.amount', '50', 'number', 'Office registration service fee in ETB'),

-- Worker Collateral
('pricing.collateral.amount', '500', 'number', 'Worker collateral deposit in ETB'),
('pricing.collateral.holdMonths', '6', 'number', 'Months to hold collateral')

ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================

SELECT '✅ Default platform settings inserted successfully' as status;
SELECT '⚠️  Remember to create admin user via: node scripts/setup-admin.js' as reminder;