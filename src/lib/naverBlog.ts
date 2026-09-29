// 네이버 블로그 RSS에서 최신 글 목록을 가져옵니다. (사이트를 빌드할 때 한 번 실행됩니다)
export const NAVER_BLOG_URL = 'https://blog.naver.com/juadsl01';
const RSS_URL = 'https://rss.blog.naver.com/juadsl01.xml';

export type NaverPost = { title: string; link: string; date: Date };

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
			.slice(1, limit + 1)
			.map((item) => ({
				title: pick(item, 'title'),
				link: pick(item, 'link').replace(/\?fromRss.*$/, ''),
				date: new Date(pick(item, 'pubDate')),
			}))
			.filter((p) => p.title && p.link);
	} catch {
		return [];
	}
}
