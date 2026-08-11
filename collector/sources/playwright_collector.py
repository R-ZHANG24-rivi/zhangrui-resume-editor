"""
Playwright 浏览器自动化采集器
------------------------------
用于采集需要浏览器渲染的招聘网站 (牛客网、Boss 直聘等)
支持 GitHub Actions 环境运行
"""

from datetime import datetime, timezone

# 牛客网校招职位页
NOWCODER_JOBS_URL = "https://www.nowcoder.com/jobs/school/jobs"
# Boss 直聘校招搜索
BOSS_URL = "https://www.zhipin.com/web/geek/job"

CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京",
          "西安", "苏州", "重庆", "长沙", "天津", "郑州", "合肥", "厦门",
          "青岛", "济南", "大连", "福州", "石家庄", "东莞"]

RELEVANT_KEYWORDS = ["产品", "设计", "交互", "体验", "UI", "UX", "AI",
                     "运营", "管培", "数据", "Agent", "agent", "用户"]


def _has_playwright():
    try:
        import playwright  # noqa: F401
        return True
    except ImportError:
        return False


def collect_nowcoder_playwright() -> list[dict]:
    """用 Playwright 采集牛客网校招职位"""
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
            page.goto(NOWCODER_JOBS_URL, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)

            # 滚动以触发懒加载
            for _ in range(3):
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1500)

            # 提取岗位卡片
            # 牛客网岗位卡片使用特定结构
            cards = page.query_selector_all(
                ".job-item, .job-card, .position-item, "
                "a[href*='/jobs/detail/'], "
                "[class*='job-card'], [class*='JobCard']"
            )

            for card in cards:
                try:
                    # 提取链接
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

                    # 从 URL 提取 job ID
                    import re
                    id_match = re.search(r'/jobs/detail/(\d+)', href)
                    if not id_match:
                        continue
                    job_id = id_match.group(1)

                    if job_id in seen:
                        continue
                    seen.add(job_id)

                    # 提取岗位标题
                    title_el = card.query_selector(
                        ".job-name, .job-title, .position-name, "
                        "span.title, h3, h4"
                    )
                    title = title_el.inner_text().strip() if title_el else ""

                    if not title or not any(kw in title for kw in RELEVANT_KEYWORDS):
                        continue

                    # 提取公司名
                    company_el = card.query_selector(
                        ".company-name, .corp-name, .enterprise-name, "
                        "a[href*='/enterprise/']"
                    )
                    company = company_el.inner_text().strip() if company_el else ""

                    # 提取城市
                    city = ""
                    city_el = card.query_selector(
                        ".job-area, .location, .city, .work-place"
                    )
                    if city_el:
                        city_text = city_el.inner_text().strip()
                        for c in CITIES:
                            if c in city_text:
                                city = c
                                break

                    # 提取薪资
                    salary = ""
                    salary_el = card.query_selector(".salary, .salary-text")
                    if salary_el:
                        salary = salary_el.inner_text().strip()

                    url_full = f"https://www.nowcoder.com{href}" if href.startswith("/") else href

                    jobs.append({
                        "id": f"nc-pw-{job_id}",
                        "company": company,
                        "title": f"{title} ({salary})" if salary else title,
                        "city": city,
                        "batch": "2027 秋招",
                        "url": url_full,
                        "publishedAt": datetime.now(timezone.utc).isoformat(),
                        "deadline": "",
                        "source": "牛客网·校招职位",
                        "verification": "待核验",
                        "notes": f"薪资: {salary}" if salary else "",
                    })

                except Exception:
                    continue

        except Exception as exc:
            print(f"  [WARN] 牛客网 Playwright 采集失败: {exc}")
        finally:
            browser.close()

    return jobs


def collect_boss_playwright() -> list[dict]:
    """用 Playwright 采集 Boss 直聘校招岗位"""
    if not _has_playwright():
        print("  [SKIP] Playwright 未安装")
        return []

    from playwright.sync_api import sync_playwright

    jobs = []
    seen = set()

    queries = [
        "产品经理 校招",
        "AI产品经理",
        "交互设计 校招",
        "UI设计 校招",
        "用户体验 校招",
    ]

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = context.new_page()

        for query in queries:
            try:
                url = (f"{BOSS_URL}?query={query}"
                       f"&city=100010000&experience=104&page=1")
                page.goto(url, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(3000)

                # 滚动加载更多
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(2000)

                cards = page.query_selector_all(
                    ".job-card-wrapper, .job-card-box li, "
                    "[class*='job-card'], [class*='JobCard']"
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

                        if not any(kw in title for kw in RELEVANT_KEYWORDS):
                            continue

                        city = area.split("·")[0] if area else ""
                        if not city:
                            for c in CITIES:
                                if c in area:
                                    city = c
                                    break

                        href = link_el.get_attribute("href") if link_el else ""
                        if href and not href.startswith("http"):
                            href = f"https://www.zhipin.com{href}"

                        dedupe = f"{company}|{title}"
                        if dedupe in seen:
                            continue
                        seen.add(dedupe)

                        jobs.append({
                            "id": f"boss-pw-{hash(dedupe) & 0x7FFFFFFF:08x}",
                            "company": company,
                            "title": f"{title} ({salary})" if salary else title,
                            "city": city,
                            "batch": "2027 秋招" if "实习" not in title else "2027 实习",
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
