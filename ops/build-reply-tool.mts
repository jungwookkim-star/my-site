// 카카오톡 응대 도구를 만듭니다. 사이트의 FAQ·요금제 데이터를 그대로 읽어서 복사용 문구를 만들기 때문에,
// 요금이나 안내가 바뀌면 이 스크립트만 다시 실행하면 문구도 같이 바뀝니다.
//   실행:  npx tsx ops/build-reply-tool.mts      →  ops/응대도구.html
import { writeFileSync } from 'node:fs';
import { faqGroups } from '../src/data/faqs.ts';
import { ktPrepaid, lgPrepaid, type PrepaidPlan } from '../src/data/prepaidPlans.ts';
import { ktPrepaidMore, lgPrepaidMore, ktPostpaid, lgPostpaid } from '../src/data/morePlans.ts';
import { postpaidPartners } from '../src/data/postpaidPlans.ts';
import { PHONE, HOURS, HOLIDAY_NOTE, SELF_ACTIVATION_URL, KAKAO_URL } from '../src/consts.ts';

type Snip = { cat: string; title: string; text: string };
const snips: Snip[] = [];
const add = (cat: string, title: string, text: string) => snips.push({ cat, title, text: text.trim() });
const SITE = 'https://connectmobile.kr';

// ---------- 1. 기본 응대 ----------
add('기본 응대', '첫 인사', `안녕하세요, 커넥트모바일입니다.\n문의 주셔서 감사합니다.\n개통이나 요금제 중 어떤 부분이 궁금하신가요?`);
add('기본 응대', '상담 시간 안내', `커넥트모바일 상담 시간은 ${HOURS}입니다.\n${HOLIDAY_NOTE}\n남겨 주신 문의는 상담 시간에 순서대로 답변드리겠습니다.`);
add('기본 응대', '개통 가능 여부 확인 질문', `개통 방법을 안내드리기 위해 몇 가지만 확인할게요.\n\n1. 개통하시는 분이 만 19세 이상 내국인이신가요? (외국인·미성년자는 대면 개통만 가능해요)\n2. 본인 확인에 쓰실 간편인증 수단과, 안면인증이 되는 휴대폰이 있으신가요?\n3. 지금 앤텔레콤 회선을 이미 쓰고 계신가요?\n4. 다른 통신사에 미납·연체가 있으신가요?`);
add('기본 응대', '셀프개통 안내', `셀프개통은 유심을 받으신 뒤 휴대폰으로 직접 진행하시면 약 10분이면 끝납니다.\n\n· 셀프개통 바로가기\n${SELF_ACTIVATION_URL}\n· 접수 시간: 신규가입 08:00~21:50, 번호이동 10:00~19:50 (번호이동은 일요일과 신정·설·추석 당일 접수 불가)\n· 준비물: 신분증, 간편인증 수단, 안면인증이 되는 휴대폰, 셀프개통이 가능한 유심\n\n진행 중 막히시면 화면 그대로 알려 주세요.`);
add('기본 응대', '방문(대면) 개통 예약 접수', `방문 개통은 사전 예약이 필요합니다.\n아래 내용을 보내 주세요.\n\n성함:\n연락처:\n방문 희망 지역:\n방문 희망 날짜와 시간:\n선택하신 요금제:\n\n준비물: 신분증, 유심비 1만원, 요금 충전비, 사용하실 휴대폰`);
add('기본 응대', '개통 완료 후 안내', `개통이 완료되었습니다.\n\n1. 유심을 휴대폰에 넣고 재부팅해 주세요.\n2. 통화·문자·데이터가 잘 되는지 한 번씩 확인해 주세요.\n3. 선불 요금제는 개통 당일 요금 충전이 필요합니다. 충전하지 않으면 다음 날 번호가 정지되거나 해지될 수 있어요.\n\n이용 중 궁금하신 점은 편하게 말씀해 주세요.`);
add('기본 응대', '연락처·사이트 안내', `커넥트모바일\n· 전화: ${PHONE}\n· 카카오톡: ${KAKAO_URL}\n· 홈페이지: ${SITE}\n· 상담 시간: ${HOURS}`);
add('기본 응대', '마무리 인사', `추가로 궁금하신 점이 있으시면 편하게 말씀해 주세요.\n감사합니다. 커넥트모바일이었습니다.`);

