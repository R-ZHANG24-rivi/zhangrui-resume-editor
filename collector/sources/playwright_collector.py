"""
Playwright 浏览器自动化采集器
------------------------------
用于采集需要浏览器渲染的招聘网站 (牛客网、Boss 直聘等)
聚焦：北京 base + 交互/视觉/AIGC/产品设计岗位 + 重点公司

支持 GitHub Actions 环境运行
"""

from datetime import datetime, timezone

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

# 牛客网校招职位页
NOWCODER_JOBS_URL = "https://www.nowcoder.com/jobs/school/jobs"
# Boss 直聘校招搜索
BOSS_URL = "https://www.zhipin.com/web/geek/job"

# 城市全量表（用于从文本中识别城市）
CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京",
          "西安", "苏州", "重庆", "长沙", "天津", "郑州", "合肥", "厦门",
          "青岛", "济南", "大连", "福州", "石家庄", "东莞"]

# Boss 直聘搜索词：围绕北京 + 设计/产品方向
BOSS_QUERIES = [
    "交互设计师 北京",
    "视觉设计师 北京",
    "AIGC设计师 北京",
    "UI设计师 北京",
    "用户体验设计师 北京",
    "产品经理 北京",
    "AI产品经理 北京",
]


def _has_playwright():
    try:
        import playwright  # noqa: F401
        return True
    except ImportError:
        return False


def _extract_city(text: str) -> str:
    """从文本中识别城市"""
    for c in CITIES:
        if c in text:
            return c
    return ""


def collect_nowcoder_playwright() -> list[dict]:
    """用 Playwright 采集牛客网校招职位（北京 + 设计/产品方向）"""
    if not _has_playwright():
        print("  [SKIP] Playwright 未安装")
        return []

    from playwright.sync_api import sync_playwright

    jobs = []
    seen = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = context.new_page()

        try:
            page.goto(NOWCODER_JOBS_URL, wait_until="domcontentloaded", timeout=45000)
            # 等待岗位卡片出现（最多 15s）
            try:
                page.wait_for_selector("a[href*='/jobs/detail/']", timeout=15000)
            except Exception:
                pass
            page.wait_for_timeout(2500)

            for _ in range(3):
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1800)

            cards = page.query_selector_all(
                ".job-item, .job-card, .position-item, "
                "a[href*='/jobs/detail/'], "
                "[class*='job-card'], [class*='JobCard'], "
                "[class*='job-list'], [class*='recruit'], [class*='post']"
            )

            for card in cards:
                try:
                    link = card.query_selector("a[href*='/jobs/detail/']")
                    if not link:
                        href_attr = card.get_attribute("href")
                        if href_attr and "/jobs/detail/" in href_attr:
                            href = href_attr
                        else:
                            continue
                    else:
                        href = link.get_attribute("href")

                    if not href or "/jobs/detail/" not in href:
                        continue

                    import re
                    id_match = re.search(r'/jobs/detail/(\d+)', href)
                    if not id_match:
                        continue
                    job_id = id_match.group(1)

                    if job_id in seen:
                        continue
                    seen.add(job_id)

                    title_el = card.query_selector(
                        ".job-name, .job-title, .position-name, "
                        "span.title, h3, h4"
                    )
                    title = title_el.inner_text().strip() if title_el else ""

                    if not title or not matches_role(title):
                        continue

                    company_el = card.query_selector(
                        ".company-name, .corp-name, .enterprise-name, "
                        "a[href*='/enterprise/']"
                    )
                    company = company_el.inner_text().strip() if company_el else ""

                    city = ""
                    city_el = card.query_selector(
                        ".job-area, .location, .city, .work-place"
                    )
                    if city_el:
                        city = _extract_city(city_el.inner_text().strip())

                    salary = ""
                    salary_el = card.query_selector(".salary, .salary-text")
                    if salary_el:
                        salary = salary_el.inner_text().strip()

                    # 非北京岗位跳过（聚焦 base 北京）
                    if city and not is_target_city(city):
                        continue

                    url_full = f"https://www.nowcoder.com{href}" if href.startswith("/") else href

                    job = {
                        "id": f"nc-pw-{job_id}",
                        "company": company,
                        "title": f"{title} ({salary})" if salary else title,
                        "city": city or "北京",
                        "batch": "2027 秋招",
                        "url": url_full,
                        "publishedAt": datetime.now(timezone.utc).isoformat(),
                        "deadline": "",
                        "source": "牛客网·校招职位",
                        "verification": "待核验",
                        "notes": f"薪资: {salary}" if salary else "",
                    }
                    job["target"] = is_priority_company(company)
                    job["priorityKind"] = company_priority(company) or ""
                    jobs.append(job)

                except Exception:
                    continue

        except Exception as exc:
            print(f"  [WARN] 牛客网 Playwright 采集失败: {exc}")
        finally:
            browser.close()

    return jobs


