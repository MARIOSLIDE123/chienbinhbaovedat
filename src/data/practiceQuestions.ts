export type PracticeType = 'single-choice' | 'bucket-sort' | 'matching' | 'multi-select' | 'true-false' | 'ordering';

export interface PracticeItem {
  id: string;
  title: string;
  instruction: string;
  type: PracticeType;
  explanation: string;
  data: any;
}

export const PRACTICE_ACTIVITIES: PracticeItem[] = [
  {
    id: 'p1',
    title: 'Thử thách 1: Nguyên nhân do con người',
    instruction: 'Hãy chọn đâu là nguyên nhân gây ô nhiễm môi trường đất do bàn tay con người gây ra:',
    type: 'single-choice',
    explanation: 'Xả nước thải chưa qua xử lí từ nhà máy ra kênh mương, đồng ruộng là nguyên nhân nhân tạo nghiêm trọng nhất gây đầu độc đất đai.',
    data: {
      options: [
        { id: 'a', text: 'Núi lửa phun trào nham thạch và bụi than', isCorrect: false },
        { id: 'b', text: 'Xả nước thải công nghiệp chưa qua xử lí ra kênh rạch, đồng ruộng', isCorrect: true },
        { id: 'c', text: 'Nước biển dâng cao tràn vào đất liền gây ngập mặn tự nhiên', isCorrect: false },
        { id: 'd', text: 'Mưa to kéo dài gây ngập úng đất vùng trũng', isCorrect: false },
      ],
    },
  },
  {
    id: 'p2',
    title: 'Thử thách 2: Phân loại nguyên nhân ô nhiễm đất',
    instruction: 'Hãy phân chia các nguyên nhân sau vào đúng 2 nhóm: "Do con người" hoặc "Do tự nhiên":',
    type: 'bucket-sort',
    explanation: 'Con người tác động qua việc dùng hóa chất và xả rác, còn tự nhiên tác động qua núi lửa, nhiễm mặn và nhiễm phèn.',
    data: {
      buckets: [
        { id: 'human', label: 'Do con người gây ra', color: 'border-orange-400 bg-orange-50' },
        { id: 'nature', label: 'Do tự nhiên gây ra', color: 'border-blue-400 bg-blue-50' },
      ],
      items: [
        { id: 'item-1', text: 'Lạm dụng phân bón hóa học nhiều năm', targetBucket: 'human' },
        { id: 'item-2', text: 'Núi lửa phun trào tro bụi khoáng', targetBucket: 'nature' },
        { id: 'item-3', text: 'Chôn lấp túi nilon bừa bãi', targetBucket: 'human' },
        { id: 'item-4', text: 'Nước biển xâm nhập mặn vào đất ruộng', targetBucket: 'nature' },
        { id: 'item-5', text: 'Phun thuốc trừ sâu quá liều lượng', targetBucket: 'human' },
        { id: 'item-6', text: 'Đất bị nhiễm phèn tự nhiên', targetBucket: 'nature' },
      ],
    },
  },
  {
    id: 'p3',
    title: 'Thử thách 3: Nối tác hại với hiện tượng tương ứng',
    instruction: 'Ghép mỗi tác hại ở cột trái với hiện tượng đúng ở cột phải:',
    type: 'matching',
    explanation: 'Ô nhiễm đất làm cây ngộ độc và thấm nước ngầm; xói mòn làm mất lớp mùn màu mỡ trên bề mặt và gây sạt lở đồi dốc.',
    data: {
      pairs: [
        { id: 'm1', left: 'Mất lớp đất mặt giàu dinh dưỡng, đất bị bạc màu trơ sỏi đá', right: 'Xói mòn đất' },
        { id: 'm2', left: 'Hóa chất độc hại thấm sâu đầu độc tầng nước ngầm quý', right: 'Ô nhiễm đất' },
        { id: 'm3', left: 'Gây nguy cơ sạt lở sườn dốc đồi núi khi mùa mưa lũ đến', right: 'Xói mòn đất' },
        { id: 'm4', left: 'Rau củ trồng trên đất tích tụ độc tố gây hại sức khỏe người ăn', right: 'Ô nhiễm đất' },
      ],
    },
  },
  {
    id: 'p4',
    title: 'Thử thách 4: Chọn hành động ĐÚNG để bảo vệ đất',
    instruction: 'Có thể chọn nhiều đáp án đúng. Đâu là những việc nên làm để bảo vệ môi trường đất?',
    type: 'multi-select',
    explanation: 'Bảo vệ đất cần kết hợp: phân loại rác, ưu tiên phân hữu cơ, canh tác ruộng bậc thang và xử lí nước thải!',
    data: {
      options: [
        { id: 'opt1', text: 'Phân loại rác sinh hoạt và bỏ rác đúng nơi quy định', isCorrect: true },
        { id: 'opt2', text: 'Đổ nước rửa chén, xà phòng thừa trực tiếp vào luống hoa', isCorrect: false },
        { id: 'opt3', text: 'Ưu tiên sử dụng phân bón hữu cơ, vi sinh thay vì lạm dụng phân hóa học', isCorrect: true },
        { id: 'opt4', text: 'Làm ruộng bậc thang và trồng cỏ giữ đất trên sườn dốc', isCorrect: true },
        { id: 'opt5', text: 'Đốt sạch rừng cây trên đỉnh đồi để lấy tro than làm phân', isCorrect: false },
        { id: 'opt6', text: 'Thu gom pin cũ riêng để xử lí chuyên dụng, không vứt ra vườn', isCorrect: true },
      ],
    },
  },
  {
    id: 'p5',
    title: 'Thử thách 5: Nhận biết dấu hiệu xói mòn đất',
    instruction: 'Hình ảnh hoặc hiện tượng nào sau đây thể hiện rõ nét nhất đất đang bị XÓI MÒN nghiêm trọng?',
    type: 'single-choice',
    explanation: 'Sườn đồi trọc bị các dòng nước mưa xé toạc thành rãnh sâu cuốn trôi đất đỏ là hình ảnh kinh điển của xói mòn đất.',
    data: {
      options: [
        { id: 'e1', text: 'Khu rừng rậm rạp xanh mát có thảm lá mục êm ái dưới chân', isCorrect: false },
        { id: 'e2', text: 'Sườn đồi trơ trọi bị nước mưa xé thành rãnh sâu, đất đỏ bị cuốn trôi trơ sỏi đá', isCorrect: true },
        { id: 'e3', text: 'Cánh đồng lúa trĩu bông được đắp bờ giữ nước vuông vắn', isCorrect: false },
        { id: 'e4', text: 'Vườn cây ăn quả xum xuê có rơm rạ phủ quanh gốc', isCorrect: false },
      ],
    },
  },
  {
    id: 'p6',
    title: 'Thử thách 6: Đúng hay Sai về cây xanh?',
    instruction: 'Đọc nhận định sau và chọn ĐÚNG hoặc SAI: "Rừng cây chỉ có tác dụng tạo bóng mát, còn bộ rễ cây không có vai trò gì trong việc giữ đất khi mưa to."',
    type: 'true-false',
    explanation: 'Nhận định trên là SAI! Bộ rễ cây như hàng triệu cánh tay đan chéo bện chặt các hạt đất lại với nhau, là "vệ sĩ" quan trọng nhất chống rửa trôi và sạt lở đất.',
    data: {
      statement: 'Rừng cây chỉ có tác dụng tạo bóng mát, còn bộ rễ cây không có vai trò gì trong việc giữ đất khi mưa to.',
      correctAnswer: false,
    },
  },
  {
    id: 'p7',
    title: 'Thử thách 7: Sắp xếp quy trình xử lý rác thải hữu cơ',
    instruction: 'Sắp xếp các bước biến rác thải thực phẩm thành phân bón tốt cho đất theo đúng thứ tự logic:',
    type: 'ordering',
    explanation: 'Quy trình chuẩn: Phân loại rác tại nguồn -> Thu gom vỏ rau củ thừa -> Ủ vi sinh phân hủy hoai mục -> Bón cho cây để đất tơi xốp.',
    data: {
      correctOrder: [
        'Bước 1: Phân loại riêng rác hữu cơ (vỏ chuối, rau củ thừa)',
        'Bước 2: Thu gom và băm nhỏ đưa vào thùng ủ chuyên dụng',
        'Bước 3: Bổ sung men vi sinh và ủ kín trong khoảng 30 ngày',
        'Bước 4: Thu được phân mùn hữu cơ sạch bón cho cây trồng',
      ],
      initialShuffled: [
        'Bước 3: Bổ sung men vi sinh và ủ kín trong khoảng 30 ngày',
        'Bước 1: Phân loại riêng rác hữu cơ (vỏ chuối, rau củ thừa)',
        'Bước 4: Thu được phân mùn hữu cơ sạch bón cho cây trồng',
        'Bước 2: Thu gom và băm nhỏ đưa vào thùng ủ chuyên dụng',
      ],
    },
  },
  {
    id: 'p8',
    title: 'Thử thách 8: Ứng xử thông minh tại trường học',
    instruction: 'Trong giờ ra chơi, bạn Nam nhìn thấy một bạn cùng trường đang tiện tay vứt chiếc túi nilon đựng hộp sữa vừa uống xong vào gốc cây phượng vĩ trong sân khấu trường. Nam nên làm gì?',
    type: 'single-choice',
    explanation: 'Nhắc nhở nhẹ nhàng và cùng bạn nhặt rác bỏ vào thùng rác tái chế là hành động đúng đắn và chuẩn mực của một chiến binh bảo vệ đất!',
    data: {
      options: [
        { id: 's1', text: 'Mặc kệ vì đó không phải rác do mình vứt ra', isCorrect: false },
        { id: 's2', text: 'Lại gần nhắc nhở bạn nhẹ nhàng: Túi nilon rất lâu phân hủy sẽ làm đất bị ngạt, rủ bạn nhặt lên bỏ vào thùng rác', isCorrect: true },
        { id: 's3', text: 'Quát mắng bạn thật to trước mặt mọi người', isCorrect: false },
        { id: 's4', text: 'Lấy chân giẫm túi nilon vùi sâu vào dưới đất cho khuất mắt', isCorrect: false },
      ],
    },
  },
];
