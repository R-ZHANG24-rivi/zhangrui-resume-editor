const STORAGE_KEY = 'zhangrui-resume-editor-v1';

const page = document.querySelector('#resumePage');
const defaultMarkup = page.innerHTML;
const savedMarkup = localStorage.getItem(STORAGE_KEY);
if (savedMarkup) page.innerHTML = savedMarkup;

const editToggle = document.querySelector('#editToggle');
const saveButton = document.querySelector('#saveButton');
const resetButton = document.querySelector('#resetButton');
const exportButton = document.querySelector('#exportButton');
const addSectionButton = document.querySelector('#addSectionButton');
const moduleDialog = document.querySelector('#moduleDialog');
const moduleForm = document.querySelector('#moduleForm');
const moduleTitle = document.querySelector('#moduleTitle');
const moduleColumn = document.querySelector('#moduleColumn');
const profilePhoto = document.querySelector('#profilePhoto');
const photoButton = document.querySelector('#photoButton');
const photoInput = document.querySelector('#photoInput');
const photoDialog = document.querySelector('#photoDialog');
const cropStage = document.querySelector('#cropStage');
const cropImage = document.querySelector('#cropImage');
const photoZoom = document.querySelector('#photoZoom');
const zoomValue = document.querySelector('#zoomValue');
const choosePhotoButton = document.querySelector('#choosePhotoButton');
const resetCropButton = document.querySelector('#resetCropButton');
const applyCropButton = document.querySelector('#applyCropButton');
const pageStatus = document.querySelector('#pageStatus');
const saveState = document.querySelector('#saveState');
const toast = document.querySelector('#toast');

