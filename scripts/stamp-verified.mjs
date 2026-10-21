// 공식 요금제 페이지와 사이트 요금 데이터가 모두 같을 때만 "마지막 대조일"(src/consts.ts의 PRICES_VERIFIED)을 오늘로 갱신합니다.
// 다른 요금이 하나라도 있으면 날짜를 바꾸지 않고, 다른 부분을 보여 준 뒤 실패(종료 코드 1)로 끝납니다.
// 사용법: node --experimental-strip-types scripts/stamp-verified.mjs   (배포하기 전에 실행)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const out = execFileSync(process.execPath, ['--experimental-strip-types', 'scripts/check-prices.mjs', '--json'], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const r = JSON.parse(out.slice(out.indexOf('{')));
const bad = r.priceMismatch.length + r.notFound.length;
if (bad > 0 || r.officialCount < 20) {
	console.error(`대조일을 갱신하지 않았습니다. 가격 다름 ${r.priceMismatch.length}개, 공식 페이지에서 못 찾음 ${r.notFound.length}개, 읽은 공식 요금제 ${r.officialCount}개`);
	for (const m of r.priceMismatch) console.error(`- ${m.group} ${m.name}: 사이트 ${m.site}원, 공식 ${m.official}`);
	for (const m of r.notFound) console.error(`- 못 찾음: ${m.group} ${m.name}`);
	process.exit(1);
}
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const f = 'src/consts.ts';
const s = readFileSync(f, 'utf8');
if (!/PRICES_VERIFIED = '\d{4}-\d{2}-\d{2}'/.test(s)) throw new Error('consts.ts에서 PRICES_VERIFIED를 찾지 못했습니다.');
writeFileSync(f, s.replace(/PRICES_VERIFIED = '\d{4}-\d{2}-\d{2}'/, `PRICES_VERIFIED = '${today}'`));
console.log(`일치 ${r.matched}개, 다름 0개. 마지막 대조일을 ${today}로 갱신했습니다.`);
