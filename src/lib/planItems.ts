// 요금제 목록(선불·알뜰)을 한 곳에서 만듭니다. 요금 찾기·절약 계산기가 같은 기준을 씁니다.
import { ktPrepaid, lgPrepaid, type PrepaidPlan } from '../data/prepaidPlans';
import { postpaidPartners } from '../data/postpaidPlans';

// 사용량 단계: 1 통화·문자 위주 / 2 가벼운 인터넷 / 3 영상·SNS 많이
const prepaidTier: Record<string, number> = {
	'선불 LTE 기본1': 1,
	'선불 300MB 라이트': 2,
	'LTE 선불 396 10.3GB': 3,
	'LTE 선불 459 20.3GB': 3,
	'LTE 선불선택 770': 3,
	'LTE 비디오': 3,
	'L망 선불 기본1': 1,
	'L망 선불 데이터 2.5GB': 2,
	'L망 선불 300분': 1,
	'L망 선불 300M 라이트': 2,
	'L망 선불 396 10.3GB': 3,
	'L망 5G 선불 20GB+': 3,
};
const alddeulTier = (tier: string) => (/일2GB|100GB/.test(tier) ? 3 : 2);
const won = (p: PrepaidPlan) => Number(p.price.replace(/[^0-9]/g, ''));
// 월 데이터량(GB) 추정: 기본 제공량 + 일 제공량 x 30
const gbOf = (p: PrepaidPlan) => {
	const gb = p.data.match(/([\d.]+)\s*GB/);
	const mb = p.data.match(/([\d.]+)\s*MB/);
	const daily = p.data.match(/일\s*(\d+)\s*GB/);
	const base = gb ? Number(gb[1]) : mb ? Number(mb[1]) / 1000 : 0;
	return base + (daily ? Number(daily[1]) * 30 : 0);
};

export interface Item {
	plan: PrepaidPlan;
	kind: 'prepaid' | 'alddeul';
	tier: number;
	price: number;
	gb: number;
}

export const items: Item[] = [];
for (const p of [...ktPrepaid, ...lgPrepaid]) {
	items.push({ plan: p, kind: 'prepaid', tier: prepaidTier[p.name] ?? 2, price: won(p), gb: gbOf(p) });
}

// 알뜰 요금제는 조건(요금·데이터)이 같은 제휴처끼리 한 카드로 묶습니다.
const groups = new Map<string, { partners: string[]; tier: string; plan: PrepaidPlan }>();
for (const partner of postpaidPartners) {
	for (const p of partner.plans) {
		const tier = p.name.slice(partner.name.length + 1);
		const sig = `${tier}|${p.price}|${p.data}|${p.note ?? ""}`;
		const g = groups.get(sig);
		if (g) g.partners.push(partner.name);
		else groups.set(sig, { partners: [partner.name], tier, plan: p });
	}
}
for (const g of groups.values()) {
	items.push({
		plan: {
			...g.plan,
			name: `${g.partners.join('·')} ${g.tier}`,
			note: [g.plan.note, g.partners.length > 1 ? '제휴처별 혜택은 상담 시 안내해 드립니다.' : ''].filter(Boolean).join(' / ') || undefined,
		},
		kind: 'alddeul',
		tier: alddeulTier(g.tier),
		price: won(g.plan),
		gb: gbOf(g.plan),
	});
}
