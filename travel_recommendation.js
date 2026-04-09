// ── Contact Form ──────────────────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  document.getElementById('form-success').style.display = 'block';
  e.target.reset();
}

// ── Fetch & Search ────────────────────────────────────────────────
let travelData = null;

fetch('travel_recommendation_api.json')
  .then(res => res.json())
  .then(data => {
    travelData = data;
    console.log('Travel data loaded:', travelData);
  })
  .catch(err => console.error('Failed to load travel data:', err));

function handleSearch() {
  const raw = document.getElementById('search-input').value.trim();
  if (!raw || !travelData) return;

  const keyword = raw.toLowerCase();
  let results = [];
  let title = '';

  if (keyword === 'beach' || keyword === 'beaches') {
    results = travelData.beaches;
    title = '🏖 Beach Recommendations';
  } else if (keyword === 'temple' || keyword === 'temples') {
    results = travelData.temples;
    title = '🛕 Temple Recommendations';
  } else if (keyword === 'country' || keyword === 'countries') {
    travelData.countries.forEach(c => {
      results = results.concat(c.cities);
    });
    title = '🌍 All Cities';
  } else {
    const matched = travelData.countries.find(c =>
      c.name.toLowerCase().includes(keyword)
    );
    if (matched) {
      results = matched.cities;
      title = `🌍 Cities in ${matched.name}`;
    } else {
      results = [];
      title = `No results found for "${raw}"`;
    }
  }

  renderResults(results, title);
}

// ── Render Results ────────────────────────────────────────────────
function renderResults(items, title) {
  const section = document.getElementById('results-section');
  const grid = document.getElementById('results-grid');
  const heading = document.getElementById('results-title');

  heading.textContent = title;
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1">No recommendations found.</p>';
  } else {
    items.forEach(item => {
      const time = getLocalTime(item.timeZone);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" />
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p class="card-time">🕐 Local time: ${time}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Clear Results ─────────────────────────────────────────────────
function clearResults() {
  document.getElementById('search-input').value = '';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('results-grid').innerHTML = '';
}

// ── Local Time ───────────────────────────────────────────────────
function getLocalTime(timeZone) {
  try {
    const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
  } catch {
    return 'N/A';
  }
}
