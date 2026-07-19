// site.jsx — shared building blocks for the HSV wedding site.
// Depends on (loaded first, exported to window): Hills, Grasses, Mountains,
// StringLights, ShakerChair, FactoryRuin (scenes.jsx); Lupin, Lavender, Yarrow,
// Rose, Greenery (botanicals.jsx).

const { useState, useEffect, useRef } = React;

/* ---- wedding content (single source of truth) -------------------------- */
const W = {
  first: 'Kathryn & Matt',
  full1: 'Kathryn Noe Grice',
  full2: 'Matthew Scott Harmon',
  dayName: 'Saturday',
  dateLong: 'May 29, 2027',
  dateISO: '2027-05-29T15:00:00-04:00',
  venue: 'Hancock Shaker Village',
  addr: '34 Lebanon Mountain Rd., Hancock, MA 01237',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=34+Lebanon+Mountain+Rd,+Hancock,+MA+01237',
  rsvpUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScXFfib3jijlUG3Z3b3UL3vjzASCxjfCH70s2ehpKlvloE0oA/viewform?usp=header',
  aboutVenueUrl: 'https://hancockshakervillage.org'
};

/* ---- style: locked to the Lantern look for the published site ---------- */
function applyStyle() { document.documentElement.setAttribute('data-style', 'lantern'); return 'lantern'; }
function initStyle() { document.documentElement.setAttribute('data-style', 'lantern'); return 'lantern'; }
// apply immediately on script load so there's no flash
initStyle();

/* ---- reveal-on-scroll --------------------------------------------------- */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) {e.target.classList.add('in');io.unobserve(e.target);}});
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ---- small bits --------------------------------------------------------- */
function Sep() {
  return (
    <div className="sep">
      <span className="line" /><span className="dot" /><span className="line" />
    </div>);

}
function Names({ text = W.first, className = '' }) {
  const parts = text.split(' & ');
  return (
    <span className={className}>
      {parts[0]}<span className="amp">&amp;</span>{parts[1]}
    </span>);

}

/* ---- navigation --------------------------------------------------------- */
function Nav({ active }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
  ['Home', 'index.html'],
  ['The weekend', 'the-weekend.html'],
  ['Travel & stay', 'travel-and-stay.html']];

  return (
    <nav className={'nav' + (solid ? ' solid' : '')}>
      <a className="brand" href="index.html">
        <span className="mono" style={{ fontSize: "18px", height: "25px", padding: "0px 6px 3px", backgroundColor: "rgba(230, 220, 196, 0.027)" }}>K<span className="amp" style={{ fontSize: "18px", color: "rgb(199, 110, 5)" }}>&amp;</span>M</span>
        <span className="tag">HSV · 2027</span>
      </a>
      <div className="nav-links-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div className={'nav-links' + (open ? ' open' : '')}>
          {links.map(([label, href]) =>
          <a key={href} className={'navlink' + (active === href ? ' active' : '')} href={href}>{label}</a>
          )}
          <a className="btn btn-primary nav-rsvp" href={W.rsvpUrl} target="_blank" rel="noopener noreferrer">RSVP</a>
        </div>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <i data-lucide={open ? 'x' : 'menu'}></i>
        </button>
      </div>
    </nav>);

}

/* ---- a row of swaying lupins anchored to a bottom edge ------------------ */
function LupinRow({ stroke = '#463f70' }) {
  return (
    <React.Fragment>
      <div className="scene-layer" style={{ left: -10, right: 'auto', display: 'flex', alignItems: 'flex-end' }}>
        <div className="sway"><Lupin height={210} tone="lav" seed={2} sway={-5} stroke={stroke} /></div>
        <div className="sway sway-2" style={{ marginLeft: -34 }}><Lupin height={268} tone="blue" seed={5} sway={3} stroke={stroke} /></div>
        <div className="sway sway-3" style={{ marginLeft: -30 }}><Lupin height={190} tone="pink" seed={8} sway={5} stroke={stroke} /></div>
      </div>
      <div className="scene-layer" style={{ right: -10, left: 'auto', display: 'flex', alignItems: 'flex-end' }}>
        <div className="sway sway-3"><Lupin height={196} tone="cream" seed={11} sway={-4} stroke={stroke} /></div>
        <div className="sway" style={{ marginLeft: -36 }}><Lupin height={258} tone="blue" seed={3} sway={5} stroke={stroke} /></div>
        <div className="sway sway-2" style={{ marginLeft: -30 }}><Lupin height={214} tone="lav" seed={9} sway={3} stroke={stroke} /></div>
      </div>
    </React.Fragment>);

}

/* ---- countdown ---------------------------------------------------------- */
function Countdown({ target = W.dateISO }) {
  const calc = () => {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000);
    const s = Math.floor(diff % 60000 / 1000);
    return { d, h, m, s };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const units = [[t.d, 'Days'], [t.h, 'Hours'], [t.m, 'Minutes'], [t.s, 'Seconds']];
  return (
    <div className="countdown">
      {units.map(([n, label], i) =>
      <React.Fragment key={label}>
          <div className="cd-unit">
            <div className="cd-num">{String(n).padStart(2, '0')}</div>
            <div className="cd-label">{label}</div>
          </div>
          {i < units.length - 1 && <div className="cd-sep">:</div>}
        </React.Fragment>
      )}
    </div>);

}

