// 외국인용 안내 페이지 문구입니다. 내용은 영어 페이지(/en/)와 같은 사실만 담습니다. (언어를 추가하려면 아래 형식으로 한 덩어리를 더하세요)
export interface ForeignLang {
	code: string; // 주소 경로 (예: zh → /zh/)
	htmlLang: string;
	locale: string;
	label: string; // 언어 선택 링크에 보이는 이름
	brand: string;
	title: string;
	description: string;
	tag: string;
	h1: string;
	lead: string;
	ctaKakao: string;
	ctaCall: string;
	factsTitle: string;
	facts: { t: string; d: string }[];
	howTitle: string;
	steps: { b: string; d: string }[];
	tmplTitle: string;
	tmplNote: string;
	copy: string;
	copied: string;
	copyManual: string;
	openKakao: string;
	plansTitle: string;
	thNet: string;
	thPlan: string;
	thPrice: string;
	krw: string;
	nets: { KT: string; LG: string };
	planDesc: Record<string, string>;
	plansNote: string;
	whereTitle: string;
	whereGasan: string;
	whereOther: string;
	regionNote: string;
	regionNames: Record<string, string>;
	faqTitle: string;
	faqs: { q: string; a: string }[];
	footBiz: string;
	footReg: string;
	footHours: string;
	koSite: string;
}

