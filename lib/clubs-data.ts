export interface StaffMember {
  position: string;
  name: string;
}

export interface Club {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  image: string;
  description: string;
  staff: StaffMember[];
  activities?: string[];
  meetingTime?: string;
}

export const clubs: Club[] = [
  {
    id: "music",
    name: "音樂社",
    bgColor: "#FFE4E6",
    textColor: "#9F1239",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    description: "音樂社是一個充滿熱情與創意的社團，致力於培養學生的音樂素養與表演能力。我們提供各種樂器學習課程，包括吉他、鋼琴、鼓等，並定期舉辦校內外演出活動。無論你是音樂新手還是有經驗的演奏者，都歡迎加入我們的大家庭！",
    staff: [
      { position: "社長", name: "林雨萱" },
      { position: "副社長", name: "陳柏翰" },
      { position: "公關", name: "王筱涵" },
      { position: "總務", name: "黃子軒" },
      { position: "活動組長", name: "張雅婷" },
      { position: "器材組長", name: "劉建宏" },
    ],
    activities: [
      "每週社課：樂器教學與合奏練習",
      "校慶成果發表會",
      "跨校音樂交流活動",
      "街頭藝人表演體驗",
    ],
    meetingTime: "每週三 17:00-19:00",
  },
  {
    id: "basketball",
    name: "籃球社",
    bgColor: "#FEF3C7",
    textColor: "#92400E",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    description: "籃球社是學校最具活力的運動社團之一，我們注重團隊合作精神與運動技能的培養。透過專業的訓練課程，幫助社員提升籃球技巧，同時培養健康的運動習慣。我們定期參加校際比賽，展現社員們的實力與熱情！",
    staff: [
      { position: "社長", name: "張偉豪" },
      { position: "副社長", name: "李佳穎" },
      { position: "隊長", name: "王志明" },
      { position: "教練助理", name: "陳宇翔" },
      { position: "總務", name: "林美玲" },
    ],
    activities: [
      "每週基礎訓練與戰術演練",
      "校內三對三鬥牛賽",
      "校際友誼賽",
      "暑期籃球營隊",
    ],
    meetingTime: "每週二、四 16:30-18:30",
  },
  {
    id: "photography",
    name: "攝影社",
    bgColor: "#E0E7FF",
    textColor: "#3730A3",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    description: "攝影社帶你探索光影的奧秘，從構圖到後製，我們提供完整的攝影教學。無論你使用專業相機還是手機，都能在這裡學到實用的攝影技巧。我們定期舉辦外拍活動與攝影展，讓你的作品被更多人看見！",
    staff: [
      { position: "社長", name: "周雅涵" },
      { position: "副社長", name: "吳承翰" },
      { position: "美編", name: "蔡欣妤" },
      { position: "器材管理", name: "楊智傑" },
      { position: "活動組長", name: "許雅琪" },
    ],
    activities: [
      "攝影基礎課程與進階技巧",
      "人像/風景外拍活動",
      "攝影作品展覽",
      "業界攝影師講座",
    ],
    meetingTime: "每週五 16:00-18:00",
  },
  {
    id: "drama",
    name: "戲劇社",
    bgColor: "#D1FAE5",
    textColor: "#065F46",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    description: "戲劇社是一個充滿創意與表演熱情的園地。我們學習表演技巧、劇本創作、舞台設計等多元技能。每學期末會舉辦公演，讓社員們有機會站上舞台展現自我。歡迎喜歡表演、對戲劇有興趣的同學加入！",
    staff: [
      { position: "社長", name: "鄭宇婷" },
      { position: "副社長", name: "林冠廷" },
      { position: "導演組長", name: "陳思涵" },
      { position: "舞台組長", name: "黃俊傑" },
      { position: "道具組長", name: "李雅芳" },
      { position: "宣傳組長", name: "王柏翔" },
    ],
    activities: [
      "表演基礎課程與即興練習",
      "劇本讀本與角色分析",
      "學期末公演",
      "校外戲劇觀摩",
    ],
    meetingTime: "每週六 14:00-17:00",
  },
  {
    id: "coding",
    name: "程式設計社",
    bgColor: "#DBEAFE",
    textColor: "#1E40AF",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    description: "程式設計社致力於培養學生的程式思維與實作能力。從基礎程式語言到進階專案開發，我們提供循序漸進的學習環境。社員們可以參加各類程式競賽，也能組隊開發自己的軟體專案，是科技愛好者的最佳選擇！",
    staff: [
      { position: "社長", name: "劉俊宏" },
      { position: "副社長", name: "張雅雯" },
      { position: "技術組長", name: "陳柏宇" },
      { position: "教學組長", name: "林家豪" },
      { position: "競賽組長", name: "吳宜蓁" },
    ],
    activities: [
      "Python/JavaScript 基礎教學",
      "網頁開發實作",
      "演算法競賽培訓",
      "專題開發與成果展示",
    ],
    meetingTime: "每週三 16:00-18:00",
  },
  {
    id: "art",
    name: "美術社",
    bgColor: "#FDE68A",
    textColor: "#78350F",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    description: "美術社是一個充滿藝術氣息的創作空間，提供素描、水彩、油畫等多種媒材的學習機會。我們鼓勵社員發揮創意，探索個人藝術風格。定期舉辦校內展覽，讓作品與大家分享，培養藝術鑑賞與創作能力。",
    staff: [
      { position: "社長", name: "蘇曉雯" },
      { position: "副社長", name: "陳彥廷" },
      { position: "教學組長", name: "王詩涵" },
      { position: "展覽組長", name: "李建成" },
      { position: "總務", name: "張雅琳" },
    ],
    activities: [
      "素描與水彩技法教學",
      "戶外寫生活動",
      "校內美展",
      "藝術家工作室參訪",
    ],
    meetingTime: "每週四 16:00-18:00",
  },
  {
    id: "dance",
    name: "熱舞社",
    bgColor: "#FCE7F3",
    textColor: "#9D174D",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80",
    description: "熱舞社是學校最具熱情與活力的社團！我們學習各種舞風，包括 K-pop、街舞、現代舞等。透過專業的舞蹈訓練，培養身體協調性與舞台表演能力。定期參加校內外表演與比賽，展現社員們的舞蹈魅力！",
    staff: [
      { position: "社長", name: "林筱芸" },
      { position: "副社長", name: "陳威廷" },
      { position: "編舞組長", name: "黃詩涵" },
      { position: "表演組長", name: "王建宇" },
      { position: "宣傳組長", name: "張雅婷" },
      { position: "總務", name: "李佳琪" },
    ],
    activities: [
      "基礎舞蹈與體能訓練",
      "各舞風教學課程",
      "校慶/迎新表演",
      "校外舞蹈比賽",
    ],
    meetingTime: "每週一、三 17:00-19:00",
  },
  {
    id: "volunteer",
    name: "志工服務社",
    bgColor: "#CCFBF1",
    textColor: "#115E59",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    description: "志工服務社秉持「服務學習、學習服務」的理念，帶領社員參與各項社會服務活動。從社區關懷、淨灘活動到偏鄉教育服務，我們希望培養學生的社會責任感，讓愛與關懷散播到每個角落。",
    staff: [
      { position: "社長", name: "周雨欣" },
      { position: "副社長", name: "林冠佑" },
      { position: "活動組長", name: "陳怡君" },
      { position: "聯絡組長", name: "黃家瑋" },
      { position: "文書組長", name: "張詩涵" },
    ],
    activities: [
      "社區老人關懷訪視",
      "淨灘環保活動",
      "偏鄉教育服務隊",
      "物資募集與捐贈",
    ],
    meetingTime: "每週五 16:00-17:30",
  },
];
