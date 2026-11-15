const $ = id => document.getElementById(id);
const money = (n, d) => fmt(n, d);
const num = v => {
  v = String(v).replace(/,/g, '').trim();
  return v !== '' && /^\d*\.?\d+$/.test(v) ? parseFloat(v) : NaN;
};

let cur = 'USD', sc = 1, cc = 'US';
const SC = {
  NGN:500, INR:80, JPY:150, KRW:1300, VND:25000, IDR:15000, PKR:280, BDT:110,
  KES:130, UGX:3700, TZS:2500, HUF:350, CLP:900, COP:4000, ARS:1000, LKR:300,
  MMK:2000, IQD:1300, KHR:4000, RWF:1300, ETB:120, EGP:48, PHP:56, THB:35,
  TWD:30, RUB:90, UAH:40, CZK:23, XOF:600, XAF:600, KZT:450, UZS:12000,
  AOA:900, MZN:64, NPR:130, DZD:135
};

function fmt(n, d) {
  const o = { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol' };
  if (d === 0) o.minimumFractionDigits = o.maximumFractionDigits = 0;
  try { return new Intl.NumberFormat(undefined, o).format(n); }
  catch (e) { return cur + ' ' + n.toFixed(2); }
}

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

/* ===== Theme ===== */
const root = document.documentElement;
let th = 'light';
try {
  th = localStorage.getItem('bb-t') ||
       (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
} catch (e) {}

function setT(t, save) {
  th = t;
  t === 'dark' ? root.dataset.t = 'dark' : root.removeAttribute('data-t');
  const nextMode = t === 'dark' ? 'light' : 'dark';
  $('theme').querySelector('.theme-icon').textContent = t === 'dark' ? '☼' : '☾';
  $('theme').querySelector('.theme-label').textContent = `${nextMode[0].toUpperCase()}${nextMode.slice(1)} mode`;
  $('theme').setAttribute('aria-label', `Switch to ${nextMode} mode`);
  $('theme').setAttribute('title', `Switch to ${nextMode} mode`);
  $('theme').setAttribute('aria-pressed', t === 'dark');
  if (save) try { localStorage.setItem('bb-t', t); } catch (e) {}
}
setT(th);
$('theme').onclick = () => setT(th === 'dark' ? 'light' : 'dark', 1);

/* ===== Rotating hero lesson ===== */
const heroLessons = [
  'Master your money, one small decision at a time.',
  'A budget gives every amount a job before you spend it.',
  'Small savings become powerful when you repeat them every month.',
  'Needs come first, wants come next, and goals keep you moving.',
  'Knowing where your money goes is the first step to keeping more of it.'
];
let heroLesson = 0;
setInterval(() => {
  const heading = $('heroHeading');
  heroLesson = (heroLesson + 1) % heroLessons.length;
  heading.classList.remove('heroSwap');
  void heading.offsetWidth;
  heading.textContent = heroLessons[heroLesson];
  heading.classList.add('heroSwap');
}, 6000);

/* ===== Visitors + clock + tips ===== */
(() => {
  let v = 12458;
  try {
    v = +localStorage.getItem('bb-v') || v;
    if (!sessionStorage.getItem('bb-s')) {
      v++;
      sessionStorage.setItem('bb-s', 1);
      localStorage.setItem('bb-v', v);
    }
  } catch (e) {}
  $('vis').textContent = v.toLocaleString();
})();

const tick = () => $('clock').textContent = new Date().toLocaleString([], {
  dateStyle: 'medium', timeStyle: 'medium'
});
tick();
setInterval(tick, 1000);

const tips = [
  'Pay yourself first – even small savings add up.',
  'Did you know? The 50-30-20 rule balances needs, wants and savings.',
  'Wait 24 hours before any non-essential purchase above your usual small-spend amount.',
  'Track every expense for one week to spot leaks.',
  'Cancel subscriptions you haven\'t used in a month.',
  'Irregular income? Budget on your lowest month and save the extras.'
];
let ti = 0;
const st = () => $('tip').textContent = tips[ti++ % tips.length];
st();
setInterval(st, 5000);

addEventListener('scroll', () => {
  $('top').style.display = scrollY > 500 ? 'block' : 'none';
  document.querySelectorAll('header nav a').forEach(a => {
    const s = document.querySelector(a.hash);
    a.classList.toggle('on', s && s.getBoundingClientRect().top < 120 && s.getBoundingClientRect().bottom > 120);
  });
});
$('top').onclick = () => scrollTo({ top: 0 });

/* ===== Hero donut ===== */
const donut = (p = [50, 30, 20]) =>
  `conic-gradient(var(--pri) 0 ${p[0]}%,var(--acc) ${p[0]}% ${p[0]+p[1]}%,#7cc47f ${p[0]+p[1]}% 100%)`;
const donutLabels = () => `<div class="donut-labels" aria-hidden="true"><span class="donut-label donut-label-needs">50%</span><span class="donut-label donut-label-wants">30%</span><span class="donut-label donut-label-savings">20%</span></div>`;

const hs = () => {
  const v = +$('hs').value;
  $('hd').style.background = donut();
  $('hv').textContent = money(v, 0);
  $('hs').textContent = money(v, 0);
  $('hs').setAttribute('aria-valuetext', `${money(v, 0)} weekly income`);
  $('hn').textContent = `Needs ${money(v * .5, 0)} · Wants ${money(v * .3, 0)} · Savings ${money(v * .2, 0)}`;
};
$('hs').oninput = hs;
hs();

/* ===== Basics cards + sample table ===== */
function drawSamples() {
  const S = [
    ['💵', 'Income', 'Money earned or received.', 1200],
    ['🏠', 'Fixed expenses', 'Same cost each month.', 450],
    ['🛒', 'Variable expenses', 'Cost changes with use or choice.', 250],
    ['✅', 'Needs', 'Essentials for basic living.', 400],
    ['🎮', 'Wants', 'Nice-to-haves that add enjoyment.', 150],
    ['🐷', 'Savings', 'Set aside for goals and emergencies.', 150]
  ];
  $('cards').innerHTML = S.map(c =>
    `<div class="card"><div style="font-size:1.8rem">${c[0]}</div><h3>${c[1]}</h3><p class="mut">${c[2]}</p><p><b>e.g. ${money(c[3]*sc,0)}/mo</b></p></div>`
  ).join('');
  $('bt').innerHTML = S.map(r =>
    `<tr><td>${r[1]}</td><td class="n">${money(r[3]*sc)}</td><td class="n">${(r[3]/12).toFixed(1)}%</td></tr>`
  ).join('');
}

/* ===== Knowledge quiz ===== */
const kq = [
  ['Which is a fixed expense?', ['Groceries', 'Rent', 'Dining out', 'Games'], 1, 'Rent stays the same every month.'],
  ['What does "savings" mean?', ['Money spent on wants', 'Money set aside for later', 'Money you owe', 'Monthly bills'], 1, 'Savings are set aside for future goals or emergencies.'],
  ['Which best describes a want?', ['Bus fare to school', 'Textbooks', 'Streaming subscription', 'Electricity'], 2, 'Streaming is enjoyable but not essential.']
];
let ki = 0;

function kshow() {
  const q = kq[ki];
  $('kq').textContent = `(${ki + 1} of ${kq.length})`;
  $('kt').textContent = q[0];
  $('kf').textContent = '';
  $('kn').hidden = true;
  $('ko').innerHTML = '';
  q[1].forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = o;
    b.onclick = () => {
      if (i === q[2]) {
        b.classList.add('right');
        $('kf').innerHTML = '✅ <b>Correct!</b> ' + q[3];
        $('kn').hidden = false;
        $('kn').textContent = ki < kq.length - 1 ? 'Next question' : 'Restart quiz';
      } else {
        b.classList.add('wrong');
        $('kf').textContent = '❌ Not quite – try another answer.';
      }
    };
    $('ko').append(b);
  });
}
$('kn').onclick = () => { ki = (ki + 1) % kq.length; kshow(); };
kshow();

/* ===== Needs vs Wants ===== */
const nw = [
  ['Groceries', 'need', 'Food is essential for health.'],
  ['Rent / hostel', 'need', 'Housing is a basic requirement.'],
  ['Bus pass', 'need', 'Transport gets you to class or work.'],
  ['Textbooks', 'need', 'Study materials support your education.'],
  ['Electricity & data for study', 'need', 'Utilities are required for daily life.'],
  ['Movie tickets', 'want', 'Fun, but not required to live.'],
  ['New sneakers (still have a pair)', 'want', 'Fashion is optional when you have working shoes.'],
  ['Streaming plan', 'want', 'Entertainment can wait.'],
  ['Coffee shop drink', 'want', 'A treat – small amounts add up.'],
  ['Phone case', 'want', 'Nice, but optional.'],
  ['Online course for exams', 'need', 'Directly supports your education.']
];
let sel = null;

