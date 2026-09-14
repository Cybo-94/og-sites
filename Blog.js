/**
 * CYBO Blog - Core Functionality with GSAP Masonry Animations
 */

gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const grid = document.querySelector('#blog-grid');
const categories = document.querySelector('#categories');
const search = document.querySelector('#search-input');
const sort = document.querySelector('#sort-select');
const modal = document.querySelector('#modal');
const article = document.querySelector('#article-body');
const videoSection = document.querySelector('#video-section');
const sourcesSection = document.querySelector('#sources-section');

let activeCategory = 'All';

// Utility: Format date
const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Extract YouTube video ID from URL
function extractYouTubeId(url) {
  if (!url) return '';
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : '';
}

// Initialize: Render categories dynamically
function renderCategories() {
  const uniqueCategories = ['All', ...new Set(blogs.map((b) => b.category))];

  categories.innerHTML = uniqueCategories
    .map((cat) => {
      const isActive = cat === activeCategory;
      return `
        <button 
          class="cat-btn rounded-full border px-4 py-2 text-xs font-bold transition ${
            isActive
              ? 'border-[#8ef2ff] bg-[#8ef2ff] text-black'
              : 'border-white/10 bg-white/[.04] text-white/65 hover:bg-white/10'
          }" 
          data-cat="${escapeHtml(cat)}"
        >
          ${escapeHtml(cat)}
        </button>
      `;
    })
    .join('');

  // Add event listeners to category buttons
  categories.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderCategories();
      renderBlogs();
    });
  });
}

// Render all blog cards with GSAP masonry animation
function renderBlogs() {
  const searchQuery = search.value.trim().toLowerCase();
  const sortOrder = sort.value;

  // Filter blogs
  let filtered = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery) ||
      blog.category.toLowerCase().includes(searchQuery) ||
      blog.content.join(' ').toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // Sort blogs
  filtered.sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  // Render cards
  if (filtered.length === 0) {
    grid.innerHTML = '';
    document.querySelector('#empty-state').classList.remove('hidden');
    return;
  }

  document.querySelector('#empty-state').classList.add('hidden');

  grid.innerHTML = filtered
    .map((blog, index) => {
      const preview = blog.content.join(' ').slice(0, 145);
      const previewText =
        blog.content.join(' ').length > 145 ? preview + '…' : preview;

      return `
        <div class="card-wrap">
          <article 
            class="blog-card rounded-2xl p-6 text-[#101313]" 
            style="background: ${escapeHtml(blog.color)}"
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
              ${escapeHtml(previewText)}
            </p>
            <div class="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-bold opacity-55">
              <span>Read note</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7m10 0v10"/>
              </svg>
            </div>
          </article>
        </div>
      `;
    })
    .join('');

  // GSAP Masonry Animation
  const cards = grid.querySelectorAll('.blog-card');
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 40,
      scale: 0.9,
      filter: 'blur(10px)'
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: {
        amount: 0.4,
        from: 'random'
      }
    }
  );

  // Add click listeners to cards
  grid.querySelectorAll('[data-id]').forEach((card) => {
    card.addEventListener('click', () => openArticle(card.dataset.id));
  });
}

