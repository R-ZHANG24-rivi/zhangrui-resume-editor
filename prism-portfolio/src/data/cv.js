/**
 * PRISM — CV CONTENT（唯一需要修改的内容文件）
 * ───────────────────────────────────────────────────────────────────────────
 * 整站所有文字都来自这里。改简历文案只动这一个文件，组件无需改动。
 * 全部内容均为张睿真实经历，并按「字节跳动 / 抖音集团 · 广告业务 AI 产品设计」
 * 实习生 JD 做了针对性优化（无虚构）。
 *
 * 想改什么就改什么：
 *   - profile    ：姓名 / 求职意向 / 一句话简介 / 联系方式 / 标签
 *   - education  ：教育背景（数组，可增删）
 *   - skills     ：技能分组（产品体验 / 视觉动效 / 设计工具 / AI 能力）
 *   - projects   ：首页 6 个「波长」项目卡片（顺序即展示顺序，建议保留 6 个）
 *   - awards     ：获奖与学术（数组）
 *   - papers     ：论文 / 研究（数组）
 *   - contact    ：联系方式
 * ───────────────────────────────────────────────────────────────────────────
 */

export const CV = {
  /* ============================ 头部 / 个人 ============================ */
  profile: {
    name: '张睿',
    title: 'AI 产品设计师 · 视觉 / 交互',
    // 求职意向（针对本 JD）
    objective: '字节跳动 / 抖音集团 · 广告业务 AI 产品设计（实习生）',
    location: '北京',
    phone: '13067018267',
    email: '1277929459@qq.com',
    // 标签（About 区与首页展示用）
    tags: [
      'UI/UX 设计',
      'AIGC 交互设计',
      'AI Coding',
      '模型评测',
      'Prompt 设计',
      'C 端 UX',
      'Figma / AE',
      'H5 原型',
    ],
    // About 区核心陈述（一句话简介）
    intro:
      '清华美院科普信息设计硕士（AI 辅助设计 / 多模态交互方向，GPA 3.9/4.0），兼具 AI 产品体验、UI/UX 与视觉设计复合能力。',
    // 个人总结（About 区展开的三段）
    summary: [
      '深度参与 AI 原生产品的「模型 × 人」交互设计：在阿里通义实验室参与万相文生图 / 图像编辑模型的体验与数据体系，搭建结构化 Prompt 体系与 Agent 评测，对模型能力边界、生成质量与人机交互有实践体感。',
      '具备真实 C 端产品从 0 到 1 / 改版上线经验（腾讯新闻任务中心、字节抖音政务运营中台），覆盖需求拆解 → 信息架构 → 交互流程 → 高保真界面 → 动效 → 走查全链路，并以数据验证体验收益。',
      '高频使用 ChatGPT / Claude / Codex / Gemini / 即梦，能把 AI 用于需求分析、创意探索、交互验证与原型 Coding；以第一作者发表 IEEE VR 2025 论文并入选 Gallery，持续思考「AI + 设计」的交互范式。',
    ],
  },

  /* ============================ 教育背景 ============================ */
  education: [
    {
      school: '清华大学美术学院',
      degree: '科普信息设计 · 硕士（在读）',
      period: '2024.09 – 2027.06',
      note: 'GPA 3.9/4.0；研究方向：用户体验设计、人工智能辅助设计、多模态交互与沉浸式体验设计。',
    },
    {
      school: '江南大学设计学院',
      degree: '视觉传达设计 · 学士',
      period: '2019.09 – 2023.06',
      note: '优秀毕业设计；学业一等奖学金、校三好学生等荣誉。',
    },
  ],

  /* ============================ 技能分组 ============================ */
  skills: [
    {
      group: '产品体验',
      items: ['用户研究', '竞品分析', '信息架构', '交互流程', '可用性分析', '设计走查', 'PRD'],
    },
    {
      group: '视觉动效',
      items: [
        '移动端 UI（iOS / Android 设计体系）',
        '组件规范',
        '视觉系统',
        '交互动效（After Effects）',
        '信息可视化',
        '三维视觉',
      ],
    },
    {
      group: '设计工具',
      items: ['Figma（组件化协作）', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere', 'Blender'],
    },
    {
      group: 'AI 能力',
      items: [
        'ChatGPT',
        'Claude',
        'Codex',
        'Gemini',
        '即梦',
        'WorkBuddy',
        '结构化 Prompt',
        '模型体验评测',
        'AI Coding',
        'H5 交互原型',
      ],
    },
  ],

  /* ===================== 首页 6 个「波长」项目卡片 =====================
     顺序即展示顺序。每个项目的 color / nm / glow / character 控制棱镜光效，
     可按喜好微调；文字内容（overview/problem/process/outcome）点开卡片可见。 */
  projects: [
    {
      id: 'bytedance-douyin',
      index: '01',
      title: '字节跳动 · 抖音',
      company: '字节跳动',
      wavelength: 'ORANGE',
      nm: 605,
      color: '#ff7a18',
      colorSecondary: '#ffc53d',
      glow: 'rgba(255, 122, 24, 0.55)',
      character: { drift: 0.9, dispersion: 1.0, bloom: 1.05, rotation: 0.9 },
      discipline: 'AI 产品设计 / 视觉',
      year: '2025',
      role: '视觉设计实习生',
      summary: '抖音政务运营中台 — 结合 AIGC 的视觉系统与 H5 体验设计，深入理解抖音产品矩阵与营销玩法。',
      overview:
        '负责政务与文旅活动的视觉系统与 H5 体验设计，结合 AIGC 完成创意扩展与快速迭代，深入理解抖音产品矩阵与内容 / 营销玩法，推动 10+ 活动页面上线。',
      problem: '政务与文旅活动频密、创意迭代快，传统设计产能难以匹配运营节奏。',
      process:
        '搭建可复用的 AIGC 创意模板；参与活动 KV、互动 H5 与落地页全流程设计，打通「创意 → 产出 → 上线」链路。',
      outcome: '沉淀可复用模板，提升运营侧内容产出效率，推动 10+ 活动页面上线。',
    },
    {
      id: 'alibaba-tongyi',
      index: '02',
      title: '阿里巴巴 · 通义万相',
      company: '阿里巴巴',
      wavelength: 'WHITE + VIOLET',
      nm: 420,
      color: '#f4f5f7',
      colorSecondary: '#8b5cff',
      glow: 'rgba(190, 175, 255, 0.5)',
      character: { drift: 0.7, dispersion: 1.25, bloom: 1.15, rotation: 0.75 },
      discipline: 'AI 视觉 / 模型体验',
      year: '2025',
      role: 'AI 视觉美学实习生',
      summary: '通义万相文生图 / 图像编辑 — 模型「模型 × 人」交互体验与数据体系，结构化 Prompt 与 Agent 评测。',
      overview:
        '参与通义万相文生图 / 图像编辑模型的体验与数据体系优化，构建 SFT 多维数据标签并整理 8.3 亿张训练数据；设计「捏脸」「调色盘」等功能与结构化 Prompt 体系，推进模型能力向用户可用产品转化。',
      problem: '生成模型能力强但用户难用、可控性差，需要把模型能力翻译为可感知的产品交互。',
      process:
        '设计功能级交互与结构化 Prompt 体系；参与 Agent 体验评测，完成 100+ 组样本测试并编写 2.6 版本 Prompt 指南。',
      outcome: '围绕生成稳定性、真实性与可控性推进体验优化，建立对 AI 能力边界的系统性认知。',
    },
    {
      id: 'tencent-news',
      index: '03',
      title: '腾讯新闻',
      company: '腾讯',
      wavelength: 'SKY BLUE',
      nm: 480,
      color: '#46b7ff',
      colorSecondary: '#38c8ff',
      glow: 'rgba(70, 183, 255, 0.5)',
      character: { drift: 1.15, dispersion: 0.85, bloom: 1.0, rotation: 1.2 },
      discipline: 'C 端产品体验设计',
      year: '2026',
      role: '产品体验设计实习生',
      summary: '任务中心改版 — 从概念到落地的完整 C 端设计交付，改版后周日均 PV 提升约 13%。',
      overview:
        '负责任务中心信息架构、任务流程、积分反馈及移动端视觉升级，协同产品 / 研发推动 7/16 上线；改版后周日均页面进入 PV 由约 1.95 万提升至 2.27 万（增长约 13%）。',
      problem: '原有任务中心入口浅、任务链路断裂，用户参与与积分消耗偏低。',
      process:
        '重构信息架构与任务流程，设计积分反馈闭环与移动端视觉；以转盘抽奖验证完整交互链路（入口→抽奖→反馈→记录→异常）。',
      outcome: '近 30 天累计抽奖 6,400+ 次，推动积分净消耗 9.26 万，完整交付从概念到落地。',
    },
    {
      id: 'chinatelcom-aigc',
      index: '04',
      title: '中国电信 · AIGC 营销',
      company: '中国电信',
      wavelength: 'BLACK + DEEP PURPLE',
      nm: 400,
      color: '#7a2bff',
      colorSecondary: '#2a1050',
      glow: 'rgba(122, 43, 255, 0.42)',
      character: { drift: 0.5, dispersion: 1.35, bloom: 0.82, rotation: 0.55 },
      discipline: 'AIGC 活动 / 产品体验',
      year: '2025',
      role: '活动策划 / 产品体验设计师',
      summary: '广博会 / 元旦 / 春节线上活动 — 结合天翼云图 AIGC 的营销互动玩法，与广告 / 商业化业务高度契合。',
      overview:
        '参与广博会、元旦及春节线上活动，结合天翼云图 AIGC 完成蛇年 IP、3D 直播场景、H5 与抽奖机制设计，探索 AI 营销互动玩法。',
      problem: '传统营销活动创意产能有限，难以在节庆高频节点快速产出差异化内容。',
      process: '以天翼云图 AIGC 驱动 IP 与场景生成，设计 H5 与抽奖机制，形成可复用的 AI 营销互动模板。',
      outcome: '探索出 AI 营销互动范式，与广告 / 商业化业务高度契合，可直接迁移至电商与品牌增长场景。',
    },
    {
      id: 'tencent-aigc-show',
      index: '05',
      title: '腾讯互娱 · AIGC 沉浸展厅',
      company: '腾讯互娱',
      wavelength: 'PINK',
      nm: 520,
      color: '#ff5fa8',
      colorSecondary: '#ff3fd0',
      glow: 'rgba(255, 95, 168, 0.52)',
      character: { drift: 1.35, dispersion: 1.1, bloom: 1.2, rotation: 1.35 },
      discipline: '沉浸式 / 原生 AI 交互',
      year: '2025',
      role: '交互设计师',
      summary: 'AIGC 生成内容 × 多模态交互的沉浸式展项，《情绪合成器》入选 IEEE VR 2025 Gallery。',
      overview:
        '围绕 AIGC 生成内容与人机交互设计沉浸式展项，以脑电、面部表情等多模态数据驱动视觉生成；《情绪合成器》入选 IEEE VR 2025 Gallery 并以第一作者发表论文。',
      problem: '原生 AI 产品的交互范式尚不成熟，需要探索「人 → 模型 → 生成物」的新型反馈回路。',
      process: '以多模态生理信号作为输入，驱动实时视觉生成，沉淀对「原生 AI 产品交互范式」的设计思考。',
      outcome: '形成可演示的沉浸式 AI 交互范式，并以第一作者发表 IEEE VR 2025 论文，体现「AI + 设计」的独立探索。',
    },
    {
      id: 'wechat-status',
      index: '06',
      title: '微信「状态」优化',
      company: '腾讯 WXG',
      wavelength: 'RED',
      nm: 660,
      color: '#ff2d3e',
      colorSecondary: '#ff7a18',
      glow: 'rgba(255, 45, 62, 0.5)',
      character: { drift: 1.0, dispersion: 1.15, bloom: 1.1, rotation: 1.0 },
      discipline: '产品 / 交互原型',
      year: '2024',
      role: '产品经理训练营',
      summary: '微信「状态」功能优化 — 用户研究到原型验证的完整产品设计流程。',
      overview:
        '围绕低频使用与表达场景单一问题开展用户访谈与需求拆解，完成信息架构、交互原型及 PRD，形成「用户研究 — 功能设计 — 原型验证」完整流程。',
      problem: '微信「状态」使用频率低、表达场景单一，缺乏持续使用的动机。',
      process: '通过用户访谈拆解需求，重构信息架构与交互原型，输出可验证的 PRD 与高保真原型。',
      outcome: '形成端到端的产品设计方法论，强化从用户研究到原型验证的闭环能力。',
    },
  ],

  /* ============================ 获奖与学术 ============================ */
  awards: [
    '清华大学梅贻琦奖学金',
    'IEEE VR 2025 第一作者论文 & Gallery 入选',
    'HRI 2025 LBR 论文收录',
    '「学院派奖」全国最高奖',
    'KTK 靳埭强设计奖优秀奖',
    '其他设计竞赛获奖 30+',
  ],

  /* ============================ 论文 / 研究 ============================ */
  papers: [
    {
      title: '《情绪合成器》',
      venue: 'IEEE VR 2025 Gallery',
      role: '第一作者',
      note: '以脑电、面部表情等多模态数据驱动视觉生成的沉浸式展项，入选 Gallery 并发表论文。',
    },
    {
      title: 'HRI 2025 LBR',
      venue: 'ACM/IEEE HRI',
      role: '论文收录',
      note: '人机交互方向 Late-Breaking Report 论文收录。',
    },
  ],

  /* ============================ 联系方式 ============================ */
  contact: {
    email: '1277929459@qq.com',
    phone: '13067018267',
    location: '北京',
  },
}

export default CV