nw.forEach((x, i) => {
  const b = document.createElement('button');
  b.textContent = x[0];
  b.setAttribute('aria-pressed', 'false');
  b.onclick = () => {
    sel = i;
    document.querySelectorAll('#pool button').forEach(y => y.setAttribute('aria-pressed', y === b));
    $('nf').textContent = `Selected: ${x[0]}. Need or want?`;
  };
  b.id = 'nw' + i;
  $('pool').append(b);
});

document.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
  if (sel === null) { $('nf').textContent = 'Pick an item first.'; return; }
  const x = nw[sel], ok = x[1] === b.dataset.a;
  $('nf').innerHTML = (ok ? '✅ <b>Correct.</b> ' : '❌ <b>Not quite.</b> ') +
    `${esc(x[0])} is a <b>${x[1]}</b>. ${x[2]}`;
  if (ok) {
    const c = document.createElement('span');
    c.className = 'chip ok';
    c.textContent = x[0];
    $(x[1] === 'need' ? 'cn' : 'wantsList').append(c);
    $('nw' + sel).remove();
    sel = null;
  }
});

/* ===== 50-30-20 Calculator ===== */
$('calc').onclick = () => {
  const v = num($('inc').value);
  const e = $('ie');
  $('inc').classList.remove('bad');
  if (isNaN(v) || v <= 0) {
    e.textContent = $('inc').value.trim() === '' ? 'Please enter your monthly income.' : 'Please enter a valid amount greater than 0.';
    $('inc').classList.add('bad');
    return;
  }
  e.textContent = '';
  const r = [
    ['Needs', 50, v * .5, 'var(--pri)'],
    ['Wants', 30, v * .3, 'var(--acc)'],
    ['Savings', 20, v * .2, '#7cc47f']
  ];
  $('res').innerHTML =
    `<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <div class="donut" style="width:130px;height:130px;background:${donut()}" data-c="100%" role="img" aria-label="Donut: 50% needs, 30% wants, 20% savings">${donutLabels()}</div>
      <div style="flex:1;min-width:180px">` +
    r.map(x => `<p><b>${x[1]}% ${x[0]}</b> – ${money(x[2])}</p><div class="bar2"><i style="width:${x[1]}%;background:${x[3]}"></i></div>`).join('') +
    `</div></div><p class="mut">Formula: income × 0.50, 0.30, 0.20. Total ${money(v)}.</p>`;
};
$('inc').addEventListener('keydown', e => e.key === 'Enter' && $('calc').click());

/* ===== Savings Goals ===== */
$('gb').onclick = () => {
  const f = [
    ['gn', v => v.trim() ? '' : 'Goal name is required.'],
    ['gt', v => { const n = num(v); return isNaN(n) || n <= 0 ? 'Enter a target greater than 0.' : ''; }],
    ['gc', v => { const n = num(v); return isNaN(n) || n < 0 ? 'Enter 0 or a positive number.' : ''; }],
    ['gm', v => { const n = num(v); return isNaN(n) || n <= 0 ? 'Enter a monthly amount greater than 0.' : ''; }]
  ];
  let ok = true;
  f.forEach((x, i) => {
    const m = x[1]($(x[0]).value);
    $('e' + (i + 1)).textContent = m;
    $(x[0]).classList.toggle('bad', !!m);
    if (m) ok = false;
  });
  if (!ok) return;

  const t = num($('gt').value), c = num($('gc').value), m = num($('gm').value);
  const reached = c >= t;
  const rem = Math.max(0, t - c), mo = reached ? 0 : Math.ceil(rem / m), p = Math.min(100, Math.round(c / t * 100));
  const y = Math.floor(mo / 12), r = mo % 12;

  $('gr').innerHTML = `
    <h3>${esc($('gn').value.trim())}</h3>
    <div class="note">${reached ? '✅ Target reached. Your locked savings are ready for this goal.' : '🔒 Locked savings: every contribution stays reserved until this target is met.'}</div>
    <div class="grid">
      <div><p class="mut">Still needed</p><b style="font-size:1.4rem">${money(rem)}</b></div>
      <div><p class="mut">${reached ? 'Status' : 'Estimated time'}</p><b style="font-size:1.4rem">${reached ? 'Unlocked' : mo + ' months'}</b>
        <p class="mut">${y ? y + ' yr ' : ''}${r ? r + ' mo' : ''}</p>
      </div>
    </div>
    <p class="mut" style="margin-top:10px">Progress: ${p}%</p>
    <div class="bar2" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
      <i style="width:${p}%"></i>
    </div>
    <p class="mut" style="margin-top:10px">
      If your income varies: at half the amount (${money(m / 2)}) it takes ${Math.ceil(rem / (m / 2))} months;
      at 1.5× it takes ${Math.ceil(rem / (m * 1.5))}.
    </p>
    <div class="note">💡 Small, steady deposits beat big, rare ones. Lock ${money(m)} on payday and keep it reserved for ${esc($('gn').value.trim())}.</div>`;
};

/* ===== Saved savings goals ===== */
const goalStorageKey = 'bb-goals';
const goalToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const goalDate = value => new Date(`${value}T00:00:00`);
const daysBetween = (from, to) => Math.max(0, Math.ceil((goalDate(to) - goalDate(from)) / 86400000));
const goalDateLabel = value => goalDate(value).toLocaleDateString(undefined, { dateStyle: 'medium' });
const loadGoals = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(goalStorageKey));
    return Array.isArray(saved) ? saved : [];
  } catch (e) { return []; }
};
const saveGoals = () => { try { localStorage.setItem(goalStorageKey, JSON.stringify(savingsGoals)); } catch (e) {} };
let savingsGoals = loadGoals();

function goalStatus(goal) {
  if (goal.status === 'archived') return 'archived';
  if (goal.status === 'paused') return 'paused';
  if (goal.current >= goal.target) return 'completed';
  if (goalDate(goal.unlockDate) <= goalDate(goalToday())) return 'unlocked';
  return 'active';
}

function goalStatusLabel(status) {
  return status === 'completed' ? 'Completed' : status === 'unlocked' ? 'Unlocked' : status === 'paused' ? 'Paused' : status === 'archived' ? 'Archived' : 'Active · locked';
}