export const zh: ForeignLang = {
	code: 'zh',
	htmlLang: 'zh-CN',
	locale: 'zh_CN',
	label: '中文',
	brand: 'Connect Mobile',
	title: '在韩国办理预付费手机卡（外国人）| Connect Mobile',
	description: '在韩国的外国居民可到店办理预付费手机号，无合约、无解约金，提供KT和LG网络套餐，需提前预约。Connect Mobile (커넥트모바일)。',
	tag: '面向在韩外国居民',
	h1: '在韩国办理预付费手机卡，无合约',
	lead: '可选择KT或LG网络，到店办理预付费手机号。无合约、无解约金。请先预约，再前往办理。',
	ctaKakao: '用KakaoTalk预约',
	ctaCall: '拨打电话',
	factsTitle: '办理前须知',
	facts: [
		{ t: '仅限到店办理', d: '外国人需到柜台办理，不能在线自助开通。需要现场核对证件。' },
		{ t: '需要预约', d: '请先通过KakaoTalk或电话预约。直接到店可能无法办理。' },
		{ t: '限办一条号码', d: '外国居民可开通一条号码。' },
		{ t: '无合约', d: '没有合约约束，也没有解约金。' },
	],
	howTitle: '办理流程',
	steps: [
		{ b: '给我们发消息', d: '通过KakaoTalk或电话联系，告诉我们地区、日期、时间和想办的套餐。下方有韩语消息模板。' },
		{ b: '我们确认预约', d: '我们会告知办理地点和需要携带的证件。' },
		{ b: '到店办理', d: '请带上证件、SIM卡费用（10,000韩元）、首次充值的钱和您要使用的手机。SIM卡在办理地点准备。' },
		{ b: '开通当天充值', d: '预付费号码需要在开通当天充值，才能保持号码正常使用。' },
	],
	tmplTitle: '消息模板（韩语）',
	tmplNote: '我们的服务使用韩语。请复制下面的消息，填写空白处后通过KakaoTalk发送。',
	copy: '复制消息',
	copied: '已复制！',
	copyManual: '请按Ctrl+C复制',
	openKakao: '打开KakaoTalk',
	plansTitle: '预付费套餐',
	thNet: '网络',
	thPlan: '套餐',
	thPrice: '月费',
	krw: '韩元',
	nets: { KT: 'KT网络', LG: 'LG网络' },
	planDesc: {
		'선불 LTE 기본1': '基础款：通话50分钟、短信30条、流量300MB',
		'선불 300MB 라이트': '含通话和短信，流量300MB（用完后最高1Mbps）',
		'LTE 선불 396 10.3GB': '含通话和短信，流量10.3GB（用完后最高3Mbps）',
		'LTE 선불 459 20.3GB': '含通话和短信，流量20.3GB（用完后最高3Mbps）',
		'L망 선불 기본1': '基础款：通话50分钟、短信30条、流量300MB',
		'L망 선불 데이터 2.5GB': '通话100分钟、短信50条、流量2.5GB',
		'L망 선불 396 10.3GB': '含通话和短信，流量10.3GB',
		'L망 5G 선불 20GB+': '含通话和短信，流量20GB + 3Mbps（5G）',
	},
	plansNote: '“含”的通话和短信需遵循各套餐的使用条件。价格和流量可能变动，预约时我们会确认最新内容。您也可以在套餐页面（韩语）查看全部套餐。',
	whereTitle: '在哪里办理？',
	whereGasan: '首尔加山：衿川区加山洞 加山Ask Tower。到访前需要预约。',
	whereOther: '以下地区也有到店办理的地点（世宗除外）。每个地点都需要预约，预约时我们会告知具体地址。',
	regionNote: '地区页面为韩语。',
	regionNames: { seoul: '首尔', busan: '釜山', daegu: '大邱', incheon: '仁川', gwangju: '光州', daejeon: '大田', ulsan: '蔚山', sejong: '世宗', gyeonggi: '京畿', gangwon: '江原', chungbuk: '忠北', chungnam: '忠南', jeonbuk: '全北', jeonnam: '全南', gyeongbuk: '庆北', gyeongnam: '庆南', jeju: '济州' },
	faqTitle: '常见问题',
	faqs: [
		{ q: '外国人可以办理预付费手机卡吗？', a: '可以。外国居民可以开通预付费号码，但只能到店办理。因为需要在柜台核对证件，外国人不能在线自助开通。' },
		{ q: '需要预约吗？', a: '需要。所有到店办理的地点都需要提前预约，直接到店可能无法办理。请通过KakaoTalk或电话告诉我们姓名、电话号码、希望的地区、日期和时间以及想办的套餐。' },
		{ q: '需要带什么？', a: '请带上证件、SIM卡费用（10,000韩元）、首次充值的钱和您要使用的手机。SIM卡在办理地点准备。具体所需证件因情况而异，预约时我们会告知。' },
		{ q: '可以开几条号码？', a: '外国居民可以开通一条号码。' },
		{ q: '有合约或解约金吗？', a: '没有。没有合约约束，也没有解约金。' },
		{ q: '开通当天必须充值吗？', a: '是的。预付费套餐需要在开通当天充值。如果不充值，号码可能在第二天被停用或注销。号码注销后，剩余余额会失效且不予退还。' },
		{ q: '使用什么语言服务？', a: '我们的服务使用韩语。请使用本页的韩语消息模板，或请会韩语的朋友帮您预约。' },
	],
	footBiz: '预付费手机卡 · N-Telecom (앤텔레콤) 事先批准的销售店',
	footReg: '营业执照号 499-37-01511 · 代表：',
	footHours: '营业时间 09:00-22:00（重大节假日部分业务受限）',
	koSite: '한국어 사이트',
};

