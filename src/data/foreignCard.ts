// 외국어 페이지의 방문 개통 예약 카드 문구입니다. 손님은 자기 언어로 고르고, 메시지는 항상 한국어로 만들어집니다.
export interface ForeignCardText {
	title: string;
	note: string;
	region: string;
	undecided: string;
	date: string;
	time: string;
	timeAny: string;
	timeAm: string;
	timePm: string;
	kind: string;
	kindNew: string;
	kindKeep: string;
	net: string;
	plan: string;
	phone: string;
	phoneYes: string;
	phoneNo: string;
	id: string;
	yes: string;
	no: string;
	notSure: string;
	idNote: string;
	fee: string;
	preview: string;
}

export const FOREIGN_CARD: Record<'en' | 'zh' | 'vi' | 'ja', ForeignCardText> = {
	en: {
		title: 'Reservation card',
		note: 'Choose below and we make a Korean message for you. Copy it and send it on KakaoTalk, with your name and phone number.',
		region: 'Area you want to visit',
		undecided: 'Not decided',
		date: 'Preferred date',
		time: 'Preferred time',
		timeAny: 'Any time',
		timeAm: 'Morning',
		timePm: 'Afternoon',
		kind: 'Phone number',
		kindNew: 'New number',
		kindKeep: 'Keep my current number',
		net: 'Network',
		plan: 'Plan',
		phone: 'Phone you will use',
		phoneYes: 'I can bring it',
		phoneNo: 'I do not have one yet',
		id: 'Do you have a passport or Alien Registration Card?',
		yes: 'Yes',
		no: 'No',
		notSure: 'Not sure',
		idNote: 'We tell you which documents you need when you reserve. Please do not send document numbers or photos in advance.',
		fee: 'I understand I need the SIM fee (10,000 KRW) and a top-up on the activation day.',
		preview: 'Message to send (Korean)',
	},
	zh: {
		title: '预约卡',
		note: '在下方选择后，我们会为您生成韩语消息。请复制后连同姓名和电话号码一起通过KakaoTalk发送。',
		region: '希望前往的地区',
		undecided: '尚未决定',
		date: '希望日期',
		time: '希望时间',
		timeAny: '任何时间',
		timeAm: '上午',
		timePm: '下午',
		kind: '电话号码',
		kindNew: '新号码',
		kindKeep: '保留现有号码',
		net: '网络',
		plan: '套餐',
		phone: '要使用的手机',
		phoneYes: '可以带来',
		phoneNo: '还没有手机',
		id: '您有护照或外国人登录证吗？',
		yes: '有',
		no: '没有',
		notSure: '不确定',
		idNote: '预约时我们会告知所需证件。请勿提前发送证件号码或照片。',
		fee: '我已了解需要准备SIM卡费10,000韩元和开通当天的充值费用。',
		preview: '要发送的消息（韩语）',
	},
	vi: {
		title: 'Thẻ đặt lịch',
		note: 'Hãy chọn bên dưới, chúng tôi sẽ tạo sẵn tin nhắn tiếng Hàn. Sao chép rồi gửi qua KakaoTalk cùng với họ tên và số điện thoại của bạn.',
		region: 'Khu vực muốn đến',
		undecided: 'Chưa quyết định',
		date: 'Ngày mong muốn',
		time: 'Giờ mong muốn',
		timeAny: 'Giờ nào cũng được',
		timeAm: 'Buổi sáng',
		timePm: 'Buổi chiều',
		kind: 'Số điện thoại',
		kindNew: 'Số mới',
		kindKeep: 'Giữ số hiện tại',
		net: 'Nhà mạng',
		plan: 'Gói cước',
		phone: 'Điện thoại sẽ dùng',
		phoneYes: 'Tôi có thể mang theo',
		phoneNo: 'Tôi chưa có điện thoại',
		id: 'Bạn có hộ chiếu hoặc thẻ đăng ký người nước ngoài không?',
		yes: 'Có',
		no: 'Không',
		notSure: 'Không chắc',
		idNote: 'Chúng tôi sẽ cho biết giấy tờ cần thiết khi đặt lịch. Vui lòng không gửi trước số giấy tờ hoặc ảnh.',
		fee: 'Tôi đã biết cần phí SIM 10.000 won và tiền nạp trong ngày kích hoạt.',
		preview: 'Tin nhắn sẽ gửi (tiếng Hàn)',
	},
	ja: {
		title: '予約カード',
		note: '下で選ぶと韓国語のメッセージが作成されます。コピーして、お名前と電話番号と一緒にKakaoTalkで送ってください。',
		region: '希望の地域',
		undecided: '未定',
		date: '希望日',
		time: '希望の時間帯',
		timeAny: 'いつでも',
		timeAm: '午前',
		timePm: '午後',
		kind: '電話番号',
		kindNew: '新しい番号',
		kindKeep: '今の番号を使う',
		net: '通信網',
		plan: '料金プラン',
		phone: '使用する携帯電話',
		phoneYes: '持参できます',
		phoneNo: 'まだ持っていません',
		id: 'パスポートまたは外国人登録証をお持ちですか？',
		yes: 'はい',
		no: 'いいえ',
		notSure: 'わかりません',
		idNote: '必要な書類はご予約時にご案内します。書類の番号や写真を事前に送らないでください。',
		fee: 'SIM料金1万ウォンと開通当日のチャージが必要なことを確認しました。',
		preview: '送信するメッセージ（韓国語）',
	},
};