function renderSavingsGoals() {
  const total = savingsGoals.reduce((sum, goal) => sum + Math.max(0, goal.current), 0);
  const targetTotal = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const completed = savingsGoals.filter(goal => goalStatus(goal) === 'completed').length;
  const active = savingsGoals.filter(goal => ['active', 'paused'].includes(goalStatus(goal))).length;
  $('goalTotal').textContent = money(total, 0);
  $('goalActive').textContent = active;
  $('goalCompleted').textContent = completed;
  $('goalProgress').textContent = `${targetTotal ? Math.min(100, Math.round(total / targetTotal * 100)) : 0}%`;

  const upcoming = savingsGoals.filter(goal => goalStatus(goal) === 'active').sort((a, b) => goalDate(a.unlockDate) - goalDate(b.unlockDate))[0];
  $('goalNextUnlock').textContent = upcoming
    ? `${upcoming.name} unlocks in ${daysBetween(goalToday(), upcoming.unlockDate)} days (${goalDateLabel(upcoming.unlockDate)}).`
    : savingsGoals.length ? 'No active locked goals.' : 'No unlock dates yet.';

  const list = $('goalList');
  list.innerHTML = '<h3>Your saved goals</h3>' + (savingsGoals.length ? savingsGoals.map(goal => {
    const status = goalStatus(goal);
    const remaining = Math.max(0, goal.target - goal.current);
    const progress = Math.min(100, Math.round(goal.current / goal.target * 100));
    const days = daysBetween(goalToday(), goal.unlockDate);
    const daily = days ? remaining / days : 0;
    const weekly = daily * 7;
    const monthly = remaining / Math.max(1, Math.ceil(days / 30));
    const milestone = Math.floor(progress / 25) * 25;
    const message = status === 'completed' ? 'Target reached. Your locked savings are ready.' : milestone >= 50 ? `You are ${milestone}% of the way there.` : 'Small, steady deposits keep the goal moving.';
    const journey = [0, 25, 50, 75, 100].map(step => `<span class="journey-step ${progress >= step ? 'done' : ''}"><i>${progress >= step ? '✓' : step}</i><small>${step === 0 ? 'Started' : step === 100 ? 'Funded' : `${step}%`}</small></span>`).join('');
    const modeLabel = goal.mode === 'flexible' ? 'Flexible' : 'Rigid';
    const earlyWithdrawNote = goal.mode === 'rigid'
      ? `A withdrawal before ${goalDateLabel(goal.unlockDate)} deducts 1% of the amount removed.`
      : `This flexible goal allows early withdrawal without a penalty.`;
    return `<article class="goal-item card" data-goal-card="${goal.id}">
      <div class="goal-heading"><div><p class="goal-kicker">${esc(goal.category || 'Personal')} goal</p><h4>${esc(goal.name)}</h4><span class="chip">${goalStatusLabel(status)}</span></div><strong class="goal-percent">${progress}%</strong></div>
      <div class="goal-progress-block"><div class="goal-progress-label"><span>Saved</span><b>${money(goal.current)} <span class="mut">of ${money(goal.target)}</span></b></div><div class="bar2" role="progressbar" aria-label="${esc(goal.name)} progress" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><i style="width:${progress}%"></i></div><p class="mut">${money(remaining)} remaining</p></div>
      <div class="goal-facts"><div><small>Unlock date</small><b>${goalDateLabel(goal.unlockDate)}</b></div><div><small>Time left</small><b>${status === 'active' ? `${days} days` : status === 'paused' ? 'Paused' : status === 'unlocked' ? 'Available' : 'Target met'}</b></div><div><small>Mode</small><b>${modeLabel}</b></div></div>
      <div class="goal-section"><p class="goal-section-label">Savings Journey</p><div class="savings-journey" aria-label="Savings journey for ${esc(goal.name)}">${journey}</div></div>
      <div class="goal-section goal-pace"><p class="goal-section-label">Suggested pace</p><p class="mut">${money(daily)}/day · ${money(weekly)}/week · ${money(monthly)}/month</p><p class="mut">${message}</p></div>
      <p class="note">${status === 'paused' ? 'This goal is paused; resume it when you are ready.' : status === 'archived' ? 'This goal is archived and excluded from active planning.' : goal.mode === 'rigid' ? 'Rigid goals are meant to stay locked until the chosen time.' : 'Flexible goals let you adjust your plan when needed.'}</p>
      ${status === 'unlocked' ? '' : `<div class="goal-section goal-withdraw"><p class="goal-section-label">Need money early?</p><p class="mut">${earlyWithdrawNote}</p><div class="row"><input inputmode="decimal" data-withdraw="${goal.id}" placeholder="Amount to review" aria-label="Early withdrawal amount for ${esc(goal.name)}"><button class="btn alt" type="button" data-withdraw-button="${goal.id}">Review withdrawal</button><button class="btn alt" type="button" data-keep="${goal.id}">Keep locked</button></div><p class="mut" data-withdraw-preview="${goal.id}">Enter an amount to see the fee.</p></div>`}
      <div class="goal-actions"><span class="goal-section-label">Manage goal</span><div class="row"><button class="btn alt" type="button" data-edit-goal="${goal.id}">Edit</button><button class="btn alt" type="button" data-pause-goal="${goal.id}">${status === 'paused' ? 'Resume' : 'Pause'}</button><button class="btn alt" type="button" data-duplicate-goal="${goal.id}">Duplicate</button><button class="btn alt" type="button" data-archive-goal="${goal.id}">Archive</button><button class="btn alt" type="button" data-delete-goal="${goal.id}">Delete</button><button class="btn alt" type="button" data-emergency="${goal.id}">Emergency policy</button></div></div>
    </article>`;
  }).join('') : '<p class="mut">Create a goal to see its locked balance here.</p>');

  const select = $('affordGoal');
  select.innerHTML = savingsGoals.length ? savingsGoals.map(goal => `<option value="${goal.id}">${esc(goal.name)}</option>`).join('') : '<option value="">Create a goal first</option>';
  list.querySelectorAll('[data-keep]').forEach(button => button.onclick = () => toast('Your savings remain locked for this goal.'));
  list.querySelectorAll('[data-edit-goal]').forEach(button => button.onclick = () => {
    const goal = savingsGoals.find(item => item.id === button.dataset.editGoal);
    $('gn').value = goal.name; $('gt').value = goal.target; $('gc').value = goal.current; $('gm').value = goal.monthly;
    $('gcategory').value = goal.category || 'Personal'; $('gmotivation').value = goal.motivation || ''; $('gmode').value = goal.mode || 'rigid'; $('gfrequency').value = goal.frequency || 'monthly'; $('gstart').value = goal.startDate; $('gunlock').value = goal.unlockDate;
    editingGoalId = goal.id; $('gb').textContent = 'Save goal changes'; $('gn').focus();
  });
  list.querySelectorAll('[data-pause-goal]').forEach(button => button.onclick = () => {
    const goal = savingsGoals.find(item => item.id === button.dataset.pauseGoal);
    goal.status = goal.status === 'paused' ? 'active' : 'paused';
    logActivity(goal.status === 'paused' ? 'paused' : 'resumed', goal, 0, `Goal ${goal.status === 'paused' ? 'paused' : 'resumed'}.`); saveGoals(); renderSavingsGoals();
  });
  list.querySelectorAll('[data-duplicate-goal]').forEach(button => button.onclick = () => {
    const goal = savingsGoals.find(item => item.id === button.dataset.duplicateGoal);
    const copy = { ...goal, id: `goal-${Date.now()}`, name: `${goal.name} copy`, current: 0, status: 'active' };
    savingsGoals.push(copy); logActivity('goal', copy, 0, 'Goal duplicated.'); saveGoals(); renderSavingsGoals();
  });
  list.querySelectorAll('[data-archive-goal]').forEach(button => button.onclick = () => {
    if (!confirm('Archive this goal? It will remain in your saved data but leave active planning.')) return;
    const goal = savingsGoals.find(item => item.id === button.dataset.archiveGoal); goal.status = 'archived'; logActivity('archived', goal, 0, 'Goal archived.'); saveGoals(); renderSavingsGoals();
  });
  list.querySelectorAll('[data-delete-goal]').forEach(button => button.onclick = () => {
    if (!confirm('Delete this goal and its saved balance? This cannot be undone.')) return;
    const goal = savingsGoals.find(item => item.id === button.dataset.deleteGoal); savingsGoals = savingsGoals.filter(item => item.id !== goal.id); logActivity('deleted', goal, 0, 'Goal deleted.'); saveGoals(); renderSavingsGoals();
  });
  list.querySelectorAll('[data-emergency]').forEach(button => button.onclick = () => toast('Emergency policy is not configured in this prototype. No emergency withdrawal was made.'));
  list.querySelectorAll('[data-withdraw]').forEach(input => input.oninput = () => {
    const amount = num(input.value), goal = savingsGoals.find(item => item.id === input.dataset.withdraw);
    const preview = list.querySelector(`[data-withdraw-preview="${goal.id}"]`);
    if (isNaN(amount) || amount <= 0) {
      preview.textContent = goal.mode === 'rigid'
        ? `Early withdrawals before ${goalDateLabel(goal.unlockDate)} deduct 1% of the amount removed.`
        : `Flexible goals allow early withdrawal without a penalty.`;
      return;
    }

    if (goal.mode === 'rigid') {
      const fee = amount * .01;
      const received = amount - fee;
      preview.textContent = `Savings: ${money(amount)} · fee: ${money(fee)} · you receive: ${money(received)}.`;
    } else {
      preview.textContent = `Flexible goal: you can remove ${money(amount)} without a penalty.`;
    }
  });
  list.querySelectorAll('[data-withdraw-button]').forEach(button => button.onclick = () => {
    const goal = savingsGoals.find(item => item.id === button.dataset.withdrawButton);
    const input = list.querySelector(`[data-withdraw="${goal.id}"]`);
    const amount = num(input.value);
    if (isNaN(amount) || amount <= 0 || amount > goal.current) { toast(`Enter an amount up to ${money(goal.current)}.`); return; }

    const beforeUnlock = goalDate(goal.unlockDate) > goalDate(goalToday());
    const fee = goal.mode === 'rigid' && beforeUnlock ? amount * .01 : 0;
    const received = amount - fee;
    const remainingAfter = Math.max(0, goal.current - amount);
    const penaltyText = goal.mode === 'rigid' && beforeUnlock ? `\nEarly withdrawal fee: ${money(fee)}` : '';
    const confirmed = confirm(`Withdrawal review\n\nSavings: ${money(amount)}${penaltyText}\nAmount received: ${money(received)}\nGoal savings remaining: ${money(remainingAfter)}\n\nChoose Cancel to keep your savings locked.`);
    if (!confirmed) { toast('Savings remain locked.'); return; }
    goal.current = remainingAfter;
    logActivity('withdrawal', goal, amount, goal.mode === 'rigid' && beforeUnlock ? 'Early rigid withdrawal with 1% fee.' : 'Flexible withdrawal made.');
    saveGoals();
    renderSavingsGoals();
    toast(goal.mode === 'rigid' && beforeUnlock ? `Withdrawal complete. You received ${money(received)} after the 1% fee.` : `Withdrawal complete. You received ${money(received)}.`);
  });
}

