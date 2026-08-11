const JOBS_KEY = 'zhangrui-job-workbench-v1';
const VERSIONS_KEY = 'zhangrui-resume-versions-v1';
const MASTER_KEY = 'zhangrui-resume-master-v1';
const FEISHU_KEY = 'zhangrui-feishu-settings-v1';
const WORKSPACE_KEY = 'zhangrui-career-workspace-v1';
const JOB_STATUSES = ['待投递', '已投递', '笔试', '面试', 'OC', '挂掉'];

const dom = {
  tabs: [...document.querySelectorAll('[data-workspace-target]')],
  workbench: document.querySelector('#workbenchWorkspace'),
  resume: document.querySelector('#resumeWorkspace'),
  addJob: document.querySelector('#addJobButton'),
  jobDialog: document.querySelector('#jobDialog'),
  jobForm: document.querySelector('#jobForm'),
  deleteJob: document.querySelector('#deleteJobButton'),
  sendJobToFeishu: document.querySelector('#sendJobToFeishuButton'),
  importJobs: document.querySelector('#importJobsButton'),
  importInput: document.querySelector('#jobsImportInput'),
  exportJobs: document.querySelector('#exportJobsButton'),
  jobTable: document.querySelector('#jobTableBody'),
  jobCount: document.querySelector('#jobTableCount'),
  search: document.querySelector('#jobSearch'),
  cityFilter: document.querySelector('#cityFilter'),
  batchFilter: document.querySelector('#batchFilter'),
  statusFilter: document.querySelector('#statusFilter'),
  resetFilters: document.querySelector('#resetFiltersButton'),
  todayJobs: document.querySelector('#todayJobs'),
  deadlineJobs: document.querySelector('#deadlineJobs'),
  pipeline: document.querySelector('#pipelineChart'),
  targets: document.querySelector('#targetCompanies'),
  targetCount: document.querySelector('#targetCount'),
  feishuDialog: document.querySelector('#feishuDialog'),
  feishuForm: document.querySelector('#feishuForm'),
  feishuSettings: document.querySelector('#feishuSettingsButton'),
  sendBriefing: document.querySelector('#sendBriefingButton'),
  testFeishu: document.querySelector('#testFeishuButton'),
  collectorInfo: document.querySelector('#collectorInfoButton'),
  collectorDialog: document.querySelector('#collectorDialog'),
  versionDialog: document.querySelector('#versionDialog'),
  versionForm: document.querySelector('#versionForm'),
  saveVersion: document.querySelector('#saveVersionButton'),
  updateMaster: document.querySelector('#updateMasterButton'),
  restoreMaster: document.querySelector('#restoreMasterButton'),
  versionList: document.querySelector('#resumeVersionList'),
  masterUpdatedAt: document.querySelector('#masterUpdatedAt'),
};

let jobs = readJSON(JOBS_KEY, []);
let versions = readJSON(VERSIONS_KEY, []);
let activeResumeJob = null;
let workbenchToastTimer;

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function notify(message, duration = 2200) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(workbenchToastTimer);
  workbenchToastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeExternalURL(value = '') {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function localInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('zh-CN', withTime
    ? {month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}
    : {year: 'numeric', month: '2-digit', day: '2-digit'});
}

function daysUntil(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.ceil((time - Date.now()) / 86400000);
}

function isNewJob(job) {
  const value = job.publishedAt || job.createdAt;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time <= Date.now() && Date.now() - time <= 86400000;
}

function dedupeKey(job) {
  return [job.company, job.title, job.city, job.batch]
    .map((value) => String(value || '').trim().toLowerCase().replaceAll(/\s+/g, ''))
    .join('|');
}

