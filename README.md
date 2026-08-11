# 张睿｜Career OS

一个无需后端的个人秋招投递工作台与 A4 简历编辑器。岗位、简历版本和飞书 Webhook 都只保存在当前浏览器的 localStorage 中。

## 秋招投递工作台

- 录入岗位并按公司、岗位、城市、招聘批次自动去重
- **从采集源一键刷新** -- GitHub Actions 每天 08:00 自动采集牛客网、应届生求职网、Boss 直聘的校招岗位
- 今日新增、截止预警、投递进度、目标公司池与数据复盘
- 支持公司/岗位搜索和城市、批次、状态筛选
- 支持 JSON 导入、导出，方便备份和批量同步岗位
- 可配置飞书自定义机器人 Webhook，推送今日新增、截止预警和优先建议

## 简历编辑台

1. 点击简历中的文字直接修改。
2. 悬停模块，使用右上角按钮上移、下移或删除。
3. 点击照片打开裁剪器，可更换图片、拖动构图、缩放并重置裁剪位置。
4. 可更新标准母版，也可为每个公司/JD保存独立版本并随时恢复。
5. 修改内容会自动保存在当前浏览器，也可点击"保存"。
6. 点击"导出 PDF"，在打印窗口中选择"另存为 PDF"；纸张选择 A4、缩放 100%、关闭浏览器页眉页脚。

## 自动采集怎么工作

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  GitHub Actions      │────▶│  collector/main.py   │────▶│  jobs.json (repo)   │
│  每天 08:00 触发     │     │  牛客 + 应届生 + Boss │     │  自动 commit & push  │
└─────────────────────┘     └──────────────────────┘     └──────────┬──────────┘
                                                                     │
                                                          ┌──────────▼──────────┐
                                                          │  前端 "从采集源刷新"  │
                                                          │  fetch raw GitHub URL │
                                                          │  智能合并 + 去重      │
                                                          └──────────────────────┘
```

### 首次使用步骤

1. **导入样本数据**（立即可用）: 工作台 → 导入 JSON → 选择 `jobs-sample.json`（已含 25 个 AI 产品/设计岗位）
2. **或者点"从采集源刷新"** -- 自动从 GitHub 拉取最新的自动采集结果
3. **配置自动采集**（可选）:
   ```bash
   # 本地测试采集器
   pip install -r collector/requirements.txt playwright
   playwright install chromium
   python collector/main.py --output jobs.json
   ```
   推送代码到 GitHub 后，Actions 会每天自动运行。

### 手动运行采集

```bash
# 只采集牛客网
python collector/main.py --source nowcoder --output jobs.json

# 采集所有源
python collector/main.py --output jobs.json

# 输出到终端查看
python collector/main.py --source nowcoder
```

## 飞书推送

1. 在飞书群聊 → 设置 → 群机器人 → 添加自定义机器人
2. 复制 Webhook 地址
3. 在工作台点击"飞书推送设置"粘贴地址
4. 点击"推送今日简报"或使用"每日简报自动推送"

这是纯 HTML、CSS 和 JavaScript 项目，直接打开 `index.html` 或部署到 GitHub Pages 即可。
