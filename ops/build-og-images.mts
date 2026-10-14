// 링크 공유 미리보기(OG) 이미지를 페이지별로 만듭니다. 결과: public/og/<키>.jpg (1200x630)
//   실행:  npx tsx ops/build-og-images.mts
// 한글 글꼴이 있는 이 컴퓨터에서 미리 만들어 둡니다. (배포 서버에는 한글 글꼴이 없어 빌드 때 만들면 글자가 깨질 수 있음)
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { REGIONS } from '../src/data/regions.ts';
import { categoryOf } from '../src/data/blogCategories.ts';
import { ogKey } from '../src/lib/ogKey.ts';

const OUT = 'public/og';
mkdirSync(OUT, { recursive: true });
const W = 1200, H = 630;
const FONT = "Malgun Gothic, 'Apple SD Gothic Neo', Arial, sans-serif";
const NAVY = '#0e2150', BLUE = '#1356d6', DEEP = '#0e45b8', MUTED = '#4f6a99';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 글자 폭 추정(한글·한자는 1em, 영문·숫자·기호는 0.58em)으로 줄바꿈합니다.
const wide = (c: string) => /[ᄀ-ᇿ㄰-㆏가-힯一-鿿＀-￯]/.test(c);
const textW = (s: string, size: number) => [...s].reduce((a, c) => a + (wide(c) ? size * 1.0 : c === ' ' ? size * 0.32 : size * 0.58), 0);

// 줄바꿈 후보: 공백, '·' 뒤, ':' 뒤, '|'(직접 지정한 줄바꿈)
interface Tok { t: string; sp: boolean; hard?: boolean }
function tokenize(text: string): Tok[] {
	const toks: Tok[] = [];
	let cur = '';
	let sp = false;
	const flush = (nextSp: boolean, hard = false) => {
		if (cur) toks.push({ t: cur, sp, hard });
		cur = '';
		sp = nextSp;
	};
	for (const ch of text) {
		if (ch === ' ') flush(true);
		else if (ch === '|') flush(false, true);
		else {
			cur += ch;
			if (ch === '·' || ch === ':' || ch === ',') flush(ch === ',' || ch === ':');
		}
	}
	flush(false);
	return toks;
}
const lineText = (ts: Tok[]) => ts.map((x, i) => (i && x.sp ? ' ' : '') + x.t).join('');
function wrapTokens(ts: Tok[], size: number, maxW: number): Tok[][] {
	const lines: Tok[][] = [];
	let cur: Tok[] = [];
	for (const tk of ts) {
		const test = [...cur, tk];
		if (cur.length && textW(lineText(test), size) > maxW) { lines.push(cur); cur = [tk]; } else cur = test;
		if (tk.hard) { lines.push(cur); cur = []; }
	}
	if (cur.length) lines.push(cur);
	return lines;
}
// 같은 줄 수 안에서 가장 긴 줄이 최소가 되도록 다시 나눕니다. (끝 줄에 한두 글자만 남는 것을 방지)
function balance(ts: Tok[], size: number, k: number): Tok[][] {
	const n = ts.length;
	if (k <= 1 || n <= k) return wrapTokens(ts, size, 1e9);
	const w = (i: number, j: number) => textW(lineText(ts.slice(i, j)), size);
	const INF = 1e18;
	const dp: number[][] = Array.from({ length: k + 1 }, () => Array(n + 1).fill(INF));
	const from: number[][] = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0));
	dp[0][0] = 0;
	for (let l = 1; l <= k; l++)
		for (let j = l; j <= n; j++)
			for (let i = l - 1; i < j; i++) {
				const v = Math.max(dp[l - 1][i], w(i, j));
				if (v < dp[l][j]) { dp[l][j] = v; from[l][j] = i; }
			}
	const out: Tok[][] = [];
	let j = n;
	for (let l = k; l >= 1; l--) { const i = from[l][j]; out.unshift(ts.slice(i, j)); j = i; }
	return out;
}
function layout(text: string, maxW: number, maxLines: number, sizes: number[]): { size: number; lines: string[] } {
	const ts = tokenize(text);
	const hasHard = ts.some((x) => x.hard);
	for (const size of sizes) {
		const g = wrapTokens(ts, size, maxW);
		if (g.length <= maxLines) {
			const lines = hasHard || g.length === 1 ? g : balance(ts, size, g.length);
			if (lines.every((l) => textW(lineText(l), size) <= maxW + 1)) return { size, lines: lines.map(lineText) };
		}
	}
	const size = sizes[sizes.length - 1];
	const lines = wrapTokens(ts, size, maxW).slice(0, maxLines).map(lineText);
	lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, '…');
	return { size, lines };
}

const mascot = await sharp('public/brand/mascot.png').resize({ height: 500 }).toBuffer();
const mascotW = (await sharp(mascot).metadata()).width ?? 290;
const mark = await sharp('public/brand/mark.png').resize(64, 64).toBuffer();

interface Card { key: string; title: string; sub?: string; chip?: string; lang?: 'en' }
const cards: Card[] = [];
const add = (path: string, title: string, sub?: string, chip?: string, lang?: 'en') => cards.push({ key: ogKey(path), title, sub, chip, lang });