function normalizeJob(raw = {}) {
  return {
    id: raw.id || uid('job'),
    company: String(raw.company || '').trim(),
    title: String(raw.title || '').trim(),
    city: String(raw.city || '').trim(),
    batch: String(raw.batch || '').trim(),
    url: String(raw.url || '').trim(),
    publishedAt: raw.publishedAt || '',
    deadline: raw.deadline || '',
    source: String(raw.source || '手动录入').trim(),
    verification: raw.verification === '已核验' ? '已核验' : '待核验',
    status: JOB_STATUSES.includes(raw.status) ? raw.status : '待投递',
    notes: String(raw.notes || '').trim(),
    target: Boolean(raw.target),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function selectWorkspace(name, persist = true) {
  const isResume = name === 'resume';
  dom.workbench.classList.toggle('is-hidden', isResume);
  dom.resume.classList.toggle('is-hidden', !isResume);
  dom.tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.workspaceTarget === name));
  if (persist) localStorage.setItem(WORKSPACE_KEY, name);
  if (isResume) {
    setTimeout(() => window.resumeAPI?.updateOverflow(), 60);
    renderVersions();
  }
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function emptyState(title, detail) {
  return `<div class="empty-state"><i>＋</i><strong>${escapeHTML(title)}</strong><span>${escapeHTML(detail)}</span></div>`;
}

function refreshSelectOptions() {
  const currentCity = dom.cityFilter.value;
  const currentBatch = dom.batchFilter.value;
  const cities = [...new Set(jobs.map((job) => job.city).filter(Boolean))].sort();
  const batches = [...new Set(jobs.map((job) => job.batch).filter(Boolean))].sort();
  dom.cityFilter.innerHTML = '<option value="">全部城市</option>' + cities.map((city) => `<option>${escapeHTML(city)}</option>`).join('');
  dom.batchFilter.innerHTML = '<option value="">全部批次</option>' + batches.map((batch) => `<option>${escapeHTML(batch)}</option>`).join('');
  dom.cityFilter.value = cities.includes(currentCity) ? currentCity : '';
  dom.batchFilter.value = batches.includes(currentBatch) ? currentBatch : '';
}

function filteredJobs() {
  const query = dom.search.value.trim().toLowerCase();
  return jobs.filter((job) => {
    const matchesQuery = !query || `${job.company} ${job.title}`.toLowerCase().includes(query);
    return matchesQuery
      && (!dom.cityFilter.value || job.city === dom.cityFilter.value)
      && (!dom.batchFilter.value || job.batch === dom.batchFilter.value)
      && (!dom.statusFilter.value || job.status === dom.statusFilter.value);
  });
}

function countdownLabel(job) {
  const days = daysUntil(job.deadline);
  if (days === null) return '<span>未公布</span>';
  if (days < 0) return '<span class="countdown">已截止</span>';
  if (days === 0) return '<span class="countdown">今天截止</span>';
  return `<span class="countdown ${days > 7 ? 'safe' : ''}">${days} 天</span>`;
}

function renderMetrics() {
  const newCount = jobs.filter(isNewJob).length;
  const applied = jobs.filter((job) => job.status !== '待投递').length;
  const interviews = jobs.filter((job) => ['面试', 'OC'].includes(job.status)).length;
  const urgent = jobs.filter((job) => {
    const days = daysUntil(job.deadline);
    return job.status === '待投递' && days !== null && days >= 0 && days <= 7;
  }).length;
  document.querySelector('#metricNew').textContent = newCount;
  document.querySelector('#metricApplied').textContent = applied;
  document.querySelector('#metricInterview').textContent = `${applied ? Math.round(interviews / applied * 100) : 0}%`;
  document.querySelector('#metricUrgent').textContent = urgent;
}

function renderToday() {
  const recent = jobs.filter(isNewJob).sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)).slice(0, 5);
  if (!recent.length) {
    dom.todayJobs.innerHTML = emptyState('暂时没有新增岗位', '录入或导入岗位后，过去 24 小时发布的岗位会显示在这里。');
    return;
  }
  dom.todayJobs.innerHTML = recent.map((job) => `
    <article class="today-item" data-open-job="${job.id}">
      <span class="company-avatar">${escapeHTML(job.company.slice(0, 1) || '岗')}</span>
      <div><b>${escapeHTML(job.company)} · ${escapeHTML(job.title)}</b><small>${escapeHTML(job.city)} · ${escapeHTML(job.batch)}</small></div>
      <span>${formatDate(job.publishedAt || job.createdAt, true)}</span>
    </article>`).join('');
}

