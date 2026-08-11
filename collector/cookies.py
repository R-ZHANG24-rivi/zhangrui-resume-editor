"""
Cookie 工具
-----------
从环境变量读取用户提供的登录 Cookie（格式: "k1=v1; k2=v2"），
注入到 Playwright 的浏览器上下文，使采集器以登录态绕过反爬/登录墙。

环境变量名（在 GitHub Actions Secrets 中配置）:
  - BOSS_COOKIES  : Boss 直聘登录态 Cookie
  - YJS_COOKIES   : 应届生求职网登录态 Cookie
若未配置则跳过注入，退化为匿名采集（当前行为）。
"""

import os


def parse_cookie_string(cookie_str: str) -> list[dict]:
    """'a=1; b=2' -> [{'name':'a','value':'1'}, ...]（忽略 Secure/Path 等属性）"""
    out: list[dict] = []
    if not cookie_str:
        return out
    attr_keys = {"secure", "httponly", "path", "expires", "domain", "max-age", "samesite"}
    for part in cookie_str.split(";"):
        part = part.strip()
        if not part or "=" not in part:
            continue
        name, _, value = part.partition("=")
        name, value = name.strip(), value.strip()
        if name.lower() in attr_keys:
            continue
        out.append({"name": name, "value": value})
    return out


def apply_cookies(context, cookie_str: str, host: str) -> int:
    """把 Cookie 注入 Playwright 上下文，返回成功注入的条数（0 表示未配置/失败）"""
    cookies = parse_cookie_string(cookie_str)
    if not cookies:
        return 0
    for c in cookies:
        c["domain"] = host
    try:
        context.add_cookies(cookies)
        return len(cookies)
    except Exception as exc:
        print(f"  [WARN] Cookie 注入失败 (host={host}): {exc}")
        return 0


def boss_cookies_from_env() -> str:
    return os.environ.get("BOSS_COOKIES", "").strip()


def yjs_cookies_from_env() -> str:
    return os.environ.get("YJS_COOKIES", "").strip()
