export interface CheckpointQuestion {
  id: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: 'recyclable' | 'food_waste' | 'other_waste';
  icon: string;
  hint: string;
  explanation: string;
}

// ============================================================================
// CHẶNG 1: 5 CÂU HỎI KIỂM TRA Ô NHIỄM ĐẤT
// ============================================================================
export const STAGE_1_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 's1_q1',
    question: 'Thế nào là ô nhiễm môi trường đất?',
    options: [
      { key: 'A', text: 'Đất tơi xốp có nhiều giun đất và vi sinh vật sinh sống.' },
      { key: 'B', text: 'Đất bị nhiễm chất thải hoặc chất có hại làm suy thoái môi trường đất.' },
      { key: 'C', text: 'Đất được bón phân hữu cơ và tưới nước sạch định kỳ.' },
      { key: 'D', text: 'Đất phù sa bồi đắp màu mỡ ven các con sông lớn.' },
    ],
    correctOption: 'B',
    explanation: 'Theo SGK, ô nhiễm đất là hiện tượng đất bị nhiễm chất thải hoặc chất có hại, làm biến đổi và ảnh hưởng tiêu cực đến đất và sinh vật.',
  },
  {
    id: 's1_q2',
    question: 'Hoạt động nào sau đây của con người KHÔNG gây ô nhiễm đất?',
    options: [
      { key: 'A', text: 'Lạm dụng phân bón hóa học trong thời gian dài.' },
      { key: 'B', text: 'Chôn lấp túi nilon và chai nhựa bừa bãi vào đất.' },
      { key: 'C', text: 'Phun thuốc bảo vệ thực vật quá liều lượng quy định.' },
      { key: 'D', text: 'Ủ rác hữu cơ thành phân vi sinh bón cho cây trồng.' },
    ],
    correctOption: 'D',
    explanation: 'Ủ phân hữu cơ vi sinh là biện pháp sinh học an toàn, vừa cung cấp dinh dưỡng vừa cải tạo đất màu mỡ, không gây ô nhiễm.',
  },
  {
    id: 's1_q3',
    question: 'Hiện tượng tự nhiên nào sau đây có thể làm thay đổi chất lượng đất tự nhiên?',
    options: [
      { key: 'A', text: 'Núi lửa phun trào tro bụi và khoáng chất có hại.' },
      { key: 'B', text: 'Học sinh trồng cây gây rừng ở vườn trường.' },
      { key: 'C', text: 'Nhà máy lọc sạch nước thải trước khi xả ra sông.' },
      { key: 'D', text: 'Phân loại rác thải tại gia đình.' },
    ],
    correctOption: 'A',
    explanation: 'Núi lửa phun trào, nước biển dâng gây xâm nhập mặn và đất bị nhiễm phèn chua là các nguyên nhân tự nhiên làm biến đổi đất.',
  },
  {
    id: 's1_q4',
    question: 'Ô nhiễm đất gây ra tác hại nghiêm trọng nào đối với đời sống con người?',
    options: [
      { key: 'A', text: 'Giúp cây trồng lớn nhanh và năng suất cao hơn.' },
      { key: 'B', text: 'Không gây bất kỳ ảnh hưởng nào đến nguồn nước sinh hoạt.' },
      { key: 'C', text: 'Chất độc thấm vào mạch nước ngầm và tích tụ trong rau củ con người ăn.' },
      { key: 'D', text: 'Làm đất ngày càng tơi xốp và giàu chất dinh dưỡng.' },
    ],
    correctOption: 'C',
    explanation: 'Hóa chất độc hại từ đất thấm sâu vào tầng nước ngầm và được cây hấp thụ, khi con người dùng nước và ăn rau củ sẽ bị nhiễm độc tích lũy.',
  },
  {
    id: 's1_q5',
    question: 'Tại gia đình, em và người thân nên làm gì để hạn chế gây ô nhiễm đất?',
    options: [
      { key: 'A', text: 'Đổ nước xà phòng giặt tẩy đậm đặc trực tiếp ra gốc cây.' },
      { key: 'B', text: 'Thu gom pin cũ vào hộp riêng, không vứt lẫn vào đất vườn.' },
      { key: 'C', text: 'Chôn các loại túi nilon bẩn xuống đất để đất tự phân hủy.' },
      { key: 'D', text: 'Vứt vỏ chai thuốc xịt muỗi ra bãi đất trống sau nhà.' },
    ],
    correctOption: 'B',
    explanation: 'Một viên pin cũ vứt vào đất có thể làm ô nhiễm 500 lít nước và 1m³ đất trong 50 năm do chứa kim loại nặng như thủy ngân, chì, cadimi.',
  },
];

