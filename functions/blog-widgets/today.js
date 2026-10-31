// 네이버 블로그 사이드 위젯용 "지금 접수돼요?" 그림을 한국 시각에 맞춰 보여 줍니다.
// 주소: /blog-widgets/today  (그림은 public/blog-widgets/today-*.png, naver-drafts/tools/make-today-widgets.cjs 로 만듦)
// 접수 시간은 사이트 글 self-activation-time-over 기준입니다.
// 신규가입 08:00~21:50, 번호이동 10:00~19:50, 번호이동은 일요일과 신정, 설, 추석 당일에 접수되지 않습니다.

// 설, 추석 당일. 매년 초에 다음 해 날짜를 확인해서 더해 주세요. (2028년 추석은 정부 발표 후 다시 확인)
const HOLIDAYS = new Set([
	'2026-02-17', '2026-09-25',
	'2027-02-06', '2027-09-15',
	'2028-01-27', '2028-10-03',
]);

/** 번호이동을 받지 않는 날(일요일, 신정, 설, 추석 당일)이면 그 이름 */
function restDay(kst) {
	const ymd = kst.toISOString().slice(0, 10);
	if (ymd.endsWith('-01-01') || HOLIDAYS.has(ymd)) return 'holiday';
	if (kst.getUTCDay() === 0) return 'sunday';
	return null;
}

/** 한국 시각 기준으로 지금 보여 줄 그림 이름 */
export function todayState(now = new Date()) {
	const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	const min = kst.getUTCHours() * 60 + kst.getUTCMinutes();
	const rest = restDay(kst);
	const tomorrowRest = restDay(new Date(kst.getTime() + 24 * 60 * 60 * 1000));
	const NEW_OPEN = 8 * 60, NEW_CLOSE = 21 * 60 + 50, MOVE_OPEN = 10 * 60, MOVE_CLOSE = 19 * 60 + 50;
	if (min >= NEW_CLOSE) return tomorrowRest ? 'night-rest' : 'night';
	if (rest) return min < NEW_OPEN ? `${rest}-early` : rest;
	if (min < NEW_OPEN) return 'early';
	if (min < MOVE_OPEN) return 'morning';
	if (min < MOVE_CLOSE) return 'open';
	return 'evening';
}

export async function onRequest({ request, env }) {
	const state = todayState();
	const res = await env.ASSETS.fetch(new URL(`/blog-widgets/today-${state}.png`, request.url));
	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': 'image/png',
			// 시각이 바뀌면 바로 다른 그림이 나오도록 저장해 두지 않게 합니다.
			'Cache-Control': 'no-store, max-age=0',
		},
	});
}
