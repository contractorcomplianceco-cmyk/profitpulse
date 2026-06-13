export interface IntegrationData {
  id: string;
  name: string;
  category: 'Accounting' | 'CRM' | 'Advertising' | 'Analytics' | 'Economic Data';
  status: 'connected' | 'syncing' | 'disconnected';
  lastSync: string;
}

export const integrations: IntegrationData[] = [
  { id: 'zoho-books', name: 'Zoho Books', category: 'Accounting', status: 'connected', lastSync: '10 mins ago' },
  { id: 'zoho-analytics', name: 'Zoho Analytics', category: 'Analytics', status: 'syncing', lastSync: 'In progress' },
  { id: 'zoho-crm', name: 'Zoho CRM', category: 'CRM', status: 'connected', lastSync: '2 mins ago' },
  { id: 'google-ads', name: 'Google Ads', category: 'Advertising', status: 'connected', lastSync: '1 hour ago' },
  { id: 'google-analytics', name: 'Google Analytics', category: 'Analytics', status: 'connected', lastSync: '1 hour ago' },
  { id: 'google-search', name: 'Google Search Console', category: 'Analytics', status: 'connected', lastSync: '4 hours ago' },
  { id: 'meta-ads', name: 'Meta Ads', category: 'Advertising', status: 'connected', lastSync: '45 mins ago' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', category: 'Advertising', status: 'disconnected', lastSync: '3 days ago' },
  { id: 'microsoft-ads', name: 'Microsoft Ads', category: 'Advertising', status: 'connected', lastSync: '2 hours ago' },
  { id: 'call-tracking', name: 'Call Tracking', category: 'Analytics', status: 'connected', lastSync: '15 mins ago' },
  { id: 'email-marketing', name: 'Email Marketing', category: 'Advertising', status: 'connected', lastSync: '30 mins ago' },
  { id: 'fred', name: 'FRED (Fed Reserve)', category: 'Economic Data', status: 'connected', lastSync: 'Yesterday' },
  { id: 'bls', name: 'BLS (Labor Stats)', category: 'Economic Data', status: 'syncing', lastSync: 'In progress' },
  { id: 'census', name: 'Census Bureau', category: 'Economic Data', status: 'disconnected', lastSync: '1 week ago' },
];

export const integrationStats = {
  total: integrations.length,
  connected: integrations.filter(i => i.status === 'connected' || i.status === 'syncing').length,
  error: integrations.filter(i => i.status === 'disconnected').length,
  syncTrend: [
    { day: 'Mon', success: 98, errors: 2 },
    { day: 'Tue', success: 99, errors: 1 },
    { day: 'Wed', success: 95, errors: 5 },
    { day: 'Thu', success: 97, errors: 3 },
    { day: 'Fri', success: 99, errors: 1 },
    { day: 'Sat', success: 100, errors: 0 },
    { day: 'Sun', success: 96, errors: 4 },
  ]
};
