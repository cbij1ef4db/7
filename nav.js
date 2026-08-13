/* 全站导航 · 固定顶栏（永远可见，赛博风格）
 * 行为：固定顶栏；滚动加深背景+霓虹底线；当前页高亮；永不隐藏。
 */
(function () {
  // ==== 配置区 ====
  var SITE_NAME = '作品集';
  var SITE_TAG = 'PORTFOLIO · 2026';
  var LINKS = [
    { href: '/', label: '首页' },
    { href: '/work/index.html', label: '作品' },
    { href: '/about/index.html', label: '关于' },
  ];
  // ==== 配置区结束 ====

  /* ---------- 样式 ---------- */
  var css = [
    '.sk-nav{position:fixed;top:0;left:0;right:0;z-index:9990;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px;',
    'padding:0 max(24px,calc((100vw - 1100px)/2));',
    'background:rgba(4,6,16,.78);backdrop-filter:blur(22px) saturate(1.4);-webkit-backdrop-filter:blur(22px) saturate(1.4);',
    'border-bottom:1px solid rgba(0,240,255,.18);',
    'font-family:"Orbitron","Rajdhani",ui-sans-serif,-apple-system,BlinkMacSystemSystem,"PingFang SC","Microsoft YaHei",sans-serif;',
    'transition:border-color .3s ease,background .3s ease,box-shadow .3s ease;}',
    '.sk-nav.scrolled{',
    '  background:rgba(4,6,16,.92);',
    '  border-bottom-color:rgba(0,240,255,.38);',
    '  box-shadow:0 1px 0 rgba(0,240,255,.12),0 8px 32px rgba(0,0,0,.45),0 0 20px rgba(0,240,255,.06);}',
    '.sk-nav a{text-decoration:none;}',
    /* 品牌 */
    '.sk-brand{display:flex;align-items:center;gap:12px;color:inherit;min-width:0;text-decoration:none !important;margin-left:46px;}',
    '.sk-brand b{font-size:17px;font-weight:900;letter-spacing:.5px;white-space:nowrap;',
    '  background:linear-gradient(135deg,#00f0ff 0%,#a855f7 50%,#ff2bd6 100%);',
    '  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;',
    '  text-shadow:none;}',
    '.sk-brand span{font-size:9.5px;letter-spacing:3px;color:#4a5a80;font-family:"Share Tech Mono",ui-monospace,"SF Mono",Consolas,monospace;white-space:nowrap;text-transform:uppercase;}',
    /* 链接组 */
    '.sk-links{display:flex;align-items:center;gap:2px;}',
    '.sk-links a{padding:8px 18px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:.5px;',
    '  color:#8896b8;white-space:nowrap;position:relative;',
    '  transition:color .25s ease,background .25s ease,box-shadow .25s ease,border-color .25s ease;',
    '  border:1px solid transparent;}',
    '.sk-links a:hover{',
    '  color:#e8f4ff;background:rgba(0,240,255,.08);',
    '  border-color:rgba(0,240,255,.28);',
    '  box-shadow:0 0 14px rgba(0,240,255,.15),inset 0 0 12px rgba(0,240,255,.04);}',
    '.sk-links a.on{',
    '  color:#00f0ff;',
    '  background:linear-gradient(135deg,rgba(0,240,255,.12),rgba(168,85,247,.08));',
    '  border-color:rgba(0,240,255,.35);',
    '  box-shadow:0 0 16px rgba(0,240,255,.2),inset 0 0 14px rgba(0,240,255,.06);}',
    '.sk-links a.on::after{content:"";position:absolute;left:18px;right:18px;bottom:2px;height:2px;border-radius:2px;',
    '  background:linear-gradient(90deg,#00f0ff,#a855f7,#ff2bd6);',
    '  box-shadow:0 0 10px rgba(0,240,255,.7),0 0 20px rgba(168,85,247,.4);}',
    /* body padding */
    'body{padding-top:64px !important;}',
    /* 撤退返回按钮（导航栏左上角外侧，纯箭头） */
    '.sk-back{position:fixed;top:14px;left:12px;z-index:9995;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;text-decoration:none;color:#04050c;font-size:20px;line-height:1;background:linear-gradient(135deg,#00f0ff,#a855f7);border:1px solid rgba(255,255,255,.35);box-shadow:0 0 12px rgba(0,240,255,.28),0 0 20px rgba(168,85,247,.15);transition:transform .2s ease,box-shadow .25s ease;cursor:pointer;will-change:transform;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}',
    '.sk-back:hover{transform:translateX(-2px) scale(1.08);box-shadow:0 0 20px rgba(0,240,255,.45),0 0 32px rgba(168,85,247,.25);}',
    '.sk-back:active{transform:scale(.92);}',
    '@media (max-width:640px){',
  '.sk-back{top:11px;left:6px;width:34px;height:34px;font-size:18px;}',
  '.sk-brand{margin-left:44px;}',
    '@media (max-width:640px){',
    '.sk-brand span{display:none;}.sk-brand b{font-size:15px;}',
    '.sk-links a{padding:7px 11px;font-size:13px;}.sk-nav{padding:0 14px;height:58px;}',
    'body{padding-top:58px !important;}}',
  ].join('');
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- DOM ---------- */
  var nav = document.createElement('header');
  nav.className = 'sk-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', '主导航');
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var linksHtml = LINKS.map(function (l) {
    var target = l.href.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
    var on = target === '/' ? (path === '/' ? ' class="on"' : '') : (path.indexOf(target) === 0 ? ' class="on"' : '');
    return '<a href="' + l.href + '"' + on + '>' + l.label + '</a>';
  }).join('');
  nav.innerHTML =
    '<a class="sk-brand" href="/"><b>' + SITE_NAME + '</b><span>' + SITE_TAG + '</span></a>' +
    '<nav class="sk-links" aria-label="页面导航">' + linksHtml + '</nav>';
  document.body.prepend(nav);

  /* ---------- 撤退返回按钮（纯箭头，嵌入导航栏左上角） ---------- */
  (function () {
    var back = document.createElement('a');
    back.className = 'sk-back';
    back.href = '/';
    back.setAttribute('role', 'button');
    back.setAttribute('aria-label', '返回');
    back.title = '返回';
    back.innerHTML = '‹'; /* 左单箭头 */
    back.addEventListener('click', function (e) {
      e.preventDefault();
      // 根据当前路径决定回哪里，避免 history.back() 黑屏
      var p = location.pathname;
      if (p.indexOf('/work/') !== -1 && p !== '/work/index.html') {
        location.href = '/work/index.html';
      } else if (p !== '/' && p !== '/index.html') {
        location.href = '/';
      } else {
        // 已在首页，不跳转
      }
    });
    document.body.prepend(back);
  })();

  /* ---------- 滚动行为（只加深，永不隐藏） ---------- */
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