function renderDeadlines() {
  const pending = jobs
    .filter((job) => job.status === '待投递' && daysUntil(job.deadline) !== null && daysUntil(job.deadline) >= 0)
    .sort((a, b) => Number(b.target) - Number(a.target) || new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);
  if (!pending.length) {
    dom.deadlineJobs.innerHTML = emptyState('没有临近截止的待投岗位', '带截止时间的待投递岗位会自动按紧急程度排序。');
    return;
  }
  dom.deadlineJobs.innerHTML = pending.map((job) => `
    <article class="deadline-item" data-open-job="${job.id}">
      <div><b>${job.target ? '★ ' : ''}${escapeHTML(job.company)} · ${escapeHTML(job.title)}</b><small>${escapeHTML(job.city)} · 截止 ${formatDate(job.deadline)}</small></div>
      ${countdownLabel(job)}
    </article>`).join('');
}

function renderPipeline() {
  const maximum = Math.max(1, ...JOB_STATUSES.map((status) => jobs.filter((job) => job.status === status).length));
  dom.pipeline.innerHTML = JOB_STATUSES.map((status) => {
    const count = jobs.filter((job) => job.status === status).length;
    return `<div class="pipeline-row"><span>${status}</span><span class="pipeline-track"><i style="width:${count / maximum * 100}%"></i></span><b>${count}</b></div>`;
  }).join('');
}

function renderTargets() {
  const companies = [...new Set(jobs.filter((job) => job.target).map((job) => job.company).filter(Boolean))];
  dom.targetCount.textContent = `${companies.length} 家关注`;
  dom.targets.innerHTML = companies.length
    ? companies.map((company) => `<span class="target-chip">★ ${escapeHTML(company)}</span>`).join('')
    : emptyState('目标公司池为空', '点击岗位列表中的星标，把重点公司放进这里。');
}

