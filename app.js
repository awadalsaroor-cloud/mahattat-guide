// ============ ICONS (simple line icons, hand-authored) ============
const ICONS = {
  palm: `<path d="M12 21V10"/><path d="M12 10c0-3-2-5-5-5 0 3 2 5 5 5z"/><path d="M12 10c0-3 2-5 5-5 0 3-2 5-5 5z"/><path d="M12 10c0-4-1.5-6.5-4-8 0 3.5 1.5 6 4 8z"/><path d="M12 10c0-4 1.5-6.5 4-8 0 3.5-1.5 6-4 8z"/><path d="M8 21h8"/>`,
  radio: `<rect x="4" y="9" width="16" height="10" rx="1.5"/><circle cx="8.5" cy="14" r="1.8"/><path d="M13 12.2h4M13 15.8h4"/><path d="M7 9l3-4h4l3 4"/>`,
  cap: `<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/>`,
  school: `<path d="M4 21V10l8-5 8 5v11"/><path d="M9 21v-6h6v6"/><path d="M4 21h16"/><path d="M9 13h.01M15 13h.01"/>`,
  building: `<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/><path d="M10 21v-4h4v4"/>`,
  heart: `<path d="M12 20s-7-4.4-9.5-9C.7 7.6 3 4 6.5 4c2 0 3.3 1 5.5 3.3C14.2 5 15.5 4 17.5 4 21 4 23.3 7.6 21.5 11 19 15.6 12 20 12 20z"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3M9 21h6"/>`,
  book: `<path d="M4 5c2-1.3 5-1.3 8 0v14c-3-1.3-6-1.3-8 0V5z"/><path d="M20 5c-2-1.3-5-1.3-8 0v14c3-1.3 6-1.3 8 0V5z"/>`,
  compass: `<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6 6-2z"/>`,
  leaf: `<path d="M5 21c9 0 14-5 14-14V4h-3C7 4 5 12 5 21z"/><path d="M5 21c0-5 3-9 8-11"/>`,
  medal: `<path d="M8.5 3l2 6M15.5 3l-2 6"/><circle cx="12" cy="15" r="5.5"/><path d="M12 12.3l1 3h-2l1-3z" fill="currentColor" stroke="none"/>`,
  feather: `<path d="M20 4c-6 0-13 3-15 11-1 3.5 1 6 4 5C13 18 17 12 17 6"/><path d="M4 20l6-6"/><path d="M9 12l3 3"/>`,
  spark: `<path d="M12 3l1.8 5.6L19 10.5l-5.2 1.9L12 18l-1.8-5.6L5 10.5l5.2-1.9L12 3z"/><path d="M5 18l.8 2.2L8 21l-2.2.8L5 24l-.8-2.2L2 21l2.2-.8L5 18z"/>`,
};

// ============ STATE ============
let state = { section: null, itemIndex: 0, pageIndex: 0 };

// ============ SCREEN NAV ============
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ============ SCREEN 1 -> 2 ============
document.getElementById('screen-cover').addEventListener('click', () => {
  showScreen('screen-menu');
});

// ============ BUILD MENU (Screen 2) ============
function buildMenu(){
  const grid = document.getElementById('medallion-grid');
  grid.innerHTML = '';
  SECTIONS.forEach(sec => {
    const el = document.createElement('div');
    el.className = 'medallion';
    el.innerHTML = `
      <div class="medallion-badge">
        <svg viewBox="0 0 24 24">${ICONS[sec.icon] || ''}</svg>
      </div>
      <div class="medallion-title">${sec.title}</div>
      ${sec.sub ? `<div class="medallion-sub">${sec.sub}</div>` : ''}
    `;
    el.addEventListener('click', () => openSection(sec));
    grid.appendChild(el);
  });
}

// ============ SCREEN 3: SUBTITLES LIST ============
function openSection(sec){
  state.section = sec;
  document.getElementById('list-eyebrow').textContent = sec.sub || 'الباب';
  document.getElementById('list-title').textContent = sec.title;
  const list = document.getElementById('toc-list');
  list.innerHTML = '';
  sec.items.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'toc-item';
    row.innerHTML = `
      <div class="toc-num">${idx + 1}</div>
      <div class="toc-title">${item.title}</div>
      <svg class="toc-arrow" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    row.addEventListener('click', () => openReader(sec, idx));
    list.appendChild(row);
  });
  showScreen('screen-list');
}

document.getElementById('back-to-cover').addEventListener('click', () => showScreen('screen-cover'));
document.getElementById('back-to-menu').addEventListener('click', () => showScreen('screen-menu'));
document.getElementById('back-to-list').addEventListener('click', () => showScreen('screen-list'));

// ============ SCREEN 4: READER ============
function openReader(sec, itemIndex){
  state.section = sec;
  state.itemIndex = itemIndex;
  state.pageIndex = 0;
  document.getElementById('reader-title').textContent = sec.items[itemIndex].title;
  renderPage();
  showScreen('screen-reader');
}

function currentItem(){
  return state.section.items[state.itemIndex];
}

function totalPages(){
  return currentItem().pages.length;
}

function renderPage(){
  const it = currentItem();
  const pageNum = it.pages[state.pageIndex];
  const padded = String(pageNum).padStart(3, '0');
  document.getElementById('reader-img').src = `assets/pages/page-${padded}.jpg`;
  document.getElementById('page-counter').textContent = `${state.pageIndex + 1} / ${totalPages()}`;
  document.getElementById('reader-img-wrap').scrollTop = 0;
  document.getElementById('btn-prev').disabled = state.pageIndex === 0;
  document.getElementById('btn-next').disabled = state.pageIndex === totalPages() - 1;
}

document.getElementById('btn-next').addEventListener('click', () => {
  if (state.pageIndex < totalPages() - 1){ state.pageIndex++; renderPage(); }
});
document.getElementById('btn-prev').addEventListener('click', () => {
  if (state.pageIndex > 0){ state.pageIndex--; renderPage(); }
});

// swipe support
(function(){
  let startX = null;
  const body = document.getElementById('reader-body');
  body.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  body.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 60){
      // RTL: swipe right -> previous page, swipe left -> next page
      if (dx > 0){ if (state.pageIndex > 0){ state.pageIndex--; renderPage(); } }
      else { if (state.pageIndex < totalPages() - 1){ state.pageIndex++; renderPage(); } }
    }
    startX = null;
  });
})();

// keyboard support
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-reader').classList.contains('active')) return;
  if (e.key === 'ArrowLeft') { if (state.pageIndex < totalPages() - 1){ state.pageIndex++; renderPage(); } }
  if (e.key === 'ArrowRight') { if (state.pageIndex > 0){ state.pageIndex--; renderPage(); } }
  if (e.key === 'Escape') { showScreen('screen-list'); }
});

// ============ INIT ============
buildMenu();
