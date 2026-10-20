import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Printer,
  Sparkles,
  BookOpen,
  Info,
  Layers,
} from 'lucide-react';

interface MindNode {
  id: string;
  label: string;
  color: string;
  icon: string;
  summary: string;
  subBranches?: {
    title: string;
    items: string[];
  }[];
}

const MIND_MAP_BRANCHES: MindNode[] = [
  {
    id: 'branch-pollution',
    label: 'Nhánh 1: Ô nhiễm đất',
    color: '#FF944D',
    icon: '☣️',
    summary: 'Đất bị nhiễm chất thải hoặc chất độc hại, làm biến đổi và suy thoái chất lượng đất và môi trường sống.',
    subBranches: [
      {
        title: 'Nguyên nhân',
        items: [
          'Do con người: Xả rác bừa bãi, lạm dụng phân bón hóa học lâu năm, phun thuốc BVTV sai quy định, chôn lấp rác nilon, nước thải nhà máy.',
          'Do tự nhiên: Núi lửa phun trào tro bụi, nước biển dâng gây xâm nhập mặn, đất bị nhiễm phèn chua tự nhiên.',
        ],
      },
      {
        title: 'Tác hại',
        items: [
          'Kìm hãm sự phát triển của cây trồng, giảm năng suất thu hoạch.',
          'Gây hại cho động vật và tiêu diệt vi sinh vật có lợi trong đất.',
          'Chất độc thấm sâu ngấm vào tầng nước ngầm quý giá.',
          'Gây nguy cơ nhiễm độc cho con người qua nước uống và rau củ.',
        ],
      },
      {
        title: 'Biện pháp phòng chống',
        items: [
          'Phân loại rác sinh hoạt tại nguồn (rác hữu cơ, tái chế, nguy hại).',
          'Sử dụng phân hữu cơ, phân vi sinh cải tạo đất.',
          'Sử dụng thuốc BVTV đúng liều lượng, đúng thời điểm theo hướng dẫn.',
          'Thu gom và vận hành trạm xử lí nước thải công nghiệp.',
          'Xây dựng công trình cống đê ngăn mặn ở vùng ven biển.',
        ],
      },
    ],
  },
  {
    id: 'branch-erosion',
    label: 'Nhánh 2: Xói mòn đất',
    color: '#45B8F5',
    icon: '⛰️',
    summary: 'Hiện tượng lớp đất mặt màu mỡ bị nước chảy xiết hoặc gió mạnh cuốn trôi, để lại mặt đất khô cằn bạc màu.',
    subBranches: [
      {
        title: 'Nguyên nhân tự nhiên',
        items: [
          'Mưa lớn như trút nước chảy tràn mạnh trên các sườn dốc đồi núi.',
          'Gió bão cuốn các hạt đất nhẹ trên những vùng đất trống khô hạn.',
        ],
      },
      {
        title: 'Nguyên nhân do con người',
        items: [
          'Chặt phá rừng phòng hộ, phá hủy thảm phủ thực vật tự nhiên.',
          'Đốt nương làm rẫy, bạt đồi mở đường không có rọ kè chắn đất.',
          'Canh tác cày xới xuôi theo sườn dốc thay vì làm đường đồng mức.',
          'Để đất trống, đồi trọc phơi nắng phơi mưa lâu ngày.',
        ],
      },
      {
        title: 'Tác hại',
        items: [
          'Rửa trôi lớp đất mặt giàu dinh dưỡng và mùn màu mỡ.',
          'Làm đất bị cằn cỗi, giảm năng suất cây lương thực.',
          'Tăng nguy cơ sạt lở đồi dốc, phá hủy đường sá, nhà cửa.',
          'Bồi lắng bùn đất lòng hồ thủy điện, gây lũ lụt vùng đồng bằng.',
        ],
      },
      {
        title: 'Biện pháp phòng chống',
        items: [
          'Trồng cây gây rừng, bảo vệ rừng đầu nguồn và rừng phòng hộ.',
          'Phủ xanh đất trống, đồi núi trọc bằng cây có rễ sâu bền chắc.',
          'Trồng thảm cỏ trên các taluy sườn dốc để cản dòng nước xiết.',
          'Canh tác ruộng bậc thang và gieo cấy theo đường đồng mức.',
          'Xây bờ kè, tường chắn rọ đá kiên cố tại các vị trí xung yếu.',
        ],
      },
    ],
  },
  {
    id: 'branch-protection',
    label: 'Nhánh 3: Bảo vệ môi trường đất',
    color: '#22B573',
    icon: '🛡️',
    summary: 'Giữ gìn nguồn tài nguyên đất quý giá cho hiện tại và mai sau bằng những hành động thực tế thiết thực.',
    subBranches: [
      {
        title: 'Phân loại và xử lí rác thải',
        items: [
          'Phân tách riêng biệt rác hữu cơ, rác tái chế và rác vô cơ.',
          'Thu gom pin, bóng đèn, hóa chất nguy hại vào nơi thu gom chuyên dụng.',
          'Tái chế và tái sử dụng chai lọ, túi đựng để giảm rác chôn lấp.',
        ],
      },
      {
        title: 'Sản xuất nông nghiệp an toàn',
        items: [
          'Ưu tiên dùng phân ủ hữu cơ, chế phẩm vi sinh thân thiện với đất.',
          'Không đổ dầu mỡ, nước giặt tẩy hóa chất ra đất vườn.',
          'Thu gom sạch vỏ chai bao bì thuốc BVTV sau khi sử dụng.',
        ],
      },
      {
        title: 'Trồng cây & Lan tỏa ý thức',
        items: [
          'Tham gia ngày hội trồng cây, chăm sóc bồn hoa vườn trường.',
          'Tuyên truyền, nhắc nhở gia đình và bạn bè cùng giữ sạch đất mẹ.',
          'Học tập và lan tỏa thông điệp Đội Trưởng Đất Xanh tới mọi người.',
        ],
      },
    ],
  },
];