function renderTable() {
  const list = filteredJobs();
  dom.jobCount.textContent = `显示 ${list.length} / 共 ${jobs.length} 个岗位`;
  if (!list.length) {
    dom.jobTable.innerHTML = '<tr class="table-empty"><td colspan="9">暂无符合条件的岗位。点击右上方“录入岗位”开始建立你的岗位库。</td></tr>';
    return;
  }
  dom.jobTable.innerHTML = list.map((job) => {
    const publicUrl = safeExternalURL(job.url);
    return `
    <tr data-job-id="${job.id}">
      <td><button class="target-toggle ${job.target ? 'is-target' : ''}" data-target-job="${job.id}" type="button" title="${job.target ? '移出' : '加入'}目标公司">★</button></td>
      <td class="job-company"><b>${escapeHTML(job.company)}</b><span>${publicUrl ? `<a class="job-link" href="${escapeHTML(publicUrl)}" target="_blank" rel="noopener">${escapeHTML(job.title)} ↗</a>` : escapeHTML(job.title)}</span><small class="verification ${job.verification === '待核验' ? 'pending' : ''}">${escapeHTML(job.verification)}</small></td>
      <td>${escapeHTML(job.city || '—')}</td>
      <td>${escapeHTML(job.batch || '—')}</td>
      <td>${formatDate(job.publishedAt)}</td>
      <td>${countdownLabel(job)}</td>
      <td>${escapeHTML(job.source || '—')}</td>
      <td><select class="status-select" data-status-job="${job.id}">${JOB_STATUSES.map((status) => `<option ${job.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></td>
      <td><div class="row-buttons"><button class="row-edit" data-resume-job="${job.id}" type="button" title="去定制这份岗位的简历">R</button><button class="row-edit" data-edit-job="${job.id}" type="button" title="编辑岗位">···</button></div></td>
    </tr>`;
  }).join('');
}

function renderAll() {
  refreshSelectOptions();
  renderMetrics();
  renderToday();
  renderDeadlines();
  renderPipeline();
  renderTargets();
  renderTable();
  writeJSON(JOBS_KEY, jobs);
}

function openJobDialog(job = null) {
  dom.jobForm.reset();
  document.querySelector('#jobDialogTitle').textContent = job ? '编辑岗位' : '录入岗位';
  document.querySelector('#jobId').value = job?.id || '';
  document.querySelector('#jobCompany').value = job?.company || '';
  document.querySelector('#jobTitle').value = job?.title || '';
  document.querySelector('#jobCity').value = job?.city || '';
  document.querySelector('#jobBatch').value = job?.batch || '2027 秋招';
  document.querySelector('#jobUrl').value = job?.url || '';
  document.querySelector('#jobPublishedAt').value = localInputValue(job?.publishedAt || new Date());
  document.querySelector('#jobDeadline').value = localInputValue(job?.deadline);
  document.querySelector('#jobSource').value = job?.source || '官网';
  document.querySelector('#jobVerification').value = job?.verification || '已核验';
  document.querySelector('#jobStatus').value = job?.status || '待投递';
  document.querySelector('#jobTarget').checked = Boolean(job?.target);
  document.querySelector('#jobNotes').value = job?.notes || '';
  dom.deleteJob.classList.toggle('is-hidden', !job);
  dom.sendJobToFeishu.classList.toggle('is-hidden', !job);
  dom.jobDialog.showModal();
  setTimeout(() => document.querySelector('#jobCompany').focus(), 20);
}

function jobFromForm() {
  const id = document.querySelector('#jobId').value;
  const existing = jobs.find((job) => job.id === id);
  return normalizeJob({
    ...existing,
    id: id || undefined,
    company: document.querySelector('#jobCompany').value,
    title: document.querySelector('#jobTitle').value,
    city: document.querySelector('#jobCity').value,
    batch: document.querySelector('#jobBatch').value,
    url: document.querySelector('#jobUrl').value,
    publishedAt: document.querySelector('#jobPublishedAt').value,
    deadline: document.querySelector('#jobDeadline').value,
    source: document.querySelector('#jobSource').value,
    verification: document.querySelector('#jobVerification').value,
    status: document.querySelector('#jobStatus').value,
    target: document.querySelector('#jobTarget').checked,
    notes: document.querySelector('#jobNotes').value,
    createdAt: existing?.createdAt,
  });
}

function startResumeForJob(job) {
  activeResumeJob = job;
  selectWorkspace('resume');
  dom.saveVersion.textContent = `＋ 保存为「${job.company}」JD 版本`;
  notify(`已切换到简历编辑台：请按“${job.title}”JD 修改后保存版本`, 3500);
}

function openVersionDialog() {
  dom.versionForm.reset();
  if (activeResumeJob) {
    document.querySelector('#versionName').value = `${activeResumeJob.company} - ${activeResumeJob.title} - V1`;
    document.querySelector('#versionCompany').value = activeResumeJob.company;
    document.querySelector('#versionRole').value = activeResumeJob.title;
  }
  dom.versionDialog.showModal();
  setTimeout(() => document.querySelector('#versionName').focus(), 20);
}

function ensureMaster() {
  if (!window.resumeAPI) return null;
  let master = readJSON(MASTER_KEY, null);
  if (!master?.markup) {
    master = {markup: window.resumeAPI.getMarkup(), updatedAt: new Date().toISOString()};
    writeJSON(MASTER_KEY, master);
  }
  return master;
}

function renderVersions() {
  const master = ensureMaster();
  dom.masterUpdatedAt.textContent = master ? `更新于 ${formatDate(master.updatedAt, true)}` : '尚未创建快照';
  if (!versions.length) {
    dom.versionList.innerHTML = '<div class="version-empty">还没有 JD 定制版本。<br>修改简历后保存一个快照，之后可随时恢复。</div>';
    return;
  }
  dom.versionList.innerHTML = versions.map((version) => `
    <article class="version-item" data-version-id="${version.id}">
      <span>${formatDate(version.createdAt, true)}</span>
      <h3>${escapeHTML(version.name)}</h3>
      <p>${escapeHTML([version.company, version.role].filter(Boolean).join(' · ') || '未指定目标岗位')}</p>
      ${version.jdKeywords ? `<p class="keyword-line"># ${escapeHTML(version.jdKeywords)}</p>` : ''}
      <div class="version-item-actions"><button data-restore-version="${version.id}" type="button">恢复此版本</button><button data-delete-version="${version.id}" type="button">删除</button></div>
    </article>`).join('');
}

function backupBeforeRestore() {
  const markup = window.resumeAPI?.getMarkup();
  if (!markup) return;
  versions.unshift({
    id: uid('version'),
    name: `恢复前自动备份 · ${new Date().toLocaleString('zh-CN', {month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}`,
    company: '',
    role: '',
    jdKeywords: '自动备份',
    createdAt: new Date().toISOString(),
    markup,
  });
  writeJSON(VERSIONS_KEY, versions);
}

function restoreResume(markup, label) {
  if (!markup || !window.resumeAPI) return;
  if (!window.confirm(`确定恢复“${label}”吗？当前简历会先自动备份。`)) return;
  backupBeforeRestore();
  localStorage.setItem(WORKSPACE_KEY, 'resume');
  window.resumeAPI.restoreMarkup(markup);
}

function exportJSON() {
  const blob = new Blob([JSON.stringify({exportedAt: new Date().toISOString(), jobs}, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `张睿-秋招岗位库-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('岗位数据已导出');
}

function getFeishuSettings() {
  return readJSON(FEISHU_KEY, {webhook: '', keywords: '产品经理、AI 产品经理、商业产品经理、策略产品经理'});
}

function openFeishuSettings() {
  const settings = getFeishuSettings();
  document.querySelector('#feishuWebhook').value = settings.webhook || '';
  document.querySelector('#collectorKeywords').value = settings.keywords || '';
  dom.feishuDialog.showModal();
}

function validFeishuWebhook(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'open.feishu.cn' && url.pathname.startsWith('/open-apis/bot/v2/hook/');
  } catch {
    return false;
  }
}

function briefingCard(testOnly = false) {
  if (testOnly) {
    return {msg_type: 'text', content: {text: '✅ 张睿 Career OS 已成功连接飞书机器人。之后可从工作台推送每日秋招简报。'}};
  }
  const recent = jobs.filter(isNewJob);
  const urgent = jobs.filter((job) => {
    const days = daysUntil(job.deadline);
    return job.status === '待投递' && days !== null && days >= 0 && days <= 7;
  }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const priority = jobs.filter((job) => job.status === '待投递').sort((a, b) => Number(b.target) - Number(a.target) || (daysUntil(a.deadline) ?? 999) - (daysUntil(b.deadline) ?? 999)).slice(0, 3);
  const line = (job) => `${safeExternalURL(job.url) ? `[${job.company} · ${job.title}](${safeExternalURL(job.url)})` : `${job.company} · ${job.title}`}｜${job.city}｜${job.batch}`;
  const section = (title, list, empty) => `**${title}**\n${list.length ? list.map((job, index) => `${index + 1}. ${line(job)}`).join('\n') : empty}`;
  const content = [
    section(`今日新增岗位（${recent.length}）`, recent.slice(0, 10), '过去 24 小时暂无新增'),
    section(`7 天内截止预警（${urgent.length}）`, urgent.slice(0, 10), '暂无临近截止岗位'),
    section('当日优先投递建议', priority, '待投递清单为空'),
    `**投递进展**\n累计投递 ${jobs.filter((job) => job.status !== '待投递').length}｜面试中 ${jobs.filter((job) => job.status === '面试').length}｜OC ${jobs.filter((job) => job.status === 'OC').length}`,
  ].join('\n\n---\n\n');
  return {
    msg_type: 'interactive',
    card: {
      config: {wide_screen_mode: true},
      header: {template: 'green', title: {tag: 'plain_text', content: `张睿｜秋招投递每日简报 · ${new Date().toLocaleDateString('zh-CN')}`}},
      elements: [{tag: 'markdown', content}, {tag: 'note', elements: [{tag: 'plain_text', content: '由 Career OS 工作台生成 · 岗位信息请以官网为准'}]}],
    },
  };
}

async function sendToFeishu(testOnly = false) {
  const webhook = document.querySelector('#feishuWebhook').value.trim() || getFeishuSettings().webhook;
  if (!validFeishuWebhook(webhook)) {
    notify('请先填写有效的飞书机器人 Webhook', 3200);
    if (!dom.feishuDialog.open) openFeishuSettings();
    return;
  }
  const button = testOnly ? dom.testFeishu : dom.sendBriefing;
  const original = button.textContent;
  button.disabled = true;
  button.textContent = '正在发送…';
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(briefingCard(testOnly)),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || (result.code !== undefined && result.code !== 0)) throw new Error(result.msg || `HTTP ${response.status}`);
    notify(testOnly ? '飞书测试消息发送成功' : '今日简报已推送到飞书');
  } catch (error) {
    notify(`推送失败：${error.message || '浏览器可能拦截了跨域请求，需要后端代理'}`, 5200);
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
}

async function sendSingleJobToFeishu() {
  const job = jobs.find((item) => item.id === document.querySelector('#jobId').value);
  if (!job) return;
  const webhook = getFeishuSettings().webhook;
  if (!validFeishuWebhook(webhook)) {
    dom.jobDialog.close();
    openFeishuSettings();
    notify('请先配置飞书机器人 Webhook');
    return;
  }
  const publicUrl = safeExternalURL(job.url);
  const content = [
    `**${job.company}｜${job.title}**`,
    `城市：${job.city || '未填写'}　批次：${job.batch || '未填写'}`,
    `发布时间：${formatDate(job.publishedAt)}　截止：${formatDate(job.deadline)}`,
    `来源：${job.source || '未填写'}　核验：${job.verification}`,
    job.notes ? `备注：${job.notes}` : '',
    publicUrl ? `[打开岗位官网 ↗](${publicUrl})` : '',
  ].filter(Boolean).join('\n\n');
  const original = dom.sendJobToFeishu.textContent;
  dom.sendJobToFeishu.disabled = true;
  dom.sendJobToFeishu.textContent = '正在发送…';
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {template: 'blue', title: {tag: 'plain_text', content: '秋招岗位卡片'}},
          elements: [{tag: 'markdown', content}],
        },
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || (result.code !== undefined && result.code !== 0)) throw new Error(result.msg || `HTTP ${response.status}`);
    notify('岗位卡片已推送到飞书');
  } catch (error) {
    notify(`推送失败：${error.message || '需要后端代理'}`, 5000);
  } finally {
    dom.sendJobToFeishu.disabled = false;
    dom.sendJobToFeishu.textContent = original;
  }
}

dom.tabs.forEach((tab) => tab.addEventListener('click', () => selectWorkspace(tab.dataset.workspaceTarget)));
dom.addJob.addEventListener('click', () => openJobDialog());
dom.jobForm.addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  const candidate = jobFromForm();
  const duplicate = jobs.find((job) => job.id !== candidate.id && dedupeKey(job) === dedupeKey(candidate));
  if (duplicate) {
    notify('该公司、岗位、城市和批次已存在，已阻止重复录入', 3500);
    return;
  }
  const index = jobs.findIndex((job) => job.id === candidate.id);
  if (index >= 0) jobs[index] = candidate;
  else jobs.unshift(candidate);
  dom.jobDialog.close();
  renderAll();
  notify(index >= 0 ? '岗位信息已更新' : '岗位已加入总库');
});

