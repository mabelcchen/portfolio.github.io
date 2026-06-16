lucide.createIcons();

/* ── Mobile nav toggle (about.html) ── */
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
let menuOpen = false;

if (toggle && links) {
  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    links.classList.toggle('open', menuOpen);
    toggle.innerHTML = menuOpen
      ? '<i data-lucide="x" width="18" height="18"></i>'
      : '<i data-lucide="menu" width="18" height="18"></i>';
    lucide.createIcons();
  });
}

function closeMenu() {
  menuOpen = false;
  if (links) links.classList.remove('open');
  if (toggle) {
    toggle.innerHTML = '<i data-lucide="menu" width="18" height="18"></i>';
    lucide.createIcons();
  }
}

/* ── Index + toggle (index.html hero) ── */
const indexBtn  = document.getElementById('indexBtn');
const indexList = document.getElementById('indexList');

if (indexBtn && indexList) {
  indexBtn.addEventListener('click', () => {
    const isOpen = indexList.classList.toggle('open');
    indexBtn.textContent = isOpen ? 'Contact −' : 'Contact +';
  });
}

/* ── Staggered petal pop (index.html hero) ── */
const flower = document.querySelector('.flower');
if (flower) {
  const petals = flower.querySelectorAll('.petal-wrap');
  const sorted = [...petals].sort((a, b) => {
    const angleA = parseFloat(a.style.getPropertyValue('--a'));
    const angleB = parseFloat(b.style.getPropertyValue('--a'));
    // start from -45° (topmost visible petal) and go clockwise
    // counter-clockwise from -15°
    const distA = ((-15 - angleA) + 360) % 360;
    const distB = ((-15 - angleB) + 360) % 360;
    return distA - distB;
  });
  sorted.forEach((p, i) => p.style.setProperty('--d', `${i * 0.12}s`));

  const lastDelay = (sorted.length - 1) * 0.12 + 0.55;
  setTimeout(() => flower.classList.add('ready'), lastDelay * 1000 + 100);
}

/* ── Timeline animation (index.html) ── */
(function () {
  const stage       = document.getElementById('stage');
  const camera      = document.getElementById('camera');
  const replayBtn   = document.getElementById('replayBtn');
  const replayWrap  = document.getElementById('replayWrap');
  const revealInner = document.getElementById('revealInner');
  if (!stage || !camera) return;

  const HOLD = 800;    // ms each frame stays visible
  const LINE = 350;    // ms line-draw duration
  const PAN  = 500;    // ms camera pan duration
  const GAP  = 100;    // ms pause between line-end and pan-start

  let hasPlayed = false;

  function getContents() { return document.querySelectorAll('.cp-content'); }
  function getLines()    { return document.querySelectorAll('.line-seg .fill'); }

  function activate(i) {
    const contents = getContents();
    if (contents[i]) {
      contents[i].classList.add('visible');
      requestAnimationFrame(() => contents[i].classList.add('active'));
    }
  }

  function deactivate(i) {
    const contents = getContents();
    if (contents[i]) contents[i].classList.remove('active');
  }

  function collapse() {
    stage.classList.add('collapsed');
    setTimeout(() => {
      if (revealInner) revealInner.classList.add('visible');
      if (replayWrap) replayWrap.classList.add('visible');
      const card = document.getElementById('card-tew');
      if (card) {
        card.classList.add('featured');
        setTimeout(() => card.classList.remove('featured'), 1600);
      }
    }, 800);
  }

  function reset() {
    stage.classList.remove('collapsed');
    if (revealInner) revealInner.classList.remove('visible');
    if (replayWrap) replayWrap.classList.remove('visible');
    camera.style.transition = 'none';
    camera.style.transform  = 'translateX(0)';
    getContents().forEach(el => el.classList.remove('visible', 'active'));
    getLines().forEach(el => el.classList.remove('drawn'));
    requestAnimationFrame(() => {
      camera.style.transition = '';
    });
  }

  function runSequence() {
    const total = getContents().length; // 5 frames
    let current = 0;
    activate(0);

    function step() {
      if (current >= total - 1) {
        // Final frame — hold then collapse
        setTimeout(() => {
          collapse();
          if (replayBtn) replayBtn.classList.add('visible');
        }, HOLD);
        return;
      }

      setTimeout(() => {
        // Draw connecting line from current frame
        const lines = getLines();
        if (lines[current]) lines[current].classList.add('drawn');

        setTimeout(() => {
          // Pan camera to next frame
          current++;
          camera.style.transform = `translateX(-${current * 100}vw)`;

          setTimeout(() => {
            // Activate new frame, dim previous
            deactivate(current - 1);
            activate(current);
            step();
          }, PAN);
        }, LINE + GAP);
      }, HOLD);
    }

    step();
  }

  function play() {
    if (hasPlayed) return;
    hasPlayed = true;
    runSequence();
  }

  // Trigger only when stage is 50% visible
  const stageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        play();
        stageObserver.unobserve(stage);
      }
    });
  }, { threshold: 0.5 });

  stageObserver.observe(stage);

  // Replay button(s)
  const replayBtn2 = document.getElementById('replayBtn2');
  function handleReplay() {
    hasPlayed = false;
    reset();
    setTimeout(() => {
      stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => play(), 400);
    }, 850);
  }

  if (replayBtn) replayBtn.addEventListener('click', handleReplay);
  if (replayBtn2) replayBtn2.addEventListener('click', handleReplay);
})();

/* ── Scroll animate-in (once only) ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
