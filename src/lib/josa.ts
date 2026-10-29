// 이름 뒤에 받침에 맞는 '은/는'을 붙입니다. (예: 서울는 → 서울은, 경기은 → 경기는)
export const eun = (word: string) => {
	const code = word.charCodeAt(word.length - 1) - 0xac00;
	return word + (code >= 0 && code <= 11171 && code % 28 ? '은' : '는');
};