// ============================================================================
// CHẶNG 2: 5 CÂU HỎI KIỂM TRA XÓI MÒN ĐẤT
// ============================================================================
export const STAGE_2_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 's2_q1',
    question: 'Hiện tượng xói mòn đất là gì?',
    options: [
      { key: 'A', text: 'Hiện tượng đất được bồi tụ thêm phù sa màu mỡ sau lũ lụt.' },
      { key: 'B', text: 'Hiện tượng lớp đất mặt bị bào mòn, cuốn trôi do nước, gió và tác động khác.' },
      { key: 'C', text: 'Hiện tượng giun đất đào hầm làm tơi xốp đất.' },
      { key: 'D', text: 'Hiện tượng người dân cày sâu bừa kĩ ruộng đồng.' },
    ],
    correctOption: 'B',
    explanation: 'Xói mòn đất là hiện tượng lớp đất mặt giàu dinh dưỡng bị nước mưa, dòng chảy hoặc gió cuốn trôi, làm đất bị suy thoái bạc màu.',
  },
  {
    id: 's2_q2',
    question: 'Vì sao sườn đồi có cây và thảm cỏ lại ít bị xói mòn hơn sườn đồi trọc?',
    options: [
      { key: 'A', text: 'Vì cây xanh hút hết toàn bộ nước mưa trên trời rơi xuống.' },
      { key: 'B', text: 'Vì tán cây cản lực rơi của giọt mưa và rễ cây bện chặt giữ đất lại.' },
      { key: 'C', text: 'Vì đồi có cây thì trời sẽ không bao giờ có mưa lớn.' },
      { key: 'D', text: 'Vì lá cây rụng làm đất cứng như đá bê tông.' },
    ],
    correctOption: 'B',
    explanation: 'Tán lá giúp giảm động năng của giọt mưa rơi xuống, thảm cỏ cản tốc độ dòng chảy xiết, còn mạng lưới rễ cây chằng chịt bện chặt đất chống xói lở.',
  },
  {
    id: 's2_q3',
    question: 'Hoạt động nào của con người là nguyên nhân hàng đầu làm tăng nguy cơ xói mòn đất đồi núi?',
    options: [
      { key: 'A', text: 'Trồng rừng phòng hộ đầu nguồn và làm ruộng bậc thang.' },
      { key: 'B', text: 'Đắp bờ kè đá giữ đất trên sườn dốc.' },
      { key: 'C', text: 'Chặt phá rừng bừa bãi và đốt nương làm rẫy trơ sỏi đá.' },
      { key: 'D', text: 'Trồng xen canh các thảm cỏ che phủ đất vườn.' },
    ],
    correctOption: 'C',
    explanation: 'Chặt phá và đốt rừng làm mất hoàn toàn lớp thảm phủ thực vật, khiến đất dốc trần trụi trước những cơn mưa lớn và gây sạt lở dữ dội.',
  },
  {
    id: 's2_q4',
    question: 'Hậu quả lớn nhất khi lớp đất mặt trên sườn đồi bị xói mòn là gì?',
    options: [
      { key: 'A', text: 'Đất mất hết lớp mùn màu mỡ, trở nên khô cằn bạc màu, cây trồng không lớn được.' },
      { key: 'B', text: 'Đất sẽ trở nên giàu chất dinh dưỡng hơn trước.' },
      { key: 'C', text: 'Mạch nước ngầm dâng cao tràn trề.' },
      { key: 'D', text: 'Không gây ảnh hưởng gì đến sinh hoạt và sản xuất nông nghiệp.' },
    ],
    correctOption: 'A',
    explanation: 'Lớp đất mặt chỉ dày vài chục centimet nhưng chứa 90% chất dinh dưỡng và vi sinh vật. Khi bị trôi mất, đồi trọc chỉ còn sỏi đá cằn cỗi.',
  },
  {
    id: 's2_q5',
    question: 'Để bảo vệ sườn đồi sau những trận mưa lũ lớn, giải pháp căn cơ và bền vững nhất là:',
    options: [
      { key: 'A', text: 'Xới tung đất mặt lên cho nhanh ráo nước.' },
      { key: 'B', text: 'Chặt bỏ hết các cây cao vì sợ cây ngã đổ.' },
      { key: 'C', text: 'Trồng thêm cây gây rừng, phủ xanh thảm cỏ và xây bờ kè chắn dòng chảy.' },
      { key: 'D', text: 'Đổ xi măng phủ kín toàn bộ sườn đồi núi.' },
    ],
    correctOption: 'C',
    explanation: 'Phủ xanh đất trống đồi trọc bằng cây thân gỗ kết hợp cỏ giữ đất và bờ kè là biện pháp khoa học và bền vững nhất để bảo vệ môi trường đất dốc.',
  },
];

