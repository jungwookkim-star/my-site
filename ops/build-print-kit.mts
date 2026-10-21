// 인쇄물 세트(명함 앞뒤, A5 전단지, A6 QR 카드)를 만듭니다. 300dpi, 재단선 바깥 3mm 여유(도련) 포함.
//   실행:  node --experimental-strip-types ops/build-print-kit.mts   →  naver-drafts/print-kit/*.png
// QR은 짧은 주소(/go/card, /go/flyer, /go/sign)로 연결되어, 사이트에서 어느 인쇄물로 들어왔는지 구분됩니다.
// 연락처와 상호는 src/consts.ts에서 읽어 옵니다. 바꾸려면 consts.ts를 고치고 다시 실행하세요.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { PHONE, HOURS, KAKAO_URL, REPRESENTATIVE } from '../src/consts.ts';

const OUT = 'naver-drafts/print-kit';
mkdirSync(OUT, { recursive: true });
const FONT = "Malgun Gothic, 'Apple SD Gothic Neo', Arial, sans-serif";
const NAVY = '#0e2150', BLUE = '#1356d6';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x: number, y: number, s: string, size: number, fill: string, weight = 800, anchor = 'start', extra = '') =>
	`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const mm = (v: number) => Math.round((v / 25.4) * 300);
const defs = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3f8ff"/><stop offset="1" stop-color="#cfe2ff"/></linearGradient>
<linearGradient id="navy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="#1c4aa8"/></linearGradient>
<linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2337ff"/><stop offset="1" stop-color="#1356d6"/></linearGradient></defs>`;
const wrap = (W: number, H: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}${body}</svg>`;
const qr = (url: string, px: number) => QRCode.toBuffer(url, { width: px, margin: 1, errorCorrectionLevel: 'M', color: { dark: NAVY, light: '#ffffff' } });
const mascot = (h: number) => sharp('public/brand/mascot.png').resize({ height: h }).toBuffer();
const mark = (px: number) => sharp('public/brand/mark.png').resize(px, px).toBuffer();
const save = (name: string, W: number, H: number, svg: string, layers: sharp.OverlayOptions[]) =>
	sharp(Buffer.from(wrap(W, H, svg))).composite(layers).png({ compressionLevel: 9 }).withMetadata({ density: 300 }).toFile(`${OUT}/${name}.png`).then(() => console.log('만듦:', name, `${W}x${H}`));

const SITE = 'connectmobile.kr';
const BLEED = mm(3);

// ---------- 명함 (90x50mm, 도련 포함 96x56mm) ----------
async function card() {
	const W = mm(96), H = mm(56);
	const safe = BLEED + mm(5); // 재단선에서 5mm 안쪽
	// 앞면
	const m = await mark(mm(14));
	await save('명함-앞', W, H,
		`<rect width="${W}" height="${H}" fill="#ffffff"/>
<rect width="${mm(22)}" height="${H}" fill="url(#blue)"/>
<circle cx="${W - mm(10)}" cy="${mm(8)}" r="${mm(26)}" fill="#e8f0ff"/>` +
		T(mm(22) + mm(8), safe + mm(6), '커넥트모바일', 84, NAVY) +
		T(mm(22) + mm(8), safe + mm(12), '선불폰, 알뜰폰 개통센터', 40, BLUE, 700) +
		T(mm(22) + mm(8), safe + mm(20), `대표 ${REPRESENTATIVE}`, 38, '#4f6a99', 700) +
		T(mm(22) + mm(8), safe + mm(29), PHONE, 74, NAVY) +
		T(mm(22) + mm(8), safe + mm(35), SITE, 44, BLUE, 800) +
		T(mm(22) + mm(8), H - safe + mm(1.5), '앤텔레콤 사전승낙 판매점', 28, '#4f6a99', 700),
		[{ input: m, left: Math.round((mm(22) - mm(14)) / 2) + 0, top: Math.round(H / 2 - mm(7)) }]);
	// 뒷면
	const q = await qr(`https://${SITE}/go/card`, mm(26));
	const qBox = mm(30);
	const mas = await mascot(mm(26));
	const masMeta = await sharp(mas).metadata();
	await save('명함-뒤', W, H,
		`<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="${W - mm(18)}" cy="${H - mm(16)}" r="${mm(26)}" fill="#ffffff" opacity="0.55"/>
<rect x="${safe}" y="${safe}" width="${qBox}" height="${qBox}" rx="${mm(2)}" fill="#ffffff"/>` +
		T(safe + qBox + mm(5), safe + mm(7), 'QR을 찍어 보세요', 52, NAVY) +
		T(safe + qBox + mm(5), safe + mm(13), '요금제 확인, 셀프개통', 36, BLUE, 700) +
		T(safe + qBox + mm(5), safe + mm(18), '가능 여부 진단', 36, BLUE, 700) +
		T(safe, safe + mm(36.5), '약정 NO, 위약금 NO', 38, NAVY) +
		T(safe, H - safe + mm(1.5), `상담 ${HOURS}`, 30, '#4f6a99', 700),
		[{ input: q, left: safe + Math.round((qBox - mm(26)) / 2), top: safe + Math.round((qBox - mm(26)) / 2) },
		 { input: mas, left: W - masMeta.width! - BLEED - mm(3), top: H - masMeta.height! - mm(4) }]);
}