dom.deleteJob.addEventListener('click', () => {
  const id = document.querySelector('#jobId').value;
  const job = jobs.find((item) => item.id === id);
  if (!job || !window.confirm(`确定删除“${job.company} · ${job.title}”吗？`)) return;
  jobs = jobs.filter((item) => item.id !== id);
  dom.jobDialog.close();
  renderAll();
  notify('岗位已删除');
});
dom.sendJobToFeishu.addEventListener('click', sendSingleJobToFeishu);

document.addEventListener('click', (event) => {
  const openId = event.target.closest('[data-open-job]')?.dataset.openJob;
  const editId = event.target.closest('[data-edit-job]')?.dataset.editJob;
  const targetId = event.target.closest('[data-target-job]')?.dataset.targetJob;
  const resumeId = event.target.closest('[data-resume-job]')?.dataset.resumeJob;
  if (openId || editId) openJobDialog(jobs.find((job) => job.id === (openId || editId)));
  if (targetId) {
    const job = jobs.find((item) => item.id === targetId);
    if (job) job.target = !job.target;
    renderAll();
  }
  if (resumeId) {
    const job = jobs.find((item) => item.id === resumeId);
    if (job) startResumeForJob(job);
  }
});

dom.jobTable.addEventListener('change', (event) => {
  const id = event.target.dataset.statusJob;
  if (!id) return;
  const job = jobs.find((item) => item.id === id);
  if (job) job.status = event.target.value;
  renderAll();
  notify('投递进度已更新');
});

