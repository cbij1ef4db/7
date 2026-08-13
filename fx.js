/* ============================================================
   fx.js · 全站交互动效引擎（零依赖）
  01 粒子网络背景（canvas 固定全站，鼠标互动）
  02 阅读进度条
  03 打字机效果
  04 滚动渐入 reveal（IntersectionObserver）
  05 3D 倾斜卡片 tilt
  06 数字滚动 countup
  07 作品分类筛选（.filters 页）
  08 光效光标（霓虹环 + 悬停放大 + 按下态）
  09 鼠标视差（整页元素随鼠标 3D 位移）
  10 灯箱画廊（点击放大 + 翻页 + 键盘）
  11 可拖转 3D 查看器（多帧模拟旋转）
  12 开场 Loading（赛博进度条）
  13 页面转场（拦截内部链接播放过渡）
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 01 粒子网络背景 ---------------- */
  (function particles() {
    if (reduce) return;
    var cv = document.createElement('canvas');
    cv.className = 'fx-bg';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var parts = [];
    var LINK = 130;          // 连线距离
    var mouse = { x: -9999, y: -9999 };
    var running = true;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(72, Math.floor(W * H / 22000));
      parts = [];
      for (var i = 0; i < n; i++) {
        var t = Math.random();
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - .5) * .34,
          vy: (Math.random() - .5) * .34,
          r: Math.random() * 1.7 + .7,
          col: t < .55 ? 0 : (t < .82 ? 1 : 2)   // 0青 1品红 2紫
        });
      }
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d2, a;
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        // 鼠标吸引
        dx = mouse.x - p.x; dy = mouse.y - p.y;
        d2 = dx * dx + dy * dy;
        if (d2 < 150 * 150 && d2 > .01) {
          p.x += dx / d2 * 6;
          p.y += dy / d2 * 6;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        var glow = .5 + Math.sin((p.x + p.y) * .01) * .22;
        ctx.fillStyle = p.col === 0
          ? 'rgba(0,240,255,' + glow + ')'
          : (p.col === 1 ? 'rgba(255,43,214,' + glow + ')' : 'rgba(168,85,247,.5)');
        ctx.fill();
        // 霓虹光晕
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.4, 0, 6.2832);
        ctx.fillStyle = p.col === 0
          ? 'rgba(0,240,255,.05)'
          : (p.col === 1 ? 'rgba(255,43,214,.05)' : 'rgba(168,85,247,.04)');
        ctx.fill();
      }
      // 连线
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j < parts.length; j++) {
          p = parts[i]; q = parts[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            a = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = 'rgba(120,90,255,' + (a * .18) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        // 与鼠标连线（霓虹青）
        dx = p.x - mouse.x; dy = p.y - mouse.y;
        d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          a = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = 'rgba(0,240,255,' + (a * .4) + ')';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) tick();
    });
    resize();
    tick();
  })();

  /* ---------------- 02 阅读进度条 ---------------- */
  (function progress() {
    var bar = document.createElement('div');
    bar.className = 'fx-progress';
    document.body.appendChild(bar);
    function upd() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = p + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
    upd();
  })();

  /* ---------------- 03 打字机效果 ---------------- */
  (function typewriter() {
    if (reduce) return;
    var el = document.querySelector('[data-type-words]');
    if (!el) return;
    var words;
    try { words = JSON.parse(el.getAttribute('data-type-words')); }
    catch (e) { words = ['作品集']; }
    var base = el.getAttribute('data-type-base') || '';
    var wi = 0, ci = base.length, deleting = false;
    function step() {
      var word = base + words[wi];
      el.textContent = word.slice(0, ci);
      var delay = deleting ? 38 : 85;
      if (!deleting && ci >= word.length) { delay = 1900; deleting = true; }
      else if (deleting && ci <= base.length) {
        deleting = false;
        wi = (wi + 1) % words.length;
        delay = 420;
      } else {
        ci += deleting ? -1 : 1;
      }
      setTimeout(step, delay);
    }
    setTimeout(step, 600);
  })();

  /* ---------------- 04 滚动渐入 reveal ---------------- */
  (function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var d = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (d) el.style.setProperty('--rd', d + 'ms');
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------------- 05 3D 倾斜卡片 tilt ---------------- */
  (function tilt() {
    if (reduce) return;
    var cards = document.querySelectorAll('.tilt');
    cards.forEach(function (card) {
      var max = 5.5;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5;
        var py = (e.clientY - r.top) / r.height - .5;
        card.style.transform =
          'rotateY(' + (px * max * 2) + 'deg) rotateX(' + (-py * max * 2) + 'deg) translateY(-4px)';
        var gx = (px + .5) * 100, gy = (py + .5) * 100;
        card.style.boxShadow =
          '0 18px 50px rgba(2,6,18,.7), 0 0 40px rgba(34,211,238,.12), ' +
          'inset 0 0 60px rgba(90,160,255,.06)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  })();

  /* ---------------- 06 数字滚动 countup ---------------- */
  (function countup() {
    var els = document.querySelectorAll('.countup');
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count') || '0');
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1100, t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var k = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (k < 1) requestAnimationFrame(frame);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(frame);
    }
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: .5 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------------- 新 赛博氛围层（合成波网格 / 扫描线 / 暗角） ---------------- */
  (function ambience() {
    var layers = [
      { cls: 'fx-grid', tag: 'div' },
      { cls: 'fx-vignette', tag: 'div' },
      { cls: 'fx-scan', tag: 'div' }
    ];
    layers.forEach(function (L) {
      var el = document.createElement(L.tag);
      el.className = L.cls;
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    });
  })();

  /* ---------------- 07 作品分类筛选 ---------------- */
  (function filters() {
    var btns = document.querySelectorAll('.filter-btn[data-filter]');
    if (!btns.length) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.work-card[data-cat]'));
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var f = btn.getAttribute('data-filter');
        var shown = 0;
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-cat') || '').split(' ');
          var hit = f === 'all' || cats.indexOf(f) !== -1;
          card.classList.toggle('hide', !hit);
          if (hit) shown++;
        });
        // 显示计数反馈
        var counter = document.querySelector('.filter-count');
        if (counter) counter.textContent = '共 ' + shown + ' 个项目';
      });
    });
  })();

  /* ---------------- 08 光效光标 ---------------- */
  (function cursor() {
    if (reduce) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var dot = document.createElement('div'); dot.className = 'sk-cursor';
    var ring = document.createElement('div'); ring.className = 'sk-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * .2; ry += (my - ry) * .2;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    })();
    var sel = 'a,button,.work-card,.tilt,.gallery-item,[data-lightbox],.viewer3d,.filter-btn,.chip,.stat,.blk';
    document.addEventListener('pointerover', function (e) {
      if (e.target.closest && e.target.closest(sel)) ring.classList.add('big');
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest && e.target.closest(sel)) ring.classList.remove('big');
    });
    window.addEventListener('pointerdown', function () { ring.classList.add('down'); });
    window.addEventListener('pointerup', function () { ring.classList.remove('down'); });
  })();

  /* ---------------- 09 鼠标视差 ---------------- */
  (function parallax() {
    if (reduce) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth - .5) * 2;
      ty = (e.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });
    (function loop() {
      cx += (tx - cx) * .06; cy += (ty - cy) * .06;
      for (var i = 0; i < els.length; i++) {
        var d = parseFloat(els[i].getAttribute('data-parallax') || '12');
        els[i].style.setProperty('--px', (cx * d).toFixed(2) + 'px');
        els[i].style.setProperty('--py', (cy * d).toFixed(2) + 'px');
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------------- 10 灯箱画廊 ---------------- */
  (function lightbox() {
    var items = [].slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!items.length) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = '<button class="lb-close" aria-label="关闭">✕</button>' +
      '<button class="lb-prev" aria-label="上一张">‹</button>' +
      '<button class="lb-next" aria-label="下一张">›</button>' +
      '<figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<div class="lb-hint">单击/滚轮放大 · 拖动平移 · 双指捏合</div>';
    document.body.appendChild(lb);
    var limg = lb.querySelector('img');
    var lcap = lb.querySelector('figcaption');
    var list = [], cur = 0;
    var scale = 1, tx = 0, ty = 0, zoomed = false, _moved = false;

    function apply() { limg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')'; }
    function resetZoom() { scale = 1; tx = 0; ty = 0; zoomed = false; limg.classList.remove('zoomed', 'dragging', 'fullsize'); lb.querySelector('.lb-figure').classList.remove('fullsize-mode'); apply(); }
    function setZoom(s) { scale = Math.min(5, Math.max(1, s)); zoomed = scale > 1.001; limg.classList.toggle('zoomed', zoomed); apply(); }

    function show() { var o = list[cur]; limg.src = o.src; limg.alt = o.cap; lcap.textContent = o.cap; resetZoom(); }
    function openLb() { lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); show(); document.body.style.overflow = 'hidden'; }
    function closeLb() { lb.classList.remove('on', 'fullsize-active'); lb.setAttribute('aria-hidden', 'true'); resetZoom(); lb.querySelector('.lb-figure').classList.remove('fullsize-mode'); document.body.style.overflow = ''; }
    function nav(d) { cur = (cur + d + list.length) % list.length; show(); }

    items.forEach(function (it, i) {
      it.style.cursor = 'zoom-in';
      it.addEventListener('click', function (e) {
        if (it.hasAttribute('data-link')) return; // 封面图：留给外层跳转
        e.preventDefault(); e.stopPropagation();
        list = items.map(function (x) { return { src: x.getAttribute('data-lightbox'), cap: x.getAttribute('data-caption') || '' }; });
        cur = i; openLb();
      });
    });

    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); nav(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); nav(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-figure')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    });

    // 缩放 + 平移
    limg.addEventListener('click', function (e) {
      e.stopPropagation();
      if (_moved) { _moved = false; return; }   // 拖动后不触发缩放
      setZoom(zoomed ? 1 : 2.6);
    });
    lb.addEventListener('wheel', function (e) {
      e.preventDefault();
      setZoom(scale * (e.deltaY < 0 ? 1.18 : 0.85));
    }, { passive: false });

    // 暴露最小 API：供外部（如 viewer3d 放大按钮）调用打开灯箱 + 缩放
    window.__lightboxAPI = {
      open: function (imageList, startIndex) {
        list = imageList;
        cur = Math.max(0, Math.min(startIndex, list.length - 1));
        openLb();
      },
      zoomTo: function (s, delay) {
        setTimeout(function () {
          lb.classList.add('fullsize-active');
          limg.classList.add('fullsize');
          lb.querySelector('.lb-figure').classList.add('fullsize-mode');
          setZoom(s);
        }, delay || 380);
      },
      close: function () { closeLb(); }
    };

    // 鼠标拖动平移
    limg.addEventListener('mousedown', function (e) {
      if (!zoomed) return;
      e.preventDefault();
      var sx = e.clientX - tx, sy = e.clientY - ty;
      limg.classList.add('dragging');
      function mv(ev) { tx = ev.clientX - sx; ty = ev.clientY - sy; apply(); }
      function up() { limg.classList.remove('dragging'); document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }
      document.addEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
    });

    // 触摸：双指捏合缩放 + 单指拖动平移
    var pinch = { d: 0, s: 1 }, t0 = null;
    function dist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    limg.addEventListener('touchstart', function (e) {
      _moved = false;
      if (e.touches.length === 2) { pinch.d = dist(e.touches); pinch.s = scale; }
      else if (e.touches.length === 1 && zoomed) { t0 = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty }; }
    }, { passive: false });
    limg.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (e.touches.length === 2) {
        setZoom(pinch.s * dist(e.touches) / pinch.d);
      } else if (e.touches.length === 1 && zoomed && t0) {
        var dx = e.touches[0].clientX - t0.x, dy = e.touches[0].clientY - t0.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) _moved = true;
        tx = dx; ty = dy; apply();
      }
    }, { passive: false });
    limg.addEventListener('touchend', function () { t0 = null; });
  })();

  /* ---------------- 11 作品切换查看器（点击/按钮/平滑过渡） ---------------- */
  (function viewerSlider() {
    var viewers = [].slice.call(document.querySelectorAll('.viewer3d'));
    viewers.forEach(function (v) {
      var frames = (v.getAttribute('data-frames') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      if (frames.length < 1) return;

      // 主图容器
      var stage = document.createElement('div');
      stage.className = 'viewer3d-stage';
      v.appendChild(stage);

      // 当前图 + 过渡层（用于交叉淡入淡出）
      var img = document.createElement('img');
      img.className = 'viewer3d-img viewer3d-img--active';
      img.src = frames[0];
      img.alt = v.getAttribute('data-alt') || '';
      img.draggable = false;
      stage.appendChild(img);

      var imgNext = document.createElement('img');
      imgNext.className = 'viewer3d-img viewer3d-img--next';
      imgNext.draggable = false;
      imgNext.style.opacity = '0';
      stage.appendChild(imgNext);

      // 左右箭头按钮
      var btnL = document.createElement('button');
      btnL.className = 'viewer3d-btn viewer3d-btn--prev';
      btnL.setAttribute('aria-label', '上一张');
      btnL.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      v.appendChild(btnL);

      var btnR = document.createElement('button');
      btnR.className = 'viewer3d-btn viewer3d-btn--next';
      btnR.setAttribute('aria-label', '下一张');
      btnR.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      v.appendChild(btnR);

      // 底部信息栏：计数器 + 圆点指示器
      var hint = document.createElement('div');
      hint.className = 'viewer3d-hint';
      var dotsHtml = '';
      for (var di = 0; di < frames.length; di++) {
        dotsHtml += '<i class="viewer3d-dot' + (di === 0 ? ' on' : '') + '" data-idx="' + di + '"></i>';
      }
      hint.innerHTML = '<span class="viewer3d-idx">1 / ' + frames.length + '</span><div class="viewer3d-dots">' + dotsHtml + '</div>';
      v.appendChild(hint);

      // 放大按钮 → 用灯箱打开当前图
      var btnZoom = document.createElement('button');
      btnZoom.className = 'viewer3d-btn viewer3d-btn--zoom';
      btnZoom.setAttribute('aria-label', '放大查看');
      btnZoom.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
      v.appendChild(btnZoom);

      var idx = 0, span = frames.length, transitioning = false;

      // 切换帧（自然丝滑：滑动 + 交叉淡入淡出，无模糊避免卡顿）
      function goTo(newIdx, direction) {
        if (transitioning || newIdx === idx) return;
        if (newIdx < 0) newIdx = span - 1;
        if (newIdx >= span) newIdx = 0;
        transitioning = true;

        // 预加载下一帧到隐藏缓冲区
        imgNext.src = frames[newIdx];
        imgNext.alt = v.getAttribute('data-alt') || '';

        var back = direction === -1; // 上一张：新图从右进、旧图向左出
        // 起点偏移（先关过渡，提交起点态）
        stage.classList.remove('v-transitioning');
        img.style.opacity = '1';
        img.style.transform = 'translateX(0) scale(1)';
        imgNext.style.opacity = '1';
        imgNext.style.transform = 'translateX(' + (back ? '5%' : '-5%') + ') scale(1.04)';
        void stage.offsetWidth; // 强制 reflow，提交起点

        // 启用过渡 + 终点态
        stage.classList.add('v-transitioning');
        imgNext.style.transform = 'translateX(0) scale(1)';
        imgNext.style.opacity = '1';
        img.style.transform = 'translateX(' + (back ? '-5%' : '5%') + ') scale(.96)';
        img.style.opacity = '0';

        var dur = reduce ? 60 : 420;
        setTimeout(function () {
          stage.classList.remove('v-transitioning');
          img.style.transform = ''; img.style.opacity = '';
          imgNext.style.transform = ''; imgNext.style.opacity = '';
          // 交换角色：缓冲区变当前显示
          img.classList.remove('viewer3d-img--active');
          img.classList.add('viewer3d-img--next');
          imgNext.classList.remove('viewer3d-img--next');
          imgNext.classList.add('viewer3d-img--active');
          var tmp = img; img = imgNext; imgNext = tmp;
          idx = newIdx;
          transitioning = false;
        }, dur);

        // 更新计数器和圆点
        hint.querySelector('.viewer3d-idx').textContent = (newIdx + 1) + ' / ' + span;
        var dots = hint.querySelectorAll('.viewer3d-dot');
        dots.forEach(function (d) { d.classList.toggle('on', parseInt(d.getAttribute('data-idx'), 10) === newIdx); });
      }

      // 按钮事件
      btnL.addEventListener('click', function (e) { e.stopPropagation(); goTo(idx - 1, -1); });
      btnR.addEventListener('click', function (e) { e.stopPropagation(); goTo(idx + 1, 1); });
      btnZoom.addEventListener('click', function (e) {
        e.stopPropagation();
        // 通过灯箱暴露的 API 打开：整图按比例适配屏幕（不过度放大，可手动缩放看细节）
        if (!window.__lightboxAPI) return;
        var alt = v.getAttribute('data-alt') || '';
        var imageList = frames.map(function (f) { return { src: f, cap: alt }; });
        window.__lightboxAPI.open(imageList, idx);
      });

      // 点击图片本身 → 下一张
      stage.addEventListener('click', function () { goTo(idx + 1, 1); });

      // 圆点点击跳转
      hint.addEventListener('click', function (e) {
        var dot = e.target.closest ? e.target.closest('.viewer3d-dot') : null;
        if (!dot) return;
        var target = parseInt(dot.getAttribute('data-idx'), 10);
        if (!isNaN(target)) goTo(target, target > idx ? 1 : -1);
      });

      // 键盘支持
      v.setAttribute('tabindex', '0');
      v.setAttribute('role', 'region');
      v.setAttribute('aria-label', '作品图片查看器');
      v.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx - 1, -1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx + 1, 1); }
      });

      // 触摸滑动支持
      var touchStartX = 0, touchMoved = false;
      v.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX; touchMoved = false;
      }, { passive: true });
      v.addEventListener('touchmove', function () { touchMoved = true; }, { passive: true });
      v.addEventListener('touchend', function (e) {
        if (!touchMoved) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { goTo(dx > 0 ? idx - 1 : idx + 1, dx > 0 ? -1 : 1); }
      });

      // 自动播放（鼠标悬停暂停）
      var autoTimer = null;
      function autoPlay() {
        if (reduce || span < 2) return;
        autoTimer = setInterval(function () { goTo(idx + 1, 1); }, 4500);
      }
      function stopAuto() { clearInterval(autoTimer); }
      v.addEventListener('mouseenter', stopAuto);
      v.addEventListener('mouseleave', autoPlay);
      v.addEventListener('focusin', stopAuto);
      v.addEventListener('focusout', autoPlay);
      autoPlay();
    });
  })();

  /* ---------------- 12 开场 Loading ---------------- */
  (function loader() {
    if (reduce) return;
    var l = document.createElement('div');
    l.className = 'sk-loader';
    l.innerHTML =
      '<div class="sk-loader-core">' +
      '<div class="sk-loader-logo">SYS<span>.</span>INIT</div>' +
      '<div class="sk-loader-bar"><i></i></div>' +
      '<div class="sk-loader-pct">0%</div>' +
      '<div class="sk-loader-sub">LOADING PORTFOLIO // CYBER THEME</div>' +
      '</div>';
    document.body.appendChild(l);
    var bar = l.querySelector('.sk-loader-bar i');
    var pct = l.querySelector('.sk-loader-pct');
    var p = 0;
    var iv = setInterval(function () {
      p += Math.random() * 14 + 5;
      if (p > 94) p = 94;
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 130);
    function done() {
      clearInterval(iv);
      bar.style.width = '100%'; pct.textContent = '100%';
      setTimeout(function () {
        l.classList.add('done');
        setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 720);
      }, 340);
    }
    if (document.readyState === 'complete') setTimeout(done, 200);
    else window.addEventListener('load', done);
  })();

  /* ---------------- 13 页面转场 ---------------- */
  (function transition() {
    if (reduce) return;
    var ov = document.createElement('div');
    ov.className = 'sk-transition';
    document.body.appendChild(ov);
    var busy = false;
    document.addEventListener('click', function (e) {
      if (busy) { e.preventDefault(); return; }
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '/') return;
      if (a.target === '_blank' || a.hasAttribute('data-no-transition') || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      busy = true;
      ov.classList.add('on');
      setTimeout(function () { window.location.href = href; }, 560);
    });
    window.addEventListener('load', function () { ov.classList.remove('on'); busy = false; });
  })();
})();
