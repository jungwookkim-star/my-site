// 알뜰(후불) 요금제 정보입니다. 요금이 바뀌면 여기만 고치면 요금제 페이지에 반영됩니다.
// 통화·문자는 모두 기본제공 상품만 싣습니다. 기준: 앤텔레콤 공식 요금제 페이지 (2026-10-01 확인).
import type { PrepaidPlan } from './prepaidPlans';

export interface Partner {
	key: string;
	name: string;
	plans: PrepaidPlan[];
}

const EXTRA = '추가 10GB 제공 (24개월)';

const plan = (partner: string, tier: string, price: string, data: string, opts: { badge?: string; extra?: boolean } = {}): PrepaidPlan => {
	const speed = data.match(/최대\s*(\d+Mbps)/)?.[1];
	return {
		name: `${partner} ${tier}`,
		voice: '기본제공',
		sms: '기본제공',
		data,
		dataNote: speed ? `데이터 소진 시 최대 ${speed} 속도제어` : undefined,
		note: opts.extra ? EXTRA : undefined,
		price: `${price}원`,
		badge: opts.badge,
	};
};

const D7 = '7GB + 최대 1Mbps';
const D10 = '10GB + 최대 1Mbps';
const D15 = '15GB + 최대 1Mbps';
const D11 = '11GB + 일2GB + 최대 3Mbps';
const D100 = '100GB + 최대 5Mbps';
const LOW = { badge: '제휴 최저' };

export const postpaidPartners: Partner[] = [
	{
		key: 'milli',
		name: '밀리의서재',
		plans: [
			plan('밀리의서재', '7GB+', '19,500', D7, LOW),
			plan('밀리의서재', '10GB+', '22,300', D10),
			plan('밀리의서재', '15GB+', '23,500', D15),
			plan('밀리의서재', '11GB+일2GB', '37,500', D11),
			plan('밀리의서재', '100GB', '43,200', D100),
		],
	},
	{
		key: 'cu',
		name: 'CU',
		plans: [
			plan('CU', '7GB+', '19,500', D7, { ...LOW, extra: true }),
			plan('CU', '10GB+', '22,300', D10),
			plan('CU', '15GB+', '24,000', D15),
			plan('CU', '11GB+일2GB', '37,500', D11),
			plan('CU', '100GB', '43,200', D100),
		],
	},
	{
		key: 'daiso',
		name: '다이소',
		plans: [
			plan('다이소', '7GB+', '21,100', D7),
			plan('다이소', '10GB+', '23,800', D10),
			plan('다이소', '15GB+', '25,800', D15),
			plan('다이소', '11GB+일2GB', '39,900', D11),
			plan('다이소', '100GB', '45,500', D100),
		],
	},
	{
		key: 'oliveyoung',
		name: '올리브영',
		plans: [
			plan('올리브영', '7GB+', '21,100', D7),
			plan('올리브영', '10GB+', '23,800', D10),
			plan('올리브영', '15GB+', '25,800', D15),
			plan('올리브영', '11GB+일2GB', '39,900', D11),
			plan('올리브영', '100GB', '45,500', D100),
		],
	},
	{
		key: 'naverpay',
		name: '네이버페이',
		plans: [
			plan('네이버페이', '7GB+', '21,100', D7, { extra: true }),
			plan('네이버페이', '10GB+', '23,800', D10, { extra: true }),
			plan('네이버페이', '15GB+', '25,800', D15, { extra: true }),
			plan('네이버페이', '11GB+일2GB', '39,900', D11),
			plan('네이버페이', '100GB', '45,500', D100),
		],
	},
	{
		key: 'coupang',
		name: '쿠팡캐시',
		plans: [
			plan('쿠팡캐시', '7GB+', '21,100', D7, { extra: true }),
			plan('쿠팡캐시', '10GB+', '23,800', D10, { extra: true }),
			plan('쿠팡캐시', '15GB+', '25,800', D15, { extra: true }),
			plan('쿠팡캐시', '11GB+일2GB', '39,900', D11),
			plan('쿠팡캐시', '100GB', '45,500', D100),
		],
	},
];
