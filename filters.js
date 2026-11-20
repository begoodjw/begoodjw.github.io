export function availableStores(app, country, platform) {
  return Object.entries(app.stores || {}).filter(([key, store]) => {
    if (!['ios', 'android'].includes(key) || (platform !== 'all' && platform !== key)) return false;
    if (store.countries !== '*' && !(Array.isArray(store.countries) && store.countries.includes(country))) return false;
    try {
      const url = new URL(store.url);
      return url.protocol === 'https:' && url.hostname === (key === 'ios' ? 'apps.apple.com' : 'play.google.com');
    } catch {
      return false;
    }
  });
}