// Open article modal
function openArticle(blogId) {
  const blog = blogs.find((b) => b.id === blogId);
  if (!blog) return;

  // Set article background color
  article.style.background = blog.color;
  article.style.color = '#101313';

  // Render article content
  const contentHtml = blog.content
    .map((paragraph) => {
      let text = escapeHtml(paragraph);
      // Support bold: **text**
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Support italic: _text_
      text = text.replace(/_(.*?)_/g, '<em>$1</em>');
      return `<p>${text}</p>`;
    })
    .join('');

  article.innerHTML = `
    <div class="mb-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.12em] opacity-60">
      <span>${escapeHtml(blog.category)}</span>
      <span>•</span>
      <span>${formatDate(blog.date)}</span>
    </div>
    <h1 id="modal-title" class="orbitron text-3xl font-bold leading-tight md:text-5xl">
      ${escapeHtml(blog.title)}
    </h1>
    <div class="mt-10 space-y-6 text-base leading-8 opacity-80">
      ${contentHtml}
    </div>
  `;

  // Handle video section
  const youtubeId = extractYouTubeId(blog.youtube);
  if (youtubeId) {
    videoSection.classList.remove('hidden');
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    document.querySelector('#video-thumb').src = thumbnailUrl;
    document.querySelector('#video-link').href = blog.youtube;
  } else {
    videoSection.classList.add('hidden');
  }

  // Handle sources section
  const hasSources = Array.isArray(blog.sources) && blog.sources.length > 0;
  if (hasSources) {
    sourcesSection.classList.remove('hidden');
    document.querySelector('#sources-list').innerHTML = blog.sources
      .map(
        (source) => `
        <a 
          class="block rounded-lg border border-white/10 bg-white/[.04] px-3 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white" 
          target="_blank" 
          rel="noopener noreferrer" 
          href="${escapeHtml(source.link)}"
        >
          ${escapeHtml(source.name)}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-left: 6px; vertical-align: -2px;">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6"/>
            <path d="M10 14L21 3"/>
          </svg>
        </a>
      `
      )
      .join('');
  } else {
    sourcesSection.classList.add('hidden');
  }

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Modal close button
document.querySelector('#close-modal').addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Event listeners
search.addEventListener('input', renderBlogs);
sort.addEventListener('change', renderBlogs);

// Initialize on page load
window.addEventListener('load', () => {
  renderCategories();
  renderBlogs();
});

// Initial render
renderCategories();
renderBlogs();/**
 * CYBO Blog Page - Interactive JavaScript
 * Handles filtering, searching, modal popups, and dynamic content rendering
 */

// ========================================================================
// INITIALIZATION
// ========================================================================

// DOM Elements
const blogGrid = document.getElementById('blog-grid');
const searchInput = document.getElementById('search-input');
const categoryButtons = document.querySelectorAll('.category-btn');
const articleModal = document.getElementById('article-modal');
const modalClose = document.getElementById('modal-close');
const filterToggle = document.getElementById('filter-toggle');

// State
let allBlogPosts = [];
let currentCategory = 'all';
let currentSearchTerm = '';

// ========================================================================
// LOAD BLOG POSTS FROM DATA
// ========================================================================

function loadBlogPosts() {
    // blogPosts is defined in blogs.js
    if (typeof blogPosts !== 'undefined') {
        allBlogPosts = blogPosts;
        renderBlogPosts();
    } else {
        console.error('Blog data not found. Make sure blogs.js is loaded.');
    }
}

// ========================================================================
// RENDER BLOG CARDS
// ========================================================================

function renderBlogPosts() {
    const filteredPosts = filterBlogPosts();
    
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = '<div class="col-span-full flex items-center justify-center py-20"><p class="text-white/40">No posts found.</p></div>';
        return;
    }

    blogGrid.innerHTML = filteredPosts.map(post => `
        <div class="blog-card" data-post-id="${post.id}">
            <img src="${post.imageUrl}" alt="${post.title}" class="blog-card-image">
            <div class="blog-card-content">
                <span class="blog-card-category">${post.category}</span>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <span class="blog-card-date">${formatDate(post.publishDate)}</span>
                    <span class="blog-card-read-time">${post.readTime} min read</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners to cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.getAttribute('data-post-id');
            openArticleModal(postId);
        });
    });
}

// ========================================================================
// FILTER BLOG POSTS
// ========================================================================

function filterBlogPosts() {
    return allBlogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category.toLowerCase() === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                             post.excerpt.toLowerCase().includes(currentSearchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// ========================================================================
// CATEGORY FILTER
// ========================================================================

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        categoryButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-cyan-500', 'text-black');
            btn.classList.add('bg-white/5', 'border', 'border-white/10');
        });
        
        button.classList.add('active', 'bg-cyan-500', 'text-black');
        button.classList.remove('bg-white/5', 'border', 'border-white/10');
        
        // Update current category
        currentCategory = button.getAttribute('data-category');
        renderBlogPosts();
    });
});

// ========================================================================
// SEARCH FUNCTIONALITY
// ========================================================================

searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    renderBlogPosts();
});

// ========================================================================
// ARTICLE MODAL
// ========================================================================

function openArticleModal(postId) {
    const post = allBlogPosts.find(p => p.id === postId);
    if (!post) return;

    // Set article content
    const modalArticle = document.getElementById('modal-article');
    modalArticle.innerHTML = `
        <h1>${post.title}</h1>
        <div style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 2rem;">
            By ${post.author} • ${formatDate(post.publishDate)} • ${post.readTime} min read
        </div>
        ${post.content}
    `;

    // Set video
    const modalVideo = document.getElementById('modal-video');
    if (post.videoUrl) {
        modalVideo.innerHTML = `
            <div class="modal-video-wrapper">
                <img src="${post.videoThumbnail}" alt="Video thumbnail" class="modal-video-img" onclick="window.open('${post.videoUrl}', '_blank')">
                <div class="modal-video-play">
                    <iconify-icon icon="lucide:play-circle" style="font-size: 4rem; color: var(--brand-cyan);"></iconify-icon>
                </div>
            </div>
        `;
    } else {
        document.getElementById('modal-video-section').style.display = 'none';
    }

    // Set sources
    const modalSources = document.getElementById('modal-sources');
    if (post.sources && post.sources.length > 0) {
        modalSources.innerHTML = post.sources.map(source => `
            <a href="${source.url}" target="_blank" class="source-link">
                <iconify-icon icon="lucide:external-link"></iconify-icon>
                <span>${source.title}</span>
            </a>
        `).join('');
    } else {
        document.getElementById('modal-sources-section').style.display = 'none';
    }

    // Show modal
    articleModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    articleModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closeArticleModal);

// Close modal on backdrop click
articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) {
        closeArticleModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeArticleModal();
    }
});

// ========================================================================
// FILTER TOGGLE (Mobile)
// ========================================================================

filterToggle.addEventListener('click', () => {
    const categoryBar = document.querySelector('[class*="category"]').parentElement;
    categoryBar.classList.toggle('hidden');
});

// ========================================================================
// UTILITY FUNCTIONS
// ========================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ========================================================================
// INITIALIZE
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});
