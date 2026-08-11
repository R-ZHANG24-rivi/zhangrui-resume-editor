"""
Boss 直聘 校招岗位采集器
-----------------------
数据源: zhipin.com 校招职位搜索
方式: Playwright 浏览器自动化 (Boss 直聘反爬严格)
"""

import re
import json
import sys
from datetime import datetime, timezone

BOSS_SEARCH_URL = "https://www.zhipin.com/web/geek/job"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

SEARCH_QUERIES = [
    {"query": "产品经理", "page": 1},
    {"query": "AI产品经理", "page": 1},
    {"query": "UI设计", "page": 1},
    {"query": "交互设计", "page": 1},
    {"query": "用户体验", "page": 1},
]


def _has_playwright() -> bool:
    """检查 Playwright 是否可用"""
    try:
        import playwright  # noqa: F401
        return True
    except ImportError:
        return False


def collect_boss() -> list[dict]:
    """
    从 Boss 直聘采集校招岗位。
    使用 Playwright 绕过反爬机制。
    如果 Playwright 未安装，降级为空列表。
    """
    if not _has_playwright():
        print("  [SKIP] Playwright 未安装，跳过 Boss 直聘采集 "
              "(pip install playwright && playwright install chromium)",
              file=sys.stderr)
        return []

    # 延迟导入，避免未安装时报错
    from playwright.sync_api import sync_playwright

    jobs = []
    seen = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=HEADERS["User-Agent"],
            viewport={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = context.new_page()

        # 设置额外请求头
        page.set_extra_http_headers({
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })

        for sq in SEARCH_QUERIES:
            try:
                # 构造搜索 URL: 校招 + 关键词
                # Boss 直聘的 URL 参数: query=关键词, experience=104(应届生)
                params = {
                    "query": sq["query"],
                    "city": "100010000",  # 全国
                    "experience": "104",  # 应届生
                    "page": str(sq["page"]),
                }
                query_string = "&".join(f"{k}={v}" for k, v in params.items())
                url = f"{BOSS_SEARCH_URL}?{query_string}"

                page.goto(url, wait_until="networkidle", timeout=30000)

                # 等待职位列表加载
                page.wait_for_selector(".job-list-box li, .job-card-wrapper",
                                       timeout=10000)

                # 滚动以触发懒加载
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(2000)

                # 解析职位卡片
                cards = page.query_selector_all(".job-card-wrapper, .job-card-box li")

                for card in cards:
                    try:
                        name_el = card.query_selector(".job-name, .job-title")
                        company_el = card.query_selector(".company-name, .company-text")
                        area_el = card.query_selector(".job-area, .job-location")
                        salary_el = card.query_selector(".salary, .salary-text")
                        link_el = card.query_selector("a.job-card-left, a")

                        if not name_el or not company_el:
                            continue

                        title = name_el.inner_text().strip()
                        company = company_el.inner_text().strip()
                        area = area_el.inner_text().strip() if area_el else ""
                        salary = salary_el.inner_text().strip() if salary_el else ""

                        # 跳过非校招/应届岗位
                        if not any(kw in title for kw in
                                   ["产品", "设计", "运营", "交互", "体验", "UI", "UX",
                                    "校招", "应届", "管培", "AI"]):
                            continue

                        # 提取城市 (Boss 直聘格式: "北京·朝阳区")
                        city = area.split("·")[0] if area else ""

                        href = link_el.get_attribute("href") if link_el else ""
                        if href and not href.startswith("http"):
                            href = f"https://www.zhipin.com{href}"

                        dedupe = f"{company}|{title}"
                        if dedupe in seen:
                            continue
                        seen.add(dedupe)

                        jobs.append({
                            "id": f"boss-{hash(dedupe) & 0x7FFFFFFF:08x}",
                            "company": company,
                            "title": f"{title} ({salary})" if salary else title,
                            "city": city,
                            "batch": "2027 秋招",
                            "url": href,
                            "publishedAt": datetime.now(timezone.utc).isoformat(),
                            "deadline": "",
                            "source": "Boss 直聘",
                            "verification": "待核验",
                            "notes": f"薪资: {salary}" if salary else "",
                        })
                    except Exception:
                        continue

            except Exception as exc:
                print(f"  [WARN] Boss 直聘 '{sq['query']}' 采集失败: {exc}")
                continue

        browser.close()

    return jobs


if __name__ == "__main__":
    result = collect_boss()
    print(f"采集到 {len(result)} 条岗位")
    for j in result[:5]:
        print(f"  {j['company']} - {j['title'][:40]} [{j['city']}]")
