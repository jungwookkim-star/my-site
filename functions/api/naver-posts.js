// 네이버 블로그 최신 통신 글 목록을 JSON으로 줍니다. 주소: /api/naver-posts
// 홈페이지의 "네이버 블로그 최신 글"이 배포 없이도 새 글을 보여 주도록, 화면이 열릴 때 이 주소를 부릅니다.
// 거르는 기준은 src/lib/naverBlog.ts 와 같아요. (IT 카테고리 제외, 제목에 통신 단어가 있어야 함) 한쪽을 고치면 같이 고쳐 주세요.
// 네이버에 너무 자주 묻지 않도록 30분 동안 저장해 두고 씁니다.

const RSS_URL = 'https://rss.blog.naver.com/connect_mobile.xml';
const squash = (t) => t.replace(/\s+/g, '');
const EXCLUDE_CATEGORIES = ['IT', 'IT꿀팁', 'IT 정보', '아이티', '휴대폰 IT 정보', '휴대폰 IT정보'].map(squash);
const TELECOM = /선불|후불|알뜰|유심|개통|요금제|번호이동|앤텔레콤|멤버십/;
const KEEP_SECONDS = 1800;

const pick = (xml, tag) => {
	const m = xml.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
	return m ? m[1].trim() : '';
};

export function parsePosts(xml, limit = 4) {
	return xml
		.split('<item>')
		.slice(1)
		.map((item) => ({
			title: pick(item, 'title'),
			link: pick(item, 'link').replace(/\?fromRss.*$/, ''),
			date: new Date(pick(item, 'pubDate')),
			category: pick(item, 'category'),
		}))
		.filter((p) => p.title && /^https:\/\/blog\.naver\.com\/connect_mobile\/\d+$/.test(p.link) && !isNaN(p.date.getTime()))
		.filter((p) => !EXCLUDE_CATEGORIES.includes(squash(p.category)) && TELECOM.test(p.title))
		.slice(0, limit)
		.map((p) => ({ title: p.title, link: p.link, date: p.date.toISOString() }));
}

export async function onRequest({ request, waitUntil }) {
	const cache = typeof caches !== 'undefined' ? caches.default : null;
	const key = new Request(new URL('/api/naver-posts', request.url).toString());
	if (cache) {
		const hit = await cache.match(key);
		if (hit) return hit;
	}
	let posts = [];
	try {
		const r = await fetch(RSS_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; connectmobile-site)' } });
		if (r.ok) posts = parsePosts(await r.text());
	} catch {
		posts = [];
	}
	const res = new Response(JSON.stringify({ posts }), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// 실패했을 때는 짧게만 저장해서 금방 다시 시도합니다.
			'Cache-Control': `public, max-age=${posts.length ? KEEP_SECONDS : 60}`,
		},
	});
	if (cache && posts.length) waitUntil(cache.put(key, res.clone()));
	return res;
}
