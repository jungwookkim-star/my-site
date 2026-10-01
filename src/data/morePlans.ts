// 앤텔레콤 공식 요금제 페이지(2026-10-01 확인)의 나머지 요금제입니다.
// prepaidPlans.ts / postpaidPlans.ts의 추천 목록에 없는 일반(약정 없는) 요금제만 담았습니다.
// 패드·스마트기기 전용, 약정, 복지 요금제는 공식 페이지에서 확인하세요.
import type { PrepaidPlan } from './prepaidPlans';

const speed = (s: string) => `데이터 소진 시 최대 ${s} 속도제어`;
const UV = '유무선 기본제공';

export const ktPrepaidMore: PrepaidPlan[] = [
	{ name: '선불 LTE기본2', voice: '50분', sms: '30건', data: '500MB', price: '15,400원', daily: '일 513원' },
	{ name: '선불 LTE실속데이터1', voice: '50분', sms: '30건', data: '1GB', price: '21,890원', daily: '일 730원' },
	{ name: 'LTE 24', voice: '160분', sms: '200건', data: '750MB', price: '26,400원', daily: '일 880원' },
	{ name: 'LTE 망내 25', voice: '망내 기본제공 / 망외 130분', sms: '기본제공', data: '750MB', price: '27,500원', daily: '일 916원' },
	{ name: 'LTE 28', voice: '200분', sms: '200건', data: '1.5GB', price: '30,800원', daily: '일 1,026원' },
	{ name: '선불선택348', voice: `${UV} (+영상/부가 30분)`, sms: '기본제공', data: '300MB', price: '34,860원', daily: '일 1,162원' },
	{ name: '선불실속1(QoS)', voice: '160분', sms: '200건', data: '750MB + 최대 400Kbps', dataNote: speed('400Kbps'), price: '35,000원', daily: '일 1,166원' },
	{ name: 'LTE 선불 베이직', voice: `${UV} (+영상/부가 50분)`, sms: '기본제공', data: '1.4GB', price: '36,000원', daily: '일 1,200원' },
	{ name: 'LTE 망내 33', voice: '망내 기본제공 / 망외 185분', sms: '기본제공', data: '1.5GB', price: '36,300원', daily: '일 1,210원' },
	{ name: 'LTE 선불실속2(QoS)', voice: '200분', sms: '200건', data: '1.5GB + 최대 400Kbps', dataNote: speed('400Kbps'), price: '39,000원', daily: '일 1,300원' },
	{ name: 'LTE 선불 396', voice: `${UV} (+영상/부가 30분)`, sms: '기본제공', data: '300MB + 최대 3Mbps', dataNote: speed('3Mbps'), price: '39,600원', daily: '일 1,320원' },
	{ name: 'LTE 망내 40', voice: '망내 기본제공 / 망외 250분', sms: '기본제공', data: '2.5GB', price: '44,000원', daily: '일 1,466원' },
	{ name: 'LTE 선불데이터10G', voice: '100분', sms: '100건', data: '10GB', price: '45,000원', daily: '일 1,500원' },
	{ name: 'LTE 웹', voice: `${UV} (+영상/부가 150분)`, sms: '기본제공', data: '2.5GB + 최대 400Kbps', dataNote: speed('400Kbps'), price: '45,100원', daily: '일 1,503원' },
	{ name: 'LTE 42', voice: '350분', sms: '350건', data: '6GB', price: '46,200원', daily: '일 1,540원' },
	{ name: 'LTE 선불데이터 15G', voice: '100분', sms: '100건', data: '15GB + 최대 3Mbps', dataNote: speed('3Mbps'), price: '49,500원', daily: '일 1,650원' },
	{ name: 'LTE 톡', voice: `${UV} (+영상/부가 300분)`, sms: '기본제공', data: '3GB + 최대 1Mbps', dataNote: speed('1Mbps'), price: '55,000원', daily: '일 1,833원' },
	{ name: 'LTE 선불 망내무한 300분 10GB', voice: '망내 무선 기본제공 / 망외 300분', sms: '기본제공', data: '10GB', price: '60,000원', daily: '일 2,000원' },
	{ name: 'LTE 선불선택 663', voice: `${UV} (+영상/부가 30분)`, sms: '기본제공', data: '6GB', price: '66,330원', daily: '일 2,211원' },
	{ name: 'LTE 음성문자 안심5GB', voice: `${UV} (+영상/부가 200분)`, sms: '기본제공', data: '5GB', price: '69,300원', daily: '일 2,310원' },
	{ name: 'LTE 음성문자 데이터안심', voice: `${UV} (+영상/부가 200분)`, sms: '기본제공', data: '25GB + 일 2GB + 최대 3Mbps', dataNote: speed('3Mbps'), price: '130,900원', daily: '일 4,363원' },
];

