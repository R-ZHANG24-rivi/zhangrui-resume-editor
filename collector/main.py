#!/usr/bin/env python3
"""
Career OS - Multi-source Campus Recruitment Collector
======================================================
从牛客网、应届生求职网、Boss 直聘采集校招岗位，
输出统一 JSON 格式供工作台前端导入。

Usage:
    python collector/main.py                          # 采集所有源，输出到 stdout
    python collector/main.py --output jobs.json       # 采集并保存到文件
    python collector/main.py --source nowcoder        # 只采集牛客网
"""

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from config import priority_score, is_target_city
from sources.nowcoder import collect_nowcoder
from sources.yingjiesheng import collect_yingjiesheng
from sources.boss import collect_boss
from sources.playwright_collector import collect_nowcoder_playwright, collect_boss_playwright

SOURCES = {
    "nowcoder": ("牛客网", collect_nowcoder_playwright),
    "yingjiesheng": ("应届生求职网", collect_yingjiesheng),
    "boss": ("Boss 直聘", collect_boss_playwright),
}


def normalize_job(raw: dict) -> dict:
    """将各源采集的原始数据统一为标准格式 (与前端 workspace.js 的 normalizeJob 对齐)"""
    return {
        "id": raw.get("id", ""),
        "company": (raw.get("company") or "").strip(),
        "title": (raw.get("title") or "").strip(),
        "city": (raw.get("city") or "").strip(),
        "batch": (raw.get("batch") or "2027 秋招").strip(),
        "url": (raw.get("url") or "").strip(),
        "publishedAt": raw.get("publishedAt") or datetime.now(timezone.utc).isoformat(),
        "deadline": raw.get("deadline") or "",
        "source": (raw.get("source") or "").strip(),
        "verification": raw.get("verification") or "待核验",
        "status": "待投递",
        "notes": (raw.get("notes") or "").strip(),
        "target": bool(raw.get("target", False)),
        "priorityKind": raw.get("priorityKind") or "",
        "createdAt": raw.get("createdAt") or datetime.now(timezone.utc).isoformat(),
    }


def run_collector(sources_filter=None, output_path=None, city=None):
    """运行采集流程，返回合并后的岗位列表"""
    all_jobs = []
    selected = sources_filter or list(SOURCES.keys())

    for key in selected:
        if key not in SOURCES:
            print(f"[WARN] 未知采集源: {key}", file=sys.stderr)
            continue

        label, collector = SOURCES[key]
        print(f"[INFO] 正在采集 {label} ...", file=sys.stderr)
        try:
            start = time.time()
            raw_jobs = collector()
            elapsed = time.time() - start
            normalized = [normalize_job(j) for j in raw_jobs if j.get("company") and j.get("title")]
            print(f"[OK]   {label}: 获取 {len(raw_jobs)} 条，有效 {len(normalized)} 条 (耗时 {elapsed:.1f}s)", file=sys.stderr)
            all_jobs.extend(normalized)
        except Exception as exc:
            print(f"[ERR]  {label} 采集失败: {exc}", file=sys.stderr)

    # 去重 (按 company + title + city + batch)
    seen = set()
    deduped = []
    for job in all_jobs:
        key = "|".join(
            (job["company"] + job["title"] + job["city"] + job["batch"])
            .lower()
            .replace(" ", "")
        )
        if key not in seen:
            seen.add(key)
            deduped.append(job)

    # 按城市过滤（如需）
    if city:
        deduped = [j for j in deduped if is_target_city(j["city"]) or city in j["city"]]

    # 合并已有 jobs.json（保留历史岗位，避免某天抓取失败清空数据）
    if output_path and Path(output_path).exists():
        try:
            prev = json.loads(Path(output_path).read_text(encoding="utf-8"))
            prev_jobs = prev.get("jobs", []) if isinstance(prev, dict) else []
            prev_seen = {
                "|".join((j.get("company", "") + j.get("title", "") + j.get("city", "") + j.get("batch", "")).lower().replace(" ", ""))
                for j in prev_jobs
            }
            merged = list(deduped)
            for j in prev_jobs:
                k = "|".join((j.get("company", "") + j.get("title", "") + j.get("city", "") + j.get("batch", "")).lower().replace(" ", ""))
                if k not in prev_seen:
                    merged.append(j)
            deduped = merged
            print(f"[INFO] 合并历史数据后共 {len(deduped)} 个岗位 (新增 {len(deduped) - len(prev_jobs) + len(prev_jobs) - len(set(prev_seen))})", file=sys.stderr)
        except Exception as exc:
            print(f"[WARN] 合并历史数据失败: {exc}", file=sys.stderr)

    # 按优先级排序：北京 + 重点公司 + 设计岗 靠前
    deduped.sort(key=priority_score, reverse=True)

    print(f"[INFO] 去重后共 {len(deduped)} 个岗位", file=sys.stderr)

    result = {
        "exportedAt": datetime.now(timezone.utc).isoformat(),
        "focus": "北京 · 交互/视觉/AIGC/产品设计 · 互联网大厂/AI公司/外企",
        "jobs": deduped,
    }

    json_output = json.dumps(result, ensure_ascii=False, indent=2)

    if output_path:
        Path(output_path).write_text(json_output, encoding="utf-8")
        print(f"[DONE] 已保存到 {output_path}", file=sys.stderr)
    else:
        print(json_output)

    return result


def main():
    parser = argparse.ArgumentParser(description="Career OS Campus Recruitment Collector")
    parser.add_argument("--source", "-s", choices=list(SOURCES.keys()), action="append",
                        help="指定采集源 (可多次使用，不指定则采集全部)")
    parser.add_argument("--output", "-o", help="输出 JSON 文件路径 (默认输出到 stdout)")
    parser.add_argument("--city", "-c", help="按城市过滤 (例如: 北京)")
    args = parser.parse_args()
    run_collector(sources_filter=args.source, output_path=args.output, city=args.city)


if __name__ == "__main__":
    main()
