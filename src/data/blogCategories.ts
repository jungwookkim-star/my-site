// 블로그 글 분류입니다. 새 글을 쓰면 아래 목록에 slug(파일 이름)를 추가하거나,
// 글 머리말(frontmatter)에 category: '요금제 비교·추천' 처럼 직접 적어도 됩니다.
export const CATEGORIES = ['개통 방법', '요금제 비교·추천', '충전·이용·해지', '번호이동·가입 조건', '알뜰폰 기초'] as const;
export type Category = (typeof CATEGORIES)[number];

const MAP: Record<string, Category> = {
	'activation-guide': '개통 방법',
	'self-activation-10min': '개통 방법',
	'self-activation-troubleshooting': '개통 방법',
	'usim-delivery': '개통 방법',
	'self-activation-face-auth': '개통 방법',
	'usim-number-input': '개통 방법',
	'visit-activation-reservation': '개통 방법',
	'after-activation-checklist': '개통 방법',
	'after-activation-account': '개통 방법',

	'kt-prepaid-lineup': '요금제 비교·추천',
	'kt-vs-lg-prepaid': '요금제 비교·추천',
	'plans-under-20000': '요금제 비교·추천',
	'prepaid-plan-picker': '요금제 비교·추천',
	'prepaid-plan-price-guide': '요금제 비교·추천',
	'heavy-data-plans': '요금제 비교·추천',
	'5g-plans-compare': '요금제 비교·추천',
	'postpaid-benefit-plans': '요금제 비교·추천',
	'alddeul-extra-data': '요금제 비교·추천',
	'lg-postpaid-platform': '요금제 비교·추천',
	'minute-limited-alddeul-plans': '요금제 비교·추천',
	'ntelecom-network-prepaid': '요금제 비교·추천',
	'prepaid-international-call': '요금제 비교·추천',
	'tablet-wearable-plans': '요금제 비교·추천',
	'senior-welfare-plans': '요금제 비교·추천',
	'second-phone-prepaid': '요금제 비교·추천',

	'prepaid-charge-guide': '충전·이용·해지',
	'prepaid-cancel-pause': '충전·이용·해지',
	'prepaid-daily-fee': '충전·이용·해지',
	'prepaid-overage-fee': '충전·이용·해지',
	'speed-limit-explained': '충전·이용·해지',
	'basic-provide-limits': '충전·이용·해지',
	'membership-app-guide': '충전·이용·해지',
	'prepaid-checklist-before-signup': '충전·이용·해지',

	'number-portability': '번호이동·가입 조건',
	'mvno-to-mvno-portability': '번호이동·가입 조건',
	'unpaid-overdue-activation': '번호이동·가입 조건',
	'foreigner-minor-activation': '번호이동·가입 조건',

	'what-is-mvno': '알뜰폰 기초',
	'prepaid-vs-postpaid': '알뜰폰 기초',
	'first-post': '알뜰폰 기초',
};

export function categoryOf(id: string, explicit?: string): Category {
	if (explicit && (CATEGORIES as readonly string[]).includes(explicit)) return explicit as Category;
	return MAP[id] ?? '알뜰폰 기초';
}
