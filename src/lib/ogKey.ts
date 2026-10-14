// 페이지 주소 → 공유 미리보기 이미지 파일 이름. (public/og/<키>.jpg)
//   /            → home
//   /plans/      → plans
//   /blog/abc/   → blog-abc
export function ogKey(pathname: string): string {
	const p = pathname.replace(/^\/+|\/+$/g, '');
	return p === '' ? 'home' : p.replace(/\//g, '-');
}