def collect_boss_playwright() -> list[dict]:
    """用 Playwright 采集 Boss 直聘校招岗位（北京 + 设计/产品方向）"""
    if not _has_playwright():
        print("  [SKIP] Playwright 未安装")
        return []

    from playwright.sync_api import sync_playwright

    jobs = []
    seen = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = context.new_page()

        for query in BOSS_QUERIES:
            try:
                url = (f"{BOSS_URL}?query={query}"
                       f"&city=101010100&page=1")  # 101010100 = 北京
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(5000)

                # 检测反爬验证页 / 登录拦截
                page_text = page.evaluate("document.body ? document.body.innerText : ''")
                if "安全验证" in page_text or "验证码" in page_text or "访问过于频繁" in page_text:
                    print(f"  [WARN] Boss 直聘 '{query}' 触发反爬验证，跳过")
                    continue
                if "login" in page.url.lower() or "请登录" in page_text or "登录后" in page_text:
                    print(f"  [WARN] Boss 直聘 '{query}' 需要登录，跳过")
                    continue

                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(2500)

                cards = page.query_selector_all(
                    ".job-card-wrapper, .job-card-box li, "
                    "[class*='job-card'], [class*='JobCard'], "
                    "[class*='job-list'], [class*='recruit'], "
                    "li[class*='job'], div[class*='job-item']"
                )

                for card in cards:
                    try:
                        title_el = card.query_selector(
                            ".job-name, .job-title, span[class*='name']"
                        )
                        company_el = card.query_selector(
                            ".company-name, .company-text, h3[class*='name']"
                        )
                        area_el = card.query_selector(
                            ".job-area, .job-location, span[class*='area']"
                        )
                        salary_el = card.query_selector(
                            ".salary, span[class*='salary']"
                        )
                        link_el = card.query_selector("a")

                        if not title_el or not company_el:
                            continue

                        title = title_el.inner_text().strip()
                        company = company_el.inner_text().strip()
                        area = area_el.inner_text().strip() if area_el else ""
                        salary = salary_el.inner_text().strip() if salary_el else ""

                        if not matches_role(title):
                            continue

                        city = area.split("·")[0] if area else ""
                        if not city:
                            city = _extract_city(area)

                        # 非北京跳过
                        if city and not is_target_city(city):
                            continue

                        href = link_el.get_attribute("href") if link_el else ""
                        if href and not href.startswith("http"):
                            href = f"https://www.zhipin.com{href}"

                        dedupe = f"{company}|{title}"
                        if dedupe in seen:
                            continue
                        seen.add(dedupe)

                        job = {
                            "id": f"boss-pw-{hash(dedupe) & 0x7FFFFFFF:08x}",
                            "company": company,
                            "title": f"{title} ({salary})" if salary else title,
                            "city": city or "北京",
                            "batch": "2027 秋招" if "实习" not in title else "2027 实习",
                            "url": href,
                            "publishedAt": datetime.now(timezone.utc).isoformat(),
                            "deadline": "",
                            "source": "Boss 直聘",
                            "verification": "待核验",
                            "notes": f"薪资: {salary}" if salary else "",
                        }
                        job["target"] = is_priority_company(company)
                        job["priorityKind"] = company_priority(company) or ""
                        jobs.append(job)

                    except Exception:
                        continue

            except Exception as exc:
                print(f"  [WARN] Boss 直聘 '{query}' 采集失败: {exc}")

        browser.close()

    return jobs


if __name__ == "__main__":
    print("Testing nowcoder...")
    nc_jobs = collect_nowcoder_playwright()
    print(f"nowcoder: {len(nc_jobs)} jobs")
    for j in nc_jobs[:3]:
        print(f"  {j['company']} - {j['title'][:50]} [{j['city']}]")

    print("\nTesting boss...")
    boss_jobs = collect_boss_playwright()
    print(f"boss: {len(boss_jobs)} jobs")
    for j in boss_jobs[:3]:
        print(f"  {j['company']} - {j['title'][:50]} [{j['city']}]")
