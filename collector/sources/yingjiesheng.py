"""
应届生求职网 校招岗位采集器
--------------------------
数据源: yingjiesheng.com 校招全职板块
URL: https://www.yingjiesheng.com/commend-fulltime-1.html

注意：该站列表页为 JS 渲染（静态 HTML 无内容），需用 Playwright 渲染后解析。
若 Playwright 不可用则回退到 requests（通常拿不到数据，仅作兜底）。
"""

import re
import sys
from datetime import datetime, timezone

try:
    from ..config import (
        company_priority,
        is_priority_company,
        matches_role,
        is_target_city,
    )
except ImportError:
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

# 应届生求职网的城市标记
CITY_PATTERNS = [
    "北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京",
    "西安", "苏州", "重庆", "长沙", "天津", "郑州", "合肥", "厦门",
    "青岛", "济南", "大连", "福州", "全国",
]


def extract_city_and_title(text: str) -> tuple[str, str]:
    """从应届生网的标题格式中提取城市和岗位"""
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


def _parse_links(soup, jobs, seen):
    """从 BeautifulSoup 中解析岗位链接（供 Playwright / requests 共用）"""
    items = soup.select(
        "ul.info-list li, div.job-item, ul.jobList li, "
        ".jobList a, .info-list a"
    )
    if not items:
        items = soup.find_all("a", href=True)

    for item in items:
        link = item if item.name == "a" else item.find("a", href=True)
        if not link:
            continue

        href = link.get("href", "")
        raw_title = link.get_text(strip=True)
        if (len(raw_title) < 4 or "更多" in raw_title
                or "下一页" in raw_title
                or raw_title in ("首页", "上一页", "尾页")):
            continue

        if not matches_role(raw_title):
            continue

        city, title = extract_city_and_title(raw_title)
        company = ""
        if " - " in title:
            parts = title.split(" - ", 1)
            company = parts[0].strip()
            title = parts[1].strip()
        elif " " in title:
            parts = title.split(None, 1)
            if len(parts) > 1:
                company = parts[0].strip()
                title = parts[1].strip()

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


def _collect_with_playwright() -> list[dict]:
    """用 Playwright 渲染 JS 页面后解析"""
    from playwright.sync_api import sync_playwright

    jobs: list[dict] = []
    seen: set = set()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page()
        page.set_default_timeout(20000)
        for pageno in range(1, 4):
            try:
                page.goto(
                    f"{BASE_URL}/commend-fulltime-{pageno}.html",
                    wait_until="domcontentloaded", timeout=25000,
                )
                # 等待列表渲染（链接出现）
                try:
                    page.wait_for_selector("a[href*='job'] , a[href*='detail'] , .info-list a, ul.jobList a", timeout=15000)
                except Exception:
                    pass
                page.wait_for_timeout(2000)
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(page.content(), "lxml")
                _parse_links(soup, jobs, seen)
            except Exception as exc:
                print(f"  [WARN] 应届生求职网(Playwright) 第 {pageno} 页失败: {exc}")
        browser.close()
    return jobs


def _collect_with_requests() -> list[dict]:
    """兜底：requests 直接抓取（该站多为 JS 渲染，通常拿不到数据）"""
    import requests
    from bs4 import BeautifulSoup

    jobs: list[dict] = []
    seen: set = set()
    for pageno in range(1, 4):
        try:
            resp = requests.get(
                f"{BASE_URL}/commend-fulltime-{pageno}.html",
                headers=HEADERS, timeout=15,
            )
            resp.encoding = "gbk"
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "lxml")
            _parse_links(soup, jobs, seen)
        except Exception as exc:
            print(f"  [WARN] 应届生求职网(requests) 第 {pageno} 页失败: {exc}")
    return jobs


def collect_yingjiesheng() -> list[dict]:
    """从应届生求职网采集校招全职岗位（优先 Playwright 渲染）"""
    try:
        jobs = _collect_with_playwright()
        if jobs:
            return jobs
    except Exception as exc:
        print(f"  [WARN] 应届生求职网 Playwright 渲染失败，回退 requests: {exc}")

    return _collect_with_requests()


if __name__ == "__main__":
    result = collect_yingjiesheng()
    print(f"采集到 {len(result)} 条岗位")
    for j in result[:5]:
        print(f"  {j['company']} - {j['title'][:40]} [{j['city']}]")