[dom.search, dom.cityFilter, dom.batchFilter, dom.statusFilter].forEach((field) => field.addEventListener('input', renderTable));
dom.resetFilters.addEventListener('click', () => {
  dom.search.value = '';
  dom.cityFilter.value = '';
  dom.batchFilter.value = '';
  dom.statusFilter.value = '';
  renderTable();
});

dom.importJobs.addEventListener('click', () => dom.importInput.click());
dom.importInput.addEventListener('change', async () => {
  const [file] = dom.importInput.files;
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const incoming = Array.isArray(data) ? data : data.jobs;
    if (!Array.isArray(incoming)) throw new Error('JSON 中未找到岗位数组');
    const known = new Set(jobs.map(dedupeKey));
    let added = 0;
    incoming.forEach((raw) => {
      const job = normalizeJob(raw);
      if (!job.company || !job.title || !job.city || !job.batch || known.has(dedupeKey(job))) return;
      jobs.push(job);
      known.add(dedupeKey(job));
      added += 1;
    });
    renderAll();
    notify(`导入完成：新增 ${added} 条，跳过 ${incoming.length - added} 条重复或无效数据`, 4200);
  } catch (error) {
    notify(`导入失败：${error.message}`, 4000);
  }
  dom.importInput.value = '';
});
dom.exportJobs.addEventListener('click', exportJSON);

