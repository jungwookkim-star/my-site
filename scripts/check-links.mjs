// 빌드한 사이트(dist)에서 깨진 내부 링크와 없는 #앵커를 찾습니다.
// 사용: npm run build && npm run check:links   (문제가 있으면 종료 코드 1)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
if (!existsSync(dist)) {
	console.error('dist 폴더가 없습니다. 먼저 npm run build 를 실행하세요.');
	process.exit(2);
}

const pages = [];
(function walk(dir) {
	for (const f of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, f.name);
		if (f.isDirectory()) walk(p);
		else if (p.endsWith('.html')) pages.push(p);
	}
})(dist);

const isFile = (p) => existsSync(p) && statSync(p).isFile();
const resolvePage = (url) => {
	const u = decodeURIComponent(url.split('#')[0].split('?')[0]);
	return [join(dist, u, 'index.html'), join(dist, u), join(dist, u + '.html')].find(isFile);
};
const idCache = new Map();
const idsOf = (file) => {
	if (!idCache.has(file)) idCache.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
	return idCache.get(file);
};

// 서버나 스크립트가 처리하는 주소는 건너뜁니다.
//  - /go/…       : Cloudflare 짧은 주소(_redirects)
//  - /blog/#분류  : 블로그 목록이 주소의 분류 이름으로 필터를 여는 방식
//  - 주소에 ${ } : 자바스크립트가 화면에서 만드는 링크
const skip = (href) => href.startsWith('/go/') || href.startsWith('/blog/#') || href.includes('${');

const broken = new Set();
const badAnchor = new Set();
let total = 0;
for (const file of pages) {
	const page = '/' + relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
	const html = readFileSync(file, 'utf8');
	for (const m of html.matchAll(/<a\s[^>]*href="(\/[^"/][^"]*|\/)"/g)) {
		const href = m[1];
		if (skip(href)) continue;
		total++;
		const target = resolvePage(href === '/' ? '/' : href);
		if (!target && href !== '/' && !href.startsWith('/#')) {
			broken.add(`${page} -> ${href}`);
			continue;
		}
		const hashAt = href.indexOf('#');
		if (hashAt >= 0 && href.slice(hashAt + 1)) {
			const id = decodeURIComponent(href.slice(hashAt + 1));
			const dest = href.startsWith('/#') ? join(dist, 'index.html') : target;
			if (dest && !idsOf(dest).has(id)) badAnchor.add(`${page} -> ${href}`);
		}
	}
}

console.log(`페이지 ${pages.length}개, 내부 링크 ${total}개 점검`);
console.log(`깨진 링크: ${broken.size}`);
[...broken].slice(0, 40).forEach((x) => console.log('  ' + x));
console.log(`없는 앵커: ${badAnchor.size}`);
[...badAnchor].slice(0, 40).forEach((x) => console.log('  ' + x));
process.exit(broken.size || badAnchor.size ? 1 : 0);
