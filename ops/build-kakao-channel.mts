// 카카오톡 채널 꾸미기 자료를 만듭니다. (이미지 3종 + 문구 문서)
//   실행:  npx tsx ops/build-kakao-channel.mts   →  ops/kakao-channel/ (이미지)  +  ops/카카오채널-꾸미기.md
// 상담 시간과 요금은 사이트 상수와 요금 데이터에서 읽기 때문에 사이트 안내와 같은 기준입니다.
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { ktPrepaid, lgPrepaid } from '../src/data/prepaidPlans.ts';
import { HOURS, HOLIDAY_NOTE, KAKAO_URL, SELF_ACTIVATION_URL } from '../src/consts.ts';

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
	// 채팅방 메뉴 이름을 그대로 보여 줘서 "아래 메뉴를 누르면 된다"는 걸 알게 합니다.
	const rows = menus
		.map((mn, i) => {
			const x = 270 + (i % 2) * 252, y = 138 + Math.floor(i / 2) * 60;
			return `<rect x="${x}" y="${y}" width="240" height="48" rx="24" fill="#ffffff"/><circle cx="${x + 26}" cy="${y + 24}" r="7" fill="url(#blue)"/>${t(x + 44, y + 32, mn.name, 21, NAVY, 800)}`;
		})
		.join('');
	const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
${t(270, 78, '무엇을 도와드릴까요?', 40, NAVY, 800)}
${t(270, 112, '채팅방 아래 메뉴를 누르면 바로 답이 와요', 22, MUTED, 600)}
${rows}`;
	const m = await mascot(300);
	await sharp(svg(W, H, body)).composite([{ input: m, left: 28, top: 70 }]).png().toFile(`${OUT}/3-환영메시지-800x400.png`);
}

// ---------- 문구 문서 ----------
// 카카오 공식 안내(스마트채팅) 기준으로 자동 답장은 "단어를 입력하면"이 아니라 "채팅방 메뉴를 누르면" 나갑니다.
// 그래서 예전 키워드 답변(2026-10-14)을 채팅방 리스트 메뉴 7개로 바꿨습니다. (2026-10-29)
// 사실은 사이트 FAQ, 글(usim-delivery, foreigner-minor-activation, prepaid-charge-guide), 요금 데이터와 같은 기준입니다.
const SITE = 'https://connectmobile.kr';
// 버튼 주소에 꼬리표를 붙여 구글 애널리틱스에서 "kakao_channel / menu" 처럼 보이게 합니다.
const link = (path: string, medium: string, campaign: string, hash = '') =>
	`${SITE}${path}?utm_source=kakao_channel&utm_medium=${medium}&utm_campaign=${campaign}${hash}`;

// 요금은 요금 데이터에서 읽습니다. KT와 LG 금액이 달라지면 문구를 다시 써야 해서 멈춥니다.
const plan = (list: typeof ktPrepaid, name: string) => {
	const p = list.find((x) => x.name === name);
	if (!p) throw new Error(`요금 데이터에서 "${name}"를 찾지 못했습니다. 메뉴 4번 문구를 고쳐 주세요.`);
	return p;
};
const kt396 = plan(ktPrepaid, 'LTE 선불 396 10.3GB'), kt459 = plan(ktPrepaid, 'LTE 선불 459 20.3GB'), kt1 = plan(ktPrepaid, '선불 LTE 기본1');
const lg396 = plan(lgPrepaid, 'L망 선불 396 10.3GB'), lg1 = plan(lgPrepaid, 'L망 선불 기본1');
if (kt396.price !== lg396.price || kt1.price !== lg1.price || kt1.voice !== lg1.voice || kt1.sms !== lg1.sms || kt1.data !== lg1.data)
	throw new Error('KT망과 LG망 396, 기본1 요금이 달라졌습니다. 메뉴 4번 문구를 나눠 써 주세요.');
const gb = (d: string) => d.split(' ')[0];

interface Menu {
	name: string;
	short?: string; // 이름이 길다고 나오면 쓸 짧은 이름
	body: string;
	buttons: [string, string][];
}
const menus: Menu[] = [
	{
		name: '셀프개통 막혀요',
		body: `어디서 막혔는지 알려 주시면 바로 봐 드릴게요. 막힌 화면을 캡처해서 보내 주시면 가장 빨라요.

