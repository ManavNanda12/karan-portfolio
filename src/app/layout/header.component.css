.hdr {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  border-bottom: 1px solid transparent;
  transition: transform .55s var(--ease), background-color .4s ease, border-color .4s ease, backdrop-filter .4s;
}
.hdr--scrolled {
  background: rgba(var(--bg-rgb),.86); border-bottom-color: rgba(var(--ink-rgb),.1);
  backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2);
}
.hdr--hidden { transform: translateY(-100%); }
.hdr--menu { background: transparent; border-bottom-color: transparent; backdrop-filter: none; }

.hdr-inner {
  max-width: 1320px; margin: 0 auto; padding: 16px var(--gutter);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
}

.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--navy); }
.brand-mark {
  width: 38px; height: 38px; border: 1px solid var(--gold); border-radius: 50%; display: grid; place-items: center;
  font-family: var(--serif); font-style: italic; font-size: 16px;
  transition: transform .8s var(--ease), background-color .4s, color .4s;
}
.brand:hover .brand-mark { transform: rotate(360deg); background: var(--deep); color: var(--on-deep); border-color: var(--deep); }
.brand-name { font-family: var(--mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; white-space: nowrap; }

.nav { display: flex; align-items: center; gap: 30px; }
.nav-link {
  position: relative; color: var(--navy); text-decoration: none; font-size: 14px; white-space: nowrap; padding: 6px 0;
}
.nav-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--gold);
  transform: scaleX(0); transform-origin: right; transition: transform .45s var(--ease);
}
.nav-link:hover::after, .nav-link.is-active::after { transform: scaleX(1); transform-origin: left; }
.nav-link::before {
  content: ''; position: absolute; left: 50%; top: -6px; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%;
  background: var(--gold); opacity: 0; transform: translateY(4px); transition: opacity .35s, transform .45s var(--ease);
}
.nav-link.is-active::before { opacity: 1; transform: none; }
.nav-link.is-active { color: var(--gold-deep); }
.nav-cta { min-height: 42px; padding: 0 20px; font-size: 13px; letter-spacing: .04em; }

.menu-btn {
  display: none; align-items: center; gap: 10px; background: transparent; border: 1px solid rgba(var(--ink-rgb),.25);
  border-radius: 999px; padding: 10px 18px; min-height: 44px; color: var(--navy); cursor: pointer;
  font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
}
.menu-lines { position: relative; width: 16px; height: 8px; }
.menu-lines i { position: absolute; left: 0; right: 0; height: 1px; background: currentColor; transition: transform .45s var(--ease), top .45s var(--ease); }
.menu-lines i:first-child { top: 0; }
.menu-lines i:last-child { top: 7px; }
.hdr--menu .menu-lines i:first-child { top: 4px; transform: rotate(45deg); }
.hdr--menu .menu-lines i:last-child { top: 4px; transform: rotate(-45deg); }

.progress {
  position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--gold);
  transform-origin: left center; transform: scaleX(0);
}

/* Mobile overlay */
.mnav {
  position: fixed; inset: 0; z-index: 45; background: var(--cream);
  padding: 110px clamp(20px,6vw,48px) 40px; display: flex; flex-direction: column; gap: 4px;
  clip-path: circle(0% at calc(100% - 60px) 40px); visibility: hidden;
  transition: clip-path .8s cubic-bezier(.76,0,.24,1), visibility 0s .8s;
}
.mnav--open { clip-path: circle(150% at calc(100% - 60px) 40px); visibility: visible; transition: clip-path .8s cubic-bezier(.76,0,.24,1), visibility 0s; }
.mnav-link {
  display: flex; align-items: baseline; gap: 16px; font-family: var(--serif); font-size: clamp(30px, 8vw, 40px); line-height: 1.25;
  color: var(--navy); text-decoration: none;
  opacity: 0; transform: translateY(30px); transition: opacity .5s, transform .7s var(--ease);
}
.mnav-num { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; color: var(--gold-deep); }
.mnav-link--accent { font-style: italic; color: var(--gold-deep); }
.mnav-foot {
  margin-top: auto; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--slate);
  opacity: 0; transition: opacity .6s;
}
.mnav-foot a { color: var(--navy); text-decoration: none; }
.mnav--open .mnav-link, .mnav--open .mnav-foot {
  opacity: 1; transform: none; transition-delay: calc(.25s + var(--i) * .06s);
}

/* Theme toggle: sun whose rays retract while a bite slides in to form a moon */
.actions { display: flex; align-items: center; gap: 10px; }
.theme-btn {
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(var(--ink-rgb),.2); background: transparent;
  color: var(--navy); display: grid; place-items: center; cursor: pointer; padding: 0;
  transition: border-color .3s, background-color .3s;
}
.theme-btn:hover { border-color: var(--gold); background: rgba(184,154,98,.12); }
.theme-btn svg { width: 20px; height: 20px; overflow: visible; transition: transform .7s var(--ease); }
.sun-core { fill: currentColor; transition: r .6s var(--ease); }
.sun-rays { stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; transform-origin: 12px 12px; transition: transform .6s var(--ease), opacity .4s; }
.moon-bite { transition: cx .6s var(--ease), cy .6s var(--ease); }
.theme-btn.is-dark svg { transform: rotate(-40deg); }
.theme-btn.is-dark .sun-core { r: 8px; }
.theme-btn.is-dark .sun-rays { transform: scale(.4) rotate(90deg); opacity: 0; }
.theme-btn.is-dark .moon-bite { cx: 16px; cy: 7px; }
.theme-btn:not(.is-dark) .moon-bite { cx: 26px; cy: 2px; }
.hdr-inner .nav { margin-left: auto; margin-right: 6px; }

@media (max-width: 1079px) {
  .nav { display: none; }
  .menu-btn { display: inline-flex; }
}
@media (max-width: 420px) {
  .brand-name { display: none; }
}
