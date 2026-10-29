// 네이버 예약을 받는 플레이스가 있는 동네의 안내 페이지 목록입니다. (/region/{region}/{slug}/)
// 플레이스 예약 링크가 있는 곳만 페이지를 만듭니다. 동네 이름만 바꾼 페이지를 늘리면 검색에서 도움이 되지 않아요.
// 가산은 따로 만든 페이지(src/pages/region/seoul/gasan.astro)가 있어서 여기 넣지 않습니다.
// 역, 상권 같은 동네 정보는 확인된 것이 없어서 쓰지 않습니다.

export interface VisitArea {
	slug: string;
	region: string; // REGIONS의 slug
	name: string; // 제목에 쓰는 동네 이름
	bookings: string[]; // naverBookings의 area 이름
	posts: RegExp; // 이 동네 블로그 글을 고르는 제목 조건
}

export const VISIT_AREAS: VisitArea[] = [
	{ slug: 'sillim', region: 'seoul', name: '신림', bookings: ['서울 신림'], posts: /신림|관악/ },
	{ slug: 'jongno', region: 'seoul', name: '종로', bookings: ['서울 종로'], posts: /종로/ },
	{ slug: 'bucheon', region: 'gyeonggi', name: '부천', bookings: ['부천 소사', '부천 중동'], posts: /부천/ },
	{ slug: 'pyeongtaek', region: 'gyeonggi', name: '평택', bookings: ['경기 평택'], posts: /평택/ },
	{ slug: 'seogu', region: 'daejeon', name: '대전 서구', bookings: ['대전 서구'], posts: /대전/ },
];
