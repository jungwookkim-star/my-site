// 셀프개통 화면 따라하기 20단계. 이미지는 public/guide/ 에 있고, 개인정보는 가려서 올렸습니다.
// 단계 설명은 직접 만든 개통 순서 안내를 그대로 옮긴 것입니다. 화면이 바뀌면 이미지와 이 목록을 함께 고치세요.
export interface GuideStep {
	n: number;
	title: string;
	desc: string;
	imgs: string[];
}

export const guideSteps: GuideStep[] = [
	{ n: 1, title: '커넥트모바일 개통 사이트 접속', desc: 'QR코드를 스캔하거나 개통 링크에 접속한 뒤, 화면에서 [개통하기]를 선택하세요.', imgs: ['step-01.webp'] },
	{ n: 2, title: '이용할 통신망 선택', desc: '준비한 유심에 맞춰 KT 또는 LG 통신망을 선택하세요.', imgs: ['step-02.webp'] },
	{ n: 3, title: '가입 정보 입력 및 본인인증', desc: '[신규가입]과 [내국인]을 선택하고, 가지고 계신 인증 유형을 고른 뒤 [안면인증]을 누르세요.', imgs: ['step-03.webp'] },
	{ n: 4, title: '안면인증 시작', desc: '원하는 인증 방법을 선택해 진행하세요.', imgs: ['step-04.webp'] },
	{ n: 5, title: '신원확인 방법 선택', desc: '신분증 촬영, PASS, 모바일신분증 중 한 가지를 선택하세요.', imgs: ['step-05.webp'] },
	{ n: 6, title: 'PASS 앱 본인확인', desc: 'PASS 앱이 있으면 [앱으로 이동] 버튼을 눌러서 인증하세요.', imgs: ['step-06.webp'] },
	{ n: 7, title: 'PASS 앱 인증 진행', desc: '앱이 열리지 않거나 신분증 촬영으로 인증할 때는 [브라우저에서 신원확인]을 누르세요.', imgs: ['step-07.webp'] },
	{ n: 8, title: '신분증 촬영 인증 시', desc: '깨끗한 바닥에 신분증을 놓고 가이드라인에 맞춰서 촬영하세요.', imgs: ['step-08.webp'] },
	{ n: 9, title: '안면인증 진행', desc: '선글라스, 모자, 마스크 등을 벗고 얼굴이 잘 보이게 정면을 보고 촬영하세요.', imgs: ['step-09.webp'] },
	{ n: 10, title: '신원확인 완료', desc: '확인이 끝나면 [개통 절차 이어가기]를 누르세요.', imgs: ['step-10.webp'] },
	{ n: 11, title: '본인인증 수단 선택', desc: '인증 수단을 고르고 본인 정보를 입력한 뒤 [본인인증 하기]를 누르세요.', imgs: ['step-11.webp'] },
	{ n: 12, title: '간편인증 완료', desc: '휴대폰에서 인증 요청을 확인한 뒤 [인증확인]을 누르세요.', imgs: ['step-12.webp'] },
	{ n: 13, title: '가입 유형 선택', desc: '[신규가입], [내국인], [선불]을 선택하세요.', imgs: ['step-13.webp'] },
	{ n: 14, title: '유심 정보 입력', desc: '유심 보유 여부를 선택하고 유심 번호를 입력하세요. 유심 번호 입력 방법은 오른쪽 안내 카드를 참고하세요.', imgs: ['step-14.webp', 'sim-input-card.webp'] },
	{ n: 15, title: '요금제 선택', desc: '사용량에 맞는 선불 요금제를 고르세요. 추천 요금제는 선불 396, 선불 459입니다.', imgs: ['step-15.webp'] },
	{ n: 16, title: '이용약관 동의', desc: '[전체 동의]를 누른 뒤 다음 단계로 이동하세요.', imgs: ['step-16.webp'] },
	{ n: 17, title: '가입자 정보 확인', desc: '자동으로 입력된 정보를 확인하고, 비어 있는 항목을 입력하세요.', imgs: ['step-17.webp'] },
	{ n: 18, title: '전화번호 선택', desc: '원하는 전화번호 뒤 4자리를 조회한 뒤 마음에 드는 번호를 예약하세요.', imgs: ['step-18.webp'] },
	{ n: 19, title: '셀프개통 신청', desc: '요금제와 유심 정보를 확인한 뒤 [셀프 개통 신청]을 누르세요.', imgs: ['step-19.webp'] },
	{ n: 20, title: '커넥트모바일 채널 추가', desc: '빠른 개통 문의와 이용 안내를 받으려면 카카오톡에서 "커넥트 모바일" 채널을 추가해 두세요.', imgs: ['step-20.webp'] },
];
