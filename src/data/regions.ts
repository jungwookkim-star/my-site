// 지역 페이지 데이터. 지역을 추가하려면 아래 목록에 한 줄 추가하면 됩니다.
export type Region = { slug: string; name: string; full: string; cities: string[] };

export const REGIONS: Region[] = [
	{ slug: 'seoul', name: '서울', full: '서울특별시', cities: ['강남구', '서초구', '송파구', '마포구', '영등포구', '노원구'] },
	{ slug: 'busan', name: '부산', full: '부산광역시', cities: ['해운대구', '부산진구', '동래구', '사하구', '남구', '북구'] },
	{ slug: 'daegu', name: '대구', full: '대구광역시', cities: ['수성구', '달서구', '중구', '북구', '동구', '서구'] },
	{ slug: 'incheon', name: '인천', full: '인천광역시', cities: ['남동구', '부평구', '연수구', '서구', '계양구', '미추홀구'] },
	{ slug: 'gwangju', name: '광주', full: '광주광역시', cities: ['북구', '서구', '광산구', '남구', '동구'] },
	{ slug: 'daejeon', name: '대전', full: '대전광역시', cities: ['유성구', '서구', '중구', '동구', '대덕구'] },
	{ slug: 'ulsan', name: '울산', full: '울산광역시', cities: ['남구', '북구', '중구', '동구', '울주군'] },
	{ slug: 'sejong', name: '세종', full: '세종특별자치시', cities: ['조치원읍', '도담동', '새롬동', '한솔동', '나성동'] },
	{ slug: 'gyeonggi', name: '경기', full: '경기도', cities: ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '화성시', '남양주시'] },
	{ slug: 'gangwon', name: '강원', full: '강원특별자치도', cities: ['춘천시', '원주시', '강릉시', '속초시', '동해시'] },
	{ slug: 'chungbuk', name: '충북', full: '충청북도', cities: ['청주시', '충주시', '제천시'] },
	{ slug: 'chungnam', name: '충남', full: '충청남도', cities: ['천안시', '아산시', '서산시', '당진시'] },
	{ slug: 'jeonbuk', name: '전북', full: '전북특별자치도', cities: ['전주시', '익산시', '군산시'] },
	{ slug: 'jeonnam', name: '전남', full: '전라남도', cities: ['목포시', '여수시', '순천시', '나주시', '광양시'] },
	{ slug: 'gyeongbuk', name: '경북', full: '경상북도', cities: ['포항시', '구미시', '경주시', '안동시', '경산시'] },
	{ slug: 'gyeongnam', name: '경남', full: '경상남도', cities: ['창원시', '김해시', '진주시', '양산시', '거제시'] },
	{ slug: 'jeju', name: '제주', full: '제주특별자치도', cities: ['제주시', '서귀포시'] },
];
