// MiMo英语课堂 - Service Worker
// 让App在没有网络时也能正常使用

const CACHE_NAME = 'mimo-english-v1';

// 需要缓存的文件列表
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 安装阶段：缓存所有文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('缓存文件中...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 激活阶段：清除旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('清除旧缓存:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 请求拦截：优先用缓存，没有再联网
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // 有缓存直接返回
      }
      return fetch(event.request); // 没缓存就联网
    })
  );
});