let editingGoalId = null;
$('gstart').value = goalToday();
$('gunlock').value = goalToday();
$('gb').onclick = () => {
  const f = [
    ['gn', v => v.trim() ? '' : 'Goal name is required.'],
    ['gt', v => { const n = num(v); return isNaN(n) || n <= 0 ? 'Enter a target greater than 0.' : ''; }],
    ['gc', v => { const n = num(v); return isNaN(n) || n < 0 ? 'Enter 0 or a positive number.' : ''; }],
    ['gm', v => { const n = num(v); return isNaN(n) || n <= 0 ? 'Enter a monthly amount greater than 0.' : ''; }],
    ['gunlock', v => v ? '' : 'Choose an unlock date.']
  ];
  let ok = true;
  f.forEach((x, i) => {
    const message = x[1]($(x[0]).value);
    const error = i === 4 ? $('e5') : $('e' + (i + 1));
    error.textContent = message;
    $(x[0]).classList.toggle('bad', !!message);
    if (message) ok = false;
  });
  if ($('gstart').value && $('gunlock').value < $('gstart').value) {
    $('e5').textContent = 'Unlock date cannot be before the start date.';
    $('gunlock').classList.add('bad');
    ok = false;
  }
  if (!ok) return;
  const goalData = { name: $('gn').value.trim(), target: num($('gt').value), current: num($('gc').value), monthly: num($('gm').value), startDate: $('gstart').value, unlockDate: $('gunlock').value, category: $('gcategory').value, motivation: $('gmotivation').value.trim(), mode: $('gmode').value, frequency: $('gfrequency').value };
  if (editingGoalId) {
    const existing = savingsGoals.find(goal => goal.id === editingGoalId);
    Object.assign(existing, goalData);
    logActivity('edited', existing, 0, 'Goal details updated.');
  } else {
    const newGoal = { id: `goal-${Date.now()}`, ...goalData, status: 'active' };
    savingsGoals.push(newGoal);
    logActivity('goal', newGoal, 0, 'Savings goal created.');
  }
  editingGoalId = null;
  saveGoals();
  const modeMessage = $('gmode').value === 'flexible'
    ? '🟢 Goal saved in flexible mode. You can withdraw early without a penalty.'
    : '🔒 Goal saved in rigid mode. Early withdrawals before your date cost 1% of the amount removed.';
  $('gr').innerHTML = `<div class="note">${modeMessage}</div>`;
  $('gr').hidden = false;
  $('gr').parentElement.classList.add('has-plan');
  $('gn').value = ''; $('gt').value = ''; $('gc').value = '0'; $('gm').value = '';
  $('gb').textContent = 'Lock savings plan';
  renderSavingsGoals();
};
$('affordCheck').onclick = () => {
  const amount = num($('affordAmount').value), goal = savingsGoals.find(item => item.id === $('affordGoal').value);
  if (!goal || isNaN(amount) || amount <= 0) { $('affordResult').textContent = 'Choose a goal and enter an amount greater than 0.'; return; }
  const after = goal.current - amount, progress = Math.max(0, Math.min(100, Math.round(after / goal.target * 100)));
  $('affordResult').textContent = after < 0 ? `This expense is ${money(Math.abs(after))} more than this goal's locked savings.` : `${goal.name} would have ${money(after)} remaining and ${progress}% progress. The goal would need ${money(goal.target - after)} more to reach its target.`;
};
renderSavingsGoals();

const activityStorageKey = 'bb-activity-v1';
const preferenceStorageKey = 'bb-preferences-v1';
const reserveStorageKey = 'bb-reserve-v1';
const readJson = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value === null ? fallback : value; }
  catch (e) { return fallback; }
};
const writeJson = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };
let goalActivity = readJson(activityStorageKey, []);
let goalPreferences = readJson(preferenceStorageKey, { motivation: true, animations: true });

function logActivity(type, goal, amount = 0, note = '') {
  goalActivity.unshift({ id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, goalId: goal?.id || '', goalName: goal?.name || 'Savings plan', amount, note, at: new Date().toISOString() });
  writeJson(activityStorageKey, goalActivity.slice(0, 200));
}

function renderActivity() {
  const filter = $('activityFilter').value;
  const rows = goalActivity.filter(item => filter === 'all' || item.type === filter);
  $('activityTimeline').innerHTML = rows.length ? rows.slice(0, 30).map(item => `<div class="activity-row"><span class="activity-dot"></span><div><b>${esc(item.type[0].toUpperCase() + item.type.slice(1))}</b> · ${esc(item.goalName)}${item.amount ? ` · ${money(item.amount)}` : ''}<p class="mut">${esc(item.note)} · ${new Date(item.at).toLocaleString()}</p></div></div>`).join('') : '<p class="mut">No matching activity yet.</p>';
}

function renderReserve() {
  const reserve = readJson(reserveStorageKey, null);
  if (!reserve) { $('reserveStatus').textContent = 'No reserve started.'; return; }
  const target = Math.max(0, reserve.target), current = Math.max(0, reserve.current), progress = target ? Math.min(100, Math.round(current / target * 100)) : 0;
  const label = !current ? 'No reserve started.' : progress >= 100 ? 'Completed reserve.' : progress >= 50 ? 'Partially funded reserve.' : 'Developing reserve.';
  $('reserveStatus').textContent = `${label} ${money(current)} of ${money(target)} (${progress}%).`;
}

function renderHealth() {
  const reserve = readJson(reserveStorageKey, null);
  const activeGoals = savingsGoals.filter(goal => ['active', 'paused'].includes(goalStatus(goal)));
  const totalTarget = activeGoals.reduce((sum, goal) => sum + Number(goal.target || 0), 0);
  const totalSaved = activeGoals.reduce((sum, goal) => sum + Math.max(0, Number(goal.current || 0)), 0);
  const goalProgress = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const completedGoals = savingsGoals.filter(goal => goalStatus(goal) === 'completed').length;
  const completionRate = savingsGoals.length ? (completedGoals / savingsGoals.length) * 100 : 0;

  const contributions = goalActivity.filter(item => item.type === 'contribution');
  const withdrawals = goalActivity.filter(item => item.type === 'withdrawal');
  const recentWindowMs = 30 * 24 * 60 * 60 * 1000;
  const recentContributions = contributions.filter(item => Date.now() - new Date(item.at).getTime() <= recentWindowMs).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const recentWithdrawals = withdrawals.filter(item => Date.now() - new Date(item.at).getTime() <= recentWindowMs).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netFlow = recentContributions - recentWithdrawals;

  const trendModifier = netFlow >= 0
    ? Math.min(15, (netFlow / Math.max(1, recentContributions || 1)) * 15)
    : -Math.min(20, (Math.abs(netFlow) / Math.max(1, recentWithdrawals || 1)) * 20);

  const reserveTarget = reserve?.target || 0;
  const reserveCurrent = reserve?.current || 0;
  const reserveProgress = reserveTarget ? Math.min(100, Math.round((reserveCurrent / reserveTarget) * 100)) : 0;

  const score = Math.max(0, Math.min(100, Math.round(
    goalProgress * 0.55 +
    completionRate * 0.2 +
    reserveProgress * 0.2 +
    trendModifier
  )));

  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Healthy' : score >= 50 ? 'Steady' : score >= 30 ? 'Needs attention' : 'Critical';

  let explanation = 'Your savings are not moving enough yet to feel stable.';
  if (score >= 80) {
    explanation = `Strong momentum: your goals are progressing well and your savings are adding up faster than withdrawals.`;
  } else if (score >= 65) {
    explanation = `Good pace overall, but a few withdrawals are slowing your progress. Keep contributing steadily.`;
  } else if (score >= 50) {
    explanation = `Your savings are holding steady, but you still need more consistent deposits to improve the trend.`;
  } else if (score >= 30) {
    explanation = `Your savings are under pressure. Withdrawals are outpacing contributions and one or two goals may be slipping.`;
  } else if (recentWithdrawals > recentContributions) {
    explanation = `Savings are falling behind. Your recent spending is higher than your savings contributions.`;
  }

  $('healthLabel').textContent = label;
  $('healthScore').textContent = `${score}/100`;
  $('healthBar').style.width = `${score}%`;
  $('healthExplain').textContent = explanation;
}

function renderInsights() {
  const insight = [];
  const active = savingsGoals.filter(goal => goalStatus(goal) === 'active');
  if (!savingsGoals.length) insight.push('Create a goal to turn an intention into a visible plan.');
  active.forEach(goal => {
    const progress = Math.min(100, Math.round(goal.current / goal.target * 100));
    insight.push(`${goal.name} is ${progress}% complete with ${money(Math.max(0, goal.target - goal.current))} remaining.`);
    if (progress < 25) insight.push(`Your next milestone for ${goal.name} is 25% complete.`);
  });
  if (goalActivity.filter(item => item.type === 'contribution').length >= 2) insight.push('Your contribution history is building a consistent saving pattern.');
  $('goalInsights').innerHTML = insight.slice(0, 5).map(item => `<p class="note">${esc(item)}</p>`).join('');
}