자주 막히는 곳
1. 안면인증: 링크는 3분 동안 1번만 열려요. 실패해도 3번까지 다시 할 수 있어요. 신분증은 지갑에서 꺼내고, 모자, 마스크, 선글라스를 벗고 정면으로 찍어 주세요.
2. 유심번호: KT 바로유심은 숫자 19자리, LG 모두의 유심은 모델코드 5자리와 일련번호 8자리예요.
3. 접수 시간: 번호이동은 10:00~19:50에만 접수돼요.
4. 외국인, 미성년자, 앤텔레콤 회선을 이미 쓰는 분, 간편인증 수단이 없는 분은 셀프개통 대신 방문 개통으로 해요.`,
		buttons: [
			['막힘 해결 모음', link('/blog/self-activation-troubleshooting/', 'menu', 'stuck')],
			['방문 개통 안내', link('/visit/', 'menu', 'stuck')],
		],
	},
	{
		name: '유심 받는 법',
		body: `유심은 두 가지 방법으로 준비해요. 유심비는 8,800원이에요.

1. 퀵 배송 (서울, 수도권, 광역시, 제주)
주문 10:00~22:00, 배송비 무료, 대부분 2시간 안에 받아요. 원하는 통신망(KT, LG)과 받을 주소, 연락처를 여기 남겨 주세요.

2. 편의점
KT 바로유심: CU, GS25, 세븐일레븐, 이마트24
LG 모두의 유심 원칩: 이마트24, 배민B마트 등

유심을 받으면 약 10분이면 셀프개통할 수 있어요. 개통 전에는 쓰던 유심을 미리 빼지 마세요.
eSIM은 LG망 선불만 되고 발급비는 2,750원이에요.`,
		buttons: [
			['유심 받는 방법', link('/blog/usim-delivery/', 'menu', 'usim')],
			['셀프개통 시작하기', SELF_ACTIVATION_URL],
		],
	},
	{
		name: '접수 시간',
		body: `셀프개통 접수 시간이에요.
신규가입 (새 번호): 08:00~21:50
번호이동 (쓰던 번호 그대로): 10:00~19:50
번호이동은 일요일과 신정, 설, 추석 당일에는 접수되지 않아요.

번호이동은 마감이 빨라서 퇴근 뒤에 하다가 놓치는 경우가 많아요. 시간이 지났다면 다음 접수 시간에 다시 하면 돼요.
상담 시간은 ${HOURS}예요.`,
		buttons: [['시간이 지났을 때', link('/blog/self-activation-time-over/', 'menu', 'time')]],
	},
	{
		name: '요금제 고르기',
		body: `추천 선불 요금제예요. 약정과 위약금은 없어요.

선불 396: 월 ${kt396.price}, 데이터 ${gb(kt396.data)} (KT망, LG망)
선불 459: 월 ${kt459.price}, 데이터 ${gb(kt459.data)} (KT망)
396과 459는 통화와 문자가 기본제공이에요.
가장 저렴한 기본1: 월 ${kt1.price}, 통화 ${kt1.voice}, 문자 ${kt1.sms}, 데이터 ${kt1.data}

데이터를 얼마나 쓰는지, 전화를 많이 하는지 알려 주시면 맞는 요금제를 골라 드릴게요.
요금제는 한 달에 한 번 바꿀 수 있고, 다음 달 1일부터 적용돼요.`,
		buttons: [
			['요금제 전체 보기', link('/plans/', 'menu', 'plans')],
			['요금 절약 계산기', link('/saving/', 'menu', 'plans')],
		],
	},
	{
		name: '충전 방법',
		body: `선불은 개통한 날 꼭 충전해 주세요. 충전하지 않으면 다음 날 번호가 정지되거나 해지될 수 있어요.

충전 방법
1. 앤텔레콤 멤버십 앱
2. 센터 방문
3. 센터에서 자동이체 (신용카드, 계좌이체)
LG망 선불은 5천원 이상부터 충전돼요.

LG망 선불은 잔액이 다 떨어지면 15일 동안 전화를 받기만 할 수 있고, 30일이 지나면 해지돼요. 해지하면 남은 잔액은 돌려받을 수 없어요.`,
		buttons: [
			['충전 방법 자세히', link('/blog/prepaid-charge-guide/', 'menu', 'charge')],
			['충전일 메모하기', link('/my-note/', 'menu', 'charge')],
		],
	},
	{
		name: '외국인 Foreigner',
		short: '외국인 EN',
		body: `외국인은 셀프개통이 안 되고, 예약한 뒤 방문 개통만 할 수 있어요. 1회선까지예요. 성함, 연락처, 방문 희망 지역, 날짜와 시간, 원하는 요금제를 남겨 주세요. 필요한 서류는 예약할 때 알려 드려요.

Foreigners can open one prepaid line, in person only, with a reservation. Please send your name, phone number, preferred area, date and time, and plan. Bring your ID, the SIM fee (10,000 KRW), money for the first top-up, and your phone.

