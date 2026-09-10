const MOODS = [
  ['开心', '😄', '#ffe779'],
  ['平静', '😌', '#b8edcd'],
  ['疲惫', '😴', '#d7c3fa'],
  ['低落', '🥲', '#b7dfff'],
  ['生气', '😤', '#ffaba7'],
  ['焦虑', '😰', '#ffd0b0']
];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const THING_CATEGORIES = [
  ['fun', '🍬', '小乐趣', '#ffe779'],
  ['win', '⭐', '成就感', '#ffd0b0'],
  ['social', '🌼', '和人连接', '#b7dfff'],
  ['move', '🐾', '动一动', '#d7c3fa']
];

const $ = id => document.getElementById(id);
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = key(new Date());
let selected = today;
let week = monday(new Date());
let draft = [];
let data = {};
let smallThingsData = {};
let legacyActivityData = {};
let thingCategory = '';
let thingStorageWarning = '';
let objectUrl;
let backupUrl;

try {
  data = JSON.parse(localStorage.getItem('mood-island-v1') || '{}');
  if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
} catch {
  data = {};
}

try {
  smallThingsData = JSON.parse(localStorage.getItem('mood-island-small-things-v1') || '{}');
  if (!smallThingsData || typeof smallThingsData !== 'object' || Array.isArray(smallThingsData)) smallThingsData = {};
} catch {
  smallThingsData = {};
  thingStorageWarning = '小事记录没有读取成功，请先保留已有备份。';
}

try {
  legacyActivityData = JSON.parse(localStorage.getItem('mood-island-activities-v1') || '{}');
  if (!legacyActivityData || typeof legacyActivityData !== 'object' || Array.isArray(legacyActivityData)) legacyActivityData = {};
} catch {
  legacyActivityData = {};
  thingStorageWarning = '旧活动记录没有读取成功，请先保留已有备份。';
}

function monday(d) {
  const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  n.setDate(n.getDate() - (n.getDay() + 6) % 7);
  return n;
}

function dates() {
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(week);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function record(k) {
  const x = data[k];
  return {
    moods: Array.isArray(x?.moods) ? x.moods.filter(i => Number.isInteger(i) && i >= 0 && i < 6) : [],
    note: typeof x?.note === 'string' ? x.note.slice(0, 160) : ''
  };
}

function isDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}

function sanitizeMoodData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([date, item]) => {
    if (!isDateKey(date) || !item || typeof item !== 'object' || Array.isArray(item)) return [];
    const moods = Array.isArray(item.moods)
      ? [...new Set(item.moods.filter(i => Number.isInteger(i) && i >= 0 && i < MOODS.length))]
      : [];
    const note = typeof item.note === 'string' ? item.note.slice(0, 160) : '';
    return moods.length || note ? [[date, {moods, note}]] : [];
  }));
}

function sanitizeSmallThingsData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const categoryIds = new Set(THING_CATEGORIES.map(category => category[0]));
  return Object.fromEntries(Object.entries(value).flatMap(([date, items]) => {
    if (!isDateKey(date) || !Array.isArray(items)) return [];
    const cleanItems = items.flatMap(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
      const text = typeof item.text === 'string' ? item.text.trim().slice(0, 80) : '';
      if (!text) return [];
      const category = categoryIds.has(item.category) ? item.category : '';
      return [{text, category}];
    }).slice(0, 3);
    return cleanItems.length ? [[date, cleanItems]] : [];
  }));
}

function migrateActivityData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const migrated = {};
  Object.entries(value).forEach(([weekId, rows]) => {
    if (!isDateKey(weekId) || !Array.isArray(rows)) return;
    const [year, month, day] = weekId.split('-').map(Number);
    rows.forEach(row => {
      if (!Array.isArray(row)) return;
      row.slice(0, 7).forEach((cell, col) => {
        const text = typeof cell === 'string' ? cell.trim().slice(0, 80) : '';
        if (!text) return;
        const date = new Date(year, month - 1, day + col);
        const dateKey = key(date);
        migrated[dateKey] ||= [];
        if (migrated[dateKey].length < 3) migrated[dateKey].push({text, category: ''});
      });
    });
  });
  return sanitizeSmallThingsData(migrated);
}

function mergeSmallThings(current, incoming) {
  const merged = sanitizeSmallThingsData(current);
  Object.entries(sanitizeSmallThingsData(incoming)).forEach(([date, items]) => {
    const existing = merged[date] || [];
    const seen = new Set(existing.map(item => `${item.text}\u0000${item.category}`));
    items.forEach(item => {
      const signature = `${item.text}\u0000${item.category}`;
      if (existing.length < 3 && !seen.has(signature)) {
        existing.push(item);
        seen.add(signature);
      }
    });
    if (existing.length) merged[date] = existing;
  });
  return merged;
}

