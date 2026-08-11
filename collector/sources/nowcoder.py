"""
牛客网 校招岗位采集器
------------------
数据源: nowcoder.com 校招职位页 SSR HTML
方式: 从页面 SSR HTML 中正则提取岗位信息 (不依赖 API)
"""

import re
import sys
import requests
from datetime import datetime, timezone

# 兼容两种运行方式: python collector/main.py 与 python -m collector.main
try:
    from ..config import (
        company_priority,
        is_priority_company,
        matches_role,
        is_target_city,
    )
except ImportError:
    sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent.parent))
    from config import (
        company_priority,
        is_priority_company,
        matches_role,
        is_target_city,
    )

BASE_URL = "https://www.nowcoder.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京",
          "西安", "苏州", "重庆", "长沙", "天津", "郑州", "合肥", "厦门",
          "青岛", "济南", "大连", "福州", "石家庄", "东莞"]


def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(HEADERS)
    try:
        session.get(BASE_URL, timeout=10)
    except requests.RequestException:
        pass
    return session


def extract_jobs_from_html(html: str) -> list[dict]:
    """
    从牛客网 SSR HTML 中提取校招岗位。
    匹配模式：岗位链接 + 公司名 + 薪资 + 城市
    """
    jobs = []
    seen = set()

    # 模式: /jobs/detail/{id}?...  后面跟着的是岗位信息
    # 每个岗位卡片包含: 岗位名(带薪资), 公司名, 城市标签

    # 先找到所有岗位卡片块
    # 牛客网的岗位在 HTML 中以链接形式出现
    job_pattern = re.compile(
        r'/jobs/detail/(\d+)\?[^"]*deliverSource[^"]*',
    )

    # 收集所有岗位链接位置
    links = list(job_pattern.finditer(html))

    for match in links:
        job_id = match.group(1)
        href = match.group(0)
        url = f"https://www.nowcoder.com/jobs/detail/{job_id}"

        if job_id in seen:
            continue
        seen.add(job_id)

        # 从链接附近提取岗位标题 (链接文本或其父级)
        # 通常结构: <a href="/jobs/detail/...">< ... >标题 薪资< ... ></a>
        pos = match.start()

        # 向前查找最近的 <a 标签，获取完整链接文本
        link_start = html.rfind('<a ', max(0, pos - 200), pos)
        if link_start == -1:
            link_start = pos - 100

        link_end = html.find('</a>', pos)
        if link_end == -1:
            link_end = pos + 300

        link_html = html[link_start:link_end]

        # 提取岗位标题 (链接内的纯文本)
        title_match = re.search(r'<a[^>]*>(.*?)</a>', link_html, re.DOTALL)
        title = ""
        if title_match:
            # 去除 HTML 标签
            inner = title_match.group(1)
            inner = re.sub(r'<[^>]+>', ' ', inner)
            inner = re.sub(r'\s+', ' ', inner).strip()
            title = inner

        if not title or len(title) < 4:
            continue

        # 跳过不相关的岗位 (只看产品、设计、AI类)
        if not matches_role(title):
            continue

        # 提取公司名 (链接后面的公司信息区域)
        # 公司名通常在岗位链接后面的 <a href="/enterprise/...">公司名</a>
        company_html = html[pos:pos + 500]
        company_match = re.search(r'/enterprise/\d+[^"]*"[^>]*>([^<]+)</a>', company_html)
        company = company_match.group(1).strip() if company_match else ""

        # 提取城市 (从岗位名或周围标签)
        city = ""
        for c in CITIES:
            if c in title or c in company_html[:300]:
                city = c
                break

        # 非北京岗位跳过（聚焦 base 北京）
        if city and not is_target_city(city):
            continue

        # 提取薪资
        salary_match = re.search(r'(\d+-\d+K[^<]*)', title)
        salary = salary_match.group(1) if salary_match else ""

        # 批次
        batch = "2027 秋招"
        if "实习" in title:
            batch = "2027 实习"
        elif "2026" in title or "26届" in title:
            batch = "2026 春招"

        job = {
            "id": f"nc-job-{job_id}",
            "company": company,
            "title": title[:100],
            "city": city or "北京",
            "batch": batch,
            "url": url,
            "publishedAt": datetime.now(timezone.utc).isoformat(),
            "deadline": "",
            "source": "牛客网·校招职位",
            "verification": "待核验",
            "notes": f"薪资: {salary}" if salary else "",
        }
        job["target"] = is_priority_company(company)
        job["priorityKind"] = company_priority(company) or ""
        jobs.append(job)

    return jobs


def collect_nowcoder() -> list[dict]:
    """
    从牛客网校招职位页采集。
    抓取多页数据。
    """
    session = create_session()
    all_jobs = []
    seen = set()

    # 抓取首页
    for page in range(1, 4):
        try:
            url = f"https://www.nowcoder.com/jobs/school/jobs?page={page}"
            resp = session.get(url, timeout=15, headers={
                **HEADERS,
                "Referer": "https://www.nowcoder.com/jobs/school/jobs",
            })
            resp.raise_for_status()

            page_jobs = extract_jobs_from_html(resp.text)
            for job in page_jobs:
                dedupe = f"{job['company']}|{job['title']}"
                if dedupe not in seen:
                    seen.add(dedupe)
                    all_jobs.append(job)

        except requests.RequestException as exc:
            print(f"  [WARN] 牛客网第 {page} 页请求失败: {exc}")
            continue

    return all_jobs


if __name__ == "__main__":
    result = collect_nowcoder()
    print(f"采集到 {len(result)} 条岗位")
    for j in result[:10]:
        print(f"  {j['company'] or '(未知)'} - {j['title'][:60]} [{j['city']}]")
