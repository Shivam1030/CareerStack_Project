// ============================================================
// skillmatch.js – Backend-powered Skill Match & Course Recommendation Logic
// ============================================================

let ALL_JOBS = [];
let ALL_COURSES = [];

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeSkill(skill) {
  return String(skill || '').trim().toLowerCase();
}

function showError(msg) {
  const err = document.getElementById('matchErr');
  if (!err) return;
  err.textContent = msg;
  err.style.display = 'block';
}

function hideError() {
  const err = document.getElementById('matchErr');
  if (!err) return;
  err.style.display = 'none';
}

async function loadJobs() {
  const data = await Auth.request('/jobs');
  ALL_JOBS = Array.isArray(data.jobs) ? data.jobs : [];

  const select = document.getElementById('jobSelect');
  if (!select) return;

  select.innerHTML =
    '<option value="">-- Select a job role --</option>' +
    ALL_JOBS.map(job => `<option value="${job._id}">${escapeHtml(job.title)}</option>`).join('');

  // Preselect job from query string: user-dashboard.html?job=<id>
  const params = new URLSearchParams(window.location.search);
  const preselectedJobId = params.get('job');

  if (preselectedJobId) {
    const exists = ALL_JOBS.some(job => job._id === preselectedJobId);
    if (exists) {
      select.value = preselectedJobId;
    }
  }
}

async function loadCourses() {
  const data = await Auth.request('/courses');
  ALL_COURSES = Array.isArray(data.courses) ? data.courses : [];
}

function getMatchLevel(pct) {
  if (pct >= 80) return 'Strong Match';
  if (pct >= 60) return 'Moderate Match';
  if (pct >= 40) return 'Needs Improvement';
  return 'Low Match';
}

function getProgressColor(pct) {
  if (pct >= 80) return 'var(--accent-3)';
  if (pct >= 60) return 'var(--accent-1)';
  if (pct >= 40) return 'var(--accent-4)';
  return 'var(--accent-5)';
}

function renderChips(targetId, skills, className = 'skill-chip') {
  const el = document.getElementById(targetId);
  if (!el) return;

  if (!skills.length) {
    el.innerHTML = '<span style="color:var(--text-muted);font-size:.85rem;">None</span>';
    return;
  }

  el.innerHTML = skills
    .map(skill => `<span class="${className}">${escapeHtml(skill)}</span>`)
    .join(' ');
}

function renderCourses(missingSkills) {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;

  const missingSet = new Set(missingSkills.map(normalizeSkill));

  const rankedCourses = ALL_COURSES
    .map(course => {
      const courseSkills = Array.isArray(course.skills) ? course.skills : [];
      const coveredSkills = courseSkills.filter(skill =>
        missingSet.has(normalizeSkill(skill))
      );

      return {
        ...course,
        coveredSkills,
        coverageCount: coveredSkills.length
      };
    })
    .filter(course => course.coverageCount > 0)
    .sort((a, b) => b.coverageCount - a.coverageCount)
    .slice(0, 6);

  if (!rankedCourses.length) {
    grid.innerHTML = `
      <div style="color:var(--text-muted);font-size:.9rem;">
        No course recommendations found for these missing skills yet.
        Add more skill-tagged courses in Admin Dashboard.
      </div>
    `;
    return;
  }

  grid.innerHTML = rankedCourses.map(course => {
    const isFree = Number(course.price || 0) === 0;

    return `
      <div class="card" style="padding:18px;">
        <h4 style="margin-bottom:8px;font-size:.95rem;">
          ${escapeHtml(course.title || 'Untitled Course')}
        </h4>

        <p style="font-size:.8rem;color:var(--text-secondary);margin-bottom:8px;">
          ${escapeHtml(course.provider || 'Unknown Provider')}
        </p>

        <p style="font-size:.78rem;color:var(--text-secondary);margin-bottom:10px;">
          Helps with:
          ${course.coveredSkills.map(skill => `<strong>${escapeHtml(skill)}</strong>`).join(', ')}
        </p>

        <div style="margin-bottom:12px;">
          ${(course.skills || [])
            .map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`)
            .join(' ')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tag ${isFree ? 'tag-green' : 'tag-orange'}">
            ${isFree ? 'Free' : 'Paid'}
          </span>

          ${course.link
            ? `<a href="${escapeHtml(course.link)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-1);font-size:.82rem;">Open →</a>`
            : '<span style="font-size:.8rem;color:var(--text-muted);">No link</span>'
          }
        </div>
      </div>
    `;
  }).join('');
}

window.runMatch = function () {
  hideError();

  const skillsRaw = document.getElementById('skillInput')?.value.trim() || '';
  const selectedJobId = document.getElementById('jobSelect')?.value || '';

  if (!skillsRaw || !selectedJobId) {
    showError('Please enter your skills and select a job role.');
    return;
  }

  const selectedJob = ALL_JOBS.find(job => job._id === selectedJobId);

  if (!selectedJob) {
    showError('Selected job role not found.');
    return;
  }

  const userSkills = skillsRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const userSkillSet = new Set(userSkills.map(normalizeSkill));
  const requiredSkills = Array.isArray(selectedJob.skills) ? selectedJob.skills : [];

  const matchedSkills = requiredSkills.filter(skill =>
    userSkillSet.has(normalizeSkill(skill))
  );

  const missingSkills = requiredSkills.filter(skill =>
    !userSkillSet.has(normalizeSkill(skill))
  );

  const pct = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;

  const matchSection = document.getElementById('matchResultSection');
  const placeholder = document.getElementById('noResultPlaceholder');

  if (matchSection) matchSection.style.display = 'block';
  if (placeholder) placeholder.style.display = 'none';

  const selectedRoleLabel = document.getElementById('selectedRoleLabel');
  const matchPct = document.getElementById('matchPct');
  const matchPctLabel = document.getElementById('matchPctLabel');
  const matchLevelLabel = document.getElementById('matchLevelLabel');
  const progress = document.getElementById('matchProgressFill');

  if (selectedRoleLabel) selectedRoleLabel.textContent = selectedJob.title || 'Selected Role';
  if (matchPct) matchPct.textContent = `${pct}%`;
  if (matchPctLabel) matchPctLabel.textContent = `${pct}%`;
  if (matchLevelLabel) matchLevelLabel.textContent = getMatchLevel(pct);

  if (progress) {
    progress.style.width = `${pct}%`;
    progress.style.background = getProgressColor(pct);
  }

  renderChips('matchedChips', matchedSkills);
  renderChips('missingChips', missingSkills);
  renderCourses(missingSkills);
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadJobs();
    await loadCourses();
  } catch (error) {
    showError(error.message || 'Failed to load jobs/courses from backend.');
  }

  document.getElementById('matchBtn')?.addEventListener('click', window.runMatch);
});