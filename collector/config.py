"""
采集配置 —— 张睿的秋招关注重点
================================
- Base 地：北京
- 岗位方向：交互设计 / 视觉设计 / AIGC 设计 / 产品经理 等
- 重点公司：互联网大厂、AI 公司、外企
"""

# ── 目标城市 (base 地) ──────────────────────────────
# 优先北京；其余城市保留但降权
TARGET_CITIES = ["北京"]

# 其他可接受城市（如需扩面可在此追加，例如 "上海"）
SECONDARY_CITIES = []

# ── 岗位关键词（按匹配优先级，越靠前越优先） ──────────
ROLE_KEYWORDS = [
    # 设计类（核心）
    "交互设计", "视觉设计", "AIGC设计", "AIGC", "UI设计", "UX设计",
    "体验设计", "用户研究", "产品设计", "界面设计", "动效设计",
    "视觉", "设计", "设计师",
    # 产品类
    "产品经理", "产品策划", "商业产品经理", "策略产品经理",
    "AI产品经理", "数据产品经理", "产品运营",
]

# ── 重点公司清单（类型 → 公司名/别名） ──────────────
# 命中即标记为「目标公司」(target=true)，并在排序中前置
PRIORITY_COMPANIES = {
    # 互联网大厂
    "腾讯": "互联网大厂", "阿里": "互联网大厂", "阿里巴巴": "互联网大厂",
    "字节": "互联网大厂", "字节跳动": "互联网大厂", "美团": "互联网大厂",
    "百度": "互联网大厂", "京东": "互联网大厂", "拼多多": "互联网大厂",
    "网易": "互联网大厂", "快手": "互联网大厂", "小米": "互联网大厂",
    "滴滴": "互联网大厂", "哔哩哔哩": "互联网大厂", "B站": "互联网大厂",
    "小红书": "互联网大厂", "蚂蚁": "互联网大厂", "携程": "互联网大厂",
    "微博": "互联网大厂", "搜狐": "互联网大厂", "360": "互联网大厂",
    "知乎": "互联网大厂", "唯品会": "互联网大厂", "陌陌": "互联网大厂",
    "得物": "互联网大厂", "SHEIN": "互联网大厂", "蔚来": "互联网大厂",
    "理想": "互联网大厂", "小鹏": "互联网大厂", "滴滴": "互联网大厂",
    # AI 公司
    "商汤": "AI公司", "智谱": "AI公司", "月之暗面": "AI公司",
    "MiniMax": "AI公司", "百川": "AI公司", "零一万物": "AI公司",
    "面壁": "AI公司", "科大讯飞": "AI公司", "阶跃星辰": "AI公司",
    "深言": "AI公司", "稀宇": "AI公司", "Kimi": "AI公司",
    "Moonshot": "AI公司", "通义": "AI公司", "文心": "AI公司",
    "星火": "AI公司", "元宝": "AI公司", "大模型": "AI公司",
    "阶跃": "AI公司", "生数": "AI公司", "无问芯穹": "AI公司",
    "智谱华章": "AI公司", "百川智能": "AI公司", "深智": "AI公司",
    "光年之外": "AI公司", "衔远": "AI公司", "TIAMAT": "AI公司",
    "右脑": "AI公司", "硅基": "AI公司", "澜舟": "AI公司",
    # 外企
    "Apple": "外企", "苹果": "外企", "Google": "外企", "谷歌": "外企",
    "Microsoft": "外企", "微软": "外企", "Meta": "外企",
    "Amazon": "外企", "亚马逊": "外企", "NVIDIA": "外企", "英伟达": "外企",
    "Adobe": "外企", "LinkedIn": "外企", "领英": "外企",
    "SAP": "外企", "Oracle": "外企", "甲骨文": "外企",
    "IBM": "外企", "Intel": "外企", "英特尔": "外企",
    "Cisco": "外企", "思科": "外企", "eBay": "外企",
    "Airbnb": "外企", "Uber": "外企", "Spotify": "外企",
    "PayPal": "外企", "Salesforce": "外企", "Shopee": "外企",
    "Grab": "外企", "Unity": "外企", "Nokia": "外企",
    "Ericsson": "外企", "爱立信": "外企", "Sony": "外企",
    "索尼": "外企", "Samsung": "外企", "三星": "外企",
    "Qualcomm": "外企", "高通": "外企", "Dell": "外企",
    "戴尔": "外企", "VMware": "外企", "Epic": "外企",
    "Databricks": "外企", "Snowflake": "外企", "OpenAI": "外企",
    "Anthropic": "外企", "Stripe": "外企", "Canva": "外企",
}

# 外企常见「北京」相关英文/缩写
FOREIGN_HINTS = ["Beijing", "Peking", "BJ", "China"]


def company_priority(company: str) -> str | None:
    """返回公司类型 (互联网大厂 / AI公司 / 外企 / None)"""
    if not company:
        return None
    lowered = company.lower()
    for name, kind in PRIORITY_COMPANIES.items():
        if name.lower() in lowered:
            return kind
    return None


def is_priority_company(company: str) -> bool:
    return company_priority(company) is not None


def matches_role(title: str) -> bool:
    """岗位标题是否匹配目标角色方向"""
    if not title:
        return False
    return any(kw in title for kw in ROLE_KEYWORDS)


def is_target_city(city: str) -> bool:
    """城市是否命中目标/次目标城市"""
    if not city:
        return False
    return any(c in city for c in (TARGET_CITIES + SECONDARY_CITIES))


def city_priority(city: str) -> int:
    """城市权重：北京最高"""
    if not city:
        return 0
    if any(c in city for c in TARGET_CITIES):
        return 2
    if any(c in city for c in SECONDARY_CITIES):
        return 1
    return 0


def priority_score(job: dict) -> int:
    """
    综合优先级评分（数值越大越优先），用于排序：
    - 北京 +2
    - 重点公司 +3
    - 设计类岗位 +2 / 产品类 +1
    """
    score = 0
    score += city_priority(job.get("city", ""))
    if is_priority_company(job.get("company", "")):
        score += 3
    title = job.get("title", "")
    if any(kw in title for kw in ["交互", "视觉", "AIGC", "UI", "UX", "体验", "设计", "研究"]):
        score += 2
    elif "产品" in title:
        score += 1
    return score
