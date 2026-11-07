// 네이버 블로그 "오늘 접수" 위젯을 눌렀을 때 시간에 따라 가는 곳을 바꿉니다. (2026-11-07)
// 위젯 코드의 링크(/blog/self-activation-time-over/?utm_source=naver_blog&utm_medium=widget&utm_campaign=today)는 그대로 두고,
// 그 주소로 들어온 요청만 여기서 돌려보냅니다. 다른 /blog/ 페이지와 위젯이 아닌 방문은 원래 페이지를 그대로 보여 줍니다.
// - 지금 접수 중: 개통 과정 안내(/guide/)로. 셀프개통 페이지 링크가 있고, 애널리틱스에 today-open 으로 남습니다.
// - 접수가 끝난 시간: 카카오톡 상담으로. 밤에 들어온 손님이 그냥 나가지 않고 내일 아침 개통을 미리 남기게 합니다.
import { todayState, accepting } from '../blog-widgets/today.js';

const KAKAO_CHAT = 'https://pf.kakao.com/_QKvfX/chat';

export function widgetTarget(url, now = new Date()) {
	if (!url.pathname.startsWith('/blog/self-activation-time-over')) return null;
	if (url.searchParams.get('utm_medium') !== 'widget' || url.searchParams.get('utm_campaign') !== 'today') return null;
	const state = todayState(now);
	if (accepting(state)) return new URL('/guide/?utm_source=naver_blog&utm_medium=widget&utm_campaign=today-open', url).toString();
	return KAKAO_CHAT;
}

export async function onRequest(context) {
	const target = widgetTarget(new URL(context.request.url));
	if (!target) return context.next();
	return new Response(null, { status: 302, headers: { Location: target, 'Cache-Control': 'no-store' } });
}
