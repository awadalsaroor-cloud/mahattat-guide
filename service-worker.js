// اسم النسخة — غيّره في كل مرة تحدّث فيها محتوى الدليل حتى يعيد المتصفح تحميل الملفات
const CACHE_NAME = 'mahattat-guide-v1';

// الملفات الأساسية التي يجب تخزينها للعمل بدون إنترنت
// إذا أضفت صورًا أو ملفات جديدة داخل assets أضف مسارها هنا
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './app.js',
  './manifest.json',
  './assets/cover.jpg',
  './assets/main_headings.png'
];

// عند التثبيت: خزّن الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// عند التفعيل: احذف أي نسخة تخزين قديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// عند الطلب: أعطِ النسخة المخزنة أولًا، وإن لم توجد اذهب للإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // خزّن أي ملف جديد يُطلب (مثل صور صفحات الدليل) تلقائيًا لمرات لاحقة
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // في حال تعذر كل شيء (لا إنترنت ولا نسخة مخزنة)
      return caches.match('./index.html');
    })
  );
});