// 고정 페이지
add('/', '선불·알뜰 개통,|한 번에 끝내세요', '약정 NO · 위약금 NO · 약 10분 셀프개통', 'KT망 · LG망 알뜰폰 개통센터');
add('/plans/', '선불·알뜰 요금제 한눈에 보기', 'KT망 · LG망 요금표와 제휴 혜택', '요금제');
add('/saving/', '알뜰폰으로 바꾸면 얼마나 아낄까?', '지금 통신비를 넣고 바로 계산해 보세요', '요금 절약 계산기');
add('/faq/', '자주 묻는 질문', '개통 · 충전 · 해지 · 번호이동 · 미납', 'FAQ');
add('/guide/', '개통 과정 안내', '유심 준비부터 셀프개통 10단계까지', '개통 가이드');
add('/about/', '커넥트모바일 선후불 개통센터', '앤텔레콤 사전승낙 판매점 · 상담 오전 9시~오후 10시', '센터 소개');
add('/region/', '전국 지역별 개통 안내', '시·도별 유심 준비와 방문 개통 사업장', '지역별 안내');
add('/blog/', '개통 · 요금제 이야기', '알뜰폰·선불폰 개통에 도움이 되는 글', '블로그');
add('/glossary/', '알뜰폰·선불폰 용어 설명', '처음 보는 말도 쉽게', '용어 설명');
add('/terms/', '이용·환불·해지 안내', '선불 요금 충전, 해지와 환불 기준', '이용 안내');
add('/privacy/', '개인정보·방문 통계 안내', '수집 항목과 이용 목적', '개인정보 안내');
add('/en/', 'Prepaid phone plans in Korea', 'For foreign residents · No contract · In-person activation', 'Connect Mobile', 'en');

// 지역 페이지
for (const r of REGIONS) add(`/region/${r.slug}/`, `${r.name} 선불폰 개통`, `${r.full} · 전국 비대면 셀프개통`, '지역별 안내');
add('/region/seoul/gasan/', '가산 선불폰 개통', '서울 금천구 가산동 · 방문 개통은 사전 예약', '지역별 안내');

// 블로그 글
const parse = (raw: string, k: string) => raw.match(new RegExp(`^${k}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'))?.[1];
for (const f of readdirSync('src/content/blog').filter((x) => x.endsWith('.md'))) {
	const raw = readFileSync(`src/content/blog/${f}`, 'utf8').replace(/\r\n/g, '\n');
	const fm = raw.split('---')[1] ?? '';
	const id = f.replace(/\.md$/, '');
	const title = parse(fm, 'title') ?? id;
	add(`/blog/${id}/`, title, '커넥트모바일 개통 가이드', categoryOf(id, parse(fm, 'category')));
}

const TEXT_X = 76;
const MAX_W = W - TEXT_X - mascotW - 70;
let n = 0;
for (const c of cards) {
	const { size, lines } = layout(c.title, MAX_W, 3, [70, 62, 56, 50, 44]);
	const sub = c.sub ? layout(c.sub, MAX_W, 2, [32, 28, 26]) : null;
	const lh = size * 1.28;
	const titleH = lines.length * lh;
	const top = 150;
	const titleY0 = top + size;
	const subY = titleY0 + titleH + 18;
	const chipW = Math.round(textW(c.chip ?? '', 26) + 56);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6faff"/><stop offset="1" stop-color="#c9ddff"/></linearGradient>
<linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b2bd6"/><stop offset="1" stop-color="#6d3df0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="${W - 120}" cy="30" r="260" fill="#dbe9ff" opacity=".75"/><circle cx="40" cy="${H + 30}" r="200" fill="#e4efff" opacity=".9"/>
<rect x="0" y="0" width="${W}" height="14" fill="url(#bar)"/>
${c.chip ? `<rect x="${TEXT_X}" y="64" width="${chipW}" height="52" rx="26" fill="${NAVY}"/><text x="${TEXT_X + chipW / 2}" y="100" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="800" fill="#ffffff">${esc(c.chip)}</text>` : ''}
${lines.map((l, i) => `<text x="${TEXT_X}" y="${titleY0 + i * lh}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="${NAVY}">${esc(l)}</text>`).join('')}
${sub ? sub.lines.map((l, i) => `<text x="${TEXT_X}" y="${subY + 30 + i * (sub.size * 1.3)}" font-family="${FONT}" font-size="${sub.size}" font-weight="600" fill="${DEEP}">${esc(l)}</text>`).join('') : ''}
<text x="${TEXT_X + 78}" y="${H - 52}" font-family="${FONT}" font-size="34" font-weight="800" fill="${NAVY}">커넥트모바일</text>
<text x="${TEXT_X + 78}" y="${H - 22}" font-family="${FONT}" font-size="20" font-weight="700" fill="${MUTED}">connectmobile.kr</text>
</svg>`;
	await sharp(Buffer.from(svg))
		.composite([
			{ input: mark, left: TEXT_X, top: H - 92 },
			{ input: mascot, left: W - mascotW - 30, top: H - 500 - 12 },
		])
		.jpeg({ quality: 86, mozjpeg: true })
		.toFile(`${OUT}/${c.key}.jpg`);
	n++;
}
console.log(`만듦: ${n}장 → ${OUT}/ (1200x630 JPEG)`);
