// 카카오톡 채널 꾸미기 자료를 만듭니다. (이미지 3종 + 문구 문서)
//   실행:  npx tsx ops/build-kakao-channel.mts   →  ops/kakao-channel/ (이미지)  +  ops/카카오채널-꾸미기.md
// 문구는 사이트의 FAQ·상수에서 읽기 때문에 사이트 안내와 같은 기준입니다.
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { faqGroups } from '../src/data/faqs.ts';
import { PHONE, HOURS, HOLIDAY_NOTE, KAKAO_URL, SELF_ACTIVATION_URL } from '../src/consts.ts';

const OUT = 'ops/kakao-channel';
mkdirSync(OUT, { recursive: true });

const FONT = "Malgun Gothic, 'Apple SD Gothic Neo', Arial, sans-serif";
const NAVY = '#0e2150', BLUE = '#1356d6', DEEP = '#0e45b8', MUTED = '#4f6a99';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (x: number, y: number, s: string, size: number, fill: string, weight = 700, anchor = 'start') =>
	`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
const defs = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3f8ff"/><stop offset="1" stop-color="#cfe2ff"/></linearGradient>
<linearGradient id="navy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="#16398a"/></linearGradient>
<linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d6bff"/><stop offset="1" stop-color="${DEEP}"/></linearGradient>
</defs>`;
const mascot = (h: number) => sharp('public/brand/mascot.png').resize({ height: h }).toBuffer();
const mark = (px: number) => sharp('public/brand/mark.png').resize(px, px).toBuffer();
const svg = (w: number, h: number, body: string) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`);

// 1) 프로필 이미지 640x640 : 얼굴이 가운데, 원형·둥근 사각형으로 잘려도 안전한 여백
async function profile() {
	const W = 640;
	const head = await sharp('public/brand/mascot.png').extract({ left: 0, top: 0, width: 371, height: 400 }).resize({ height: 470 }).toBuffer();
	const hm = await sharp(head).metadata();
	const k = 470 / 400;
	await sharp(svg(W, W, `<rect width="${W}" height="${W}" fill="url(#blue)"/><circle cx="320" cy="330" r="250" fill="#ffffff" opacity=".16"/>`))
		.composite([{ input: head, left: Math.round(W / 2 - 215 * k), top: 110 }])
		.png()
		.toFile(`${OUT}/1-프로필-640x640.png`);
}

// 2) 배경(커버) 이미지: 정사각 800x800 과 가로형 1280x720. 중요한 글은 가운데 안전 영역에 둡니다.
async function cover(w: number, h: number, name: string) {
	const cx = w / 2;
	const big = h >= 780;
	const body = `<rect width="${w}" height="${h}" fill="url(#bg)"/>