中文 ${SITE}/zh/
Tiếng Việt ${SITE}/vi/
日本語 ${SITE}/ja/`,
		buttons: [
			['English guide', link('/en/', 'menu', 'foreign')],
			['방문 개통 안내', link('/visit/', 'menu', 'foreign', '#foreign')],
		],
	},
	{
		name: '방문 개통 예약',
		body: `방문 개통은 예약하고 오셔야 해요. 아래 내용을 여기 남겨 주시면 가까운 곳을 안내해 드려요.

1. 성함
2. 연락처
3. 방문 희망 지역
4. 희망 날짜와 시간
5. 원하는 요금제 (모르면 "추천"이라고 써 주세요)

준비물: 신분증, 유심비 1만원, 요금 충전비, 사용할 휴대폰 (유심은 지점에서 준비해요)
방문 개통은 외국인, 미성년자, 앤텔레콤 회선을 이미 쓰는 분, 간편인증 수단이 없는 분이 해요. 미성년자는 법정대리인 서류가 필요해요.`,
		buttons: [
			['내가 방문 대상인지', link('/visit/', 'menu', 'visit')],
			['미성년자 서류', link('/blog/foreigner-minor-activation/', 'menu', 'visit')],
		],
	},
];

// 채팅 가능 시간 밖에 말을 건 사람에게 나가는 안내. 아침에 한 번에 답할 수 있게 필요한 것을 먼저 받습니다.
const away = `문의 주셔서 감사합니다. 지금은 상담 시간이 아니에요. (상담 ${HOURS})
아래 내용을 한 번에 남겨 주시면 오전 9시부터 순서대로 답해 드릴게요.

1. 새 번호 또는 쓰던 번호 그대로
2. 사는 지역 (시, 구까지)
3. 유심 있음 또는 없음
4. 외국인이나 미성년자라면 알려 주세요
5. 궁금한 점

자주 묻는 답은 채팅방 아래 메뉴를 누르면 바로 볼 수 있어요.
신규가입 셀프개통은 오전 8시부터 할 수 있어요.`;

// 채널을 친구 추가한 사람에게 나가는 메시지 (본문 400자까지, 버튼 2개까지)
const welcomeMsg = `반가워요, 커넥트모바일이에요.
앤텔레콤 사전승낙을 받은 판매점이고, 선불폰과 알뜰폰을 약정 없이 개통해 드려요.

채팅방 아래 메뉴를 누르면 바로 답이 와요.
${menus.map((m) => m.name).join(' / ')}

상담 시간은 ${HOURS}예요. 그 밖의 시간에 남겨 주셔도 오전 9시부터 순서대로 답해 드려요.`;
const welcomeButtons: [string, string][] = [
	['셀프개통 가능 확인', link('/', 'welcome', 'welcome', '#check')],
	['셀프개통 시작하기', SELF_ACTIVATION_URL],
];
const len = (s: string) => [...s].length;
if (len(welcomeMsg) > 400) throw new Error(`웰컴메시지가 ${len(welcomeMsg)}자입니다. 400자 안으로 줄여 주세요.`);
const btnTable = (b: [string, string][]) => `| 버튼 이름 | 연결 주소 |\n|---|---|\n${b.map(([n, u]) => `| ${n} | ${u} |`).join('\n')}`;

const md = `# 카카오톡 채널 꾸미기 자료 (${new Date().toISOString().slice(0, 10)} 생성)