let editing = true;
let saveTimer;
let toastTimer;
let suppressUnloadSave = false;
let cropState = {
  source: '',
  naturalWidth: 0,
  naturalHeight: 0,
  baseScale: 1,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  pointerX: 0,
  pointerY: 0,
  startX: 0,
  startY: 0,
  dragging: false,
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function cleanMarkup() {
  const clone = page.cloneNode(true);
  clone.querySelectorAll('.module-actions').forEach((node) => node.remove());
  return clone.innerHTML;
}

function saveResume(silent = false) {
  localStorage.setItem(STORAGE_KEY, cleanMarkup());
  saveState.textContent = `已保存 · ${new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}`;
  if (!silent) showToast('已保存在当前浏览器');
}

function queueSave() {
  saveState.textContent = '正在保存修改…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveResume(true), 450);
}

function setEditing(nextState) {
  editing = nextState;
  document.body.classList.toggle('is-editing', editing);
  document.body.classList.toggle('not-editing', !editing);
  page.querySelectorAll('.editable').forEach((node) => {
    node.contentEditable = editing ? 'true' : 'false';
  });
  editToggle.textContent = editing ? '完成编辑' : '继续编辑';
  editToggle.setAttribute('aria-pressed', String(editing));
}

function moduleControls() {
  const controls = document.createElement('div');
  controls.className = 'module-actions';
  controls.contentEditable = 'false';
  controls.innerHTML = `
    <button type="button" data-action="up" title="上移模块" aria-label="上移模块">↑</button>
    <button type="button" data-action="down" title="下移模块" aria-label="下移模块">↓</button>
    <button type="button" data-action="delete" title="删除模块" aria-label="删除模块">×</button>
  `;
  return controls;
}

function hydrateModules() {
  page.querySelectorAll('.module-actions').forEach((node) => node.remove());
  page.querySelectorAll('.resume-section').forEach((section) => {
    section.prepend(moduleControls());
  });
}

function updateOverflowStatus() {
  requestAnimationFrame(() => {
    const overflow = page.scrollHeight > page.clientHeight + 2;
    pageStatus.classList.toggle('overflow', overflow);
    pageStatus.innerHTML = overflow ? '<i></i>内容超出 A4' : '<i></i>A4 单页';
  });
}

function addModule(title, columnName) {
  const target = page.querySelector(`[data-column="${columnName}"]`);
  const section = document.createElement('section');
  section.className = 'resume-section';
  section.dataset.moduleId = `custom-${Date.now()}`;
  section.innerHTML = `
    <h2 class="section-title editable" contenteditable="true"></h2>
    <article class="entry">
      <div class="entry-heading">
        <h3 class="editable" contenteditable="true">条目标题</h3>
        <time class="editable" contenteditable="true">时间</time>
      </div>
      <p class="entry-role editable" contenteditable="true">角色 / 说明</p>
      <p class="entry-copy editable" contenteditable="true">点击此处填写内容。可直接换行、粘贴文本或删除本段。</p>
    </article>
  `;
  section.querySelector('.section-title').textContent = title;
  section.prepend(moduleControls());
  target.append(section);
  setEditing(true);
  queueSave();
  updateOverflowStatus();
  section.scrollIntoView({behavior: 'smooth', block: 'center'});
  showToast('模块已添加');
}

function handleModuleAction(button) {
  const section = button.closest('.resume-section');
  const action = button.dataset.action;
  if (action === 'up' && section.previousElementSibling?.classList.contains('resume-section')) {
    section.parentElement.insertBefore(section, section.previousElementSibling);
  }
  if (action === 'down' && section.nextElementSibling) {
    section.parentElement.insertBefore(section.nextElementSibling, section);
  }
  if (action === 'delete') {
    const title = section.querySelector('.section-title')?.textContent.trim() || '此模块';
    if (!window.confirm(`确定删除“${title}”吗？`)) return;
    section.remove();
  }
  queueSave();
  updateOverflowStatus();
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function cropLimits() {
  const width = cropState.naturalWidth * cropState.baseScale * cropState.zoom;
  const height = cropState.naturalHeight * cropState.baseScale * cropState.zoom;
  return {
    x: Math.max(0, (width - cropStage.clientWidth) / 2),
    y: Math.max(0, (height - cropStage.clientHeight) / 2),
    width,
    height,
  };
}

function clampCrop() {
  const limits = cropLimits();
  cropState.offsetX = Math.max(-limits.x, Math.min(limits.x, cropState.offsetX));
  cropState.offsetY = Math.max(-limits.y, Math.min(limits.y, cropState.offsetY));
  return limits;
}

function renderCrop() {
  if (!cropState.naturalWidth) return;
  const limits = clampCrop();
  cropImage.style.width = `${limits.width}px`;
  cropImage.style.height = `${limits.height}px`;
  cropImage.style.transform = `translate(-50%, -50%) translate(${cropState.offsetX}px, ${cropState.offsetY}px)`;
  zoomValue.value = `${Math.round(cropState.zoom * 100)}%`;
}

function resetCrop() {
  if (!cropState.naturalWidth) return;
  cropState.baseScale = Math.max(
    cropStage.clientWidth / cropState.naturalWidth,
    cropStage.clientHeight / cropState.naturalHeight,
  );
  cropState.zoom = 1;
  cropState.offsetX = 0;
  cropState.offsetY = 0;
  photoZoom.value = '1';
  renderCrop();
}

function loadCropSource(source) {
  cropState.source = source;
  cropImage.onload = () => {
    cropState.naturalWidth = cropImage.naturalWidth;
    cropState.naturalHeight = cropImage.naturalHeight;
    resetCrop();
  };
  cropImage.src = source;
}

function openPhotoEditor(source = profilePhoto.src) {
  if (!photoDialog.open) photoDialog.showModal();
  loadCropSource(source);
}

function applyCrop() {
  const outputWidth = 810;
  const outputHeight = 1020;
  const scale = outputWidth / cropStage.clientWidth;
  const limits = clampCrop();
  const left = cropStage.clientWidth / 2 - limits.width / 2 + cropState.offsetX;
  const top = cropStage.clientHeight / 2 - limits.height / 2 + cropState.offsetY;
  const output = document.createElement('canvas');
  output.width = outputWidth;
  output.height = outputHeight;
  const context = output.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(cropImage, left * scale, top * scale, limits.width * scale, limits.height * scale);
  profilePhoto.src = output.toDataURL('image/jpeg', .92);
  photoDialog.close();
  saveResume(true);
  showToast('照片构图已应用并保存');
}

page.addEventListener('input', () => {
  queueSave();
  updateOverflowStatus();
});

page.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) handleModuleAction(actionButton);
});