<circle cx="${w - 80}" cy="40" r="${h * 0.32}" fill="#dbe9ff" opacity=".7"/><circle cx="50" cy="${h + 10}" r="${h * 0.26}" fill="#e4efff" opacity=".9"/>
${t(cx, big ? 330 : 280, '커넥트모바일', big ? 78 : 76, NAVY, 800, 'middle')}
${t(cx, big ? 380 : 328, 'CONNECT MOBILE', 28, BLUE, 700, 'middle')}
<rect x="${cx - 190}" y="${big ? 412 : 358}" width="380" height="58" rx="29" fill="url(#navy)"/>${t(cx, big ? 452 : 398, '선후불 개통센터', 32, '#ffffff', 800, 'middle')}
${t(cx, big ? 534 : 490, '약정 NO · 위약금 NO · 10분 셀프개통', 30, DEEP, 800, 'middle')}
${t(cx, big ? 584 : 534, `상담 ${HOURS}`, 24, MUTED, 600, 'middle')}`;
	const m = await mascot(big ? 250 : 210);
	const mm = await sharp(m).metadata();
	await sharp(svg(w, h, body))
		.composite([
			{ input: await mark(big ? 96 : 84), left: Math.round(cx - (big ? 48 : 42)), top: big ? 120 : 92 },
			{ input: m, left: w - (mm.width ?? 0) - 36, top: h - (mm.height ?? 0) - 6 },
		])
		.png()
		.toFile(`${OUT}/${name}.png`);
}

// 3) 환영 메시지 이미지 800x400 (2:1): 무엇을 도와드릴까요?
async function welcome() {
	const W = 800, H = 400;
	const items = [
		['1', '요금제가 궁금해요', '선불·알뜰 요금제 비교'],
		['2', '개통이 되는지 궁금해요', '셀프개통 / 방문 개통 안내'],
		['3', '외국인·미성년자예요', '방문 개통(예약) 안내'],
	];
	const rows = items
		.map(([n, a, b], i) => {
			const y = 140 + i * 82;
			return `<rect x="270" y="${y}" width="490" height="68" rx="20" fill="#ffffff"/><circle cx="312" cy="${y + 34}" r="22" fill="url(#blue)"/>${t(312, y + 43, n, 26, '#fff', 800, 'middle')}${t(350, y + 31, a, 25, NAVY, 800)}${t(350, y + 56, b, 18, MUTED, 600)}`;
		})
		.join('');
	const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
${t(270, 78, '무엇을 도와드릴까요?', 40, NAVY, 800)}
${t(270, 112, '번호만 보내 주셔도 안내해 드려요', 22, MUTED, 600)}
${rows}`;
	const m = await mascot(300);
	await sharp(svg(W, H, body)).composite([{ input: m, left: 28, top: 70 }]).png().toFile(`${OUT}/3-환영메시지-800x400.png`);
}

// ---------- 문구 문서 ----------
const faq = (prefix: string) => faqGroups.flatMap((g) => g.items).find((f) => f.q.startsWith(prefix))?.a ?? `(FAQ에서 "${prefix}" 를 찾지 못했습니다)`;
const keywordReplies: [string, string, string][] = [
	['미납', '미납이나 연체 이력이 있어도 개통되나요?', faq('미납이나 연체')],
	['외국인', '외국인이나 미성년자도 개통할 수 있나요?', faq('외국인이나 미성년자')],
	['미성년자', '(외국인과 같은 답변)', faq('외국인이나 미성년자')],
	['방문', '방문 개통은 어떻게 예약하나요?', faq('방문 개통은 어떻게')],
	['유심', '유심은 어떻게 받나요?', faq('유심은 어떻게 받나요')],
	['접수시간', '번호이동과 신규가입은 몇 시까지 접수되나요?', faq('번호이동과 신규가입은')],
	['충전', '개통 당일에 요금을 충전해야 하나요?', faq('개통 당일에 요금을 충전')],
	['약정', '약정이나 위약금이 있나요?', faq('약정이나 위약금')],
];

