export interface LessonTopic {
  id: 'soil-pollution' | 'soil-erosion' | 'soil-protection';
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  badge: string;
  image: {
    src: string;
    alt: string;
    caption: string;
    observationTip: string;
  };
  sections: {
    heading: string;
    subheading?: string;
    items: string[];
    note?: string;
    type?: 'causes' | 'effects' | 'solutions' | 'concept';
  }[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  realSituation: {
    title: string;
    scenario: string;
    question: string;
    solution: string;
  };
}

export const LESSON_TOPICS: LessonTopic[] = [
  {
    id: 'soil-pollution',
    title: 'Chủ đề 1: Ô nhiễm đất',
    subtitle: 'Tìm hiểu nguyên nhân, tác hại và giải pháp bảo vệ nguồn đất màu mỡ',
    iconName: 'Biohazard',
    color: '#FF944D',
    badge: 'Bài học 1',
    image: {
      src: '/images/lesson-1-soil-pollution.png',
      alt: 'Pin phế thải và rác nguy hại bị chôn lấp ngấm độc vào môi trường đất',
      caption: 'Ảnh quan sát thực tế: Pin cũ và rác thải điện tử bị vùi lấp độc hại trong lòng đất',
      observationTip: 'Học sinh quan sát kỹ: Khi vỏ pin bị gỉ sét, các kim loại nặng cực độc (như chì, thủy ngân, cadimi) sẽ tan ra và ngấm sâu vào tầng đất mùn, hủy hoại vi sinh vật, giun đất và làm nhiễm độc nguồn nước ngầm sinh hoạt!'
    },
    sections: [
      {
        heading: '1. Khái niệm ô nhiễm đất là gì?',
        items: [
          'Ô nhiễm đất là tình trạng đất bị nhiễm các chất thải hoặc chất có hại, làm biến đổi và ảnh hưởng tiêu cực đến môi trường đất cũng như đời sống của các sinh vật sống trên và trong đất.',
        ],
        type: 'concept',
      },
      {
        heading: '2. Nguyên nhân do con người gây ra',
        subheading: 'Hành động thiếu ý thức trong sản xuất và sinh hoạt:',
        items: [
          'Xả chất thải sinh hoạt, công nghiệp chưa qua xử lí trực tiếp ra môi trường đất.',
          'Lạm dụng hoặc sử dụng phân bón hóa học trong thời gian dài làm chai cứng, chua đất.',
          'Sử dụng thuốc bảo vệ thực vật, thuốc trừ sâu không đúng nồng độ và quy định.',
          'Chôn lấp rác thải, túi nilon, rác khó phân hủy không đúng quy trình kỹ thuật.',
          'Để nước thải sản xuất từ nhà máy hoặc nước bẩn sinh hoạt ngấm trực tiếp vào lòng đất.',
        ],
        type: 'causes',
      },
      {
        heading: '3. Nguyên nhân tự nhiên',
        subheading: 'Các hiện tượng thiên nhiên làm suy giảm chất lượng đất:',
        items: [
          'Hoạt động phun trào của núi lửa mang theo tro bụi, dung nham và khoáng chất có hại.',
          'Hiện tượng xâm nhập mặn từ nước biển dâng vào sâu trong nội đồng làm đất bị mặn.',
          'Hiện tượng đất bị nhiễm phèn, khô hạn kéo dài hoặc rửa trôi khoáng tự nhiên.',
        ],
        type: 'causes',
      },
      {
        heading: '4. Tác hại nghiêm trọng của ô nhiễm đất',
        items: [
          'Kìm hãm sự phát triển của cây trồng, làm vàng lá, thối rễ, giảm năng suất mùa màng.',
          'Tiêu diệt vi sinh vật có lợi và các loài động vật trong đất (như giun đất, bọ đất).',
          'Chất độc thấm sâu qua các tầng địa chất, gây ô nhiễm nguồn nước ngầm quý giá.',
          'Gây nguy hiểm trực tiếp cho sức khỏe con người khi ăn nông sản hoặc uống nước nhiễm độc.',
          'Làm suy thoái toàn bộ hệ sinh thái và làm giảm sút chất lượng môi trường sống.',
        ],
        type: 'effects',
      },
      {
        heading: '5. Biện pháp phòng chống ô nhiễm đất',
        items: [
          'Thu gom, phân loại và xử lí triệt để chất thải trước khi xả ra ngoài thiên nhiên.',
          'Tích cực phân loại rác thải tại nguồn (rác hữu cơ, rác tái chế, rác nguy hại).',
          'Ưu tiên sử dụng phân bón hữu cơ, phân vi sinh thay thế dần phân hóa học.',
          'Sử dụng thuốc bảo vệ thực vật theo đúng nguyên tắc "4 đúng": Đúng thuốc, Đúng liều, Đúng lúc, Đúng cách.',
          'Xây dựng các trạm xử lí nước thải hiện đại tại mọi khu công nghiệp.',
          'Xây đê kè cống ngăn mặn tại các vùng ven biển có nguy cơ xâm nhập mặn.',
          'Tuyên truyền, cổ động bạn bè và gia đình cùng chung tay giữ sạch nguồn đất.',
        ],
        type: 'solutions',
      },
    ],
    quickCheck: {
      question: 'Chất ô nhiễm ngấm vào đất có nguy cơ thấm sâu và gây hại trực tiếp cho nguồn tài nguyên quý giá nào?',
      options: ['Nước ngầm', 'Ánh sáng mặt trời', 'Không khí trên tầng mây cao', 'Kim loại dưới đáy biển sâu'],
      correctIndex: 0,
      explanation: 'Chất độc hại ngấm qua các tầng đất sẽ xâm nhập vào tầng nước ngầm mà con người thường khai thác làm nước sinh hoạt và tưới tiêu.',
    },
    realSituation: {
      title: 'Tình huống: Vỏ chai thuốc trừ sâu trên bờ ruộng',
      scenario: 'Bạn An đi thăm đồng cùng ông nội và phát hiện một số bác nông dân sau khi phun thuốc bảo vệ thực vật xong đã vứt luôn vỏ chai thủy tinh, bao bì nylon chứa thuốc thừa ngay trên bờ ruộng cạnh rãnh nước tưới.',
      question: 'Nếu là An, em sẽ khuyên ông nội và các bác nông dân như thế nào?',
      solution: 'An nên lễ phép giải thích: Thuốc thừa trong vỏ chai rất độc, gặp mưa sẽ ngấm vào đất làm chết giun đất, làm đất nhiễm độc và thấm vào nước tưới. Cần thu gom vỏ bao bì bỏ vào hố chứa rác nguy hại chuyên dụng trên đồng ruộng để thu gom tiêu hủy an toàn!',
    },
  },
  {
    id: 'soil-erosion',
    title: 'Chủ đề 2: Xói mòn đất',
    subtitle: 'Hiểu rõ hiện tượng đất bị cuốn trôi và sức mạnh kỳ diệu của rừng cây giữ đất',
    iconName: 'Mountain',
    color: '#45B8F5',
    badge: 'Bài học 2',
    image: {
      src: '/images/lesson-2-soil-erosion.jpg',
      alt: 'Đất sườn dốc bị xói mòn nghiêm trọng trơ sỏi đá và nguy cơ sạt lở',
      caption: 'Ảnh quan sát thực tế: Sườn đồi bị rửa trôi, xói mòn trơ trọi đá sỏi và nguy cơ sạt lở taluy',
      observationTip: 'Học sinh quan sát kỹ: Mưa lũ đã cuốn trôi toàn bộ lớp đất mùn màu mỡ trên bề mặt, để lộ ra lớp sỏi đá trơ trụi cằn cỗi không thể trồng trọt. Địa hình sạt trượt còn đe dọa sự an toàn của chân cột điện cao thế và sườn đồi!'
    },
    sections: [
      {
        heading: '1. Khái niệm xói mòn đất',
        items: [
          'Xói mòn đất là hiện tượng lớp đất màu mỡ trên bề mặt bị nước chảy, gió mạnh hoặc các tác nhân cơ học cuốn trôi, bào mòn hoặc phá hủy, để lại lớp đất trơ trọi, khô cằn.',
        ],
        type: 'concept',
      },
      {
        heading: '2. Nguyên nhân gây xói mòn',
        subheading: 'Sự tác động kết hợp giữa thiên nhiên và con người:',
        items: [
          'Nguyên nhân tự nhiên: Những trận mưa như trút nước chảy tràn trên sườn dốc cao; những cơn gió lốc mạnh quét qua vùng đất cát khô hạn; địa hình dốc đứng thiếu che chắn.',
          'Nguyên nhân do con người: Chặt phá rừng phòng hộ, đốt nương làm rẫy làm mất thảm thực vật che chở.',
          'Khai thác khoáng sản, bạt núi mở đường bừa bãi không có biện pháp gia cố.',
          'Canh tác cày xới xuôi theo sườn dốc (thay vì làm ruộng bậc thang hoặc đường đồng mức).',
          'Để đất trống, đồi trọc phơi mình dưới nắng mưa gay gắt trong thời gian dài.',
        ],
        type: 'causes',
      },
      {
        heading: '3. Tác hại khôn lường của xói mòn',
        items: [
          'Rửa trôi hoàn toàn lớp đất mặt giàu mùn và chất hữu cơ – nguồn sống chính của cây cối.',
          'Đất bị thoái hóa, bạc màu, cằn cỗi chỉ còn đá sỏi, không thể trồng trọt hiệu quả.',
          'Gây suy giảm năng suất cây lương thực, đe dọa an ninh lương thực.',
          'Gây sạt lở đất nguy hiểm, cuốn trôi nhà cửa, đường sá trên vùng núi.',
          'Bùn đất trôi xuống làm bồi lắng lòng hồ thủy điện, sông ngòi, gây ngập lụt vùng hạ du.',
        ],
        type: 'effects',
      },
      {
        heading: '4. Biện pháp phòng chống xói mòn đất',
        subheading: 'Giải pháp khoa học bảo vệ lớp đất mặt:',
        items: [
          'Trồng cây gây rừng, tích cực bảo vệ rừng đầu nguồn và rừng tự nhiên.',
          'Phủ xanh đất trống, đồi trọc bằng các loại cây bụi, cây gỗ có bộ rễ khỏe mạnh.',
          'Trồng thảm cỏ chắn sóng, chắn gió trên các taluy đồi dốc và triền đê.',
          'Làm ruộng bậc thang và canh tác theo đường đồng mức trên vùng núi.',
          'Xây dựng hệ thống bờ kè, rọ đá, đập chắn bùn kiên cố tại các vị trí sườn dốc nguy hiểm.',
          'Luôn duy trì thảm che phủ đất (như phủ rơm rạ, trồng xen canh cây họ đậu).',
        ],
        type: 'solutions',
      },
    ],
    quickCheck: {
      question: 'Tại sao rừng cây lại là "vệ sĩ số 1" bảo vệ đất khỏi bị xói mòn khi trời mưa bão?',
      options: [
        'Vì cây hút hết toàn bộ nước mưa trên trời không cho rơi xuống đất',
        'Vì rễ cây đan chặt giữ đất, tán lá xòe rộng cản bớt sức va đập của giọt mưa',
        'Vì cây làm cho mặt đất biến thành đá cứng',
        'Vì cây làm cho gió ngừng thổi hoàn toàn',
      ],
      correctIndex: 1,
      explanation: 'Tán cây như chiếc ô làm giảm lực va đập của hạt mưa, còn mạng lưới rễ cây chằng chịt bện chặt các hạt đất lại với nhau, giữ cho đất không bị nước mưa cuốn trôi.',
    },
    realSituation: {
      title: 'Tình huống: Quả đồi trọc sau mùa khai thác gỗ',
      scenario: 'Một quả đồi ở gần xã của bạn Bình vừa bị người ta khai thác sạch gỗ keo, để lại bề mặt đất trống trơn. Mùa mưa bão sắp tới, nước mưa bắt đầu tạo ra các rãnh xói sâu hoắm trên sườn đồi và kéo bùn đỏ xuống ao làng.',
      question: 'Theo em, địa phương cần có hành động cấp thiết nào để cứu quả đồi?',
      solution: 'Cần khẩn trương gieo trồng lại cây con, trồng ngay thảm cỏ vertiver trên các sườn dốc và đắp bờ chắn đất ngang sườn dốc để ngăn nước xối đất trôi đi, giữ quả đồi an toàn qua mùa mưa.',
    },
  },
  {
    id: 'soil-protection',
    title: 'Chủ đề 3: Bảo vệ môi trường đất',
    subtitle: 'Những hành động thiết thực, nhỏ bé mỗi ngày của chiến binh nhí vì Trái Đất xanh',
    iconName: 'ShieldCheck',
    color: '#22B573',
    badge: 'Bài học 3',
    image: {
      src: '/images/lesson-3-soil-protection.jpg',
      alt: 'Nhiều bàn tay chung sức nâng niu bầu đất và cây con bảo vệ môi trường',
      caption: 'Ảnh quan sát thực tế: Chung tay trồng cây gây rừng, giữ chặt lớp đất mặt màu mỡ',
      observationTip: 'Học sinh quan sát kỹ: Nhiều bàn tay cùng đồng lòng nâng niu những cây non với bầu đất màu mỡ. Rễ cây phát triển sẽ giữ đất không bị nước lũ xối trôi, phủ xanh mặt đất và duy trì sự sống phì nhiêu của đất mẹ!'
    },
    sections: [
      {
        heading: '1. Ý nghĩa của việc bảo vệ môi trường đất',
        items: [
          'Đất là tài nguyên quý giá, là cái nôi nuôi dưỡng cây xanh, cung cấp lương thực thực phẩm cho toàn nhân loại.',
          'Bảo vệ đất chính là bảo vệ nguồn sống của chính chúng ta và các thế hệ tương lai.',
        ],
        type: 'concept',
      },
      {
        heading: '2. Chiến binh nhí hành động ngay hôm nay!',
        subheading: 'Những việc làm thiết thực em có thể làm ngay tại trường và ở nhà:',
        items: [
          'Bỏ rác đúng nơi quy định: Không vứt rác, vỏ kẹo, túi bóng bừa bãi ra sân trường hay luống hoa.',
          'Thực hành phân loại rác: Tách riêng rác hữu cơ (vỏ quả, thức ăn thừa), rác tái chế (giấy vụn, vỏ lon), rác nguy hại (pin cũ).',
          'Tái sử dụng & Giảm thiểu rác thải nhựa: Dùng bình nước cá nhân, hộp đựng dùng nhiều lần thay vì đồ nhựa dùng một lần.',
          'Nói "KHÔNG" với việc đổ nước xà phòng, dầu mỡ, pin cũ hay hóa chất xuống bồn cây, mặt đất.',
          'Chăm sóc và trồng cây xanh: Tham gia ngày hội trồng cây, tưới nước, bắt sâu cho bồn hoa của trường.',
          'Trở thành Đại sứ Môi trường nhí: Nhắc nhở người thân và bạn bè cùng giữ gìn đất và phân loại rác.',
        ],
        type: 'solutions',
      },
      {
        heading: '3. Nguyên tắc vàng trong sản xuất nông nghiệp sạch',
        items: [
          'Ưu tiên phân hữu cơ vi sinh, phân ủ từ rơm rạ và phế phẩm nông nghiệp để nuôi dưỡng đất màu mỡ.',
          'Hạn chế tối đa thuốc diệt cỏ hóa học; áp dụng các biện pháp sinh học bảo vệ mùa màng.',
          'Thu gom triệt để bao bì, chai lọ thuốc BVTV vào bể chứa an toàn sau khi sử dụng.',
        ],
        type: 'solutions',
      },
    ],
    quickCheck: {
      question: 'Khi em có một quả pin đồng hồ hoặc pin đồ chơi đã cạn, em nên xử lý như thế nào?',
      options: [
        'Vứt ngay vào thùng rác đất hoặc chôn dưới gốc cây',
        'Bỏ vào lửa đốt cho cháy hết',
        'Thu gom riêng vào lọ đựng pin cũ và mang tới điểm thu gom pin chuyên dụng',
        'Vứt xuống cống nước thải',
      ],
      correctIndex: 2,
      explanation: 'Pin chứa nhiều kim loại nặng độc hại (chì, thủy ngân, cadimi). Nếu vứt xuống đất, 1 viên pin có thể làm ô nhiễm 500 lít nước hoặc 1 mét khối đất trong 50 năm!',
    },
    realSituation: {
      title: 'Tình huống: Bữa trưa liên hoan ở trường',
      scenario: 'Sau buổi liên hoan bế giảng lớp, có rất nhiều rác: hộp xốp, chai nước ngọt bằng nhựa, vỏ dưa hấu, thìa nhựa dùng một lần.',
      question: 'Em hãy hướng dẫn các bạn phân loại số rác trên vào các thùng phù hợp.',
      solution: 'Vỏ dưa hấu là rác hữu cơ -> bỏ thùng xanh lá để ủ phân. Chai nhựa và vỏ lon là rác tái chế -> thu gom lại để bán ve chai. Thìa nhựa bẩn và hộp xốp -> bỏ vào thùng rác còn lại.',
    },
  },
];

export const DAILY_ACTIONS_CHECKLIST = [
  { id: 'act-1', text: 'Bỏ rác đúng nơi quy định, không vứt giấy rác ra sân vườn', points: 15, icon: 'Trash2' },
  { id: 'act-2', text: 'Thu gom pin cũ vào hộp riêng, không vứt chung vào đất', points: 20, icon: 'BatteryCharging' },
  { id: 'act-3', text: 'Tưới nước và nhổ cỏ chăm sóc 1 chậu cây hoặc luống hoa', points: 15, icon: 'Sprout' },
  { id: 'act-4', text: 'Nhắc nhở người thân không đổ nước giặt xà phòng vào gốc cây', points: 15, icon: 'Droplets' },
  { id: 'act-5', text: 'Sử dụng bình nước cá nhân thay vì mua chai nhựa dùng 1 lần', points: 15, icon: 'Coffee' },
  { id: 'act-6', text: 'Tuyên truyền với 1 bạn cùng lớp về bài học bảo vệ đất', points: 20, icon: 'Megaphone' },
];