function hasSavedContent(moods, smallThings) {
  return Object.keys(moods).length > 0 || Object.keys(smallThings).length > 0;
}

smallThingsData = sanitizeSmallThingsData(smallThingsData);
try {
  if (!localStorage.getItem('mood-island-activities-migrated-v1')) {
    smallThingsData = mergeSmallThings(smallThingsData, migrateActivityData(legacyActivityData));
    localStorage.setItem('mood-island-small-things-v1', JSON.stringify(smallThingsData));
    localStorage.setItem('mood-island-activities-migrated-v1', '1');
  }
} catch {
  thingStorageWarning = '浏览器未能保存旧记录，请先导出备份。';
}

function render() {
  const ds = dates();
  $('range').textContent = `${ds[0].getMonth() + 1}月${ds[0].getDate()}日 — ${ds[6].getMonth() + 1}月${ds[6].getDate()}日`;
  $('days').replaceChildren();
  let count = 0;

  ds.forEach((d, i) => {
    const k = key(d);
    const r = record(k);
    const thingCount = (smallThingsData[k] || []).length;
    if (r.moods.length || r.note || thingCount) count++;
    const b = document.createElement('button');
    b.className = `day${k === selected ? ' active' : ''}${k === today ? ' today' : ''}`;
    b.setAttribute('aria-label', `${k}，${r.moods.map(j => MOODS[j][0]).join('、') || '未选心情'}${thingCount ? `，${thingCount}条小事` : ''}`);
    b.setAttribute('aria-pressed', String(k === selected));
    b.innerHTML = `<span class="date">${WEEKDAYS[i]}<br>${d.getDate()}</span><span class="face">${r.moods.length ? MOODS[r.moods[0]][1] : '＋'}</span><small>${r.moods.length ? MOODS[r.moods[0]][0] + (r.moods.length > 1 ? ` +${r.moods.length - 1}` : '') : thingCount ? `${thingCount}件小事` : '未记录'}</small>`;
    if (r.moods.length) b.style.background = MOODS[r.moods[0]][2];
    b.onclick = () => select(k);
    $('days').append(b);
  });

  $('summary').textContent = count ? `这周已经收好了 ${count} 天的你。` : '还没记录也没关系，从今天开始。';
}

function select(k) {
  selected = k;
  const r = record(k);
  draft = [...r.moods];
  $('note').value = r.note;
  $('thing-input').value = '';
  thingCategory = '';
  $('selected').textContent = `${Number(k.slice(5, 7))}月${Number(k.slice(8))}日 · 今天的心情`;
  $('status').textContent = '';
  $('thing-status').textContent = '';
  render();
  choices();
  renderSmallThings();
}

function choices() {
  $('moods').replaceChildren();
  MOODS.forEach((m, i) => {
    const b = document.createElement('button');
    b.className = `mood${draft.includes(i) ? ' on' : ''}`;
    b.style.background = m[2];
    b.innerHTML = `<span>${m[1]}</span>${m[0]}`;
    b.setAttribute('aria-pressed', String(draft.includes(i)));
    b.onclick = () => {
      draft = draft.includes(i) ? draft.filter(v => v !== i) : [...draft, i];
      choices();
    };
    $('moods').append(b);
  });
}

function save(k, moods, note) {
  data[k] = {moods: [...moods], note};
  try {
    localStorage.setItem('mood-island-v1', JSON.stringify(data));
    $('status').textContent = '收好啦，今天也有位置 ♥';
  } catch {
    $('status').textContent = '浏览器未能保存；请先导出心情卡。';
  }
  render();
}

function saveSmallThings(message) {
  try {
    localStorage.setItem('mood-island-small-things-v1', JSON.stringify(smallThingsData));
    thingStorageWarning = '';
    $('thing-status').textContent = message;
    return true;
  } catch {
    $('thing-status').textContent = '浏览器未能保存，请检查隐私设置或先导出备份。';
    return false;
  }
}

function renderThingCategories() {
  $('thing-categories').replaceChildren();
  THING_CATEGORIES.forEach(([id, emoji, label, color]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `thing-category${thingCategory === id ? ' on' : ''}`;
    button.style.background = color;
    button.textContent = `${emoji} ${label}`;
    button.setAttribute('aria-pressed', String(thingCategory === id));
    button.disabled = (smallThingsData[selected] || []).length >= 3;
    button.onclick = () => {
      thingCategory = thingCategory === id ? '' : id;
      renderThingCategories();
    };
    $('thing-categories').append(button);
  });
}

