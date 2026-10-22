// 커넥트모바일 오프라인 보기용 서비스 워커.
// 원칙: 평소 이용에는 끼어들지 않습니다. 사용자가 "이 폰에 저장해 두기"를 눌러 저장한 것만, 인터넷이 안 될 때 보여 줍니다.
//  - 페이지 이동: 항상 인터넷으로 먼저 받습니다(최신 내용). 실패했을 때만 저장해 둔 것을 보여 줍니다.
//  - 저장된 이미지와 스크립트: 저장해 둔 것이 있으면 그것을 씁니다.
const CACHE = 'cm-offline-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
	e.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k.startsWith('cm-offline-') && k !== CACHE).map((k) => caches.delete(k)));
			await self.clients.claim();
		})(),
	);
});

self.addEventListener('fetch', (e) => {
	const req = e.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin !== self.location.origin) return;

	if (req.mode === 'navigate') {
		e.respondWith(
			(async () => {
				try {
					const res = await fetch(req);
					// 이미 저장해 둔 페이지라면 최신 내용으로 저장본을 갱신합니다.
					if (res.ok) {
						const cache = await caches.open(CACHE);
						const had = await cache.match(url.pathname);
						if (had) cache.put(url.pathname, res.clone());
					}
					return res;
				} catch (err) {
					const cache = await caches.open(CACHE);
					const hit = (await cache.match(url.pathname)) || (await cache.match(url.pathname.replace(/\/?$/, '/')));
					if (hit) return hit;
					const off = await cache.match('/offline/');
					if (off) return off;
					return new Response('인터넷에 연결되어 있지 않아요. 연결 후 다시 열어 주세요.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
				}
			})(),
		);
		return;
	}

	// 저장해 둔 이미지, 스크립트, 스타일만 저장본을 먼저 씁니다. 저장된 게 없으면 그대로 인터넷으로 받습니다.
	if (/^\/(guide|_astro|brand)\//.test(url.pathname)) {
		e.respondWith(
			(async () => {
				const cache = await caches.open(CACHE);
				const hit = await cache.match(req);
				if (hit) return hit;
				return fetch(req);
			})(),
		);
	}
});