export const InteractiveMindMap: React.FC = () => {
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    'branch-pollution': true,
    'branch-erosion': true,
    'branch-protection': true,
  });
  const [activeModalBranch, setActiveModalBranch] = useState<MindNode | null>(null);

  const toggleBranch = (id: string) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setExpandedBranches({
      'branch-pollution': true,
      'branch-erosion': true,
      'branch-protection': true,
    });
  };

  const collapseAll = () => {
    setExpandedBranches({
      'branch-pollution': false,
      'branch-erosion': false,
      'branch-protection': false,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Control bar */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Sơ đồ tư duy tương tác</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#20352B]">
            Cây Tri Thức Bảo Vệ Đất Mẹ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bấm vào các nhánh để mở rộng hoặc thu gọn kiến thức bài học
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mở rộng tất cả</span>
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Thu gọn</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#22B573] hover:bg-[#1caa68] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / Lưu sơ đồ</span>
          </button>
        </div>
      </div>

      {/* Center Root Hub */}
      <div className="text-center">
        <div className="inline-block p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl shadow-lg border-4 border-white max-w-xl">
          <div className="text-3xl mb-1">🌍</div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 block mb-1">
            Chủ đề trung tâm · Bài 2 SGK
          </span>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
            Ô NHIỄM, XÓI MÒN ĐẤT VÀ BẢO VỆ MÔI TRƯỜNG ĐẤT
          </h1>
        </div>
      </div>

      {/* 3 Main Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MIND_MAP_BRANCHES.map((branch) => {
          const isExpanded = expandedBranches[branch.id];

          return (
            <div
              key={branch.id}
              className="bg-white border-2 rounded-3xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between"
              style={{ borderColor: `${branch.color}40` }}
            >
              <div>
                {/* Branch Header */}
                <div
                  onClick={() => toggleBranch(branch.id)}
                  className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ backgroundColor: `${branch.color}15` }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{branch.icon}</span>
                    <h3 className="font-black text-base sm:text-lg text-[#20352B]">
                      {branch.label}
                    </h3>
                  </div>
                  <div className="p-1 rounded-lg text-slate-600">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>

                {/* Short Summary */}
                <p className="text-xs text-slate-600 font-medium px-2 py-3 leading-relaxed border-b border-slate-100">
                  {branch.summary}
                </p>

                {/* Sub-branches (Accordion) */}
                {isExpanded && (
                  <div className="space-y-4 pt-3">
                    {branch.subBranches?.map((sub, sIdx) => (
                      <div key={sIdx} className="pl-3 border-l-2" style={{ borderColor: branch.color }}>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: branch.color }}
                          />
                          <span>{sub.title}</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {sub.items.map((it, iIdx) => (
                            <li
                              key={iIdx}
                              className="text-xs text-slate-600 font-medium leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400"
                            >
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Zoom In Modal Trigger */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalBranch(branch)}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem chi tiết nhánh này</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal when clicked "Xem chi tiết nhánh này" */}
      {activeModalBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-emerald-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalBranch.icon}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#20352B]">
                    {activeModalBranch.label}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Sơ đồ tư duy mở rộng
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalBranch(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-700 font-semibold mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              {activeModalBranch.summary}
            </p>

            <div className="space-y-5">
              {activeModalBranch.subBranches?.map((sub, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-200">
                  <h4 className="text-sm font-extrabold text-[#20352B] mb-2 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeModalBranch.color }}
                    />
                    <span>{sub.title}</span>
                  </h4>
                  <ul className="space-y-2">
                    {sub.items.map((it, iIdx) => (
                      <li key={iIdx} className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pl-3 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalBranch(null)}
                className="px-5 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
