"""
应届生求职网 校招岗位采集器
--------------------------
数据源: yingjiesheng.com 校招全职板块
URL: https://www.yingjiesheng.com/commend-fulltime-1.html
"""

import re
import sys
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup

try:
    from ..config import (
        company_priority,
        is_priority_company,
        matches_role,
        is_target_city,
    )
except ImportError:
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from config import (
        company_priority,
        is_priority_company,
        matches_role,
        is_target_city,
    )

BASE_URL = "https://www.yingjiesheng.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

# 应届生求职网的城市分类
CITY_PATTERNS = [
    "北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京",
    "西安", "苏州", "重庆", "长沙", "天津", "郑州", "合肥", "厦门",
    "青岛", "济南", "大连", "福州", "全国",
]


def extract_city_and_title(text: str) -> tuple[str, str]:
    """从应届生网的标题格式中提取城市和岗位"""
    # 常见格式: "[北京] 腾讯 - 产品经理"
    # 或者: "【北京】腾讯 产品经理 校招"
    city = ""
    title = text.strip()

    for c in CITY_PATTERNS:
        for fmt in [f"[{c}]", f"【{c}】", f"({c})", f"（{c}）"]:
            if fmt in title:
                city = c
                title = title.replace(fmt, "").strip()
                break
        if city:
            break

    return city, title


def collect_yingjiesheng() -> list[dict]:
    """
    从应届生求职网采集校招全职岗位。
    抓取首页推荐列表，解析岗位信息。
    """
    jobs = []
    seen = set()

    for page in range(1, 4):  # 抓取前 3 页
        try:
            url = f"{BASE_URL}/commend-fulltime-{page}.html"
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.encoding = "gbk"  # 应届生网使用 GBK 编码
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "lxml")

            # 岗位列表通常在 ul 或 div 中
            items = soup.select("ul.info-list li, div.job-item, ul.jobList li")
            if not items:
                # 尝试更通用的选择器
                items = soup.find_all("li")

            for item in items:
                link = item.find("a", href=True)
                if not link:
                    continue

                href = link.get("href", "")
                raw_title = link.get_text(strip=True)

                # 跳过无关内容
                if len(raw_title) < 4 or "更多" in raw_title or "下一页" in raw_title:
                    continue

                # 检查是否与校招/产品/设计相关
                if not matches_role(raw_title):
                    continue

                city, title = extract_city_and_title(raw_title)
                company = ""
                if " - " in title:
                    parts = title.split(" - ", 1)
                    company = parts[0].strip()
                    title = parts[1].strip()
                elif " " in title:
                    # 尝试从标题中提取公司名
                    parts = title.split(None, 1)
                    if len(parts) > 1:
                        company = parts[0].strip()
                        title = parts[1].strip()

                # 非北京岗位跳过（聚焦 base 北京）
                if city and not is_target_city(city):
                    continue

                url_full = href if href.startswith("http") else f"{BASE_URL}{href}"
                dedupe = f"{company}|{title}"
                if dedupe in seen:
                    continue
                seen.add(dedupe)

                job = {
                    "id": f"yjs-{hash(url_full) & 0x7FFFFFFF:08x}",
                    "company": company,
                    "title": title[:80],
                    "city": city or "北京",
                    "batch": "2027 秋招" if "实习" not in title else "2027 实习",
                    "url": url_full,
                    "publishedAt": datetime.now(timezone.utc).isoformat(),
                    "deadline": "",
                    "source": "应届生求职网",
                    "verification": "待核验",
                }
                job["target"] = is_priority_company(company)
                job["priorityKind"] = company_priority(company) or ""
                jobs.append(job)

        except requests.RequestException as exc:
            print(f"  [WARN] 应届生求职网第 {page} 页请求失败: {exc}")
            continue

    return jobs


if __name__ == "__main__":
    result = collect_yingjiesheng()
    print(f"采集到 {len(result)} 条岗位")
    for j in result[:5]:
        print(f"  {j['company']} - {j['title'][:40]} [{j['city']}]")