// ============================================================================
// CHẶNG 3: 5 CÂU HỎI KIỂM TRA BẢO VỆ MÔI TRƯỜNG ĐẤT
// ============================================================================
export const STAGE_3_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 's3_q1',
    question: 'Biện pháp nào sau đây giúp bảo vệ môi trường đất trong sản xuất nông nghiệp?',
    options: [
      { key: 'A', text: 'Phun thuốc diệt cỏ thật nhiều để đất không còn cỏ dại.' },
      { key: 'B', text: 'Tăng cường bón phân hóa học gấp đôi liều lượng hàng năm.' },
      { key: 'C', text: 'Ưu tiên sử dụng phân chuồng ủ hoai mục, phân vi sinh và thuốc BVTV sinh học.' },
      { key: 'D', text: 'Đốt sạch rơm rạ ngay trên mặt đất ruộng sau thu hoạch.' },
    ],
    correctOption: 'C',
    explanation: 'Phân vi sinh và phân hữu cơ cung cấp mùn tự nhiên, nuôi dưỡng giun đất và vi khuẩn có lợi, giúp đất tơi xốp phì nhiêu lâu dài.',
  },
  {
    id: 's3_q2',
    question: 'Vì sao việc phân loại rác thải tại nguồn lại giúp bảo vệ môi trường đất?',
    options: [
      { key: 'A', text: 'Vì giúp giảm khối lượng rác phải chôn lấp và ngăn chất độc ngấm vào đất.' },
      { key: 'B', text: 'Vì rác phân loại xong sẽ tự động biến mất không cần xử lý.' },
      { key: 'C', text: 'Vì phân loại rác làm đất trở nên rộng hơn.' },
      { key: 'D', text: 'Vì rác thải sinh hoạt không có hại gì cho đất.' },
    ],
    correctOption: 'A',
    explanation: 'Phân loại rác giúp tái chế vật liệu, biến rác thực phẩm thành phân bón, giảm đến 70% lượng rác chôn lấp làm thoái hóa đất.',
  },
  {
    id: 's3_q3',
    question: 'Tại trường học, hoạt động nào của học sinh thể hiện tinh thần Chiến Binh Bảo Vệ Đất?',
    options: [
      { key: 'A', text: 'Vứt vỏ hộp sữa và túi bánh kẹo vào bồn hoa sân trường.' },
      { key: 'B', text: 'Tích cực tham gia ngày hội trồng cây, chăm sóc hoa và nhặt rác vườn trường.' },
      { key: 'C', text: 'Đổ nước thừa sau khi lau bảng vào bãi cỏ trường học.' },
      { key: 'D', text: 'Bẻ cành cây non trong khuôn viên trường để chơi đùa.' },
    ],
    correctOption: 'B',
    explanation: 'Trồng và chăm sóc cây hoa, giữ sạch sân trường là hành động cụ thể, thiết thực nhất của học sinh tiểu học để bảo vệ đất mẹ.',
  },
  {
    id: 's3_q4',
    question: 'Quy trình xử lý nước thải của các nhà máy công nghiệp trước khi thải ra môi trường có ý nghĩa gì?',
    options: [
      { key: 'A', text: 'Loại bỏ chất độc hại và kim loại nặng để không làm nhiễm độc đất và nguồn nước.' },
      { key: 'B', text: 'Làm cho nước thải sôi lên để bốc hơi vào không khí.' },
      { key: 'C', text: 'Tăng thêm hóa chất vào nước để diệt hết cỏ dại xung quanh.' },
      { key: 'D', text: 'Chỉ nhằm mục đích trang trí cho nhà máy đẹp hơn.' },
    ],
    correctOption: 'A',
    explanation: 'Nước thải công nghiệp chứa nhiều axit, kiềm và kim loại nặng. Xử lý triệt để sẽ bảo vệ tầng đất xung quanh không bị chai hóa, chết vi sinh vật.',
  },
  {
    id: 's3_q5',
    question: 'Khi thấy bạn cùng lớp vứt túi nilon xuống bồn cây, em nên làm gì?',
    options: [
      { key: 'A', text: 'Bỏ qua vì đó không phải là việc của mình.' },
      { key: 'B', text: 'Lấy túi nilon chôn sâu xuống đất cho bạn không bị thầy cô nhìn thấy.' },
      { key: 'C', text: 'Nhắc nhở bạn nhẹ nhàng và cùng bạn nhặt túi nilon bỏ vào thùng rác tái chế.' },
      { key: 'D', text: 'Vứt thêm một túi rác khác vào bồn cây cùng bạn.' },
    ],
    correctOption: 'C',
    explanation: 'Lan tỏa ý thức bảo vệ môi trường bằng cách nhắc nhở văn minh và cùng nhau nhặt rác là phẩm chất tuyệt vời của Chiến Binh Đất Xanh.',
  },
];