editToggle.addEventListener('click', () => setEditing(!editing));
saveButton.addEventListener('click', () => saveResume());

addSectionButton.addEventListener('click', () => {
  moduleForm.reset();
  moduleTitle.value = '新增模块';
  moduleDialog.showModal();
  setTimeout(() => moduleTitle.select(), 30);
});

moduleForm.addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  addModule(moduleTitle.value.trim() || '新增模块', moduleColumn.value);
  moduleDialog.close();
});

photoButton.addEventListener('click', () => {
  if (editing) openPhotoEditor();
});

photoInput.addEventListener('change', async () => {
  const [file] = photoInput.files;
  if (!file) return;
  try {
    openPhotoEditor(await readPhoto(file));
  } catch {
    showToast('照片读取失败，请更换文件');
  }
  photoInput.value = '';
});

choosePhotoButton.addEventListener('click', () => photoInput.click());
resetCropButton.addEventListener('click', resetCrop);
applyCropButton.addEventListener('click', applyCrop);

photoZoom.addEventListener('input', () => {
  cropState.zoom = Number(photoZoom.value);
  renderCrop();
});

cropStage.addEventListener('pointerdown', (event) => {
  cropState.dragging = true;
  cropState.pointerX = event.clientX;
  cropState.pointerY = event.clientY;
  cropState.startX = cropState.offsetX;
  cropState.startY = cropState.offsetY;
  cropStage.setPointerCapture(event.pointerId);
});

cropStage.addEventListener('pointermove', (event) => {
  if (!cropState.dragging) return;
  cropState.offsetX = cropState.startX + event.clientX - cropState.pointerX;
  cropState.offsetY = cropState.startY + event.clientY - cropState.pointerY;
  renderCrop();
});

function stopCropDrag(event) {
  cropState.dragging = false;
  if (cropStage.hasPointerCapture(event.pointerId)) cropStage.releasePointerCapture(event.pointerId);
}

cropStage.addEventListener('pointerup', stopCropDrag);
cropStage.addEventListener('pointercancel', stopCropDrag);

cropStage.addEventListener('keydown', (event) => {
  const movement = event.shiftKey ? 10 : 2;
  const directions = {
    ArrowLeft: [-movement, 0],
    ArrowRight: [movement, 0],
    ArrowUp: [0, -movement],
    ArrowDown: [0, movement],
  };
  if (!directions[event.key]) return;
  event.preventDefault();
  cropState.offsetX += directions[event.key][0];
  cropState.offsetY += directions[event.key][1];
  renderCrop();
});

resetButton.addEventListener('click', () => {
  if (!window.confirm('确定恢复初始简历吗？当前浏览器中的修改将被覆盖。')) return;
  suppressUnloadSave = true;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

exportButton.addEventListener('click', () => {
  saveResume(true);
  setEditing(false);
  showToast('请在打印窗口选择“另存为 PDF”');
  setTimeout(() => window.print(), 180);
});

window.addEventListener('afterprint', () => setEditing(true));
window.addEventListener('resize', updateOverflowStatus);
window.addEventListener('beforeunload', () => {
  if (!suppressUnloadSave) saveResume(true);
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    saveResume();
  }
});

if (savedMarkup) {
  saveState.textContent = '已载入本机保存的版本';
}

hydrateModules();
setEditing(true);
updateOverflowStatus();

window.resumeAPI = {
  getMarkup: cleanMarkup,
  getDefaultMarkup: () => defaultMarkup,
  save: () => saveResume(true),
  updateOverflow: updateOverflowStatus,
  restoreMarkup(markup) {
    if (!markup) return;
    suppressUnloadSave = true;
    localStorage.setItem(STORAGE_KEY, markup);
    location.reload();
  },
};