function renderSmallThings() {
  const items = smallThingsData[selected] || [];
  $('thing-list').replaceChildren();
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'thing-empty';
    empty.textContent = '今天不记也没关系。';
    $('thing-list').append(empty);
  } else {
    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'thing-item';
      const category = THING_CATEGORIES.find(entry => entry[0] === item.category);
      const text = document.createElement('span');
      text.textContent = `${category ? `${category[1]} ` : ''}${item.text}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'thing-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `删除小事：${item.text}`);
      remove.onclick = () => {
        const previous = smallThingsData[selected];
        const next = items.filter((_, itemIndex) => itemIndex !== index);
        if (next.length) smallThingsData[selected] = next;
        else delete smallThingsData[selected];
        if (!saveSmallThings('已经轻轻拿掉了。')) {
          smallThingsData[selected] = previous;
        }
        render();
        renderSmallThings();
      };
      row.append(text, remove);
      $('thing-list').append(row);
    });
  }
  const full = items.length >= 3;
  $('thing-count').textContent = `${items.length}/3`;
  $('thing-input').disabled = full;
  $('thing-add').disabled = full;
  $('thing-input').placeholder = full ? '今天已经收好三件小事啦' : '写下一件就很好';
  if (thingStorageWarning) $('thing-status').textContent = thingStorageWarning;
  renderThingCategories();
}

$('thing-add').onclick = () => {
  const input = $('thing-input');
  const text = input.value.trim().slice(0, 80);
  const current = smallThingsData[selected] || [];
  if (!text) {
    $('thing-status').textContent = '先写下一件小事，或者今天留空也可以。';
    input.focus();
    return;
  }
  if (current.length >= 3) {
    $('thing-status').textContent = '今天三件就够啦。';
    return;
  }
  const next = [...current, {text, category: thingCategory}];
  smallThingsData[selected] = next;
  if (!saveSmallThings('这件小事也收好啦 ✓')) {
    if (current.length) smallThingsData[selected] = current;
    else delete smallThingsData[selected];
    return;
  }
  input.value = '';
  thingCategory = '';
  render();
  renderSmallThings();
};

$('thing-input').onkeydown = event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    $('thing-add').click();
  }
};

$('save').onclick = () => save(selected, draft, $('note').value.trim());

function changeWeek(n) {
  week.setDate(week.getDate() + n * 7);
  select(key(week));
}

$('prev').onclick = () => changeWeek(-1);
$('next').onclick = () => changeWeek(1);
$('thisweek').onclick = () => {
  week = monday(new Date());
  select(today);
};

$('share').onclick = async () => {
  const url = location.origin + location.pathname;
  try {
    if (navigator.share) {
      await navigator.share({title: '心情小岛', text: '来放一只今天的心情小团子 😺', url});
    } else {
      await navigator.clipboard.writeText(url);
      $('share').textContent = '链接复制好了 ✓';
    }
  } catch (error) {
    if (error.name !== 'AbortError') $('status').textContent = '可以复制浏览器地址，把小岛分享出去。';
  }
};

$('download').onclick = async () => {
  const b = $('download');
  b.disabled = true;
  b.textContent = '正在装好小情绪…';
  try {
    const c = document.createElement('canvas');
    c.width = 1000;
    c.height = $('include').checked ? 1450 : 990;
    const x = c.getContext('2d');
    x.fillStyle = '#ff9abe';
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#fff9e9';
    x.beginPath();
    x.roundRect(35, 35, 930, c.height - 70, 32);
    x.fill();
    x.strokeStyle = '#42213e';
    x.lineWidth = 4;
    x.stroke();
    x.fillStyle = '#42213e';
    x.font = 'bold 26px sans-serif';
    x.fillText('MOOD ISLAND · 我的心情小岛', 75, 100);
    x.font = 'bold 54px sans-serif';
    x.fillText('每一种心情，都有位置。', 75, 185);
    x.font = '26px sans-serif';
    x.fillText($('range').textContent, 75, 237);
    const img = new Image();
    img.src = 'moods.png';
    await img.decode();
    x.drawImage(img, 70, 260, 860, 287);
    dates().forEach((d, i) => {
      const r = record(key(d));
      const cx = 110 + i * 130;
      x.fillStyle = r.moods.length ? MOODS[r.moods[0]][2] : '#eee5ea';
      x.beginPath();
      x.roundRect(cx - 49, 570, 100, 175, 30);
      x.fill();
      x.stroke();
      x.fillStyle = '#42213e';
      x.textAlign = 'center';
      x.font = '23px sans-serif';
      x.fillText(['一', '二', '三', '四', '五', '六', '日'][i], cx, 610);
      x.font = '42px sans-serif';
      x.fillText(r.moods.length ? MOODS[r.moods[0]][1] : '·', cx, 670);
      x.font = '19px sans-serif';
      x.fillText(r.moods.length ? MOODS[r.moods[0]][0] + (r.moods.length > 1 ? ` +${r.moods.length - 1}` : '') : '未记录', cx, 718);
    });
    x.textAlign = 'left';
    let y = 810;
    if ($('include').checked) {
      x.font = '22px sans-serif';
      dates().forEach(d => {
        const r = record(key(d));
        const text = `${d.getMonth() + 1}/${d.getDate()}  ${r.moods.map(i => MOODS[i][0]).join('、')}${r.note ? ` · ${r.note}` : ''}`;
        const chars = [...text];
        let line = '';
        let lines = 0;
        for (let i = 0; i < chars.length; i++) {
          line += chars[i];
          if (x.measureText(line).width > 790) {
            x.fillText(line + (lines === 1 && i < chars.length - 1 ? '…' : ''), 80, y);
            y += 29;
            line = '';
            if (++lines === 2) break;
          }
        }
        if (line) {
          x.fillText(line, 80, y);
          y += 29;
        }
        y += 13;
      });
    }
    x.font = '24px sans-serif';
    x.fillText('一周七天，不必每天晴天。', 75, c.height - 105);
    x.font = '18px sans-serif';
    x.fillText('mood island  /  made with a little kindness', 75, c.height - 68);
    const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Image export failed');
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    $('cardimage').src = objectUrl;
    $('cardlink').href = objectUrl;
    $('carddialog').showModal();
  } catch {
    $('status').textContent = '图片没生成成功，请再试一次。';
  } finally {
    b.disabled = false;
    b.textContent = '生成心情卡 ↓';
  }
};

$('backup-export').onclick = () => {
  const button = $('backup-export');
  button.disabled = true;
  $('backup-status').textContent = '正在把记录装进小行李…';
  try {
    const backup = {
      format: 'mood-island-backup',
      version: 2,
      exportedAt: new Date().toISOString(),
      moodData: sanitizeMoodData(data),
      smallThingsData: sanitizeSmallThingsData(smallThingsData)
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
    if (backupUrl) URL.revokeObjectURL(backupUrl);
    backupUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = backupUrl;
    link.download = `心情小岛备份-${today}.json`;
    link.click();
    $('backup-status').textContent = hasSavedContent(backup.moodData, backup.smallThingsData)
      ? '备份已经下载好啦，请把它放在不会弄丢的地方。'
      : '空白备份已经下载；现在还没有记录。';
  } catch {
    $('backup-status').textContent = '备份没有导出成功，请再试一次。';
  } finally {
    button.disabled = false;
  }
};

$('backup-import').onclick = () => $('backup-file').click();

$('backup-file').onchange = async event => {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  const importButton = $('backup-import');
  importButton.disabled = true;
  $('backup-status').textContent = '正在打开备份…';
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('too-large');
    const backup = JSON.parse(await file.text());
    if (backup?.format !== 'mood-island-backup' || ![1, 2].includes(backup.version)) throw new Error('invalid');
    const importedMoods = sanitizeMoodData(backup.moodData);
    const importedSmallThings = mergeSmallThings(
      sanitizeSmallThingsData(backup.smallThingsData),
      migrateActivityData(backup.activityData)
    );
    if (!hasSavedContent(importedMoods, importedSmallThings)) {
      $('backup-status').textContent = '这个备份里还没有心情或小事记录。';
      return;
    }
    if (hasSavedContent(sanitizeMoodData(data), sanitizeSmallThingsData(smallThingsData))) {
      const confirmed = confirm('要把这份备份放回来吗？它会和当前记录合并；遇到同一天时，以备份里的内容为准。');
      if (!confirmed) {
        $('backup-status').textContent = '没有导入，当前记录保持不变。';
        return;
      }
    }
    const nextData = {...sanitizeMoodData(data), ...importedMoods};
    const nextSmallThingsData = {...sanitizeSmallThingsData(smallThingsData), ...importedSmallThings};
    const previousMoods = localStorage.getItem('mood-island-v1');
    const previousSmallThings = localStorage.getItem('mood-island-small-things-v1');
    try {
      localStorage.setItem('mood-island-v1', JSON.stringify(nextData));
      localStorage.setItem('mood-island-small-things-v1', JSON.stringify(nextSmallThingsData));
    } catch (error) {
      if (previousMoods === null) localStorage.removeItem('mood-island-v1');
      else localStorage.setItem('mood-island-v1', previousMoods);
      if (previousSmallThings === null) localStorage.removeItem('mood-island-small-things-v1');
      else localStorage.setItem('mood-island-small-things-v1', previousSmallThings);
      throw error;
    }
    data = nextData;
    smallThingsData = nextSmallThingsData;
    select(selected);
    $('backup-status').textContent = '记录都放回来啦 ✓';
  } catch (error) {
    $('backup-status').textContent = error.message === 'too-large'
      ? '这个文件太大了，不像心情小岛的备份。'
      : '没有认出这个备份，请选择心情小岛导出的 JSON 文件。';
  } finally {
    input.value = '';
    importButton.disabled = false;
  }
};

$('close').onclick = () => $('carddialog').close();
select(today);
