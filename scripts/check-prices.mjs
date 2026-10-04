// 앤텔레콤 공식 요금제 페이지와 사이트 요금 데이터를 비교해서 다른 부분만 알려 줍니다. (읽기 전용: 아무것도 고치지 않습니다)
// 사용법: node scripts/check-prices.mjs          → 콘솔 보고
//        node scripts/check-prices.mjs --json    → JSON 보고
import { ktPrepaid, lgPrepaid } from '../src/data/prepaidPlans.ts';
import { ktPrepaidMore, lgPrepaidMore, lgPostpaid, ktPostpaid } from '../src/data/morePlans.ts';
import { postpaidPartners } from '../src/data/postpaidPlans.ts';

const PAGES = [
	['K망', 'https://info.n-telecom.co.kr/ntelecom-asp/products/Kt_all.asp'],
	['L망', 'https://info.n-telecom.co.kr/ntelecom-asp/products/Lg_all.asp'],
];

const strip = (s) => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const num = (s) => (String(s).match(/[\d,]+/) ? Number(String(s).match(/[\d,]+/)[0].replace(/,/g, '')) : NaN);
// 이름 비교용: 공백·괄호·"K망/L망/KT망/LTE" 같은 접두어를 줄여서 비슷한 이름을 맞춥니다.
const norm = (s) => s.toLowerCase().replace(/\s+/g, '').replace(/[()·_\-+]/g, '').replace(/캐쉬/g, '캐시').replace(/^앤텔레콤/, '').replace(/^(k망|l망|kt망|lg망)/, '').replace(/^(선불|후불)/, '');

function parseOfficial(html, net) {
	// 화면에 보이지 않는 주석 처리된 요금제는 제외합니다.
	const parts = html.replace(/<!--[sS]*?-->/g, '').split('<div class="plan-item"').slice(1);
	return parts.map((p) => {
		const cat = (p.match(/data-category="([^"]*)"/) || [])[1] || '';
		const nameBlock = (p.match(/<div class="plan-name">([\s\S]*?)<\/div>\s*<div class="plan-specs"/) || [])[1] || '';
		const top = strip((nameBlock.match(/<div class="name-top[^"]*">([\s\S]*?)<\/div>/) || [])[1] || '');
		const name = strip(nameBlock.replace(/<div class="name-top[^"]*">[\s\S]*?<\/div>/, ''));
		const price = num((p.match(/class="main-price">[\s\S]*?<span>([\s\S]*?)<\/span>/) || [])[1] || '');
		const spec = (label) => strip((p.match(new RegExp(`label-group">${label}<b>([\s\S]*?)</b>`)) || [])[1] || '');
		return { net, cat, top, name, price, voice: spec('음성'), sms: spec('문자'), data: spec('데이터') };
	});
}

const official = [];
for (const [net, url] of PAGES) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url} → ${res.status}`);
	official.push(...parseOfficial(await res.text(), net));
}
if (official.length < 20) throw new Error(`공식 페이지에서 요금제를 ${official.length}개만 읽었습니다. 페이지 구조가 바뀌었을 수 있어요.`);

const site = [
	...ktPrepaid.map((p) => ['K망 선불', p]),
	...ktPrepaidMore.map((p) => ['K망 선불', p]),
	...lgPrepaid.map((p) => ['L망 선불', p]),
	...lgPrepaidMore.map((p) => ['L망 선불', p]),
	...lgPostpaid.map((p) => ['L망 후불', p]),
	...ktPostpaid.map((p) => ['K망 후불', p]),
	...postpaidPartners.flatMap((pt) => pt.plans.map((p) => [`K망 제휴(${pt.name})`, { ...p, lookup: `K망 ${p.name.replace(pt.name, '').trim()}(${pt.name})` }])),
];

const byNorm = new Map();
for (const o of official) {
	const k = norm(o.name);
	if (!byNorm.has(k)) byNorm.set(k, []);
	byNorm.get(k).push(o);
}

const report = { checked: site.length, officialCount: official.length, priceMismatch: [], notFound: [], matched: 0, missingOnSite: [] };
for (const [group, p] of site) {
	const k = norm(p.lookup ?? p.name);
	let cands = byNorm.get(k);
	if (!cands) {
		// 이름이 조금 다른 경우: 한쪽이 다른 쪽을 포함하는 후보
		cands = official.filter((o) => norm(o.name).includes(k) || k.includes(norm(o.name))).filter((o) => norm(o.name).length > 3);
	}
	if (!cands || cands.length === 0) {
		report.notFound.push({ group, name: p.name, price: p.price });
		continue;
	}
	const want = num(p.price);
	const hit = cands.find((o) => o.price === want);
	if (hit) report.matched++;
	else report.priceMismatch.push({ group, name: p.name, site: want, official: cands.map((o) => `${o.name} ${o.price}`).join(' / ') });
}

// 반대로, 공식 페이지에는 있는데 사이트에 없는 요금제(약정·복지·패드 전용 등은 일부러 뺀 것이라 참고용입니다)
const siteKeys = new Set(site.map(([, p]) => norm(p.lookup ?? p.name)));
for (const o of official) {
	const k = norm(o.name);
	const onSite = siteKeys.has(k) || [...siteKeys].some((x) => x.length > 3 && (x.includes(k) || k.includes(x)));
	if (!onSite) report.missingOnSite.push({ net: o.net, cat: o.cat, name: o.name, price: o.price, voice: o.voice, data: o.data });
}

if (process.argv.includes('--json')) {
	console.log(JSON.stringify(report, null, 2));
} else {
	console.log(`사이트 요금제 ${report.checked}개 / 공식 페이지에서 읽은 요금제 ${report.officialCount}개`);
	console.log(`일치 ${report.matched}개, 가격 다름 ${report.priceMismatch.length}개, 공식 페이지에서 못 찾음 ${report.notFound.length}개`);
	if (report.priceMismatch.length) {
		console.log('\n[가격이 다른 요금제]');
		for (const m of report.priceMismatch) console.log(`- ${m.group} ${m.name}: 사이트 ${m.site}원 ↔ 공식 ${m.official}`);
	}
	if (report.missingOnSite.length) {
		console.log(`
[공식 페이지에는 있지만 사이트에 없는 요금제 ${report.missingOnSite.length}개] (약정·복지·패드·로밍 전용은 의도적으로 뺀 것일 수 있어요)`);
		for (const m of report.missingOnSite) console.log(`- [${m.cat}] ${m.name} ${m.price}원 · 음성 ${m.voice} · 데이터 ${m.data}`);
	}
	if (report.notFound.length) {
		console.log('\n[공식 페이지에서 이름으로 못 찾은 요금제] (이름이 바뀌었거나 판매가 끝났을 수 있어요)');
		for (const m of report.notFound) console.log(`- ${m.group} ${m.name} (${m.price})`);
	}
}