/* ---- interior-page header band ----------------------------------------- */
function PageHead({ eyebrow, title, lede }) {
  return (
    <header className="pagehead">
      <div className="hero-glow" />
      <div className="sun-glow" />
      <div className="scene-layer" style={{ height: '92%', opacity: 0.55 }}><Mountains width={1500} height={540} color="#aeb6dd" fade={true} ridge={false} /></div>
      <div className="scene-layer" style={{ top: 10, bottom: 'auto' }}><StringLights width={1500} drops={20} /></div>
      <div className="scene-layer" style={{ height: 120 }}><Grasses width={1400} height={120} seed={14} /></div>
      <LupinRow />
      <div className="scene-fade-bottom" style={{ height: '40%' }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 5 }}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{lede}</p>}
      </div>
    </header>);

}

/* ---- dusk footer (shared on every page) --------------------------------- */
function DuskFooter({ children }) {
  return (
    <footer className="dusk">
      <div className="dusk-sky"><Stars width={1400} height={460} count={78} seed={7} /></div>
      <div className="dusk-glow" />
      <div className="scene-layer" style={{ top: 26, bottom: 'auto' }}>
        <StringLights width={1400} drops={20} />
      </div>
      <div className="wrap dusk-inner">
        {children}
      </div>
      <div className="dusk-scene">
        <div className="scene-layer" style={{ height: 300 }}>
          <Mountains width={1400} height={300} color="#241733" fade={true} />
        </div>
        <div className="scene-layer" style={{ height: 96 }}>
          <Grasses width={1400} height={96} seed={21} outline={true} stroke="#ecd6b0" />
        </div>
        <div className="scene-layer" style={{ left: 24, right: 'auto', display: 'flex', alignItems: 'flex-end' }}>
          <div className="sway"><Lupin height={170} tone="lav" seed={7} sway={-5} stroke="#ecd6b0" /></div>
          <div className="sway sway-2" style={{ marginLeft: -32 }}><Lupin height={216} tone="blue" seed={4} sway={3} stroke="#ecd6b0" /></div>
        </div>
        <div className="scene-layer" style={{ right: 24, left: 'auto', display: 'flex', alignItems: 'flex-end' }}>
          <div className="sway sway-3"><Lupin height={196} tone="blue" seed={1} sway={4} stroke="#ecd6b0" /></div>
          <div className="sway" style={{ marginLeft: -30 }}><Lupin height={158} tone="pink" seed={10} sway={-4} stroke="#ecd6b0" /></div>
        </div>
      </div>
      <div className="dusk-foot">
        <ShakerChair size={52} color="#e6c79a" />
        <div className="names" style={{ marginTop: 10 }}><Names /></div>
        <div className="small">{W.dayName}, {W.dateLong} · Hancock, Massachusetts</div>
      </div>
    </footer>);

}

/* ---- a single framed photo --------------------------------------------- */
function PhotoFrame({ src, alt = '', ratio = '3 / 2', maxWidth = 720, style }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        display: 'block', width: '100%', maxWidth, margin: '0 auto',
        aspectRatio: ratio, objectFit: 'cover', borderRadius: 'var(--r-lg)', overflow: 'hidden',
        boxShadow: 'var(--shadow-lift)', border: '1px solid var(--line-soft)',
        background: 'var(--surface-sunk)', ...style
      }} />);

}

/* ---- a swipeable carousel of photos ------------------------------------ */
function PhotoCarousel({ imgs = [], ratio = '3 / 2', maxWidth = 760, alt = 'Kathryn and Matt' }) {
  const [i, setI] = useState(0);
  const n = imgs.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  const Chevron = ({ dir }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>);
  if (n === 0) return null;
  return (
    <div className="carousel" style={{ maxWidth, margin: '0 auto' }}>
      <div className="carousel-viewport" style={{ aspectRatio: ratio }}>
        <div className="carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {imgs.map((src, k) =>
          <img key={src} className="cphoto" src={src} loading={k === 0 ? 'eager' : 'lazy'}
            alt={`${alt} ${k + 1} of ${n}`} />
          )}
        </div>
        {n > 1 &&
        <React.Fragment>
            <button className="carousel-arrow prev" aria-label="Previous photo" onClick={() => go(-1)}><Chevron dir="prev" /></button>
            <button className="carousel-arrow next" aria-label="Next photo" onClick={() => go(1)}><Chevron dir="next" /></button>
          </React.Fragment>
        }
      </div>
      {n > 1 &&
      <div className="carousel-dots">
          {imgs.map((_, k) =>
        <button key={k} className={'cdot' + (k === i ? ' on' : '')}
          aria-label={`Go to photo ${k + 1}`} onClick={() => setI(k)}></button>
        )}
        </div>
      }
    </div>);

}

Object.assign(window, {
  W, applyStyle, initStyle, useReveal, Sep, Names, Nav, LupinRow,
  Countdown, PageHead, DuskFooter, PhotoFrame, PhotoCarousel
});