export const vi: ForeignLang = {
	code: 'vi',
	htmlLang: 'vi',
	locale: 'vi_VN',
	label: 'Tiếng Việt',
	brand: 'Connect Mobile',
	title: 'SIM điện thoại trả trước cho người nước ngoài tại Hàn Quốc | Connect Mobile',
	description: 'Người nước ngoài sống tại Hàn Quốc có thể đến trực tiếp để mở số điện thoại trả trước, không hợp đồng, không phí hủy. Gói mạng KT và LG, cần đặt lịch trước. Connect Mobile (커넥트모바일).',
	tag: 'Dành cho người nước ngoài sống tại Hàn Quốc',
	h1: 'SIM trả trước tại Hàn Quốc, không hợp đồng',
	lead: 'Mở số trả trước trực tiếp trên mạng KT hoặc LG. Không hợp đồng, không phí hủy. Hãy đặt lịch trước rồi mới đến.',
	ctaKakao: 'Đặt lịch qua KakaoTalk',
	ctaCall: 'Gọi điện',
	factsTitle: 'Điều cần biết',
	facts: [
		{ t: 'Chỉ làm trực tiếp', d: 'Người nước ngoài làm thủ tục tại quầy, không mở trực tuyến. Giấy tờ được kiểm tra tại chỗ.' },
		{ t: 'Cần đặt lịch', d: 'Hãy đặt lịch trước qua KakaoTalk hoặc điện thoại. Đến không báo trước có thể không làm được.' },
		{ t: 'Một số điện thoại', d: 'Người nước ngoài cư trú được mở một số.' },
		{ t: 'Không hợp đồng', d: 'Không ràng buộc hợp đồng và không có phí hủy.' },
	],
	howTitle: 'Quy trình',
	steps: [
		{ b: 'Nhắn tin cho chúng tôi', d: 'Liên hệ qua KakaoTalk hoặc gọi điện. Cho biết khu vực, ngày giờ và gói cước. Bên dưới có mẫu tin nhắn tiếng Hàn.' },
		{ b: 'Chúng tôi xác nhận lịch hẹn', d: 'Chúng tôi sẽ báo địa điểm và giấy tờ cần mang theo.' },
		{ b: 'Đến và mở số', d: 'Mang theo giấy tờ tùy thân, phí SIM (10.000 won), tiền nạp lần đầu và điện thoại bạn sẽ dùng. SIM được chuẩn bị tại địa điểm.' },
		{ b: 'Nạp tiền ngay trong ngày', d: 'Số trả trước cần nạp tiền vào đúng ngày mở số để giữ số hoạt động.' },
	],
	tmplTitle: 'Mẫu tin nhắn (tiếng Hàn)',
	tmplNote: 'Dịch vụ của chúng tôi bằng tiếng Hàn. Hãy sao chép tin nhắn này, điền vào chỗ trống rồi gửi qua KakaoTalk.',
	copy: 'Sao chép tin nhắn',
	copied: 'Đã sao chép!',
	copyManual: 'Nhấn Ctrl+C để sao chép',
	openKakao: 'Mở KakaoTalk',
	plansTitle: 'Gói cước trả trước',
	thNet: 'Mạng',
	thPlan: 'Gói cước',
	thPrice: 'Giá / tháng',
	krw: 'won',
	nets: { KT: 'Mạng KT', LG: 'Mạng LG' },
	planDesc: {
		'선불 LTE 기본1': 'Cơ bản: gọi 50 phút, 30 tin nhắn, dữ liệu 300MB',
		'선불 300MB 라이트': 'Gồm gọi và nhắn tin, dữ liệu 300MB (hết thì tối đa 1Mbps)',
		'LTE 선불 396 10.3GB': 'Gồm gọi và nhắn tin, dữ liệu 10,3GB (hết thì tối đa 3Mbps)',
		'LTE 선불 459 20.3GB': 'Gồm gọi và nhắn tin, dữ liệu 20,3GB (hết thì tối đa 3Mbps)',
		'L망 선불 기본1': 'Cơ bản: gọi 50 phút, 30 tin nhắn, dữ liệu 300MB',
		'L망 선불 데이터 2.5GB': 'Gọi 100 phút, 50 tin nhắn, dữ liệu 2,5GB',
		'L망 선불 396 10.3GB': 'Gồm gọi và nhắn tin, dữ liệu 10,3GB',
		'L망 5G 선불 20GB+': 'Gồm gọi và nhắn tin, dữ liệu 20GB + 3Mbps (5G)',
	},
	plansNote: 'Cuộc gọi và tin nhắn "gồm trong gói" theo điều kiện sử dụng của từng gói. Giá và dung lượng có thể thay đổi, nên khi đặt lịch chúng tôi sẽ xác nhận thông tin mới nhất. Bạn cũng có thể xem tất cả gói (tiếng Hàn) ở trang gói cước.',
	whereTitle: 'Làm ở đâu?',
	whereGasan: 'Seoul, Gasan: Gasan Ask Tower, Gasan-dong, Geumcheon-gu. Cần đặt lịch trước khi đến.',
	whereOther: 'Chúng tôi còn có địa điểm làm trực tiếp ở các khu vực dưới đây (trừ Sejong). Mọi địa điểm đều cần đặt lịch, và chúng tôi sẽ báo địa chỉ chính xác khi bạn đặt.',
	regionNote: 'Các trang khu vực bằng tiếng Hàn.',
	regionNames: { seoul: 'Seoul', busan: 'Busan', daegu: 'Daegu', incheon: 'Incheon', gwangju: 'Gwangju', daejeon: 'Daejeon', ulsan: 'Ulsan', sejong: 'Sejong', gyeonggi: 'Gyeonggi', gangwon: 'Gangwon', chungbuk: 'Bắc Chungcheong', chungnam: 'Nam Chungcheong', jeonbuk: 'Bắc Jeolla', jeonnam: 'Nam Jeolla', gyeongbuk: 'Bắc Gyeongsang', gyeongnam: 'Nam Gyeongsang', jeju: 'Jeju' },
	faqTitle: 'Câu hỏi thường gặp',
	faqs: [
		{ q: 'Người nước ngoài có mở được SIM trả trước không?', a: 'Có. Người nước ngoài cư trú có thể mở số trả trước nhưng chỉ làm trực tiếp. Không thể tự mở trực tuyến vì giấy tờ phải được kiểm tra tại quầy.' },
		{ q: 'Có cần đặt lịch không?', a: 'Có. Mọi địa điểm làm trực tiếp đều cần đặt lịch trước. Đến không báo trước có thể không làm được. Hãy gửi cho chúng tôi qua KakaoTalk hoặc điện thoại: họ tên, số điện thoại, khu vực muốn đến, ngày giờ và gói cước muốn dùng.' },
		{ q: 'Cần mang theo gì?', a: 'Mang theo giấy tờ tùy thân, phí SIM (10.000 won), tiền nạp lần đầu và điện thoại bạn sẽ dùng. SIM được chuẩn bị tại địa điểm. Giấy tờ cụ thể tùy từng trường hợp, chúng tôi sẽ báo khi bạn đặt lịch.' },
		{ q: 'Được mở bao nhiêu số?', a: 'Người nước ngoài cư trú được mở một số.' },
		{ q: 'Có hợp đồng hay phí hủy không?', a: 'Không. Không ràng buộc hợp đồng và không có phí hủy.' },
		{ q: 'Có phải nạp tiền ngay ngày mở số không?', a: 'Có. Gói trả trước cần nạp tiền vào ngày mở số. Nếu không nạp, số có thể bị tạm ngưng hoặc hủy vào ngày hôm sau. Khi số bị hủy, số dư còn lại sẽ hết hạn và không được hoàn lại.' },
		{ q: 'Dịch vụ dùng ngôn ngữ nào?', a: 'Dịch vụ của chúng tôi bằng tiếng Hàn. Hãy dùng mẫu tin nhắn tiếng Hàn trong trang này, hoặc nhờ bạn bè biết tiếng Hàn giúp bạn đặt lịch.' },
	],
	footBiz: 'SIM trả trước · Đại lý bán hàng được N-Telecom (앤텔레콤) chấp thuận trước',
	footReg: 'Mã số kinh doanh 499-37-01511 · Người đại diện: ',
	footHours: 'Giờ làm việc 09:00-22:00 (một số thủ tục bị hạn chế vào các ngày lễ lớn)',
	koSite: '한국어 사이트',
};

export const FOREIGN_LANGS = [zh, vi];
