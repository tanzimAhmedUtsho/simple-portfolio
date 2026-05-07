const body = document.body;
const loader = document.getElementById('loader');
const cursorGlow = document.getElementById('cursorGlow');
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const backToTop = document.getElementById('backToTop');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    loader.style.transition = 'opacity .55s ease';
  }, 650);
});

document.getElementById('year').textContent = new Date().getFullYear();

const typingText = document.getElementById('typingText');
const phrases = ['Web Developer & Data Analyst', 'Dashboard Designer', 'Frontend Experience Builder', 'Business Intelligence Storyteller'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  typingText.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex += 1;
  } else if (deleting && charIndex > 0) {
    charIndex -= 1;
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, deleting ? 42 : 78);
}
typeLoop();

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('hidden');
  navLinks.classList.toggle('flex');
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.add('hidden');
    navLinks.classList.remove('flex');
  });
});

function updateChrome() {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('nav-scrolled', scrolled);
  backToTop.classList.toggle('translate-y-20', window.scrollY < 600);
  backToTop.classList.toggle('opacity-0', window.scrollY < 600);
}

window.addEventListener('scroll', updateChrome);
updateChrome();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  document.documentElement.classList.toggle('dark');
  themeIcon.textContent = body.classList.contains('light-mode') ? 'Dark' : 'Light';
});

window.addEventListener('mousemove', (event) => {
  cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
});

document.querySelectorAll('a, button, .project-card, .skill-card').forEach((item) => {
  item.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
  item.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.counter);
    const duration = 1300;
    const start = performance.now();

    function animateCounter(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      entry.target.textContent = `${value}+`;
      if (progress < 1) requestAnimationFrame(animateCounter);
    }

    requestAnimationFrame(animateCounter);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach((counter) => counterObserver.observe(counter));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.querySelectorAll('.skill-row').forEach((row) => {
      row.querySelector('i').style.width = `${row.dataset.level}%`;
    });

    entry.target.querySelectorAll('.circle-chart').forEach((chart) => {
      const percent = Number(chart.dataset.percent);
      chart.style.background = `conic-gradient(#18d8ff ${percent * 3.6}deg, rgba(255,255,255,.08) 0deg)`;
    });

    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-card').forEach((card) => skillObserver.observe(card));

document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
});

const sections = document.querySelectorAll('main section[id]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach((section) => activeObserver.observe(section));

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.style.display = visible ? 'block' : 'none';
      setTimeout(() => {
        card.style.opacity = visible ? '1' : '0';
        card.style.transform = visible ? 'translateY(0)' : 'translateY(12px)';
      }, 30);
    });
  });
});

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeModalButtons = [document.getElementById('modalClose'), document.getElementById('modalCloseAlt')];

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    modal.classList.add('show');
    modal.classList.remove('hidden');
  });
});

function closeModal() {
  modal.classList.remove('show');
  modal.classList.add('hidden');
}

closeModalButtons.forEach((button) => button.addEventListener('click', closeModal));
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

let testimonialIndex = 0;
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}, 3800);

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.classList.remove('hidden');
  contactForm.reset();
  setTimeout(() => formStatus.classList.add('hidden'), 3200);
});

window.addEventListener('scroll', () => {
  const parallax = document.querySelector('.parallax-card');
  if (!parallax) return;
  parallax.style.transform = `translateY(${window.scrollY * -0.025}px)`;
});

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(Math.floor(window.innerWidth / 18), 90);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: Math.random() * 1.8 + 0.8
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(103, 232, 249, .65)';
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.14 - distance / 900})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener('resize', resizeCanvas);
