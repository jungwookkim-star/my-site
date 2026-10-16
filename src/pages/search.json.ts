import { getCollection } from 'astro:content';
import { faqGroups } from '../data/faqs';
import { REGIONS } from '../data/regions';
import { ktPrepaid, lgPrepaid } from '../data/prepaidPlans';
import { ktPrepaidMore, lgPrepaidMore, ktPostpaid, lgPostpaid } from '../data/morePlans';
import { postpaidPartners } from '../data/postpaidPlans';

// 사이트 검색용 색인입니다. 빌드할 때 한 번 만들어지는 정적 파일입니다.
type Item = { t: string; d: string; u: string; k: string };

export async function GET() {
	const items: Item[] = [];

	const pages: [string, string, string][] = [
		['요금제 전체 보기', '선불·알뜰(후불) 요금제 비교', '/plans/'],
		['개통 과정 안내', '상담부터 셀프개통까지 4단계, 준비물 체크리스트', '/guide/'],
		['자주 묻는 질문', '미납, 충전, 유심, 외국인 등', '/faq/'],
		['세컨드 번호 만들기', '인증용·업무용·중고거래용 두 번째 번호', '/second-number/'],
		['요금 절약 계산기', '지금 쓰는 요금과 비교', '/saving/'],
		['지역별 대면 개통 안내', '전국 센터 지역 안내', '/region/'],
		['용어 설명', '알뜰폰·선불 용어 풀이', '/glossary/'],
		['센터 소개', '커넥트모바일 소개와 사업자 정보', '/about/'],
	];
	pages.forEach(([t, d, u]) => items.push({ t, d, u, k: '페이지' }));

	const plans = [...ktPrepaid, ...ktPrepaidMore, ...lgPrepaid, ...lgPrepaidMore, ...ktPostpaid, ...lgPostpaid, ...postpaidPartners.flatMap((p) => p.plans)];
	const seen = new Set<string>();
	plans.forEach((p) => {
		if (seen.has(p.name)) return;
		seen.add(p.name);
		items.push({ t: p.name, d: `월 ${p.price} · 데이터 ${p.data}`, u: '/plans/', k: '요금제' });
	});

	faqGroups.forEach((g) => g.items.forEach((f) => items.push({ t: f.q, d: f.a.replace(/\s+/g, ' ').slice(0, 90), u: '/faq/', k: 'FAQ' })));

	REGIONS.forEach((r) => items.push({ t: `${r.name} 대면 개통`, d: [...r.cities, ...r.centers].join(' '), u: `/region/${r.slug}/`, k: '지역' }));

	const posts = await getCollection('blog');
	posts
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.forEach((p) => items.push({ t: p.data.title, d: p.data.description, u: `/blog/${p.id}/`, k: '블로그' }));

	return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