> 이 문서는 \`ops/build-kakao-channel.mts\`로 만듭니다. 문구는 사이트 FAQ·상수와 같은 기준입니다.
> 채널 주소: ${KAKAO_URL} (현재 공개 페이지에서 확인되는 이름: "커넥트 모바일")

## 1. 이미지 (ops/kakao-channel/)
| 파일 | 용도 | 크기 |
|---|---|---|
| 1-프로필-640x640.png | 프로필 이미지 (얼굴이 가운데, 원형으로 잘려도 안전) | 640×640 |
| 2-배경-800x800.png / 2-배경-1280x720.png | 채널 배경(커버) 이미지 | 800×800 / 1280×720 |
| 3-환영메시지-800x400.png | 웰컴메시지에 넣는 이미지 (채팅방 메뉴 7개 안내, 2026-10-29 바꿈) | 800×400 |
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

## 3. 첫 답장 (2026-10-29 바꿈)
카카오 공식 안내 기준으로, 자동 답장은 손님이 **단어를 입력할 때가 아니라 채팅방 메뉴를 누를 때** 나가요.
그래서 10/14에 만든 "키워드 자동 답변"과 "채널 메뉴"는 쓰지 않고, 아래 세 군데로 바꿨어요.

| 어디 | 누구에게, 언제 나가나 |
|---|---|
| 4. 채팅 불가능 안내 메시지 | 상담 시간 밖(오후 10시~오전 9시)에 말을 건 사람 |
| 5. 채팅방 메뉴 7개 | 채팅방을 연 누구나, 메뉴를 누르면 24시간 바로 |
| 6. 웰컴메시지 | 채널을 친구 추가한 사람 (오후 8시 55분~오전 8시에 추가하면 다음 날 오전 8시에) |

채팅하기 링크로 바로 들어온 손님은 친구 추가를 안 해서 웰컴메시지를 못 받을 수 있어요. 그래서 가장 중요한 건 5번 메뉴예요.
버튼 주소에는 꼬리표가 붙어 있어서, 구글 애널리틱스에서 \`kakao_channel / menu\`, \`kakao_channel / welcome\`으로 따로 보여요.

## 4. 채팅 불가능 안내 메시지 (상담 시간 밖)
밤에 온 문의에 아침에 한 번에 답할 수 있게, 필요한 내용을 먼저 받아 두는 문구예요. (${len(away)}자)
\`\`\`
${away}
\`\`\`

## 5. 채팅방 메뉴 7개 (리스트 메뉴)
메뉴 1개와 응답 메시지 1개가 한 세트예요. 아래 순서대로 등록하고 7개 모두 노출에 체크합니다.
메뉴 이름이나 본문이 길다고 나오면 그 화면을 캡처해서 보내 주세요. (카카오 안내서에 글자 수 제한이 적혀 있지 않아요)

${menus
	.map(
		(m, i) => `### 메뉴 ${i + 1}. ${m.name}${m.short ? ` (이름이 길다고 나오면: ${m.short})` : ''}
응답 본문 (${len(m.body)}자)
\`\`\`
${m.body}
\`\`\`
${btnTable(m.buttons)}`,
	)
	.join('\n\n')}

## 6. 웰컴메시지 (친구 추가 직후)
본문 (${len(welcomeMsg)}자, 400자까지)
\`\`\`
${welcomeMsg}
\`\`\`
${btnTable(welcomeButtons)}

이미지는 \`3-환영메시지-800x400.png\`를 붙이면 돼요. (메뉴 이름이 그대로 들어간 그림이에요. 이미지는 없어도 됩니다)

## 7. 적용 순서
카카오톡 채널 관리자센터(center-pf.kakao.com)에 로그인하고 "커넥트 모바일" 채널을 엽니다.
1. **상담 시간과 밤 안내**: 1:1 채팅 → 채팅 가능 시간을 오전 9시~오후 10시로 맞추고(쉬는 요일이 있으면 그 요일만 빼기), 채팅 불가능 안내 메시지를 "직접 입력"으로 골라 4번 문구를 붙여 넣습니다.
2. **메뉴 7개**: 비즈니스 도구 → 채팅방 메뉴 → 리스트 메뉴에서 5번의 메뉴 이름, 응답 본문, 버튼을 7세트 등록합니다. 7개 모두 노출에 체크하고 "리스트 메뉴 사용"을 켭니다.
   - 채팅방 메뉴는 한 종류만 쓸 수 있어요. 10/14 자료로 커스텀 메뉴를 켜 두셨다면 그것을 먼저 끕니다.
3. **웰컴메시지**: 메시지 → 웰컴메시지에 6번 본문과 버튼 2개를 넣고, 이미지는 3번 파일을 붙입니다.
4. **확인**: 내 카카오톡으로 채널 채팅방을 열어 메뉴 7개를 하나씩 눌러 보고, 답장과 버튼이 맞게 나오는지 봅니다.
5. 막히는 화면은 캡처해서 보내 주세요.

요금이 바뀌면 메뉴 4번(요금제 고르기) 본문도 바꿔야 해요. 사이트 요금을 고칠 때 이 문서를 다시 만들어 드릴게요.

## 8. 효과 보는 법 (2주 뒤)
- 구글 애널리틱스 → 보고서 → 획득 → 트래픽 획득 → 세션 소스/매체에서 \`kakao_channel / menu\` 줄을 봅니다. 캠페인(stuck, usim, time, plans, charge, foreign, visit)별로 어떤 메뉴 버튼이 많이 눌렸는지 알 수 있어요.
- 밤사이 온 문의 중 4번의 다섯 가지를 채워서 보낸 사람이 몇 명인지 대충 세어 두세요. 많이 채워 오면 아침 답장이 한 번에 끝나요.
- 자주 눌리는 메뉴는 앞으로, 안 눌리는 메뉴는 뒤로 옮깁니다.
`;
writeFileSync('ops/카카오채널-꾸미기.md', md);

await profile();
await cover(800, 800, '2-배경-800x800');
await cover(1280, 720, '2-배경-1280x720');
await welcome();
console.log('만듦: ops/kakao-channel/ (이미지 4장), ops/카카오채널-꾸미기.md');