dom.feishuSettings.addEventListener('click', openFeishuSettings);
dom.collectorInfo.addEventListener('click', () => dom.collectorDialog.showModal());
dom.feishuForm.addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  const webhook = document.querySelector('#feishuWebhook').value.trim();
  if (webhook && !validFeishuWebhook(webhook)) {
    notify('Webhook 地址格式不正确');
    return;
  }
  writeJSON(FEISHU_KEY, {webhook, keywords: document.querySelector('#collectorKeywords').value.trim()});
  dom.feishuDialog.close();
  notify('飞书推送设置已保存在当前浏览器');
});
dom.testFeishu.addEventListener('click', () => sendToFeishu(true));
dom.sendBriefing.addEventListener('click', () => sendToFeishu(false));

dom.saveVersion.addEventListener('click', openVersionDialog);
dom.versionForm.addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  const markup = window.resumeAPI?.getMarkup();
  if (!markup) return notify('简历内容读取失败');
  versions.unshift({
    id: uid('version'),
    name: document.querySelector('#versionName').value.trim(),
    company: document.querySelector('#versionCompany').value.trim(),
    role: document.querySelector('#versionRole').value.trim(),
    jdKeywords: document.querySelector('#versionKeywords').value.trim(),
    createdAt: new Date().toISOString(),
    markup,
  });
  writeJSON(VERSIONS_KEY, versions);
  window.resumeAPI.save();
  dom.versionDialog.close();
  renderVersions();
  notify('JD 简历版本已保存');
});

dom.updateMaster.addEventListener('click', () => {
  if (!window.resumeAPI || !window.confirm('确定用当前简历更新标准母版吗？原母版会被覆盖。')) return;
  writeJSON(MASTER_KEY, {markup: window.resumeAPI.getMarkup(), updatedAt: new Date().toISOString()});
  renderVersions();
  notify('标准简历母版已更新');
});
dom.restoreMaster.addEventListener('click', () => {
  const master = ensureMaster();
  if (master) restoreResume(master.markup, '标准简历母版');
});
dom.versionList.addEventListener('click', (event) => {
  const restoreId = event.target.dataset.restoreVersion;
  const deleteId = event.target.dataset.deleteVersion;
  if (restoreId) {
    const version = versions.find((item) => item.id === restoreId);
    if (version) restoreResume(version.markup, version.name);
  }
  if (deleteId) {
    const version = versions.find((item) => item.id === deleteId);
    if (!version || !window.confirm(`确定删除“${version.name}”吗？`)) return;
    versions = versions.filter((item) => item.id !== deleteId);
    writeJSON(VERSIONS_KEY, versions);
    renderVersions();
    notify('历史版本已删除');
  }
});

document.querySelector('#jobStatus').innerHTML = JOB_STATUSES.map((status) => `<option>${status}</option>`).join('');
dom.statusFilter.innerHTML += JOB_STATUSES.map((status) => `<option>${status}</option>`).join('');
const now = new Date();
document.querySelector('#todayLabel').textContent = now.toLocaleDateString('zh-CN', {weekday: 'long'}).toUpperCase();
document.querySelector('#todayDate').textContent = now.toLocaleDateString('zh-CN', {month: '2-digit', day: '2-digit'}).replace('/', ' / ');
jobs = jobs.map(normalizeJob);
renderAll();
renderVersions();
selectWorkspace(localStorage.getItem(WORKSPACE_KEY) === 'resume' ? 'resume' : 'workbench', false);
