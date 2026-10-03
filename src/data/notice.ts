// 사이트 맨 위 공지 띠입니다. 안내가 필요할 때만 NOTICE 에 내용을 넣고, 없으면 null 로 두세요.
// 예) 명절 휴무, 요금제 변경, 점검 안내
//   export const NOTICE: Notice | null = {
//     id: '2026-chuseok',            // 공지가 바뀌면 id 도 바꿔 주세요(닫은 사람에게 다시 보입니다)
//     text: '추석 연휴(9/24~9/28)에는 개통이 일부 제한될 수 있습니다.',
//     link: '/faq/',                  // 선택
//     linkText: '자세히 보기',         // 선택
//     until: '2026-09-29',            // 선택: 이 날짜(한국 시간)까지만 보입니다
//   };
export interface Notice {
	id: string;
	text: string;
	link?: string;
	linkText?: string;
	until?: string;
}

export const NOTICE: Notice | null = null;
