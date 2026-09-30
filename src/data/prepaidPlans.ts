// 선불 요금제 정보입니다. 요금이 바뀌면 여기만 고치면 요금제 페이지에 반영됩니다.

export interface PrepaidPlan {
	name: string;
	voice: string;
	sms: string;
	data: string;
	dataNote?: string;
	note?: string;
	price: string;
	daily?: string;
	badge?: string;
}

export const ktPrepaid: PrepaidPlan[] = [
	{ name: '선불 LTE 기본1', voice: '50분', sms: '30건', data: '300MB', price: '12,100원', daily: '일 403원' },
	{
		name: '선불 300MB 라이트',
		voice: '유무선 기본제공 (+영상/부가 30분)',
		sms: '기본제공',
		data: '300MB + 최대 1Mbps',
		dataNote: '데이터 소진 시 최대 1Mbps 속도제어',
		price: '33,000원',
		daily: '일 1,100원',
	},
	{
		name: 'LTE 선불 396 10.3GB',
		voice: '유무선 기본제공 (+영상/부가 30분)',
		sms: '기본제공',
		data: '10.3GB + 최대 3Mbps',
		dataNote: '데이터 소진 시 최대 3Mbps 속도제어',
		note: '요금제 변경 시 300MB 데이터만 적용',
		price: '39,600원',
		daily: '일 1,320원',
		badge: 'BEST',
	},
	{
		name: 'LTE 선불 459 20.3GB',
		voice: '유무선 기본제공 (+영상/부가 30분)',
		sms: '기본제공',
		data: '20.3GB + 최대 3Mbps',
		dataNote: '데이터 소진 시 최대 3Mbps 속도제어',
		note: '요금제 변경 시 재변경 불가',
		price: '45,900원',
		daily: '일 1,530원',
		badge: 'BEST',
	},
	{
		name: 'LTE 선불선택 770',
		voice: '유무선 기본제공 (+영상/부가 200분)',
		sms: '기본제공',
		data: '11GB + 일 2GB + 최대 3Mbps',
		dataNote: '데이터 소진 시 최대 3Mbps 속도제어',
		price: '77,000원',
		daily: '일 2,566원',
	},
	{
		name: 'LTE 비디오',
		voice: '유무선 기본제공 (+영상/부가 300분)',
		sms: '기본제공',
		data: '100GB + 최대 5Mbps',
		dataNote: '데이터 소진 시 최대 5Mbps 속도제어',
		price: '85,900원',
		daily: '일 2,863원',
	},
];

export const lgPrepaid: PrepaidPlan[] = [
	{ name: 'L망 선불 기본1', voice: '50분', sms: '30건', data: '300MB', price: '12,100원' },
	{ name: 'L망 선불 데이터 2.5GB', voice: '100분', sms: '50건', data: '2.5GB', price: '17,000원' },
	{
		name: 'L망 선불 300분',
		voice: '300분',
		sms: '300건',
		data: '300MB',
		dataNote: '최대 400Kbps 속도제어',
		price: '20,800원',
	},
	{
		name: 'L망 선불 300M 라이트',
		voice: '기본제공 (+영상/부가 50분)',
		sms: '기본제공',
		data: '300MB',
		dataNote: '최대 1Mbps 속도제어',
		price: '33,000원',
	},
	{
		name: 'L망 선불 396 10.3GB',
		voice: '기본제공 (+영상/부가 50분)',
		sms: '기본제공',
		data: '10.3GB',
		dataNote: '최대 3Mbps 속도제어',
		note: '요금제 변경 시 300MB 데이터만 적용',
		price: '39,600원',
		badge: 'BEST',
	},
	{
		name: 'L망 5G 선불 20GB+',
		voice: '기본제공 (+영상/부가 50분)',
		sms: '기본제공',
		data: '20GB + 3Mbps',
		dataNote: '데이터 소진 시 최대 3Mbps 속도제어',
		price: '46,400원',
		badge: '5G',
	},
];