// ============================================================================
// CHẶNG 4: 12 MÓN ĐỒ PHÂN LOẠI RÁC TRONG GIA ĐÌNH (CHUẨN 3 NHÓM BẮT BUỘC)
// ============================================================================
export const HOUSEHOLD_WASTE_ITEMS: WasteItem[] = [
  // Nhóm 1: CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ
  {
    id: 'w1',
    name: 'Chai nhựa nước khoáng sạch',
    category: 'recyclable',
    icon: '🍾',
    hint: 'Chất liệu nhựa PET sạch, có thể nấu chảy tạo hạt nhựa mới.',
    explanation: 'Chai nhựa sạch thuộc nhóm CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ. Hãy súc sạch và vặn chặt nắp trước khi bỏ thùng.',
  },
  {
    id: 'w2',
    name: 'Lon nước ngọt bằng nhôm',
    category: 'recyclable',
    icon: '🥫',
    hint: 'Kim loại nhôm có giá trị tái chế rất cao và tiết kiệm năng lượng.',
    explanation: 'Lon nhôm thuộc nhóm CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ. Có thể tái chế vô hạn lần mà không giảm chất lượng.',
  },
  {
    id: 'w3',
    name: 'Giấy báo cũ và bìa carton sạch',
    category: 'recyclable',
    icon: '📦',
    hint: 'Giấy khô sạch có thể nghiền thành bột giấy tái chế sách vở mới.',
    explanation: 'Bìa carton và giấy báo thuộc nhóm CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ, giúp giảm đốn hạ cây rừng làm giấy.',
  },
  {
    id: 'w4',
    name: 'Chai lọ thủy tinh nước giải khát',
    category: 'recyclable',
    icon: '🍶',
    hint: 'Thủy tinh có thể tái sinh thành chai lọ mới an toàn.',
    explanation: 'Chai thủy tinh thuộc nhóm CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ. Cần cẩn thận tránh làm vỡ vụn.',
  },

  // Nhóm 2: CHẤT THẢI THỰC PHẨM
  {
    id: 'w5',
    name: 'Vỏ dưa hấu và vỏ chuối',
    category: 'food_waste',
    icon: '🍉',
    hint: 'Chất hữu cơ từ trái cây, dễ phân hủy sinh học.',
    explanation: 'Vỏ trái cây thuộc nhóm CHẤT THẢI THỰC PHẨM. Rất thích hợp để ủ làm phân bón hữu cơ giàu mùn cho đất vườn.',
  },
  {
    id: 'w6',
    name: 'Cuống rau và lá rau úa hỏng',
    category: 'food_waste',
    icon: '🥬',
    hint: 'Rác phát sinh từ quá trình nhặt rau chuẩn bị bữa ăn.',
    explanation: 'Rau củ hỏng thuộc nhóm CHẤT THẢI THỰC PHẨM, chứa nhiều chất dinh dưỡng tự nhiên nuôi dưỡng vi sinh vật đất.',
  },
  {
    id: 'w7',
    name: 'Cơm nguội và thức ăn thừa',
    category: 'food_waste',
    icon: '🍚',
    hint: 'Thức ăn còn dư sau bữa cơm gia đình.',
    explanation: 'Thức ăn thừa thuộc nhóm CHẤT THẢI THỰC PHẨM. Nên phân loại riêng để tránh gây mùi hôi và làm bẩn rác tái chế.',
  },
  {
    id: 'w8',
    name: 'Bã trà và bã cà phê',
    category: 'food_waste',
    icon: '☕',
    hint: 'Phụ phẩm hữu cơ sau khi pha đồ uống của bố mẹ.',
    explanation: 'Bã trà/cà phê thuộc nhóm CHẤT THẢI THỰC PHẨM, là nguồn phân bón xốp đất và xua đuổi côn trùng hại rễ cây.',
  },

  // Nhóm 3: CHẤT THẢI RẮN SINH HOẠT KHÁC
  {
    id: 'w9',
    name: 'Khăn giấy ướt đã qua sử dụng',
    category: 'other_waste',
    icon: '🧻',
    hint: 'Khăn giấy bẩn có vi khuẩn và sợi tổng hợp khó tái chế.',
    explanation: 'Khăn giấy bẩn thuộc nhóm CHẤT THẢI RẮN SINH HOẠT KHÁC vì không thể tái chế do nhiễm bẩn vi sinh.',
  },
  {
    id: 'w10',
    name: 'Bao bì ni-lông dính dầu mỡ',
    category: 'other_waste',
    icon: '🛍️',
    hint: 'Màng bọc thực phẩm và túi dính thức ăn dầu mỡ khó rửa.',
    explanation: 'Túi nilon bẩn thuộc nhóm CHẤT THẢI RẮN SINH HOẠT KHÁC do dính dầu mỡ không đủ tiêu chuẩn đưa vào dây chuyền tái chế.',
  },
  {
    id: 'w11',
    name: 'Bàn chải đánh răng cũ hỏng',
    category: 'other_waste',
    icon: '🪥',
    hint: 'Đồ dùng vệ sinh cá nhân kết hợp nhiều loại nhựa và sợi cước.',
    explanation: 'Bàn chải đánh răng thuộc nhóm CHẤT THẢI RẮN SINH HOẠT KHÁC vì làm từ nhiều loại nhựa phức hợp khó phân tách tái chế.',
  },
  {
    id: 'w12',
    name: 'Tăm tre và que kem bẩn',
    category: 'other_waste',
    icon: '🥢',
    hint: 'Vật dụng sinh hoạt nhỏ dính nước bọt, không dùng lại.',
    explanation: 'Tăm tre đã dùng thuộc nhóm CHẤT THẢI RẮN SINH HOẠT KHÁC theo quy chuẩn phân loại rác thải gia đình.',
  },
];

