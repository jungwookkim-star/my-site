// 네이버 블로그 RSS에서 최신 글 목록을 가져옵니다. (사이트를 빌드할 때 한 번 실행됩니다)
export const NAVER_BLOG_URL = 'https://blog.naver.com/connect_mobile';
const RSS_URL = 'https://rss.blog.naver.com/connect_mobile.xml';

export type NaverPost = { title: string; link: string; date: Date };

// 홈페이지에는 선불폰·통신 관련 글만 보여 줍니다. IT 글(방문자 유입용)은 제외합니다.
// 1) 네이버 블로그 카테고리 이름이 아래 목록에 있으면 제외합니다. (IT 글을 'IT' 카테고리에 올리면 가장 확실합니다)
// 2) 제목에 통신 관련 단어가 하나도 없으면 제외합니다.
const EXCLUDE_CATEGORIES = ['IT', 'IT꿀팁', 'IT 정보', '아이티'];
const TELECOM = /선불|후불|알뜰|유심|개통|요금제|번호이동|앤텔레콤|멤버십/;

const pick = (xml: string, tag: string) => {
	const m = xml.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
	return m ? m[1].trim() : '';
};

export async function getNaverPosts(limit = 6): Promise<NaverPost[]> {
	try {
		const res = await fetch(RSS_URL);
		if (!res.ok) return [];
		const xml = await res.text();
		return xml
			.split('<item>')
			.slice(1)
			.map((item) => ({
				title: pick(item, 'title'),
				link: pick(item, 'link').replace(/\?fromRss.*$/, ''),
				date: new Date(pick(item, 'pubDate')),
				category: pick(item, 'category'),
			}))
			.filter((p) => p.title && p.link)
			.filter((p) => !EXCLUDE_CATEGORIES.includes(p.category) && TELECOM.test(p.title))
			.slice(0, limit)
			.map(({ title, link, date }) => ({ title, link, date }));
	} catch {
		return [];
	}
}