function syncGoalModeCards() {
  const mode = $('gmode').value;
  document.querySelectorAll('.mode-card').forEach(card => {
    const active = card.dataset.mode === mode;
    card.classList.toggle('active', active);
    card.setAttribute('aria-pressed', String(active));
  });
}

function renderGoalExtras() {
  renderReserve();
  renderHealth();
  renderInsights();
  renderActivity();
}

const baseGoalRender = renderSavingsGoals;
renderSavingsGoals = () => { baseGoalRender(); renderGoalExtras(); };
renderGoalExtras();

$('gmode').addEventListener('change', syncGoalModeCards);
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    $('gmode').value = card.dataset.mode;
    syncGoalModeCards();
  });
});

$('activityFilter').onchange = renderActivity;
$('clearActivity').onclick = () => { if (confirm('Clear the simulated activity timeline?')) { goalActivity = []; writeJson(activityStorageKey, goalActivity); renderActivity(); renderHealth(); } };
$('saveReserve').onclick = () => {
  const target = num($('reserveTarget').value), current = num($('reserveCurrent').value);
  if (isNaN(target) || target <= 0 || isNaN(current) || current < 0) { toast('Enter a valid reserve target and current amount.'); return; }
  writeJson(reserveStorageKey, { target, current });
  renderReserve(); renderHealth();
  toast('Emergency reserve plan saved on this device.');
};
$('exportData').onclick = () => {
  const data = { version: 1, goals: savingsGoals, activity: goalActivity, reserve: readJson(reserveStorageKey, null), preferences: goalPreferences };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  link.download = 'budgetbasics-demo-data.json'; link.click(); URL.revokeObjectURL(link.href);
};
$('importData').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.goals) || !confirm('Import this demo data and replace the added savings workspace?')) return;
      savingsGoals = data.goals; goalActivity = Array.isArray(data.activity) ? data.activity : [];
      saveGoals(); writeJson(activityStorageKey, goalActivity); writeJson(reserveStorageKey, data.reserve || null); writeJson(preferenceStorageKey, data.preferences || goalPreferences); renderSavingsGoals(); toast('Demo data imported.');
    } catch (e) { toast('That file could not be imported.'); }
  };
  reader.readAsText(file);
};
$('resetDemo').onclick = () => {
  if (!confirm('Reset added savings goals, reserve planning, and activity? Existing allowance and theme data will remain.')) return;
  savingsGoals = []; goalActivity = [];
  saveGoals(); writeJson(activityStorageKey, []); localStorage.removeItem(reserveStorageKey);
  renderSavingsGoals(); toast('Added savings demo data reset.');
};

/* ===== Common Mistakes ===== */
[
  ['🛍️', 'Impulse buying', 'Saw a “limited deal” on sneakers and bought them instantly.', 'Pause 24 hours and ask: do I really need this?'],
  ['☕', 'Ignoring small expenses', 'Daily coffee, snacks and app purchases I never track.', 'Track every expense for a week and look for patterns.'],
  ['📅', 'Late payments', 'Forgot my bill and got charged a late fee.', 'Set calendar reminders or auto-pay.'],
  ['📺', 'Unused subscriptions', 'Still paying for a gym and streaming I rarely use.', 'Review subscriptions monthly; cancel what you skip.'],
  ['🗒️', 'Spending without a plan', 'End of month: “Where did my money go?”', 'Make a simple budget and stick to your priorities.']
].forEach(m => {
  $('mm').insertAdjacentHTML('beforeend',
    `<details><summary>${m[0]} ${m[1]}</summary>
     <p><b>Student scenario:</b> ${m[2]}</p>
     <p><b>Corrective action:</b> ${m[3]}</p></details>`);
});

/* ===== Gallery ===== */
const gal = [
  ['Needs vs Wants: spend with clarity', 'needs', '⚖️', 'A scale comparing needs and wants with example icons.', 1],
  ['The 50-30-20 budgeting rule', 'budgeting', '🥧', 'Pie chart showing 50% needs, 30% wants, 20% savings.', 2],
  ['Your monthly money cycle', 'expenses', '🔄', 'Circular diagram of income, spending and saving phases.', 3],
  ['12-week saving challenge', 'saving', '📈', 'Weekly savings tracker with milestones.', 4],
  ['Everyday choices: needs vs wants', 'needs', '🧺', 'Card sorting examples of needs and wants.', 5],
  ['50-30-20 in action', 'goals', '🎯', 'Sample monthly budget using the 50-30-20 rule.', 6]
];
let tag = 'all';
const tags = ['all', 'saving', 'needs', 'expenses', 'goals', 'budgeting'];

tags.forEach(t => {
  const b = document.createElement('button');
  b.textContent = t === 'all' ? 'All' : t;
  b.setAttribute('aria-pressed', t === 'all');
  b.onclick = () => {
    tag = t;
    document.querySelectorAll('#gc2 button').forEach(x => x.setAttribute('aria-pressed', x === b));
    g();
  };
  $('gc2').append(b);
});

function g() {
  const q = $('gs').value.toLowerCase().trim();
  let l = gal.filter(x => (tag === 'all' || x[1] === tag) &&
    (!q || (x[0] + x[1] + x[3]).toLowerCase().includes(q)));
  const s = $('go').value;
  if (s === 'az') l.sort((a, b) => a[0].localeCompare(b[0]));
  else if (s === 'new') l.sort((a, b) => b[4] - a[4]);
  else l.sort((a, b) => a[4] - b[4]);

  $('gg').innerHTML = l.map(x =>
    `<figure class="card" style="margin:0">
      <div class="viz" role="img" aria-label="${esc(x[3])}">${x[2]}</div>
      <figcaption><b>${x[0]}</b><br><span class="mut">${x[3]}</span></figcaption>
    </figure>`
  ).join('');
  $('gm2').hidden = l.length > 0;
}
$('gs').oninput = $('go').onchange = g;
g();

/* ===== Chatbot (pure frontend, no backend) ===== */
const fallbackChatConfig = {
  quickPrompts: [
    'What is a need?',
    'How much should I save?',
    'How do I avoid overspending?',
    'What is the 50-30-20 rule?',
    'How do I use the money monitor?'
  ],
  fallbackAnswer: 'I can help with budgeting basics like needs, wants, savings, and the 50-30-20 rule. Try one of the quick suggestions.',
  welcomeMessage: 'Hi! I\'m the BudgetBasics assistant. Ask me a budgeting question or tap a suggestion.',
  answers: [
    { questions: ['need', 'needs'], answer: 'A need is something essential for living or studying, such as food, transport, rent, or school materials.' },
    { questions: ['want', 'wants'], answer: 'A want is nice to have but not essential, like entertainment, extra shopping, streaming, or snacks.' },
    { questions: ['save', 'saving', 'savings'], answer: 'A good beginner target is to save about 20% of your income when possible, or start smaller and build the habit gradually.' },
    { questions: ['50 30 20', '50-30-20', 'rule'], answer: 'The 50-30-20 rule means 50% needs, 30% wants, and 20% savings or future goals.' },
    { questions: ['planner', 'expense planner', 'money monitor', 'manual monitor'], answer: 'Use the manual money monitor in the Planner section to record expected needs, wants, or savings and review the totals saved on this device.' },
    { questions: ['overspend', 'spending'], answer: 'Set a clear cap for wants, pause 24 hours before non-essential purchases, and track spending for one week to spot patterns.' }
  ]
};

let chatKnowledge = fallbackChatConfig.answers;
let chatConfig = { ...fallbackChatConfig };