// Định nghĩa 3 nhóm rác bắt buộc đúng tên
export const WASTE_CATEGORIES = [
  {
    id: 'recyclable',
    name: 'CHẤT THẢI RẮN CÓ KHẢ NĂNG TÁI SỬ DỤNG, TÁI CHẾ',
    shortTitle: 'Rác Tái Chế',
    color: '#FF944D',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    hoverBorder: 'hover:border-amber-500',
    tagBg: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '♻️',
    description: 'Bao gồm giấy báo, bìa carton sạch, chai lọ nhựa sạch, vỏ lon kim loại... có thể đưa vào nhà máy tái chế thành sản phẩm mới.',
  },
  {
    id: 'food_waste',
    name: 'CHẤT THẢI THỰC PHẨM',
    shortTitle: 'Rác Thực Phẩm',
    color: '#22B573',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    hoverBorder: 'hover:border-emerald-500',
    tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: '🍃',
    description: 'Bao gồm vỏ rau củ, vỏ trái cây, cơm thừa, bã trà... dễ phân hủy sinh học, rất tốt để ủ làm phân bón hữu cơ nuôi đất.',
  },
  {
    id: 'other_waste',
    name: 'CHẤT THẢI RẮN SINH HOẠT KHÁC',
    shortTitle: 'Rác Sinh Hoạt Khác',
    color: '#64748B',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-400',
    hoverBorder: 'hover:border-slate-500',
    tagBg: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: '🗑️',
    description: 'Bao gồm khăn giấy bẩn, bao bì dính dầu mỡ, tăm tre, đồ nhựa hỏng... được thu gom xử lý đốt hoặc chôn lấp hợp vệ sinh.',
  },
];