// ---------- 2. 자주 묻는 질문 (사이트 FAQ와 같은 내용) ----------
for (const g of faqGroups) for (const f of g.items) add(`FAQ · ${g.title}`, f.q, f.a);

// ---------- 3. 요금제 안내 (요금제 데이터에서 자동 생성) ----------
const line = (p: PrepaidPlan) => `· ${p.name} | 월 ${p.price} | 데이터 ${p.data}${p.note ? ` (${p.note})` : ''}`;
const detail = (p: PrepaidPlan) => `${p.name}\n월 ${p.price}${p.daily ? ` (${p.daily})` : ''}\n데이터: ${p.data}${p.dataNote ? ` · ${p.dataNote}` : ''}\n음성: ${p.voice}\n문자: ${p.sms}${p.note ? `\n※ ${p.note}` : ''}`;
const notice = `\n\n※ 요금과 제공량은 통신사 사정에 따라 바뀔 수 있어요. 개통 전에 최신 내용을 다시 안내드립니다.\n※ 커넥트모바일은 약정·위약금이 없습니다.`;

const kt = [...ktPrepaid, ...ktPrepaidMore];
const lg = [...lgPrepaid, ...lgPrepaidMore];
add('요금제 안내', 'KT망 선불 요금제 전체', `[KT망 선불 요금제]\n${kt.map(line).join('\n')}${notice}`);
add('요금제 안내', 'LG망 선불 요금제 전체', `[LG망 선불 요금제]\n${lg.map(line).join('\n')}${notice}`);
for (const pt of postpaidPartners) add('요금제 안내', `알뜰 요금제 · ${pt.name}`, `[KT망 알뜰(후불) · ${pt.name} 혜택]\n${pt.plans.map(line).join('\n')}${notice}`);
if (ktPostpaid.length) add('요금제 안내', 'KT망 알뜰(후불) 기본 요금제', `[KT망 알뜰(후불)]\n${ktPostpaid.map(line).join('\n')}${notice}`);
if (lgPostpaid.length) add('요금제 안내', 'LG망 알뜰(후불) 요금제', `[LG망 알뜰(후불)]\n${lgPostpaid.map(line).join('\n')}${notice}`);
for (const p of [...kt, ...lg]) add('요금제 상세', `${p.name}`, `${detail(p)}${notice}`);