async function loadChatKnowledge() {
  try {
    const response = await fetch('.vscode/chatbot.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Chatbot data request failed: ${response.status}`);
    const data = await response.json();
    chatKnowledge = Array.isArray(data.answers) && data.answers.length ? data.answers : fallbackChatConfig.answers;
    chatConfig = {
      ...fallbackChatConfig,
      ...data,
      quickPrompts: Array.isArray(data.quickPrompts) && data.quickPrompts.length ? data.quickPrompts : fallbackChatConfig.quickPrompts,
      answers: chatKnowledge
    };
  } catch (error) {
    console.warn('Chatbot JSON could not be loaded; using built-in fallback.', error);
    chatKnowledge = fallbackChatConfig.answers;
    chatConfig = { ...fallbackChatConfig };
  }
  say(chatConfig.welcomeMessage, 'b');
  renderQuickPrompts();
}

function say(text, type = 'b') {
  const message = document.createElement('div');
  message.className = `m ${type}`;
  message.textContent = text;
  $('log').appendChild(message);
  $('log').scrollTop = 1e9;
}

function getBotReply(question) {
  const query = question.toLowerCase().replace(/[^a-z0-9%\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  let bestMatch = null;
  let highestScore = 0;

  chatKnowledge.forEach(item => {
    const score = item.questions.reduce((total, keyword) => {
      const phrase = keyword.toLowerCase().replace(/[^a-z0-9%\s-]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!phrase) return total;
      const words = phrase.split(' ');
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const exactPhrase = words.length > 1 ? query.includes(phrase) : new RegExp(`(^|\\s)${escaped}(?=\\s|$)`).test(query);
      if (exactPhrase) return total + 100 + words.length;
      const overlap = words.filter(word => word.length > 2 && query.includes(word)).length;
      return total + (overlap / Math.max(words.length, 1));
    }, 0);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.answer;
    }
  });

  if (bestMatch && highestScore > 0) return bestMatch;
  return chatConfig.fallbackAnswer;
}

function renderQuickPrompts() {
  const prompts = chatConfig.quickPrompts;
  $('sp').innerHTML = '';
  prompts.forEach(prompt => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = prompt;
    button.addEventListener('click', () => {
      $('ci').value = prompt;
      ask();
    });
    $('sp').appendChild(button);
  });
}

function ask() {
  const question = $('ci').value.trim();
  if (!question) return;
  say(question, 'u');
  $('ci').value = '';
  const response = getBotReply(question);
  setTimeout(() => say(response, 'b'), 250);
}

loadChatKnowledge();
$('ask').addEventListener('click', ask);
$('ci').addEventListener('keydown', e => { if (e.key === 'Enter') ask(); });

/* ===== Feedback form ===== */
$('ff').onsubmit = e => {
  e.preventDefault();
  const chk = [
    ['fn', v => v.trim().length >= 2 ? '' : 'Enter your name.'],
    ['fe', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'],
    ['fr', v => v ? '' : 'Choose a rating.'],
    ['fc', v => v.trim().length >= 10 ? '' : 'Comments need at least 10 characters.']
  ];
  let ok = true;
  chk.forEach(([id, f]) => {
    const m = f($(id).value);
    $(id).classList.toggle('bad', !!m);
    $(id).nextElementSibling.textContent = m;
    if (m) ok = false;
  });
  $('fm').hidden = !ok;
  if (ok) $('ff').reset();
};

/* ===== Floating AI + mobile menu ===== */
const cw = $('chatWindow'), fab = $('fab'), nav = $('nav');

function chat(o) {
  cw.hidden = !o;
  fab.setAttribute('aria-expanded', o);
  fab.firstChild.textContent = o ? '✕' : '🤖';
  fab.setAttribute('aria-label', o ? 'Close AI assistant' : 'Open AI assistant');
  if (o) {
    const d = fab.querySelector('.dot');
    d && d.remove();
    setTimeout(() => $('ci').focus(), 50);
  }
}
fab.onclick = () => chat(cw.hidden);
$('cx').onclick = () => { chat(false); fab.focus(); };
document.querySelectorAll('[data-chat]').forEach(b => b.onclick = e => {
  e.preventDefault();
  nav.classList.remove('open');
  chat(true);
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!cw.hidden) { chat(false); fab.focus(); }
    nav.classList.remove('open');
  }
});
$('cclear').onclick = () => {
  $('log').innerHTML = '';
  say('Chat cleared. What would you like to know about budgeting?', 'b');
};
$('burger').onclick = () => {
  const o = nav.classList.toggle('open');
  $('burger').setAttribute('aria-expanded', o);
  $('burger').textContent = o ? '✕' : '☰';
};
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    $('burger').textContent = '☰';
    $('burger').setAttribute('aria-expanded', false);
  }
});

/* ===== Country & Currency ===== */
const CT = 'US:USD,NG:NGN,GB:GBP,CA:CAD,AU:AUD,NZ:NZD,IN:INR,PK:PKR,BD:BDT,LK:LKR,NP:NPR,GH:GHS,KE:KES,ZA:ZAR,UG:UGX,TZ:TZS,RW:RWF,ET:ETB,EG:EGP,MA:MAD,DZ:DZD,TN:TND,SN:XOF,CI:XOF,CM:XAF,ZM:ZMW,ZW:USD,BW:BWP,NA:NAD,MU:MUR,MZ:MZN,AO:AOA,AE:AED,SA:SAR,QA:QAR,KW:KWD,BH:BHD,OM:OMR,JO:JOD,IL:ILS,TR:TRY,IQ:IQD,LB:LBP,DE:EUR,FR:EUR,ES:EUR,IT:EUR,NL:EUR,PT:EUR,IE:EUR,BE:EUR,AT:EUR,FI:EUR,GR:EUR,LU:EUR,CH:CHF,SE:SEK,NO:NOK,DK:DKK,IS:ISK,PL:PLN,CZ:CZK,HU:HUF,RO:RON,BG:BGN,UA:UAH,RU:RUB,KZ:KZT,UZ:UZS,AZ:AZN,GE:GEL,JP:JPY,CN:CNY,KR:KRW,HK:HKD,SG:SGD,MY:MYR,TH:THB,VN:VND,ID:IDR,PH:PHP,TW:TWD,MM:MMK,KH:KHR,AF:AFN,BR:BRL,AR:ARS,CL:CLP,CO:COP,PE:PEN,MX:MXN,UY:UYU,JM:JMD,TT:TTD,DO:DOP,CR:CRC,PA:USD,EC:USD,SV:USD'
  .split(',').map(x => x.split(':'));
const extraCountries = 'AD:EUR,AG:XCD,AI:XCD,AL:ALL,AM:AMD,AO:AOA,AW:AWG,AX:EUR,BA:BAM,BB: BBD,BF:XOF,BJ:XOF,BL:EUR,BM:BMD,BN:BND,BO:BOB,BQ:USD,BS:BSD,BT:BTN,BV:NOK,BZ:BZD,CD:CDF,CF:XAF,CG:XAF,CK:NZD,CU:CUP,CV:CVE,CW:ANG,CY:EUR,DJ:DJF,DM:XCD,ER:ERN,FJ:FJD,FK:GBP,FO:DKK,GA:XAF,GD:XCD,GF:EUR,GG:GBP,GI:GIP,GL:DKK,GM:GMD,GP:EUR,GQ:XAF,GS:GBP,GT:GTQ,GU:USD,GY:GYD,HK:HKD,HN:HNL,HR:EUR,HT:HTG,IM:GBP,IO:USD,JE:GBP,KG:KGS,KI:AUD,KM:KMF,KN:XCD,LA:LAK,LI:CHF,LR:LRD,LS:LSL,LY:LYD,MC:EUR,MD:MDL,ME:EUR,MF:EUR,MG:MGA,MH:USD,MK:MKD,ML:XOF,MN:MNT,MO:MOP,MP:USD,MR:MRU,MS:XCD,MT:EUR,MU:MUR,MV:MVR,MW:MWK,NC:XPF,NE:XOF,NF:AUD,NI:NIO,NR:AUD,NU:NZD,OM:OMR,PF:XPF,PG:PGK,PM:EUR,PN:NZD,PR:USD,PW:USD,PY:PYG,RE:EUR,SB:SBD,SC:SCR,SD:SDG,SH:SHP,SI:EUR,SK:EUR,SL:SLE,SM:EUR,SN:XOF,SO:SOS,SR:SRD,SS:SSP,ST:STN,SX:ANG,SY:SYP,TC:USD,TD:XAF,TG:XOF,TJ:TJS,TL:USD,TM:TMT,TO:TOP,TV:AUD,TZ:TZS,VA:EUR,VC:XCD,VE:VES,VG:USD,VI:USD,VU:VUV,WF:XPF,WS:WST,YE:YER,YT:EUR'
  .split(',').map(x => x.split(':')).map(x => [x[0], x[1].trim()]);
extraCountries.forEach(country => { if (!CT.some(item => item[0] === country[0])) CT.push(country); });

let rn;
try { rn = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) {}
const nmC = c => { try { return rn.of(c); } catch (e) { return c; } };
CT.sort((a, b) => nmC(a[0]).localeCompare(nmC(b[0])));
$('cty').innerHTML = CT.map(x => `<option value="${x[0]}">${nmC(x[0])} (${x[1]})</option>`).join('');

const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

function toast(t) {
  const x = $('toast');
  x.textContent = t;
  x.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => x.hidden = true, 3000);
}

function me() {
  const em = LS.get('bb-me');
  const U = LS.get('bb-users') || {};
  return em && U[em] ? Object.assign({ em }, U[em]) : null;
}