// Danh sách các tình huống tương tác cho Chặng 1, 2, 3
export const STAGE_1_DETECTIVE_SCENARIOS = [
  {
    id: 'det_1',
    title: 'Bãi rác thải sinh hoạt xả bừa bãi ra kênh rạch',
    image: '🗑️',
    type: 'human',
    typeLabel: 'Nguyên nhân do con người',
    explanation: 'Con người xả rác không qua xử lý làm chất bẩn ngấm độc trực tiếp vào lòng đất.',
  },
  {
    id: 'det_2',
    title: 'Núi lửa phun trào tro bụi và khoáng chất có hại',
    image: '🌋',
    type: 'nature',
    typeLabel: 'Nguyên nhân tự nhiên',
    explanation: 'Núi lửa là hiện tượng địa chất tự nhiên làm biến đổi thành phần khoáng và tính chất đất.',
  },
  {
    id: 'det_3',
    title: 'Dòng nước thải đen kịt chưa xử lý từ nhà máy',
    image: '🏭',
    type: 'human',
    typeLabel: 'Nguyên nhân do con người',
    explanation: 'Chất thải công nghiệp chứa nhiều axit và kim loại nặng đầu độc đất đai.',
  },
  {
    id: 'det_4',
    title: 'Nước biển dâng cao tràn vào làm đất bị nhiễm mặn',
    image: '🌊',
    type: 'nature',
    typeLabel: 'Nguyên nhân tự nhiên',
    explanation: 'Triều cường và nước biển xâm nhập mặn làm đất bị chai cứng, cây không hút được nước.',
  },
  {
    id: 'det_5',
    title: 'Học sinh trồng cây xanh và gom rác vườn trường',
    image: '🌱',
    type: 'solution',
    typeLabel: 'Biện pháp bảo vệ đất',
    explanation: 'Trồng cây và gom rác giúp phục hồi độ phì nhiêu và làm sạch đất mẹ.',
  },
];

export const STAGE_3_GREEN_ACTIONS = [
  {
    id: 'act_1',
    situation: 'Bạn nhìn thấy nhiều vỏ hộp sữa bị vứt cạnh bồn cây ở sân trường.',
    options: [
      { text: 'Lờ đi vì có cô lao công dọn dẹp.', isBest: false },
      { text: 'Nhặt vỏ hộp sữa bỏ vào thùng rác tái chế và nhắc bạn cùng lớp giữ vệ sinh.', isBest: true },
      { text: 'Chôn vỏ hộp sữa xuống bồn cây cho nhanh.', isBest: false },
    ],
    explanation: 'Hành động nhặt rác và nhắc nhở bạn bè thể hiện tinh thần trách nhiệm của Chiến Binh Đất Xanh.',
  },
  {
    id: 'act_2',
    situation: 'Gia đình em có nhiều chai nhựa và giấy báo cũ sau một tháng.',
    options: [
      { text: 'Đem đốt sạch ở góc sân vườn.', isBest: false },
      { text: 'Thu gom riêng, làm phẳng bìa carton và gửi cho điểm thu gom phế liệu tái chế.', isBest: true },
      { text: 'Vứt lẫn vào túi rác ẩm ướt hàng ngày.', isBest: false },
    ],
    explanation: 'Phân loại riêng rác tái chế giúp tiết kiệm tài nguyên và bảo vệ môi trường đất.',
  },
  {
    id: 'act_3',
    situation: 'Một khoảnh đất trống trong trường em nhiều sỏi đá, cỏ cháy khô cằn.',
    options: [
      { text: 'Tham gia ngày hội xanh: nhặt sỏi đá, xới đất tơi xốp và trồng hoa làm đẹp.', isBest: true },
      { text: 'Đổ rác thải của lớp vào đó để tạo thành bãi rác.', isBest: false },
      { text: 'Đổ nước xà phòng vào để diệt cỏ dại.', isBest: false },
    ],
    explanation: 'Cải tạo đất trống thành vườn hoa trường học giúp phủ xanh đất và chống xói mòn.',
  },
  {
    id: 'act_4',
    situation: 'Một người hàng xóm định đổ nước giặt tẩy hóa chất ra đất vườn.',
    options: [
      { text: 'Cổ vũ vì nghĩ nước xà phòng sẽ làm sạch đất.', isBest: false },
      { text: 'Khuyên bác nên đổ vào cống thoát nước có xử lý, vì hóa chất sẽ giết chết giun đất.', isBest: true },
      { text: 'Không quan tâm vì đó là vườn nhà người khác.', isBest: false },
    ],
    explanation: 'Hóa chất giặt tẩy làm chua đất và giết chết các sinh vật có lợi giúp đất tơi xốp.',
  },
];