// ---------- A5 전단지 (148x210mm, 도련 포함 154x216mm) ----------
async function flyer() {
	const W = mm(154), H = mm(216);
	const safe = BLEED + mm(8);
	const qpx = mm(36);
	const q = await qr(`https://${SITE}/go/flyer`, qpx);
	const mas = await mascot(mm(62));
	const mm2 = await sharp(mas).metadata();
	const m = await mark(mm(16));
	const bullets = ['유심만 있으면 약 10분, 휴대폰으로 셀프개통', 'KT망과 LG망 중에 골라요', '미납이나 연체가 있어도 선불은 상담 가능', '외국인, 미성년자는 방문 개통 (예약)'];
	let by = mm(98);
	let b = '';
	for (const t of bullets) {
		b += `<rect x="${safe}" y="${by}" width="${mm(100)}" height="${mm(13)}" rx="${mm(3)}" fill="#ffffff"/><circle cx="${safe + mm(6.5)}" cy="${by + mm(6.5)}" r="${mm(3)}" fill="#2337ff"/>` +
			T(safe + mm(13), by + mm(8.4), t, 46, NAVY);
		by += mm(15);
	}
	await save('전단지-A5', W, H,
		`<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${mm(48)}" fill="url(#navy)"/>
<circle cx="${W - mm(10)}" cy="${mm(8)}" r="${mm(40)}" fill="#ffffff" opacity="0.08"/>` +
		T(safe + mm(19), mm(22), '커넥트모바일', 70, '#ffffff') +
		T(safe + mm(19), mm(30), '선불폰, 알뜰폰 개통센터', 40, '#cfe2ff', 700) +
		T(safe, mm(72), '약정 없이 시작하세요', 104, NAVY) +
		T(safe, mm(86), '선불폰, 알뜰폰 개통은 커넥트모바일에서', 46, BLUE, 700) +
		b +
		`<rect x="${safe}" y="${mm(160)}" width="${qpx + mm(6)}" height="${qpx + mm(6)}" rx="${mm(3)}" fill="#ffffff"/>` +
		T(safe + qpx + mm(12), mm(170), 'QR을 찍으면', 54, NAVY) +
		T(safe + qpx + mm(12), mm(178), '내게 맞는 요금제와', 40, BLUE, 700) +
		T(safe + qpx + mm(12), mm(184), '개통 방법을 바로 확인', 40, BLUE, 700) +
		T(safe + qpx + mm(12), mm(194), PHONE, 62, NAVY) +
		T(safe + qpx + mm(12), mm(200), `카카오톡 채널 커넥트모바일 | ${SITE}`, 28, '#4f6a99', 700) +
		T(W / 2, H - BLEED - mm(1.2), `앤텔레콤 사전승낙 판매점 | 상담 ${HOURS} | 공식 안내는 바뀔 수 있어요`, 24, '#4f6a99', 700, 'middle'),
		[{ input: m, left: safe, top: mm(14) },
		 { input: q, left: safe + mm(3), top: mm(163) },
		 { input: mas, left: W - mm2.width! - BLEED - mm(4), top: mm(86) }]);
}

// ---------- A6 QR 카드 (105x148mm, 도련 포함 111x154mm) : 책상, 카운터, 간판용 ----------
async function qrCard() {
	const W = mm(111), H = mm(154);
	const safe = BLEED + mm(8);
	const qpx = mm(62);
	const q = await qr(`https://${SITE}/go/sign`, qpx);
	const mas = await mascot(mm(19));
	const mmeta = await sharp(mas).metadata();
	await save('QR카드-A6', W, H,
		`<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="${W / 2}" cy="${mm(78)}" r="${mm(52)}" fill="#ffffff" opacity="0.5"/>` +
		T(W / 2, mm(23), '궁금한 점,', 80, NAVY, 800, 'middle') +
		T(W / 2, mm(34), 'QR로 바로 확인하세요', 58, BLUE, 800, 'middle') +
		`<rect x="${(W - qpx - mm(8)) / 2}" y="${mm(43)}" width="${qpx + mm(8)}" height="${qpx + mm(8)}" rx="${mm(3)}" fill="#ffffff"/>` +
		T(W / 2, mm(124), '선불폰, 알뜰폰 개통센터 커넥트모바일', 36, NAVY, 800, 'middle') +
		T(W / 2, mm(131), `${PHONE} | 상담 ${HOURS}`, 32, '#4f6a99', 700, 'middle'),
		[{ input: q, left: Math.round((W - qpx) / 2), top: mm(47) },
		 { input: mas, left: Math.round((W - mmeta.width!) / 2), top: mm(134) }]);
}

await card();
await flyer();
await qrCard();
console.log('카카오 채널 주소(참고):', KAKAO_URL);