function setCountry(code, save) {
  const r = CT.find(x => x[0] === code) || ['US', 'USD'];
  cc = r[0];
  cur = r[1];
  sc = SC[cur] || 1;
  $('cty').value = cc;
  let symbol = cur;
  try {
    symbol = new Intl.NumberFormat(undefined, {
      style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol'
    }).formatToParts(0).find(x => x.type === 'currency').value;
  } catch (e) {}
  $('currencyMark').textContent = symbol;
  $('currencyMark').title = `${nmC(cc)} (${cur}) currency`;
  document.querySelectorAll('.cur').forEach(e => {
    e.textContent = symbol;
    e.title = `${nmC(cc)} (${cur})`;
  });
  const h = $('hs');
  h.min = 50 * sc;
  h.max = 1000 * sc;
  h.step = 10 * sc;
  h.value = 500 * sc;
  drawSamples();
  hs();
  renderAllowance();
  renderSavingsGoals();
  $('res').innerHTML = '<div class="mut">Enter an income to see your split.</div>';
  $('gr').innerHTML = '<div class="mut">Your plan will appear here.</div>';
  $('gr').hidden = true;
  $('gr').parentElement.classList.remove('has-plan');
  if (save) {
    LS.set('bb-cc', cc);
    const u = me();
    if (u) {
      const U = LS.get('bb-users');
      U[u.em].cc = cc;
      LS.set('bb-users', U);
    }
  }
}
$('cty').onchange = () => { setCountry($('cty').value, 1); toast('Currency set to ' + cur); };

/* ===== Irregular income mode ===== */
let mode = 'fix';
$('ms').innerHTML = [1, 2, 3, 4, 5, 6].map(i =>
  `<input inputmode="decimal" aria-label="Income, month ${i}" placeholder="Month ${i}">`
).join('');

function setMode(m) {
  mode = m;
  $('pf').hidden = m !== 'fix';
  $('pv').hidden = m !== 'var';
  $('mf').setAttribute('aria-pressed', m === 'fix');
  $('mv').setAttribute('aria-pressed', m === 'var');
  $('ie').textContent = '';
}
$('mf').onclick = () => setMode('fix');
$('mv').onclick = () => setMode('var');

const oc = $('calc').onclick;
$('calc').onclick = () => mode === 'var' ? calcVar() : oc();

function calcVar() {
  const e = $('ie');
  const v = [...document.querySelectorAll('#ms input')]
    .map(i => i.value.trim()).filter(x => x !== '').map(num);

  if (v.some(x => isNaN(x) || x < 0)) { e.textContent = 'Use numbers of 0 or more only.'; return; }
  if (v.length < 3) { e.textContent = 'Enter at least 3 months of income.'; return; }
  e.textContent = '';

  const lo = Math.min(...v), hi = Math.max(...v);
  const av = v.reduce((a, b) => a + b, 0) / v.length;
  const vol = av ? Math.round((hi - lo) / av * 100) : 0;
  const lab = vol < 25 ? 'Mild' : vol < 60 ? 'Moderate' : 'High';
  const nd = num($('inn').value);

  let needs, wants, sav, warn = '';
  if (isNaN(nd)) {
    needs = lo * .5; wants = lo * .3; sav = lo * .2;
  } else {
    needs = Math.min(nd, lo);
    const rest = lo - needs;
    wants = rest * .6; sav = rest * .4;
    if (nd > lo) warn = `<div class="note">⚠️ Your lowest month doesn't cover your needs (${money(nd)}). Focus on lifting your lowest month and trimming needs first.</div>`;
  }

  $('res').innerHTML = `
    <h3>Your baseline month: ${money(lo)}</h3>
    <p class="mut">Lowest of ${v.length} months · average ${money(av)} · highest ${money(hi)} · variability: <b>${lab}</b> (${vol}%)</p>
    <p>Plan every month on your <b>lowest</b> figure so a slow month never breaks your budget.</p>` +
    [['Needs', needs, 'var(--pri)'], ['Wants', wants, 'var(--acc)'], ['Savings', sav, '#7cc47f']]
      .map(x => `<p><b>${x[0]}</b> – ${money(x[1])}</p><div class="bar2"><i style="width:${Math.round(x[1]/lo*100)||0}%;background:${x[2]}"></i></div>`).join('') +
    warn +
    `<div class="note">
      <b>Good month?</b> Split what is above ${money(lo)}: 50% buffer fund, 30% goals or debt, 20% a treat.<br>
      <b>Lean month?</b> Cut wants first, then savings – protect needs.<br>
      <b>Buffer goal:</b> ${money(needs * 6)} (about 6 months of needs).
    </div>
    <p class="mut">Educational estimate only.</p>`;
}

/* ===== Allowance vault ===== */
const todayValue = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const dateLabel = value => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
  dateStyle: 'medium'
});

function nextReleaseDate(value, cadence) {
  const d = new Date(`${value}T00:00:00`);
  if (cadence === 'weekly') d.setDate(d.getDate() + 7);
  else if (cadence === 'biweekly') d.setDate(d.getDate() + 14);
  else {
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const periodsPerMonth = cadence => cadence === 'weekly' ? 4 : cadence === 'biweekly' ? 2 : 1;
let allowancePlan = LS.get('bb-allowance');
let pendingItems = LS.get('bb-pending') || [];

function renderAllowance() {
  const result = $('allowanceResult');
  const layout = result.parentElement;
  layout.classList.toggle('has-plan', !!allowancePlan);
  result.hidden = !allowancePlan;
  if (!allowancePlan) {
    return;
  }

  const balances = allowancePlan.balances || { savings: 0 };
  allowancePlan.balances = balances;
  allowancePlan.lockedSavings = allowancePlan.lockedSavings ?? allowancePlan.amount * .2;
  const due = new Date(`${allowancePlan.next}T00:00:00`) <= new Date(`${todayValue()}T00:00:00`);
  const savingsUnlock = allowancePlan.next;
  const savingsLocked = !due;
  const cadenceLabel = { monthly: 'monthly', biweekly: 'every two weeks', weekly: 'weekly' }[allowancePlan.cadence];
  const savingsPerRelease = allowancePlan.amount * .2 / periodsPerMonth(allowancePlan.cadence);
  const withdrawableSavings = (balances.savings || 0) + (allowancePlan.lockedSavings || 0);

  result.innerHTML = `
    <div class="vault-heading">
      <div><p class="eyebrow">Your savings reserve</p><h3>${money(allowancePlan.amount * .2)} ${cadenceLabel}</h3></div>
      <span class="vault-live"><i></i> On this device</span>
    </div>
    <p class="mut">20% of your monthly money is reserved for savings.</p>
    <p class="mut">Next savings release: <b>${dateLabel(savingsUnlock)}</b>${savingsLocked ? ' · locked' : ' · available without a fee'}</p>
    <div class="vault-balances">
      <div class="vault-balance"><small>Savings reserved</small><b>${money(withdrawableSavings)}</b></div>
    </div>
    <div class="vault-progress"><i style="width:${Math.min(100, Math.round(withdrawableSavings / Math.max(allowancePlan.amount, 1) * 100))}%"></i></div>
    <p class="mut">Each scheduled release adds ${money(savingsPerRelease)} to savings.</p>
    <div class="vault-next">
      <div><small>Next scheduled release</small><br><b>${due ? 'Ready now' : dateLabel(allowancePlan.next)}</b></div>
      <button class="btn" type="button" id="releaseAllowance" ${due ? '' : 'disabled'}>${due ? 'Release savings' : 'Savings locked'}</button>
    </div>
    <p class="note">Needs and wants are not stored in this reserve. Only savings can be released here.</p>
    <div class="vault-withdraw">
      <b>Need money before the schedule?</b>
      <p class="mut">Only savings can be withdrawn before the schedule date. Needs stay protected until their scheduled release, and wants remain optional.</p>
      <div class="row">
        <input id="withdrawalAmount" inputmode="decimal" placeholder="Savings amount" aria-label="Savings amount to withdraw early">
      </div>
      <p class="mut" id="withdrawalPreview">Enter an amount to see the 5% fee.</p>
      <div class="err" id="withdrawalError" role="alert"></div>
      <button class="btn alt" type="button" id="withdrawEarly" ${savingsLocked ? '' : 'disabled'}>Withdraw early</button>
    </div>`;

  $('releaseAllowance').onclick = () => {
    const installment = allowancePlan.amount / periodsPerMonth(allowancePlan.cadence);
    balances.savings += installment * .2;
    allowancePlan.balances = balances;
    allowancePlan.lockedSavings = 0;
    allowancePlan.next = nextReleaseDate(allowancePlan.next, allowancePlan.cadence);
    LS.set('bb-allowance', allowancePlan);
    renderAllowance();
    toast('Scheduled allowance released.');
  };

  const withdrawalAmount = $('withdrawalAmount');
  const withdrawalPreview = $('withdrawalPreview');
  const updateWithdrawalPreview = () => {
    const amount = num(withdrawalAmount.value);
    const feeRate = savingsLocked ? .05 : 0;
    withdrawalPreview.textContent = isNaN(amount) || amount <= 0
      ? 'Enter an amount to see the 5% fee.'
      : feeRate ? `You receive ${money(amount * (1 - feeRate))} · early fee ${money(amount * feeRate)} · available ${money(withdrawableSavings)}` : 'No early fee for this balance today.';
  };
  withdrawalAmount.oninput = updateWithdrawalPreview;
  $('withdrawEarly').onclick = () => {
    const amount = num(withdrawalAmount.value);
    const error = $('withdrawalError');
    error.textContent = '';
    if (isNaN(amount) || amount <= 0) {
      error.textContent = 'Enter an amount greater than 0.';
      return;
    }
    const available = savingsLocked ? withdrawableSavings : balances.savings;
    if (amount > available) {
      error.textContent = `Only ${money(available)} is available in this balance.`;
      return;
    }
    const fee = savingsLocked ? amount * .05 : 0;
    let remaining = amount;
    if (savingsLocked) {
      const lockedUse = Math.min(remaining, allowancePlan.lockedSavings || 0);
      allowancePlan.lockedSavings = Math.max(0, (allowancePlan.lockedSavings || 0) - lockedUse);
      remaining -= lockedUse;
      if (remaining > 0) {
        balances.savings = Math.max(0, (balances.savings || 0) - remaining);
      }
    } else {
      balances.savings -= amount;
    }
    allowancePlan.balances = balances;
    allowancePlan.withdrawals = (allowancePlan.withdrawals || 0) + fee;
    LS.set('bb-allowance', allowancePlan);
    renderAllowance();
    toast(`Early withdrawal released ${money(amount - fee)} after the 5% fee.`);
  };
}

$('allowanceStart').value = todayValue();
$('allowanceForm').onsubmit = e => {
  e.preventDefault();
  const amount = num($('allowanceAmount').value);
  const error = $('allowanceError');
  error.textContent = '';
  $('allowanceAmount').classList.remove('bad');
  if (isNaN(amount) || amount <= 0) {
    error.textContent = 'Enter an allowance greater than 0.';
    $('allowanceAmount').classList.add('bad');
    return;
  }
  allowancePlan = {
    amount,
    cadence: $('allowanceCadence').value,
    next: $('allowanceStart').value || todayValue(),
    balances: { savings: 0 },
    lockedSavings: amount * .2
  };
  LS.set('bb-allowance', allowancePlan);
  renderAllowance();
  toast('Allowance plan saved on this device.');
};
$('allowanceReset').onclick = () => {
  allowancePlan = null;
  LS.set('bb-allowance', null);
  $('allowanceForm').reset();
  $('allowanceStart').value = todayValue();
  renderAllowance();
  toast('Allowance vault cleared.');
};
renderAllowance();

function renderPending() {
  const table = $('pendingTable');
  const totals = pendingItems.reduce((sum, item) => {
    sum.total += item.amount;
    sum[item.type] += item.amount;
    return sum;
  }, { total: 0, needs: 0, wants: 0, savings: 0 });
  $('pendingTotal').textContent = money(totals.total);
  $('pendingNeeds').textContent = money(totals.needs);
  $('pendingWants').textContent = money(totals.wants);
  $('pendingSavings').textContent = money(totals.savings);
  if (!pendingItems.length) {
    table.innerHTML = '<tr><td colspan="4" class="mut">No pending items.</td></tr>';
    return;
  }
  table.innerHTML = pendingItems.map((item, index) =>
    `<tr><td>${esc(item.name)}</td><td>${item.type}</td><td class="n">${money(item.amount)}</td><td><button class="ic" type="button" data-pending-remove="${index}" aria-label="Remove ${esc(item.name)}">✕</button></td></tr>`
  ).join('');
  table.querySelectorAll('[data-pending-remove]').forEach(button => {
    button.onclick = () => {
      pendingItems.splice(+button.dataset.pendingRemove, 1);
      LS.set('bb-pending', pendingItems);
      renderPending();
    };
  });
}

$('pendingForm').onsubmit = e => {
  e.preventDefault();
  const name = $('pendingName').value.trim();
  const amount = num($('pendingAmount').value);
  const error = $('pendingError');
  error.textContent = '';
  if (!name || isNaN(amount) || amount <= 0) {
    error.textContent = 'Add a name and an amount greater than 0.';
    return;
  }
  pendingItems.push({ name, amount, type: $('pendingType').value });
  LS.set('bb-pending', pendingItems);
  $('pendingForm').reset();
  renderPending();
  toast('Pending item saved on this device.');
};
renderPending();

/* ===== Accounts (demo – on-device only) ===== */
async function hsh(p, salt) {
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + p));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return btoa(unescape(encodeURIComponent(salt + p)));
  }
}