export const lgPrepaidMore: PrepaidPlan[] = [
	{ name: 'L망 선불 396(국제)', voice: '기본제공 + 국제전화 일 20분 (+영상/부가 50분)', sms: '기본제공', data: '300MB', dataNote: '최대 3Mbps 속도제어', note: '국제전화는 002 사용 시에만 제공, 제휴 7개국 일 20분', price: '48,400원' },
	{ name: 'L망 선불 데이터15GB', voice: '100분', sms: '100건', data: '15GB', dataNote: '최대 3Mbps 속도제어', price: '49,500원' },
	{ name: 'L망 선불 770', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '11GB + 일 2GB + 최대 3Mbps', dataNote: speed('3Mbps'), note: '일 600분 초과 통화를 월 3회 이상 하면 기본제공이 제한될 수 있음', price: '77,000원' },
	{ name: 'L망 선불 770(국제)', voice: '기본제공 + 국제전화 일 20분 (+영상/부가 300분)', sms: '기본제공', data: '11GB + 일 2GB + 최대 3Mbps', dataNote: speed('3Mbps'), note: '국제전화는 002 사용 시에만 제공, 제휴국가 일 20분', price: '85,800원' },
	{ name: 'L망 선불 매일5GB', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '매일 5GB', dataNote: '최대 5Mbps 속도제어', note: '단기간 대용량 데이터 이용 시 속도가 제한되거나 차단될 수 있음', price: '85,900원' },
];

export const lgPostpaid: PrepaidPlan[] = [
	{ name: 'L망 데이터10G+', voice: '100분', sms: '100건', data: '10GB + 최대 1Mbps', dataNote: speed('1Mbps'), price: '17,600원' },
	{ name: 'L망 플랫폼 7GB+', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '7GB + 최대 1Mbps', dataNote: speed('1Mbps'), price: '17,900원' },
	{ name: 'L망 후불 베이직', voice: '기본제공 (+영상/부가 110분)', sms: '기본제공', data: '1.5GB + 최대 400Kbps', dataNote: speed('400Kbps'), price: '20,500원' },
	{ name: 'L망 후불 플랫폼 100분 15GB+', voice: '100분 (망내 1회선 무제한 지정 가능)', sms: '100건', data: '15GB + 최대 3Mbps', dataNote: speed('3Mbps'), note: '영상통화 시 데이터가 1.66배 소진', price: '28,500원' },
	{ name: 'L망 후불 플랫폼 300분 15GB+', voice: '300분 (망내 1회선 무제한 지정 가능)', sms: '300건', data: '15GB + 최대 3Mbps', dataNote: speed('3Mbps'), note: '영상통화 시 데이터가 1.66배 소진', price: '30,600원' },
	{ name: 'L망 후불 웹', voice: '기본제공 (+영상/부가 110분)', sms: '기본제공', data: '2.5GB + 최대 400Kbps', dataNote: speed('400Kbps'), price: '30,800원' },
	{ name: 'L망 플랫폼 11GB+일2GB', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '11GB + 일 2GB + 최대 3Mbps', dataNote: speed('3Mbps'), price: '36,700원' },
	{ name: 'L망 후불 톡', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '3.5GB + 최대 1Mbps', dataNote: speed('1Mbps'), price: '37,000원' },
	{ name: 'L망 플랫폼 매일5GB', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '5GB + 최대 5Mbps', dataNote: speed('5Mbps'), note: '테더링 월 11GB 별도 제공, 영상통화 시 데이터가 1.66배 소진', price: '43,200원' },
	{ name: 'L망 후불 5G라이트', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '12GB + 최대 1Mbps', dataNote: speed('1Mbps'), price: '46,400원' },
	{ name: 'L망 후불 494', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '11GB + 일 2GB + 최대 3Mbps', dataNote: speed('3Mbps'), price: '49,400원' },
	{ name: 'L망 후불 매일5GB', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '매일 5GB + 최대 5Mbps', dataNote: speed('5Mbps'), price: '60,500원' },
	{ name: 'L망 후불 5G스탠다드', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '150GB + 최대 5Mbps', dataNote: speed('5Mbps'), price: '66,000원' },
	{ name: 'L망 후불 5G스페셜', voice: '기본제공 (+영상/부가 300분)', sms: '기본제공', data: '180GB + 최대 10Mbps', dataNote: speed('10Mbps'), price: '70,000원' },
];
