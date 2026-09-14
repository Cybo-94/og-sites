/**
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
