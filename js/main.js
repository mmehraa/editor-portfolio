(() => {
  const S = window.SITE || {};
  const REELS = window.REELS || [];
  const TRIPS = window.TRIPS || [];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const small = () => matchMedia('(max-width:719px)').matches;

  document.title = `${S.name || 'Portfolio'} — ${S.role || 'Video editor'}`;

  /* ---------- hero text on the desktop ---------- */
  $('heroName').textContent = S.name || '';
  const words = String(S.tagline || '').trim().split(/\s+/);
  const tagHTML = words.length > 2
    ? `${esc(words.slice(0, -2).join(' '))} <em>${esc(words.slice(-2).join(' '))}</em>`
    : esc(S.tagline || '');
  $('heroTag').innerHTML = tagHTML;
  if (S.availability) { $('avail').hidden = false; $('avail').lastElementChild.textContent = S.availability; }

  /* ---------- art for clips ---------- */
  const scene = (h = 0) => `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="300" height="400" fill="hsl(${h},60%,72%)"/><circle cx="220" cy="110" r="40" fill="hsl(${(h + 40) % 360},90%,85%)"/><path d="M0 400V260l70-70 60 60 80-100 90 110v140z" fill="hsl(${h},45%,40%)"/><path d="M0 400V320l90-60 80 50 130-70v160z" fill="hsl(${h},50%,28%)"/></svg>`;
  const art = (p) => {
    if (p.thumb) return `<img src="${esc(p.thumb)}" alt="" loading="lazy">`;
    if (p.youtube) return `<img src="https://img.youtube.com/vi/${esc(p.youtube)}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${esc(p.youtube)}/hqdefault.jpg'" alt="" loading="lazy">`;
    if (p.video) return `<video src="${esc(p.video)}#t=0.5" preload="metadata" muted playsinline></video>`;
    return scene(p.hue || 0);
  };

  /* ---------- window manager ---------- */
  const wins = {};
  let z = 10, opened = 0;
  const root = $('desk');

  function place(el, w) {
    const rw = root.clientWidth || innerWidth, rh = root.clientHeight || innerHeight;
    const n = opened++ % 6;
    const x = Math.max(8, Math.min(rw - w - 12, 110 + n * 30));
    const y = Math.max(8, Math.min(rh - 300, 14 + n * 30));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }
  const fitW = (w) => w; // CSS max-width keeps it inside the screen at any size

  function make(id, title, w, body) {
    const el = document.createElement('section');
    el.className = 'w';
    el.id = 'w-' + id;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    const ww = fitW(w);
    el.style.width = ww + 'px';
    el.innerHTML = `<header class="tb"><span class="tt">${esc(title)}</span><span class="wc"><button data-a="min" aria-label="Minimise">_</button><button data-a="max" aria-label="Maximise">□</button><button data-a="x" aria-label="Close">x</button></span></header><div class="bd">${body}</div>`;
    $('wins').appendChild(el);
    place(el, ww);
    wins[id] = el;

    el.addEventListener('pointerdown', () => focusWin(id));
    el.querySelector('.tb').addEventListener('click', (e) => {
      const a = e.target.closest('button');
      if (!a) return;
      if (a.dataset.a === 'x') closeWin(id);
      if (a.dataset.a === 'min') { el.classList.add('min'); sync(); }
      if (a.dataset.a === 'max') el.classList.toggle('max');
    });
    el.querySelector('.tb').addEventListener('dblclick', (e) => { if (!e.target.closest('button') && !small()) el.classList.toggle('max'); });

    el.querySelector('.tb').addEventListener('pointerdown', (e) => {
      if (small() || el.classList.contains('max') || e.target.closest('button')) return;
      const r = root.getBoundingClientRect();
      const ox = e.clientX - el.offsetLeft - r.left, oy = e.clientY - el.offsetTop - r.top;
      const move = (ev) => {
        el.style.left = Math.max(0, Math.min(root.clientWidth - 80, ev.clientX - r.left - ox)) + 'px';
        el.style.top = Math.max(0, Math.min(root.clientHeight - 70, ev.clientY - r.top - oy)) + 'px';
      };
      const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
    });
    return el;
  }

  function focusWin(id) {
    z++;
    Object.keys(wins).forEach((k) => wins[k].classList.remove('on'));
    wins[id].style.zIndex = z;
    wins[id].classList.add('on');
    sync();
  }
  function closeWin(id) {
    const el = wins[id];
    el.classList.remove('o', 'min', 'max');
    if (id === 'player') el.querySelector('.bd').innerHTML = '';
    sync();
  }
  function topWin() {
    let top = null, topZ = -1;
    Object.keys(wins).forEach((k) => {
      const el = wins[k];
      const zi = +el.style.zIndex || 0;
      if (el.classList.contains('o') && !el.classList.contains('min') && zi > topZ) { top = k; topZ = zi; }
    });
    return top;
  }
  function sync() {
    const box = $('tbtns');
    box.innerHTML = '';
    const top = topWin();
    Object.keys(wins).forEach((k) => {
      const el = wins[k];
      if (!el.classList.contains('o')) return;
      const b = document.createElement('button');
      b.textContent = el.querySelector('.tt').textContent;
      if (k === top) b.className = 'on';
      b.onclick = () => {
        if (k === top) { el.classList.add('min'); sync(); }
        else { el.classList.remove('min'); focusWin(k); }
      };
      box.appendChild(b);
    });
  }

  /* ---------- shared fun state ---------- */
  const order = new Set();
  let zc = 0;
  const zMsgs = [[1, 'Mistake undone.'], [5, 'Bad idea undone.'], [10, 'Whole weekend undone.'], [15, 'Tried Ctrl+Z on an ex. Does not work in real life.'], [25, 'Okay, that is a lot of Ctrl+Z.'], [50, 'Respect the undo button.'], [100, 'You are now a certified Ctrl+Z press-er. (Still no certificate.)']];
  const zMsg = () => { let m = 'Press it. Go on.'; zMsgs.forEach(([n, t]) => { if (zc >= n) m = t; }); return m; };

  function syncOrder() {
    document.querySelectorAll('[data-svc]').forEach((b) => {
      const on = order.has(b.dataset.svc);
      b.classList.toggle('sel', on);
      b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('addb')) b.textContent = on ? '✓ In my order' : '+ Add to my order';
    });
    const list = [...order];
    const ot = $('ordTxt');
    if (ot) ot.textContent = list.length ? list.join(', ') : 'nothing yet';
    const mm = $('mm');
    if (mm && (mm.dataset.auto === '1' || !mm.value.trim())) {
      mm.value = list.length ? `Hi Mayank, I need: ${list.join(', ')}.\n\n` : '';
      mm.dataset.auto = '1';
    }
  }

  /* ---------- window contents ---------- */
  const chips = (arr) => `<div class="chips">${(arr || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>`;

  function welcomeBody() {
    return `<h2 class="hd">${tagHTML}</h2>
      <p class="lead">${esc(S.intro || '')}</p>
      <div class="term" aria-label="About me, as a terminal">
        <div>&gt; whoami</div><div class="o">${esc(S.name || '')}. ${esc(S.role || 'Video editor')}. Self-taught.</div>
        <div>&gt; boring_parts --count</div><div class="o" id="bpOut">press the button below</div>
        <div>&gt; powered_by</div><div class="o">Ctrl+Z and stubbornness</div>
        <div>&gt; ex_girlfriends --status</div><div class="o">Cut from the timeline. Best edit I ever made.</div>
        <div>&gt; ex_girlfriends --replies</div><div class="o">0. Left on read. Clients always get a reply.</div>
      </div>
      <div class="meter"><div class="mb"><i id="bpBar"></i></div><button class="bt alt" id="bpBtn">Scan my footage for boring parts</button></div>
      ${chips(S.tools)}
      <div class="row">
        <button class="bt" data-open="short">See short-form</button>
        <button class="bt alt" data-open="long">See long-form</button>
        <button class="bt red" data-open="hire">Hire me</button>
      </div>
      <p class="dim" style="margin-top:14px">Tip: the icons on the desktop are folders. Click one to open it. Windows can be dragged. Try the Start button.</p>`;
  }
  function wireWelcome(el) {
    const btn = el.querySelector('#bpBtn'), bar = el.querySelector('#bpBar'), out = el.querySelector('#bpOut');
    btn.onclick = () => {
      btn.textContent = 'Scanning…';
      out.textContent = 'scanning…';
      bar.style.width = '0%';
      let n = 0;
      const t = setInterval(() => {
        n += 8;
        bar.style.width = Math.min(n, 100) + '%';
        if (n >= 100) {
          clearInterval(t);
          out.textContent = '0 found (already cut)';
          btn.textContent = 'Clean. Scan again?';
        }
      }, 90);
    };
  }

  function clipGrid(list, kind) {
    if (!list.length) return '<p class="dim">No clips yet.</p>';
    const vert = kind === 'short';
    return `<div class="gr ${vert ? 's' : 'l'}">${list.map((p, i) => {
      const n = String(i + 1).padStart(2, '0');
      const name = p.title || `${vert ? 'short' : 'long'}-${n}`;
      return `<button class="th ${vert ? 'v' : 'h'}" data-clip="${kind}:${i}" aria-label="Play ${esc(name)}">${art(p)}<span class="pl">▶</span>${(() => { const info = [p.client, p.place, p.year, p.meta].filter(Boolean).join(' · '); return (p.title || info) ? `<span class="cap">${p.title ? `<b>${esc(p.title)}</b>` : ''}${esc(info)}</span>` : ''; })()}</button>`;
    }).join('')}</div>`;
  }

  const SHEET = [['Cutting', 96], ['Pacing', 92], ['Colour', 85], ['Patience', 60], ['Sleep', 12], ['Certificates', 0], ['Ex replies', 0]];
  function aboutBody() {
    const facts = (S.funFacts || []).map((f) => `<div><span>${esc(f[0])}</span><b>${esc(f[1])}</b></div>`).join('');
    const stats = (S.stats || []).map((s) => `<div><span>${esc(s.label)}</span><b>${esc(s.n)}</b></div>`).join('');
    const rows = stats || facts;
    return `<p class="lead">${esc(S.bio || '')}</p>
      <div class="zz"><button class="bt red" id="zbtn">Press Ctrl+Z</button><div><b id="zc">0</b> undos<br><span id="zm">${esc(zMsg())}</span></div></div>
      <div class="sheet"><h4>Character sheet · Level ∞ video editor</h4>
        ${SHEET.map(([k, v]) => `<div class="sr"><span>${esc(k)}</span><div class="sb"><i data-v="${v}"></i></div><b>${v}</b></div>`).join('')}
      </div>
      ${rows ? `<div class="cert"><h4>${stats ? 'The numbers' : 'Official certificate of nothing'}</h4>${rows}</div>` : ''}
      <p style="margin:14px 0 4px"><b>Weapons of choice</b></p>${chips(S.tools)}`;
  }
  function wireAbout(el) {
    requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll('.sb i').forEach((i) => { i.style.width = i.dataset.v + '%'; })));
    const zb = el.querySelector('#zbtn');
    zb.onclick = pressZ;
  }
  function pressZ() {
    zc++;
    const c = $('zc'), m = $('zm');
    if (c) c.textContent = zc;
    if (m) m.textContent = zMsg();
  }

  function servicesBody() {
    const list = S.services || [];
    return `<p class="dim">Build your order. It carries over to the hire me window.</p>` +
      list.map((s) => `${s.side ? '<p class="side">Side quest · video editing stays the main thing</p>' : ''}<div class="sv${s.side ? ' sd' : ''}"><b class="n">${esc(s.icon)}</b><div><strong>${esc(s.title)}${s.side ? '<span class="tag">side quest</span>' : ''}</strong>${esc(s.text)}${s.joke ? `<em class="jk">${esc(s.joke)}</em>` : ''}<button class="addb chipb" data-svc="${esc(s.title)}" aria-pressed="false">+ Add to my order</button></div></div>`).join('') +
      `<div class="ord"><b>Your order:</b> <span id="ordTxt">nothing yet</span><br><span class="dim">Not included: a magic "make it go viral" button. Sorry.</span><div class="row"><button class="bt red" data-open="hire">Checkout (it's free to ask)</button></div></div>`;
  }

  function siteBody() {
    const subj = encodeURIComponent('I want a portfolio site like yours');
    const body = encodeURIComponent('Hi Mayank, I saw your portfolio and I want one like it.\n\nAbout me / my brand:\nWhat I want on it:\n');
    return `<h2 class="hd">Like this site? <em>I can build yours.</em></h2>
      <p class="lead">Video editing is my main thing. Websites are my side quest, and this very desktop is the proof.</p>
      <div class="sv"><b class="n">01</b><div><strong>A site with personality</strong>One page, your style, your jokes. Not another boring template.</div></div>
      <div class="sv"><b class="n">02</b><div><strong>Works everywhere</strong>Phones, tablets and laptops. Windows included.</div></div>
      <div class="sv"><b class="n">03</b><div><strong>Easy to update</strong>Add your own work by editing one simple file.</div></div>
      <p class="dim" style="margin-top:10px">Fine print: may cause clients to hire you. Side effects include compliments and an urge to Ctrl+Z your old website.</p>
      <div class="row"><button class="btn red" data-open="hire" data-order="Portfolio websites">I want a site like this</button><button class="btn alt" data-open="hire">Open hire me</button></div>`;
  }

  function processBody() {
    const list = S.process || [];
    return `<p class="dim">Tick off each step to see how a project goes.</p>` +
      list.map((s, i) => `<button class="stp" data-step="${i}" aria-pressed="false"><b class="n">${i + 1}</b><span><strong>${esc(s.title)}</strong>${esc(s.text)}${s.joke ? `<em class="jk">${esc(s.joke)}</em>` : ''}</span><i class="ck" aria-hidden="true"></i></button>`).join('') +
      `<p class="stm" id="stm" role="status"></p>
      <div class="happy" id="happy" hidden><button class="btn red" data-open="hire">Slide into my inbox</button><p class="dim" style="margin:8px 0 0">Unlike my exes, I actually reply. Usually within minutes.</p></div>`;
  }
  function stepClick(b) {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('dn', on);
    const all = document.querySelectorAll('#w-process .stp');
    const done = [...all].filter((x) => x.classList.contains('dn')).length;
    const m = $('stm');
    const full = done === all.length;
    if (m) m.textContent = full ? 'Project complete. That was painless. Unlike my last relationship.' : done ? `${done} of ${all.length} done.` : '';
    const h = $('happy');
    if (h) h.hidden = !full;
  }

  function quotesBody() {
    return (S.testimonials || []).map((t) => `<div class="q">“${esc(t.quote)}”<small>${esc(t.name)}${t.role ? ', ' + esc(t.role) : ''}</small></div>`).join('');
  }
  function trashBody() {
    return `<p><b>certificates.zip</b> · 0 items</p><p class="dim">diploma.pdf (never existed)<br>imposter_syndrome.exe (deleted)<br>course_receipts.xls (empty)<br>ex_texts_2019.zip (can't delete, only mute)<br>"we need to talk".mp3 (never opened)</p><button class="bt" id="empty">Empty trash</button><p id="emptyMsg" class="er" style="margin-top:10px"></p>`;
  }

  function hireBody() {
    const links = [];
    if (S.email) links.push(`<a class="btn red" href="mailto:${esc(S.email)}">Email me</a><button class="btn alt" id="copy">Copy email</button>`);
    if (S.instagram) links.push(`<a class="btn alt" href="${esc(S.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    if (S.linkedin) links.push(`<a class="btn alt" href="${esc(S.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (S.youtube) links.push(`<a class="btn alt" href="${esc(S.youtube)}" target="_blank" rel="noopener">YouTube</a>`);
    const noSoc = !S.instagram && !S.linkedin && !S.youtube && S.noSocial;
    const svcChips = (S.services || []).map((s) => `<button type="button" class="chipb" data-svc="${esc(s.title)}" aria-pressed="false">${esc(s.title)}</button>`).join('');
    return `<h2 class="hd">Need an <em>editor?</em></h2>
      <p class="dim">I reply faster than an export bar. Remote, worldwide.</p>
      <div class="badges"><span>Reply: fast</span><span>Timezone: flexible</span><span>Drama: none</span><span>Exes: edited out</span></div>
      <form class="f" id="mailForm" novalidate>
        <label>What do you need? (pick any)</label><div class="chipsb">${svcChips}</div>
        <label for="mn">Your name</label><input id="mn" type="text" autocomplete="name" placeholder="Your name">
        <label for="mf">Your email</label><input id="mf" type="email" autocomplete="email" placeholder="name@company.com">
        <label for="mm">About the project</label><textarea id="mm" data-auto="1" placeholder="What are we cutting, and when do you need it?"></textarea>
        <input type="checkbox" id="bc" name="botcheck" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="er" id="mer" role="alert"></p>
        <button class="btn red" type="submit">Send message</button>
      </form>
      <div class="row">${links.join('')}</div>
      ${noSoc ? `<div class="nosoc"><div class="strike"><span>Instagram</span><span>LinkedIn</span><span>YouTube</span></div><p><b>${esc(S.noSocial.title)}</b></p><p>${esc(S.noSocial.text)}</p></div>` : ''}`;
  }
  function wireHire(el) {
    const form = el.querySelector('#mailForm');
    const er = el.querySelector('#mer');
    const mf = el.querySelector('#mf');
    const mm = el.querySelector('#mm');
    const clear = () => { er.textContent = ''; er.className = 'er'; };
    mf.oninput = clear;
    mm.oninput = () => { mm.dataset.auto = '0'; clear(); };
    syncOrder();
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!/^\S+@\S+\.\S+$/.test(mf.value.trim())) { er.className = 'er'; er.textContent = 'Enter a valid email so I can reply.'; mf.focus(); return; }
      if (!mm.value.trim()) { er.className = 'er'; er.textContent = 'Tell me a little about the project.'; mm.focus(); return; }
      if (form.querySelector('#bc').checked) return;
      if (!S.formKey) {
        const subject = encodeURIComponent('Editing project from the portfolio');
        const body = encodeURIComponent(`${mm.value.trim()}\n\nReply to: ${mf.value.trim()}`);
        location.href = `mailto:${S.email}?subject=${subject}&body=${body}`;
        return;
      }
      const btn = form.querySelector('button[type=submit]');
      const payload = {
        access_key: S.formKey,
        subject: 'New project enquiry from your portfolio',
        from_name: 'Portfolio website',
        name: form.querySelector('#mn').value.trim() || mf.value.trim(),
        email: mf.value.trim(),
        message: mm.value.trim()
      };
      btn.disabled = true;
      btn.textContent = 'Sending…';
      er.className = 'er';
      er.textContent = '';
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then((r) => r.json())
        .then((j) => {
          if (!j.success) throw new Error(j.message || 'failed');
          er.className = 'er ok';
          er.textContent = 'Sent! I read every message. Unlike my exes, I reply.';
          mm.dataset.auto = '1';
          order.clear();
          syncOrder();
          btn.textContent = 'Sent ✓';
          setTimeout(() => { btn.disabled = false; btn.textContent = 'Send message'; }, 2500);
        })
        .catch(() => {
          er.className = 'er';
          er.textContent = `That did not send. Please email me directly at ${S.email}.`;
          btn.disabled = false;
          btn.textContent = 'Send message';
        });
    };
    const c = el.querySelector('#copy');
    if (c) c.onclick = () => {
      const done = () => { c.textContent = 'Copied'; setTimeout(() => (c.textContent = 'Copy email'), 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(S.email).then(done, () => {}); else done();
    };
  }

  /* ---------- player ---------- */
  function openPlayer(kind, i) {
    const p = (kind === 'short' ? REELS : TRIPS)[i];
    if (!p) return;
    const vert = kind === 'short';
    const name = p.title || `${vert ? 'short' : 'long'}-${String(i + 1).padStart(2, '0')}`;
    let media, note = '';
    if (p.youtube) {
      media = `<iframe src="https://www.youtube.com/embed/${esc(p.youtube)}?autoplay=1&rel=0" title="${esc(name)}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      if (location.protocol === 'file:') note = `<p class="dim" style="margin:8px 0 0">YouTube blocks embedded videos when the page is opened as a file. Double-click <b>Open portfolio.bat</b> in the project folder, or just <a href="https://youtu.be/${esc(p.youtube)}" target="_blank" rel="noopener">watch it on YouTube</a>. It plays fine on the live site.</p>`;
    } else if (p.video) media = `<video controls autoplay playsinline src="${esc(p.video)}"${p.thumb ? ` poster="${esc(p.thumb)}"` : ''}></video>`;
    else media = `${scene(p.hue || 0)}<div class="no">This clip is coming soon.</div>`;
    const html = `<div class="pv ${vert ? 'v' : ''}">${media}</div>${(p.title || p.client || p.place || p.year) ? `<div class="pcap"><b>${esc(p.title || '')}</b><span>${esc([p.client, p.place, p.year].filter(Boolean).join(' · '))}</span></div>` : ''}${note}`;
    const w = vert ? 420 : 860;
    if (!wins.player) make('player', name, w, html);
    else { wins.player.querySelector('.bd').innerHTML = html; wins.player.querySelector('.tt').textContent = name; wins.player.style.width = fitW(w) + 'px'; }
    open('player');
  }

  /* ---------- app registry ---------- */
  const apps = {
    welcome: { title: 'welcome.exe', w: 640, body: welcomeBody, after: wireWelcome },
    short: { title: 'short-form/', w: 700, body: () => `<p class="dim">Vertical reels and shorts. Click a clip to play.</p>${clipGrid(REELS, 'short')}` },
    long: { title: 'long-form/', w: 780, body: () => `<p class="dim">Longer cinematic cuts and travel films. Click a clip to play.</p>${clipGrid(TRIPS, 'long')}` },
    about: { title: 'about.txt', w: 660, body: aboutBody, after: wireAbout },
    services: { title: 'services.exe', w: 640, body: servicesBody, after: syncOrder },
    site: { title: 'site_builder.exe', w: 640, body: siteBody, after: syncOrder },
    process: { title: 'how_it_works.txt', w: 640, body: processBody },
    kind: { title: 'kind_words.txt', w: 620, body: quotesBody },
    hire: { title: 'hire_me.exe', w: 620, body: hireBody, after: wireHire },
    trash: { title: 'trash', w: 420, body: trashBody, after: (el) => { el.querySelector('#empty').onclick = () => { el.querySelector('#emptyMsg').textContent = 'Nothing to delete. Zero certificates, remember?'; }; } }
  };

  function open(id) {
    if (!wins[id]) {
      const a = apps[id];
      const el = make(id, a.title, a.w, a.body());
      if (a.after) a.after(el);
    }
    const el = wins[id];
    el.classList.add('o');
    el.classList.remove('min');
    $('menu').hidden = true;
    $('start').setAttribute('aria-expanded', 'false');
    focusWin(id);
  }

  /* ---------- icons ---------- */
  const icons = [
    ['welcome', 'welcome', 'exe'],
    ['short', 'short-form', 'fold'],
    ['long', 'long-form', 'fold2'],
    ['about', 'about.txt', 'doc'],
    ['services', 'services', 'exe'],
    ['process', 'how it works', 'doc'],
    ...((S.testimonials || []).length ? [['kind', 'kind words', 'star']] : []),
    ['hire', 'hire me', 'mail'],
    ['site', 'build me a site', 'web'],
    ['trash', 'trash', 'bin']
  ];
  $('icons').innerHTML = icons.map(([id, label, g]) => `<button class="ic" data-open="${id}"><span class="g ${g}"></span><span class="l">${esc(label)}</span></button>`).join('');

  /* ---------- start menu ---------- */
  const menu = $('menu');
  menu.innerHTML = icons.filter((x) => x[0] !== 'trash').map(([id, label]) => `<button data-open="${id}">${esc(label)}</button>`).join('') + '<hr><button id="shut">Shut down…</button>';
  $('start').onclick = (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    $('start').setAttribute('aria-expanded', String(!menu.hidden));
  };
  $('shut').onclick = () => { menu.hidden = true; $('off').hidden = false; $('on').focus(); };
  $('on').onclick = () => { $('off').hidden = true; open('hire'); };

  /* ---------- global clicks ---------- */
  document.addEventListener('click', (e) => {
    const sv = e.target.closest('[data-svc]');
    if (sv) { const t = sv.dataset.svc; if (order.has(t)) order.delete(t); else order.add(t); syncOrder(); return; }
    const st = e.target.closest('[data-step]');
    if (st) { stepClick(st); return; }
    const o = e.target.closest('[data-open]');
    if (o) { if (o.dataset.order) order.add(o.dataset.order); open(o.dataset.open); syncOrder(); return; }
    const c = e.target.closest('[data-clip]');
    if (c) { const [k, i] = c.dataset.clip.split(':'); openPlayer(k, +i); return; }
    if (!e.target.closest('#menu')) { menu.hidden = true; $('start').setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && wins.about && wins.about.classList.contains('o') && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); pressZ(); return; }
    if (e.key !== 'Escape') return;
    if (!menu.hidden) { menu.hidden = true; return; }
    const top = topWin();
    if (top) closeWin(top);
  });

  document.addEventListener('pointerover', (e) => {
    const c = e.target.closest && e.target.closest('.th');
    if (!c || c.dataset.pv || small()) return;
    const [k, i] = (c.dataset.clip || '').split(':');
    const p = (k === 'short' ? REELS : TRIPS)[+i];
    if (!p || !p.video) return;
    c.dataset.pv = '1';
    const v = c.querySelector('video');
    if (v) { v.loop = true; v.play().catch(() => {}); c.addEventListener('pointerleave', () => { v.pause(); v.currentTime = 0.5; c.dataset.pv = ''; }, { once: true }); }
  });

  /* ---------- clock ---------- */
  const clock = () => { const d = new Date(); $('clk').textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  clock(); setInterval(clock, 15000);

  /* ---------- boot sequence ---------- */
  const boot = $('boot');
  const lines = [
    `${(S.name || 'PORTFOLIO').toUpperCase()} OS v1.0`,
    'checking talent........ ok',
    'checking coffee........ low',
    'ex_girlfriend.exe..... not responding',
    'loading 0 certificates. ok',
    'mounting short-form, long-form.'
  ];
  $('bootText').innerHTML = lines.map((l) => `<div>${esc(l)}</div>`).join('');
  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; } catch (e) {}
  let entered = false;
  const enter = () => {
    if (entered) return;
    entered = true;
    try { sessionStorage.setItem('booted', '1'); } catch (e) {}
    boot.classList.add('out');
    setTimeout(() => (boot.hidden = true), 450);
  };
  if (seen) { boot.hidden = true; entered = true; }
  else {
    let n = 0;
    const t = setInterval(() => {
      n += 10;
      $('bootBar').style.width = Math.min(n, 100) + '%';
      if (n >= 100) { clearInterval(t); $('bootMsg').textContent = 'ready.'; setTimeout(enter, 350); }
    }, 130);
    $('bootMsg').textContent = 'booting… (click to skip)';
    boot.addEventListener('click', enter);
    addEventListener('keydown', enter, { once: true });
  }
})();