// ---------- HTML ----------
const cats = [...new Set(snips.map((s) => s.cat))];
const images = [
	['요금표-KT.png', 'KT 선불 요금표'], ['요금표-LG.png', 'LG 선불 요금표'], ['유심준비.png', '유심 준비'], ['준비물체크.png', '준비물 체크'],
	['방문개통.png', '방문 개통'], ['앱개통승인요청.png', '앱 개통 승인 요청'], ['알뜰-milli.png', '알뜰 밀리의서재'], ['알뜰-naverpay.png', '알뜰 네이버페이'],
	['알뜰-coupang.png', '알뜰 쿠팡캐시'], ['알뜰-cu.png', '알뜰 CU'], ['알뜰-daiso.png', '알뜰 다이소'], ['알뜰-oliveyoung.png', '알뜰 올리브영'],
];
const data = JSON.stringify(snips).replace(/</g, '\\u003c');
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>커넥트모바일 응대 도구</title>
<style>
:root{--a:#2337ff;--g:#546692;--bg:#f5f7fb}
*{box-sizing:border-box}
body{margin:0;font-family:'Pretendard Variable',Pretendard,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:var(--bg);color:#222939;line-height:1.6}
header{position:sticky;top:0;z-index:10;background:#fff;box-shadow:0 2px 8px rgba(15,18,25,.08);padding:.8rem 1rem}
.wrap{max-width:980px;margin:0 auto}
h1{font-size:1.1rem;margin:0 0 .5rem}
#q{width:100%;font:inherit;font-size:1rem;padding:.6rem 1rem;border:2px solid #dfe3f0;border-radius:999px}
#q:focus{outline:none;border-color:var(--a)}
.tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.6rem}
.tabs button{font:inherit;font-size:.85rem;font-weight:700;border:1px solid #d9defa;background:#f6f8ff;color:var(--a);border-radius:999px;padding:.3rem .8rem;cursor:pointer}
.tabs button.on{background:var(--a);color:#fff;border-color:var(--a)}
main{padding:1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(440px,100%),1fr));gap:.8rem}
.card{background:#fff;border-radius:14px;box-shadow:0 1px 2px rgba(84,102,146,.12),0 8px 20px rgba(84,102,146,.1);padding:1rem 1.1rem;display:flex;flex-direction:column;gap:.5rem}
.card small{color:var(--g);font-weight:700;font-size:.75rem}
.card h2{font-size:1rem;margin:0}
.card pre{margin:0;white-space:pre-wrap;word-break:keep-all;font:inherit;font-size:.9rem;color:#333;max-height:11rem;overflow:auto;background:#f6f8ff;border-radius:10px;padding:.6rem .8rem}
.copy{align-self:flex-start;font:inherit;font-weight:800;border:0;border-radius:999px;background:var(--a);color:#fff;padding:.45rem 1.1rem;cursor:pointer}
.copy.done{background:#0b7a4b}
.imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.8rem}
.imgs figure{margin:0;background:#fff;border-radius:12px;padding:.6rem;box-shadow:0 1px 2px rgba(84,102,146,.12)}
.imgs img{width:100%;height:auto;border-radius:8px;display:block}
.imgs figcaption{font-size:.8rem;font-weight:700;margin-top:.4rem;text-align:center}
.note{color:var(--g);font-size:.85rem}
#empty{text-align:center;color:var(--g);padding:2rem}
</style></head><body>
<header><div class="wrap">
<h1>커넥트모바일 응대 도구 <span class="note">· 사이트 데이터 기준 · 복사 버튼을 누르고 카톡에 붙여넣으세요</span></h1>
<input id="q" type="search" placeholder="검색 (예: 미납, 충전, 번호이동, 396)" autocomplete="off">
<div class="tabs" id="tabs"></div>
</div></header>
<main><div class="wrap">
<div class="grid" id="grid"></div>
<p id="empty" hidden>찾는 문구가 없어요. 다른 검색어로 찾아보세요.</p>
<section id="imgsec" hidden>
<p class="note">이미지를 오른쪽 클릭 → "이미지 복사"로 카톡에 붙여넣거나, 파일 그대로 끌어다 놓으세요. (원본 폴더: naver-drafts/brand-cards)</p>
<div class="imgs">${images.map(([f, c]) => `<figure><a href="../naver-drafts/brand-cards/${f}" target="_blank"><img src="../naver-drafts/brand-cards/${f}" alt="${c}" loading="lazy"></a><figcaption>${c}</figcaption></figure>`).join('')}</div>
</section>
</div></main>
<script>
const DATA=${data};
const CATS=${JSON.stringify(['전체', ...cats, '이미지'])};
let cat='전체';
const $=s=>document.querySelector(s);
const tabs=$('#tabs'), grid=$('#grid'), q=$('#q');
CATS.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.onclick=()=>{cat=c;render()};tabs.append(b)});
function copy(t,btn){
  const done=()=>{btn.textContent='복사했어요';btn.classList.add('done');setTimeout(()=>{btn.textContent='복사';btn.classList.remove('done')},1500)};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(done).catch(()=>fallback(t,done))}else fallback(t,done);
}
function fallback(t,done){const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.append(a);a.select();document.execCommand('copy');a.remove();done()}
function render(){
  [...tabs.children].forEach(b=>b.classList.toggle('on',b.textContent===cat));
  const showImgs=cat==='이미지';
  $('#imgsec').hidden=!showImgs; grid.hidden=showImgs;
  if(showImgs){$('#empty').hidden=true;return}
  const k=q.value.trim().toLowerCase();
  const list=DATA.filter(s=>(cat==='전체'||s.cat===cat)&&(!k||(s.title+' '+s.text).toLowerCase().includes(k)));
  grid.replaceChildren(...list.map(s=>{
    const c=document.createElement('div');c.className='card';
    const sm=document.createElement('small');sm.textContent=s.cat;
    const h=document.createElement('h2');h.textContent=s.title;
    const p=document.createElement('pre');p.textContent=s.text;
    const b=document.createElement('button');b.className='copy';b.textContent='복사';b.onclick=()=>copy(s.text,b);
    c.append(sm,h,p,b);return c}));
  $('#empty').hidden=list.length>0;
}
q.addEventListener('input',()=>{if(cat==='이미지')cat='전체';render()});
render();
</script></body></html>`;
writeFileSync('ops/응대도구.html', html);
console.log(`만듦: ops/응대도구.html (문구 ${snips.length}개, 분류 ${cats.length}개, 이미지 ${images.length}장)`);
