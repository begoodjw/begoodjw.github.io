import { availableStores } from './filters.js';

const query = new URLSearchParams(location.search);
const preferredLanguage = (query.get('lang') || navigator.language).split('-')[0].toLowerCase();
const language = ['ko', 'ja'].includes(preferredLanguage) ? preferredLanguage : 'en';
const copy = {
  ko: { title: '조금 더 간편하게', subtitle: '필요한 순간에 간편하게 쓸 수 있는 앱을 만듭니다.', heading: '개발자의 다른 앱', country: '국가', platform: '플랫폼', all: '전체', worldwide: '전 세계 공통', loading: '앱 목록을 불러오는 중입니다.', empty: '선택한 국가와 플랫폼에서 표시할 앱이 없습니다.', error: '앱 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', count: n => `앱 ${n}개`, demo: '예시 미리보기' },
  ja: { title: 'もう少し手軽に', subtitle: '必要なときに、手軽に使えるアプリを作っています。', heading: '開発者のほかのアプリ', country: '国', platform: 'プラットフォーム', all: 'すべて', worldwide: '世界共通のアプリ', loading: 'アプリを読み込んでいます。', empty: '選択した国とプラットフォームで表示できるアプリはありません。', error: 'アプリ一覧を読み込めませんでした。しばらくしてからお試しください。', count: n => n + '件のアプリ', demo: 'サンプルプレビュー' },
  en: { title: 'A little easier', subtitle: 'We make apps that are easy to use whenever you need them.', heading: 'More apps by Begood', country: 'Country', platform: 'Platform', all: 'All platforms', worldwide: 'Worldwide apps', loading: 'Loading apps…', empty: 'No apps to show for this country and platform.', error: 'Could not load the app list. Please try again later.', count: n => `${n} ${n === 1 ? 'app' : 'apps'}`, demo: 'Sample preview' }
}[language];
const demo = query.get('demo') === '1';
const country = document.querySelector('#country');
const platform = document.querySelector('#platform');
const status = document.querySelector('#status');
const list = document.querySelector('#apps');
const storeNames = { ios: 'App Store', android: 'Google Play' };
const names = new Intl.DisplayNames([language], { type: 'region' });

document.documentElement.lang = language;
document.title = copy.title + ' · Begood';
for (const [id, value] of Object.entries({
  title: copy.title, subtitle: copy.subtitle, 'catalog-title': demo ? copy.demo : copy.heading,
  'region-label': copy.country, 'platform-label': copy.platform, status: copy.loading
})) {
  document.getElementById(id).textContent = value;
}
platform.options[0].textContent = copy.all;

function make(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

function localized(value) {
  return value?.[language] || value?.default || value?.en || value?.ko || value?.ja || '';
}

function render(apps) {
  list.replaceChildren();
  let count = 0;
  for (const app of apps) {
    if (app.id === query.get('from')) continue;
    const stores = availableStores(app, country.value, platform.value);
    if (!stores.length) continue;
    count++;
    const name = app.namesByCountry?.[country.value] || localized(app.name);
    const card = make('li', 'card');
    const icon = make(app.icon ? 'img' : 'span', 'icon', app.icon ? undefined : name.slice(0, 1));
    if (app.icon) {
      icon.src = app.icon;
      icon.alt = '';
      icon.loading = 'lazy';
    } else {
      icon.setAttribute('aria-hidden', 'true');
    }
    const details = make('div', '');
    details.append(make('h3', '', name));
    const description = app.descriptionsByCountry?.[country.value] || localized(app.description);
    if (description) details.append(make('p', '', description));
    const links = make('div', 'stores');
    for (const [key, store] of stores) {
      const link = make(demo ? 'span' : 'a', 'store', storeNames[key]);
      if (!demo) {
        link.href = store.url;
        link.setAttribute('aria-label', name + ' · ' + storeNames[key]);
      }
      links.append(link);
    }
    card.append(icon, details, links);
    list.append(card);
  }
  status.textContent = count ? copy.count(count) : copy.empty;
}

try {
  const response = await fetch(demo ? './apps.example.json' : './apps.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error('Catalog unavailable');
  const apps = await response.json();
  const requested = (query.get('country') || '').toUpperCase();
  const browserRegion = new Intl.Locale(navigator.language).region;
  const regions = new Set(['KR', 'US', 'JP']);
  for (const code of [requested, browserRegion]) {
    if (/^[A-Z]{2}$/.test(code || '')) regions.add(code);
  }
  for (const app of apps) {
    for (const store of Object.values(app.stores || {})) {
      if (Array.isArray(store.countries)) store.countries.forEach(code => regions.add(code));
    }
  }
  const options = [...regions].map(code => [code, names.of(code)]);
  options.sort((a, b) => a[1].localeCompare(b[1], language));
  country.add(new Option(copy.worldwide, 'global'));
  for (const [code, label] of options) country.add(new Option(label, code));
  country.value = requested === 'GLOBAL' ? 'global'
    : regions.has(requested) ? requested : browserRegion || 'global';
  platform.value = ['ios', 'android'].includes(query.get('platform')) ? query.get('platform') : 'all';
  for (const [control, key] of [[country, 'country'], [platform, 'platform']]) {
    control.addEventListener('change', () => {
      const url = new URL(location.href);
      url.searchParams.set(key, control.value);
      history.replaceState(null, '', url);
      render(apps);
    });
  }
  render(apps);
} catch (error) {
  status.textContent = copy.error;
  console.error(error);
}
