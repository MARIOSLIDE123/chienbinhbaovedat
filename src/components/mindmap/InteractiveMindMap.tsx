import React, { useState } from 'react';
import {
  Printer,
  Layers,
  ChevronRight,
  Info,
  CheckCircle,
  Sparkles,
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
  const [activeBranchId, setActiveBranchId] = useState<string>('all');
  const [activeModalBranch, setActiveModalBranch] = useState<MindNode | null>(null);

  const activeBranch = MIND_MAP_BRANCHES.find((b) => b.id === activeBranchId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-3 pb-6">
      {/* 1. Control Header Bar (Compact single row) */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-[#22B573] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-[#20352B] leading-none">
              Sơ Đồ Tư Duy Cây Tri Thức
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Khoa học Lớp 5 · Bài 2
            </p>
          </div>
        </div>

        {/* Branch Filters and Print */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveBranchId('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeBranchId === 'all'
                ? 'bg-[#22B573] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Toàn bộ 3 nhánh
          </button>
          {MIND_MAP_BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBranchId(b.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeBranchId === b.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{b.icon}</span>
              <span className="hidden sm:inline">{b.label.split(': ')[1]}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handlePrint}
            title="In hoặc lưu file PDF sơ đồ"
            className="p-1 sm:px-2.5 sm:py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In sơ đồ</span>
          </button>
        </div>
      </div>

      {/* 2. Central Root Node Header (Compact pill) */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-sm border-2 border-white max-w-full">
          <span className="text-lg">🌍</span>
          <span className="text-xs sm:text-sm font-black tracking-tight">
            Ô NHIỄM, XÓI MÒN ĐẤT VÀ BẢO VỆ MÔI TRƯỜNG ĐẤT
          </span>
        </div>
      </div>

      {/* 3. Branch Content Area (Single screen fitting) */}
      {activeBranchId === 'all' ? (
        /* View All 3 Branches as Compact Summary Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MIND_MAP_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="bg-white border-2 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between space-y-2.5 hover:shadow-md transition-shadow"
              style={{ borderColor: `${branch.color}50` }}
            >
              <div>
                <div
                  className="p-2 rounded-xl flex items-center justify-between mb-2"
                  style={{ backgroundColor: `${branch.color}15` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{branch.icon}</span>
                    <h3 className="font-black text-xs sm:text-sm text-[#20352B]">
                      {branch.label}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {branch.summary}
                </p>

                {/* Sub-branch pill list */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                  {branch.subBranches?.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="truncate">{sub.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveBranchId(branch.id)}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors border border-slate-200"
              >
                <span>Xem chi tiết nhánh này</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed View of Single Selected Branch */
        activeBranch && (
          <div
            className="bg-white border-2 rounded-2xl p-4 shadow-2xs space-y-3 animate-in fade-in duration-150"
            style={{ borderColor: `${activeBranch.color}60` }}
          >
            {/* Branch Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeBranch.icon}</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#20352B]">
                    {activeBranch.label}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{activeBranch.summary}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveBranchId('all')}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0 transition-colors"
              >
                ← Trở lại xem cả 3 nhánh
              </button>
            </div>

            {/* Sub-branch Cards (Compact grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {activeBranch.subBranches?.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <h4 className="text-xs font-black text-[#20352B] flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: activeBranch.color }}
                    />
                    <span>{sub.title}</span>
                  </h4>
                  <ul className="space-y-1">
                    {sub.items.map((it, iIdx) => (
                      <li
                        key={iIdx}
                        className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="text-emerald-600 font-bold shrink-0">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Modal Zoom Details (if opened) */}
      {activeModalBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-emerald-300 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeModalBranch.icon}</span>
                <h3 className="text-base font-black text-[#20352B]">{activeModalBranch.label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalBranch(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 font-medium p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              {activeModalBranch.summary}
            </p>
            <div className="space-y-2">
              {activeModalBranch.subBranches?.map((sub, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{sub.title}</h4>
                  <ul className="space-y-0.5 text-xs text-slate-600">
                    {sub.items.map((it, iIdx) => (
                      <li key={iIdx} className="leading-snug">• {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