let tabS = 'in';
function tab(t) {
  tabS = t;
  $('tin').setAttribute('aria-pressed', t === 'in');
  $('tup').setAttribute('aria-pressed', t === 'up');
  $('nmw').hidden = t === 'in';
  $('at').textContent = t === 'in' ? 'Welcome back' : 'Create your free account';
  $('asub').textContent = t === 'in' ? 'Sign in' : 'Create account';
  $('aem').previousElementSibling.textContent = t === 'in' ? 'Username or email' : 'Email';
  $('aem').type = t === 'in' ? 'text' : 'email';
  $('aem').autocomplete = t === 'in' ? 'username' : 'email';
  $('apw').autocomplete = t === 'in' ? 'current-password' : 'new-password';
  $('ae').textContent = '';
}

function applyUser() {
  const u = me();
  const f = u && u.name.split(' ')[0];
  $('acct').querySelector('.nm').textContent = u ? f : 'Sign in';
  $('acct').setAttribute('aria-label', u ? 'Account menu for ' + f : 'Sign in');
  $('hi').textContent = u ? 'Welcome back, ' + f + ' 👋' : 'Smart money. Better future.';
  $('who').textContent = u ? u.em : '';
  $('amenu').hidden = true;
}

function openAuth() {
  tab('in');
  $('ax').hidden = false;
  $('ad').showModal();
  $('aem').focus();
}

$('acct').onclick = e => {
  e.stopPropagation();
  me() ? $('amenu').hidden = !$('amenu').hidden : openAuth();
};
document.addEventListener('click', e => {
  if (!e.target.closest('.am')) $('amenu').hidden = true;
});

$('tin').onclick = () => tab('in');
$('tup').onclick = () => tab('up');
$('ax').onclick = () => {
  $('ad').close();
};
$('ad').addEventListener('cancel', () => $('ad').close());
$('asp').onchange = () => {
  $('apw').type = $('asp').checked ? 'text' : 'password';
};

$('af').onsubmit = async e => {
  e.preventDefault();
  const email = $('aem').value.trim().toLowerCase();
  const password = $('apw').value;
  const name = $('anm').value.trim();
  const error = $('ae');
  error.textContent = '';

  if (tabS === 'up' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = 'Enter a valid email address.';
    $('aem').focus();
    return;
  }
  if (password.length < 6) {
    error.textContent = 'Use a password with at least 6 characters.';
    $('apw').focus();
    return;
  }
  if (tabS === 'up' && !/^[a-zA-Z0-9._-]{3,24}$/.test(name)) {
    error.textContent = 'Username must be 3–24 letters, numbers, dots, underscores, or hyphens.';
    $('anm').focus();
    return;
  }

  const users = LS.get('bb-users') || {};
  if (tabS === 'up') {
    if (users[email]) {
      error.textContent = 'An account with that email already exists. Sign in instead.';
      return;
    }
    if (Object.values(users).some(user => (user.username || '').toLowerCase() === name.toLowerCase())) {
      error.textContent = 'That username is already taken. Choose another one.';
      $('anm').focus();
      return;
    }
    users[email] = { name, username: name.toLowerCase(), password: await hsh(password, email), cc };
    LS.set('bb-users', users);
    LS.set('bb-me', email);
    $('ad').close();
    applyUser();
    toast('Account created on this device.');
    return;
  }

  const userEntry = users[email] ? [email, users[email]] :
    Object.entries(users).find(([, user]) => (user.username || '').toLowerCase() === email);
  const userKey = userEntry && userEntry[0];
  const user = userEntry && userEntry[1];
  if (!user || user.password !== await hsh(password, userKey)) {
    error.textContent = 'Username/email or password not recognised on this device.';
    return;
  }
  LS.set('bb-me', userKey);
  $('ad').close();
  applyUser();
  if (user.cc) setCountry(user.cc, false);
  toast('Signed in successfully.');
};

$('so').onclick = () => {
  LS.set('bb-me', null);
  applyUser();
  toast('Signed out.');
};
$('del').onclick = () => {
  const user = me();
  if (!user) return;
  const users = LS.get('bb-users') || {};
  delete users[user.em];
  LS.set('bb-users', users);
  LS.set('bb-me', null);
  applyUser();
  toast('Account deleted from this device.');
};

const savedCountry = LS.get('bb-cc');
setCountry(savedCountry || 'US', false);
applyUser();

async function startWithLogin() {
  const users = LS.get('bb-users') || {};
  const demoEmail = 'darkprotocol@local.demo';
  if (!users[demoEmail]) {
    users[demoEmail] = {
      name: 'darkprotocol',
      username: 'darkprotocol',
      password: await hsh('latest', demoEmail),
      cc: 'US'
    };
    LS.set('bb-users', users);
  }
}
startWithLogin();