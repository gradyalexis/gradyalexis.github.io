// SKILL KEY -> DISPLAY LABEL
const skillLabels = {
  next: "Next.js", react: "React", nuxt: "Nuxt.js", vue: "Vue.js",
  tailwind: "TailwindCSS", ts: "TypeScript", laravel: "Laravel", bootstrap: "Bootstrap",
  vercel: "Vercel"
};
const skillLabel = key => skillLabels[key] || key;

function formatBio(text, years) {
  return text.replace(/{{years}}/g, years).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// "YYYY/MM/DD" -> "Mon YYYY", null -> "Present"
function formatDate(dateStr) {
  if (!dateStr) return "Present";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m] = dateStr.split('/');
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function formatDescription(desc) {
  return desc.split('\n').filter(Boolean).join('<br>');
}

function formatPhoneDisplay(intl) {
  const m = intl.match(/^\+(\d{2})(\d{3})(\d{4})(\d+)$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : intl;
}

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const { profile, experiences, projects, skills } = data;

    // PROFILE
    document.title = `${profile.name} — Frontend Engineer`;
    const nameParts = profile.name.toUpperCase().split(' ');
    const lastName = nameParts.pop();
    document.getElementById('heroName').innerHTML = `${nameParts.join(' ')}<br><span>${lastName}</span>`;
    document.getElementById('heroEyebrow').textContent = profile.headline.split('|')[0].trim();
    document.getElementById('heroTitle').textContent = profile.headline.split('|').pop().trim();
    document.getElementById('metaCurrentRole').textContent = profile.currentPosition;
    document.getElementById('metaLocation').textContent = `${profile.city} 🇮🇩`;
    document.getElementById('metaCoreStack').textContent = skills.frontend.map(skillLabel).join(' · ');
    document.getElementById('skillTagsFrontend').innerHTML = skills.frontend.map(s => `<div class="skill-tag">${skillLabel(s)}</div>`).join('');
    document.getElementById('skillTagsBackend').innerHTML = skills.backend.map(s => `<div class="skill-tag">${skillLabel(s)}</div>`).join('');
    document.getElementById('skillTagsDeployment').innerHTML = skills.deployment.map(s => `<div class="skill-tag">${skillLabel(s)}</div>`).join('');

    document.getElementById('heroBgYears').textContent = profile.yearsExperience;
    document.getElementById('metaYearsValue').textContent = `${profile.yearsExperience} Years in Frontend Development`;
    document.getElementById('aboutBio').innerHTML = profile.bio.map(p => `<p>${formatBio(p, profile.yearsExperience)}</p>`).join('');

    document.getElementById('contactEmailText').textContent = profile.email;
    document.getElementById('contactEmailLink').href = `mailto:${profile.email}`;
    document.getElementById('contactWhatsappText').textContent = formatPhoneDisplay(profile.whatsapp);
    document.getElementById('contactWhatsappLink').href = `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`;
    document.getElementById('contactLinkedinText').textContent = profile.linkedin.replace(/^https?:\/\//, '');
    document.getElementById('contactLinkedinLink').href = profile.linkedin;
    const cityParts = profile.city.split(',').map(s => s.trim());
    document.getElementById('footerCopy').textContent = `© ${new Date().getFullYear()} ${profile.name} — ${cityParts[0]}, ${cityParts[cityParts.length - 1]}`;

    // RENDER EXPERIENCE
    const expList = document.getElementById('expList');
    experiences.forEach(exp => {
      expList.innerHTML += `
        <div class="exp-item fade-up">
          <div class="exp-period">
            <div class="year">${formatDate(exp.startDate)}</div>
            <div>— ${formatDate(exp.endDate)}</div>
          </div>
          <div class="exp-body">
            <div class="exp-company">${exp.company} · ${exp.employmentType}</div>
            <div class="exp-title">${exp.title}</div>
            <div class="exp-desc">${formatDescription(exp.description)}</div>
          </div>
          <div class="exp-tags">
            ${exp.skills.map(s => `<div class="exp-tag">${skillLabel(s)}</div>`).join('')}
          </div>
        </div>`;
    });

    // RENDER PROJECTS
    const grid = document.getElementById('projectsGrid');
    projects.forEach((p, i) => {
      grid.innerHTML += `
        <div class="project-card fade-up" style="transition-delay:${(i % 3) * 0.08}s">
          <div class="project-num">${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</div>
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${formatDescription(p.description)}</div>
          <div class="project-tech">${p.technologies.map(t => `<span>${skillLabel(t)}</span>`).join('')}</div>
        </div>`;
    });

    document.querySelectorAll('#expList .fade-up, #projectsGrid .fade-up').forEach(el => observer.observe(el));
  });

// INTERSECTION OBSERVER
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// HERO FADE IN
setTimeout(() => {
  document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
}, 300);

// CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; follower.style.transform = 'translate(-50%,-50%) scale(1.4)'; follower.style.opacity = '1'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.opacity = '0.5'; });
});
