// 네이버 플레이스 예약 링크입니다. (2026-10-29 사용자 제공, 7곳 모두 열리는 것 확인)
// 예약은 각 플레이스에서 받고, 실제 방문 개통은 그 플레이스 근처 제휴센터에서 진행합니다.
// 링크를 바꾸려면 스마트플레이스 지도 주소의 bookingRedirectUrl 안에 있는 m.booking.naver.com 주소만 옮겨 적으세요.

export interface NaverBooking {
	area: string; // 버튼에 보이는 지역 이름
	url: string;
}

export const naverBookings: NaverBooking[] = [
	{ area: '서울 가산', url: 'https://m.booking.naver.com/booking/6/bizes/1742168' },
	{ area: '서울 신림', url: 'https://m.booking.naver.com/booking/6/bizes/1743830' },
	{ area: '서울 종로', url: 'https://m.booking.naver.com/booking/13/bizes/1759012' },
	{ area: '부천 소사', url: 'https://m.booking.naver.com/booking/13/bizes/1728217' },
	{ area: '부천 중동', url: 'https://m.booking.naver.com/booking/13/bizes/1759006' },
	{ area: '경기 평택', url: 'https://m.booking.naver.com/booking/13/bizes/1728221' },
	{ area: '대전 서구', url: 'https://m.booking.naver.com/booking/13/bizes/1728224' },
];
