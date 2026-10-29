// 네이버 블로그 사이드 위젯용 "오늘 번호이동 접수돼요?" 그림을 한국 날짜에 맞춰 보여 줍니다.
// 주소: /blog-widgets/today  (그림 3장은 public/blog-widgets/today-*.png, naver-drafts/tools/make-today-widgets.cjs 로 만듦)
// 번호이동은 일요일과 신정, 설, 추석 당일에 접수되지 않습니다(사이트 글 self-activation-time-over 기준).

// 설, 추석 당일. 매년 초에 다음 해 날짜를 확인해서 더해 주세요. (2028년 추석은 정부 발표 후 다시 확인)
const HOLIDAYS = new Set([
	'2026-02-17', '2026-09-25',
	'2027-02-06', '2027-09-15',
	'2028-01-27', '2028-10-03',
]);

/** 한국 시각 기준으로 오늘 보여 줄 그림 이름 */
export function todayState(now = new Date()) {
	const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	const ymd = kst.toISOString().slice(0, 10);
	if (ymd.endsWith('-01-01') || HOLIDAYS.has(ymd)) return 'holiday';
	if (kst.getUTCDay() === 0) return 'sunday';
	return 'open';
}

export async function onRequest({ request, env }) {
	const state = todayState();
	const res = await env.ASSETS.fetch(new URL(`/blog-widgets/today-${state}.png`, request.url));
	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': 'image/png',
			// 날짜가 바뀌면 바로 다른 그림이 나오도록 저장해 두지 않게 합니다.
			'Cache-Control': 'no-store, max-age=0',
		},
	});
}
