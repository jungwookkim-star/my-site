// 네이버 블로그 "선불폰 개통 안내" 카테고리 글 전체를 가져옵니다. (사이트를 빌드할 때 한 번 실행됩니다)
// RSS는 최근 글 몇십 개만 주기 때문에, 지역 페이지에서 오래된 지역 글까지 찾으려고 공개 글 목록을 씁니다.
// 실패하면 빈 목록을 돌려주고, 지역 페이지는 그 칸만 숨깁니다.
export type CategoryPost = { title: string; link: string; date: Date; brief: string };

const BLOG = 'connect_mobile';
const CATEGORY = 1; // 선불폰 개통 안내
const HEADERS = { 'User-Agent': 'Mozilla/5.0', Referer: `https://m.blog.naver.com/${BLOG}` };

// 글 첫머리의 사진 설명("▲ 광주선불폰 안내" 같은 문구)을 빼고 본문 앞부분만 남깁니다.
const CAPTION = /▲[^▲]*?(안내|정리|보기|예시\)|이미지|비교|순서|체크|확인)\s+/g;
const PHOTO_NOTE = /(이해를 돕는\s*(AI로 만든\s*)?(생성\s*)?(예시|대표 이미지|이미지))|(\S+ 핵심 (숫자|정리))/g;
const decode = (t: string) => {
	let s = t;
	for (let i = 0; i < 2; i++) s = s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
	return s;
};
const cleanBrief = (t: string) => {
	const s = decode(t).replace(/\s+/g, ' ').replace(CAPTION, '').replace(/▲/g, '').replace(PHOTO_NOTE, ' ').replace(/^\s*안내\s+/, '').replace(/\s+/g, ' ').trim();
	return s.length < 30 ? '' : s;
};

// 지역 이름으로 시작하는 첫 문장("광주선불폰은", "전주에서")부터 잘라 짧게 보여 줍니다. (앞에 남은 소제목을 건너뜀)
export function briefFor(brief: string, stems: string[]): string {
	if (!brief) return '';
	let start = 0;
	for (const s of stems) {
		const m = brief.slice(0, 90).match(new RegExp(`${s}(선불폰은|선불폰을|에서|는|은) `));
		if (m && m.index !== undefined) { start = m.index; break; }
	}
	const cut = brief.slice(start, start + 110);
	return brief.length - start > 110 ? cut.replace(/\s\S*$/, '') + '…' : cut;
}

let cache: Promise<CategoryPost[]> | null = null;

async function load(): Promise<CategoryPost[]> {
	const out: CategoryPost[] = [];
	for (let page = 1; page <= 10; page++) {
		const url = `https://m.blog.naver.com/api/blogs/${BLOG}/post-list?categoryNo=${CATEGORY}&itemCount=30&page=${page}`;
		const res = await fetch(url, { headers: HEADERS });
		if (!res.ok) break;
		const items: Array<Record<string, unknown>> = (await res.json())?.result?.items ?? [];
		for (const i of items) {
			if (i.allOpenPost === false) continue;
			out.push({
				title: decode(String(i.titleWithInspectMessage ?? '')).trim(),
				link: `https://blog.naver.com/${BLOG}/${i.logNo}`,
				date: new Date(Number(i.addDate)),
				brief: cleanBrief(String(i.briefContents ?? '')),
			});
		}
		if (items.length < 30) break;
	}
	return out.filter((p) => p.title);
}

export function getCategoryPosts(): Promise<CategoryPost[]> {
	return (cache ??= load().catch(() => []));
}
