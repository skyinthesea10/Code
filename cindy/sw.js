/* Cindy AMRAP 서비스워커: 앱 파일을 캐시해 오프라인에서도 열리게 한다.
   - 앱 본체(index.html): 캐시 우선. 새 버전 확인과 갱신은 페이지(index.html)가 직접 한다.
   - 그 외 파일(아이콘·매니페스트): 캐시 우선 + 백그라운드 갱신.
   캐시 이름의 버전(v1)은 파일 목록이 바뀔 때만 올리면 된다. */
var PREFIX = 'cindy-amrap-';   // github.io는 모든 저장소가 같은 출처라, 이 앱의 캐시만 건드린다
var CACHE = PREFIX + 'v1';
var HTML = './index.html';
var ASSETS = [HTML, './manifest.json', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(ASSETS.map(function (url) {
        // GitHub Pages는 10분 HTTP 캐시를 주므로, 설치 때는 브라우저 캐시를 건너뛰고 서버에서 받는다
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf(PREFIX) === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isHtml(req) {
  return req.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(req.url).pathname);
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('fresh')) return;   // 페이지의 새 버전 확인용 요청은 네트워크로 그대로 보낸다

  if (isHtml(req)) {
    event.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(HTML).then(function (cached) {
          if (cached) return cached;
          return fetch(req).then(function (res) {
            if (res && res.ok) cache.put(HTML, res.clone()).catch(function () {});
            return res;
          });
        });
      })
    );
    return;
  }

  var key = url.origin + url.pathname;   // 쿼리는 무시하고 한 키로 저장·조회
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(key).then(function (cached) {
        var network = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
          if (res && res.ok && res.type === 'basic') {
            return cache.put(key, res.clone()).catch(function () {}).then(function () { return res; });
          }
          return res;
        }).catch(function () { return null; });
        if (cached) {
          event.waitUntil(network);   // 응답 뒤에도 백그라운드 갱신이 끝날 때까지 워커를 살려 둔다
          return cached;
        }
        return network.then(function (res) {
          return res || new Response('', { status: 504, statusText: 'offline' });
        });
      });
    })
  );
});
