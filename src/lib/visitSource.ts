// 손님이 들어온 경로를 메시지 한 줄로 바꿉니다. 목록에 없는 값은 그대로 쓰지 않습니다.
// /visit/ 페이지의 인라인 스크립트에도 같은 목록이 있으니 함께 고쳐 주세요.
const SRC: Record<string, string> = {
	place: '플레이스',
	naver_blog: '네이버 블로그',
	naver: '네이버 블로그',
	daangn: '당근',
	poster: '포스터 QR',
	a4: 'A4 안내문 QR',
	card: '명함',
	flyer: '전단지',
	sign: '간판',
	sms: '문자',
	kakao: '카카오 채널',
};

export function visitSourceLabel(): string {
	let s = '';
	try {
		const fromUrl = new URLSearchParams(location.search).get('utm_source');
		if (fromUrl) sessionStorage.setItem('first_src', fromUrl);
		s = (fromUrl || sessionStorage.getItem('first_src') || '').toLowerCase();
	} catch { /* 저장소를 못 써도 아래로 넘어갑니다 */ }
	if (Object.prototype.hasOwnProperty.call(SRC, s)) return SRC[s];
	if (s.startsWith('partner-')) return '제휴처';
	if (s) return '기타 링크';
	const r = document.referrer || '';
	if (/blog\.naver/.test(r)) return '네이버 블로그';
	if (/(map|place)\.naver/.test(r)) return '플레이스';
	if (/search\.naver/.test(r)) return '네이버 검색';
	if (/google\./.test(r)) return '구글 검색';
	return '홈페이지';
}
