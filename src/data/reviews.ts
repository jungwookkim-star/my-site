// 개통 후기입니다. 여기에 후기를 추가하면 홈 화면에 "개통 후기" 섹션이 자동으로 나타납니다.
// 후기가 하나도 없으면 섹션 자체가 보이지 않습니다.
//
// [꼭 지켜 주세요]
// - 실제 고객이 남긴 후기만 넣습니다. (지어내거나 다듬어서 바꾸지 마세요)
// - 이름·전화번호·생년월일 같은 개인정보는 넣지 않습니다.
// - 고객이 홈페이지 게시에 동의한 후기만 consent 를 true 로 두세요. (false 면 화면에 나오지 않습니다)
//
// 추가 예시 (아래 REVIEWS 배열 안에 한 덩어리씩 넣습니다):
//   {
//     id: '2026-10-a',                 // 겹치지 않는 이름
//     text: '후기 내용을 고객이 쓴 그대로',
//     who: '김○○ 님',                  // 이름은 성만 쓰고 가리기 권장. 비워도 됩니다
//     type: '선불 셀프개통',              // 개통 유형 (선택)
//     date: '2026-10',                 // 후기를 받은 달 (YYYY-MM)
//     source: '카카오톡 후기',            // 후기를 받은 곳 (선택)
//     consent: true,                   // 게시 동의를 받았을 때만 true
//   },
export interface Review {
	id: string;
	text: string;
	who?: string;
	type?: string;
	date: string;
	source?: string;
	consent: boolean;
}

export const REVIEWS: Review[] = [];

// 화면에 보이는 후기만 (동의한 것, 최신순)
export const visibleReviews = (limit = 6): Review[] =>
	REVIEWS.filter((r) => r.consent && r.text.trim()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
