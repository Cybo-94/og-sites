// ============================================================================
// CYBO BLOG SYSTEM - Unified JavaScript File
// ============================================================================
// STRUCTURE: 1) FUNCTIONALITY 2) EVENT LISTENERS 3) INITIALIZATION 4) DATA
// ============================================================================

// ============================================================================
// SECTION 1: CORE FUNCTIONALITY & UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date from YYYY-MM-DD to readable format (e.g., "Sep 14, 2026")
 */
function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

/**
 * Extract YouTube video ID from URL
 * Works with youtu.be, youtube.com/watch?v=, youtube.com/embed/, youtube.com/shorts/
 */
function extractYoutubeId(url) {
  let match = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([w-]{11})/);
  return match ? match[1] : '';
}

/**
 * Render category filter buttons
 * Extracts unique categories from blogs, creates buttons, handles click events
 */
function renderCategories() {
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];
  
  const html = categories.map(category => `
    <button 
      class="cat-btn rounded-full border px-4 py-2 text-xs font-bold transition ${
        category === activeCategory
          ? 'border-[#8ef2ff] bg-[#8ef2ff] text-black'
          : 'border-white/10 bg-white/[.04] text-white/65 hover:bg-white/10'
      }"
      data-cat="${escapeHtml(category)}"
    >
      ${escapeHtml(category)}
    </button>
  `).join('');
  
  categoriesContainer.innerHTML = html;
  
  // Attach click listeners to category buttons
  categoriesContainer.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      activeCategory = btn.dataset.cat;
      renderCategories();
      renderBlogCards();
    };
  });
}

/**
 * Render blog cards based on active filters and search
 * Applies filtering by category and search query
 * Applies sorting (newest/oldest)
 * Handles empty state message
 */
function renderBlogCards() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const allText = blog => [blog.title, blog.category, ...blog.content].join(' ').toLowerCase();
  
  // Filter blogs
  let filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch = !searchQuery || allText(blog).includes(searchQuery);
    return matchesCategory && matchesSearch;
  });
  
  // Sort blogs
  filteredBlogs.sort((a, b) => {
    if (sortSelect.value === 'newest') {
      return b.date.localeCompare(a.date);
    } else {
      return a.date.localeCompare(b.date);
    }
  });
  
  // Generate HTML for cards
  const html = filteredBlogs.map((blog, index) => `
    <div class="card-wrap">
      <article 
        class="blog-card card-in rounded-2xl p-6 text-[#101313]" 
        style="background: ${escapeHtml(blog.color)}; animation-delay: ${index * 70}ms"
        data-id="${escapeHtml(blog.id)}"
      >
        <div class="mb-9 flex items-start justify-between gap-3">
          <span class="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em]">
            ${escapeHtml(blog.category)}
          </span>
          <span class="text-xs opacity-60">${formatDate(blog.date)}</span>
        </div>
        <h2 class="orbitron text-xl font-bold leading-tight">
          ${escapeHtml(blog.title)}
        </h2>
        <p class="mt-5 text-sm leading-6 opacity-70">
          ${escapeHtml(blog.content.join(' ').slice(0, 145))}${
            blog.content.join(' ').length > 145 ? '…' : ''
          }
        </p>
        <div class="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-bold opacity-55">
          <span>Read note</span>
          <iconify-icon icon="lucide:arrow-up-right" class="text-lg"></iconify-icon>
        </div>
      </article>
    </div>
  `).join('');
  
  blogGrid.innerHTML = html;
  
  // Show/hide empty state
  emptyState.classList.toggle('hidden', filteredBlogs.length > 0);
  
  // Attach click listeners to cards
  blogGrid.querySelectorAll('[data-id]').forEach(card => {
    card.onclick = () => openArticleModal(card.dataset.id);
  });
}

/**
 * Open article modal and populate with article content
 * Fetches blog by ID and renders article, video, and sources
 */
function openArticleModal(blogId) {
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) return;
  
  // Set article background color
  articleBody.style.background = blog.color;
  articleBody.style.color = '#101313';
  
  // Render article content
  articleBody.innerHTML = `
    <div class="mb-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.12em] opacity-60">
      <span>${escapeHtml(blog.category)}</span>
      <span>•</span>
      <span>${formatDate(blog.date)}</span>
    </div>
    <h1 id="modal-title" class="orbitron text-3xl font-bold leading-tight md:text-5xl">
      ${escapeHtml(blog.title)}
    </h1>
    <div class="mt-10 space-y-6 text-base leading-8 opacity-80">
      ${blog.content.map(paragraph => `
        <p>${escapeHtml(paragraph)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g, '<em>$1</em>')
        }</p>
      `).join('')}
    </div>
  `;
  
  // Render YouTube video section (hide if no video)
  const youtubeId = extractYoutubeId(blog.youtube);
  videoSection.classList.toggle('hidden', !youtubeId);
  if (youtubeId) {
    document.querySelector('#video-thumb').src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    document.querySelector('#video-link').href = blog.youtube;
  }
  
  // Render sources section (hide if no sources)
  const hasSources = Array.isArray(blog.sources) && blog.sources.length > 0;
  sourcesSection.classList.toggle('hidden', !hasSources);
  
  if (hasSources) {
    sourcesList.innerHTML = blog.sources.map(source => `
      <a 
        class="block rounded-lg border border-white/10 bg-white/[.04] px-3 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
        href="${escapeHtml(source.link)}"
      >
        ${escapeHtml(source.name)}
        <iconify-icon icon="lucide:arrow-up-right" class="float-right"></iconify-icon>
      </a>
    `).join('');
  }
  
  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close article modal and restore scroll
 */
function closeArticleModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================================================
// SECTION 2: DOM ELEMENT REFERENCES
// ============================================================================

const blogGrid = document.querySelector('#blog-grid');
const categoriesContainer = document.querySelector('#categories');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');
const modal = document.querySelector('#modal');
const articleBody = document.querySelector('#article-body');
const videoSection = document.querySelector('#video-section');
const sourcesSection = document.querySelector('#sources-section');
const sourcesList = document.querySelector('#sources-list');
const emptyState = document.querySelector('#empty-state');
const closeModalBtn = document.querySelector('#close-modal');

// ============================================================================
// SECTION 3: STATE VARIABLES
// ============================================================================

let activeCategory = 'All';

// ============================================================================
// SECTION 4: EVENT LISTENERS
// ============================================================================

// Close modal button
closeModalBtn.onclick = closeArticleModal;

// Close modal when clicking on backdrop
modal.onclick = (event) => {
  if (event.target === modal) {
    closeArticleModal();
  }
};

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeArticleModal();
  }
});

// Search input
searchInput.oninput = renderBlogCards;

// Sort select
sortSelect.onchange = renderBlogCards;

// ============================================================================
// SECTION 5: INITIALIZATION - RUN ON PAGE LOAD
// ============================================================================

renderCategories();
renderBlogCards();

// ============================================================================
// SECTION 6: BLOG DATA - ADD YOUR BLOG POSTS HERE
// ============================================================================

const blogs = [
  {
    id: 'art-of-starting',
    title: 'The Art of Starting Something New',
    date: '2026-09-14',
    category: 'Thoughts',
    color: '#DFF4FF',
    content: [
      'Starting something new is uncomfortable because you are stepping into a situation where the result is unknown.',
      'But waiting until everything is perfect creates a strange problem: you never actually begin.',
      'The first version of an idea is rarely the final version. You build something, notice what is wrong, learn from it, and improve it.',
      'Starting also teaches you something that research alone cannot. You discover what actually matters only after you begin doing the work.',
      'So the goal is not to start perfectly. The goal is to start honestly, learn quickly, and keep improving.'
    ],
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sources: [
      { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/' },
      { name: 'Example Reference', link: 'https://example.com' }
    ]
  },
  {
    id: 'why-curiosity-matters',
    title: 'Why Curiosity Matters',
    date: '2026-09-10',
    category: 'Ideas',
    color: '#FFF1D6',
    content: [
      'Curiosity is one of the simplest ways to learn because it turns information into a personal question.',
      'Instead of asking only what works, ask why it works. That small change can completely change the way you understand a subject.',
      'The internet gives us access to an absurd amount of information. The difficult part is deciding which information deserves your attention.',
      'A curious mind does not blindly accept an answer. It keeps asking better questions until the answer actually makes sense.',
      'That habit is useful everywhere: studying, building technology, creating content, solving problems, or understanding the world around you.'
    ],
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sources: [
      { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/' }
    ]
  },
  {
    id: 'small-ideas',
    title: 'Small Ideas Can Become Big Things',
    date: '2026-09-05',
    category: 'Creation',
    color: '#E8FFD9',
    content: [
      'Not every useful idea arrives as a revolutionary discovery. Sometimes it begins as a tiny observation that refuses to leave your mind.',
      'A small idea becomes interesting when you actually do something with it. Write it down. Test it. Build a rough version. Break it. Then try again.',
      'Ideas become valuable through execution.',
      'The world already has enough people waiting for the perfect moment. Creating something imperfect is usually more useful.'
    ],
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sources: [
      { name: 'Example Reference', link: 'https://example.com' }
    ]
  }
];

// ============================================================================
// HOW TO ADD NEW BLOG POSTS:
// ============================================================================
// 1. Copy the object structure above (art-of-starting, why-curiosity-matters, etc)
// 2. Replace with your blog post data:
//    - id: unique slug (use hyphens, no spaces)
//    - title: your blog title
//    - date: YYYY-MM-DD format
//    - category: Thoughts, Ideas, Creation (or add your own)
//    - color: hex color for card background
//    - content: array of paragraph strings
//    - youtube: YouTube URL (or empty string "")
//    - sources: array of {name, link} objects
// 3. Add the new object to the blogs array
// 4. Page automatically updates!
// ============================================================================