const md = `# 카카오톡 채널 꾸미기 자료 (${new Date().toISOString().slice(0, 10)} 생성)

> 이 문서는 \`ops/build-kakao-channel.mts\`로 만듭니다. 문구는 사이트 FAQ·상수와 같은 기준입니다.
> 채널 주소: ${KAKAO_URL} (현재 공개 페이지에서 확인되는 이름: "커넥트 모바일")

## 1. 이미지 (ops/kakao-channel/)
| 파일 | 용도 | 크기 |
|---|---|---|
| 1-프로필-640x640.png | 프로필 이미지 (얼굴이 가운데, 원형으로 잘려도 안전) | 640×640 |
| 2-배경-800x800.png / 2-배경-1280x720.png | 채널 배경(커버) 이미지 | 800×800 / 1280×720 |
| 3-환영메시지-800x400.png | 친구 추가 환영 메시지에 넣는 이미지 | 800×400 |
관리자 화면에서 안내하는 권장 크기가 다르면 알려 주세요. 맞춰서 다시 만듭니다. (배경 이미지는 두 비율을 모두 만들어 두었습니다.)

## 2. 채널 소개 문구
**한 줄 소개**
> 선불·알뜰폰 개통, 약정·위약금 없이 10분 셀프개통. 상담 ${HOURS}

**상세 소개**
> 커넥트모바일 선후불 개통센터입니다.
> KT망·LG망 선불 요금제와 알뜰(후불) 요금제를 안내해 드려요.
> · 약정·위약금 없음
> · 유심만 준비하시면 약 10분이면 셀프개통
> · 미납·연체가 있어도 선불은 개통 상담 가능
> · 외국인·미성년자는 방문(대면) 개통 예약
> 상담 시간: ${HOURS} (${HOLIDAY_NOTE})
> 홈페이지: https://connectmobile.kr

**검색 키워드 제안 (채널 검색용)**
선불폰, 알뜰폰, 선불유심, 알뜰폰 개통, 선불폰 개통, KT선불, LG선불, 셀프개통, 번호이동, 커넥트모바일

## 3. 환영 메시지 (친구 추가 직후)
\`\`\`
안녕하세요, 커넥트모바일 선후불 개통센터입니다.
친구 추가해 주셔서 감사합니다.

원하시는 번호를 보내 주세요.
1. 요금제가 궁금해요
2. 개통이 되는지 궁금해요 (셀프개통 / 방문 개통)
3. 외국인·미성년자예요 (방문 개통 예약)

상담 시간은 ${HOURS}입니다.
${HOLIDAY_NOTE}
\`\`\`

## 4. 상담 시간 외 자동 응답 (부재중 메시지)
\`\`\`
문의 주셔서 감사합니다.
지금은 상담 시간(${HOURS})이 아니에요.
남겨 주신 내용은 상담 시간에 순서대로 답변드리겠습니다.

셀프개통은 아래에서 바로 진행하실 수 있어요.
${SELF_ACTIVATION_URL}
(신규가입 08:00~21:50 · 번호이동 10:00~19:50)
\`\`\`

## 5. 키워드 자동 답변
고객이 아래 단어를 보내면 해당 답변이 나가도록 설정합니다. (답변 내용은 사이트 FAQ와 같습니다)

${keywordReplies.map(([k, q, a]) => `### 키워드: ${k}\n질문: ${q}\n\`\`\`\n${a}\n\`\`\``).join('\n\n')}

## 6. 채널 메뉴(버튼) 제안
| 순서 | 버튼 이름 | 연결 주소 |
|---|---|---|
| 1 | 셀프개통 바로가기 | ${SELF_ACTIVATION_URL} |
| 2 | 요금제 보기 | https://connectmobile.kr/plans/ |
| 3 | 개통 가능 여부 진단 | https://connectmobile.kr/#check |
| 4 | 요금 절약 계산기 | https://connectmobile.kr/saving/ |
| 5 | 방문 개통 예약 안내 | https://connectmobile.kr/faq/ |
| 6 | 자주 묻는 질문 | https://connectmobile.kr/faq/ |
메뉴 개수 제한은 관리자 화면 기준으로 맞춥니다. 많으면 1~4번만 쓰셔도 됩니다.

## 7. 적용 순서
1. 카카오톡 채널 관리자센터(center-pf.kakao.com)에 로그인하고 "커넥트 모바일" 채널을 엽니다.
2. **프로필**: 프로필 이미지와 배경 이미지, 소개글, 검색 키워드를 입력합니다. (이미지는 1번 폴더)
3. **메시지/응답 설정**: 환영 메시지, 부재중 메시지를 3·4번 문구로 바꿉니다. (환영 메시지에 3번 이미지 첨부)
4. **키워드 답변**: 5번의 키워드와 답변을 등록합니다.
5. **메뉴**: 6번 버튼을 등록합니다.
6. 각 화면에서 막히면 그 화면을 스크린샷으로 보내 주세요.
`;
writeFileSync('ops/카카오채널-꾸미기.md', md);

await profile();
await cover(800, 800, '2-배경-800x800');
await cover(1280, 720, '2-배경-1280x720');
await welcome();
console.log('만듦: ops/kakao-channel/ (이미지 4장), ops/카카오채널-꾸미기.md');
