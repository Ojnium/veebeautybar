// ============================================
// VEEBEAUTYBAR - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ============================================
    // GALLERY DATA
    // ============================================
    const galleryData = [
        { id: 1, title: 'Classic Lash Set', category: 'lashes', image: 'Lash-1.jpeg' },
        { id: 2, title: 'Hybrid Lash Set', category: 'lashes', image: 'Lash-2.jfif' },
        { id: 3, title: 'Volume Lash Set', category: 'lashes', image: 'Lash-3.jfif' },
        { id: 4, title: 'Wispy Lash Effect', category: 'lashes', image: 'Lash-4.jfif' },
        { id: 5, title: 'Custom Lash Design', category: 'lashes', image: 'Lash-5.jfif' },
        { id: 6, title: 'Bottom Lashes', category: 'lashes', image: 'Lash-6.jfif' },
        { id: 7, title: 'Brow Lamination', category: 'brows', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Brow+Lamination' },
        { id: 8, title: 'Brow Lamination & Tint', category: 'brows', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Brow+%26+Tint' },
        { id: 9, title: 'Brow Grooming', category: 'brows', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Brow+Grooming' },
        { id: 10, title: 'Brow Shaping', category: 'brows', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Brow+Shaping' },
        { id: 11, title: 'Bridal Lash Set', category: 'bridal', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Bridal+Lashes' },
        { id: 12, title: 'Bridal Makeup & Lashes', category: 'bridal', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Bridal+Makeup' },
        { id: 13, title: 'Wedding Day Glam', category: 'bridal', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Wedding+Glam' },
        { id: 14, title: 'Bridal Brow & Lash', category: 'bridal', image: 'https://placehold.co/400x400/F8BBD0/000000?text=Bridal+Brow' },
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreGallery');
    let visibleCount = 6;
    let currentFilter = 'all';

    function renderGalleryItems(filter = 'all', count = visibleCount) {
        const filtered = filter === 'all' ? galleryData : galleryData.filter(item => item.category === filter);
        const itemsToShow = filtered.slice(0, count);
        
        galleryGrid.innerHTML = itemsToShow.map(item => `
            <div class="gallery-item" data-category="${item.category}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <span class="category-badge">${item.category}</span>
                <div class="gallery-item-overlay">
                    <h4>${item.title}</h4>
                    <span>${item.category}</span>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const index = galleryData.findIndex(g => g.id === id);
                if (index !== -1) openLightbox(index);
            });
        });

        if (loadMoreBtn) {
            const totalFiltered = filter === 'all' ? galleryData.length : galleryData.filter(item => item.category === filter).length;
            loadMoreBtn.style.display = count >= totalFiltered ? 'none' : 'inline-flex';
        }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            visibleCount = 6;
            renderGalleryItems(currentFilter, visibleCount);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += 6;
            renderGalleryItems(currentFilter, visibleCount);
        });
    }

    renderGalleryItems('all', visibleCount);

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryData[currentIndex];
        lightboxImage.src = item.image;
        lightboxCaption.textContent = `${item.title} · ${item.category}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        const filtered = currentFilter === 'all' ? galleryData : galleryData.filter(item => item.category === currentFilter);
        const currentItem = galleryData[currentIndex];
        const filteredIndex = filtered.findIndex(item => item.id === currentItem.id);
        let newFilteredIndex = filteredIndex + direction;
        if (newFilteredIndex < 0) newFilteredIndex = filtered.length - 1;
        if (newFilteredIndex >= filtered.length) newFilteredIndex = 0;
        const newItem = filtered[newFilteredIndex];
        const newGlobalIndex = galleryData.findIndex(item => item.id === newItem.id);
        if (newGlobalIndex !== -1) {
            currentIndex = newGlobalIndex;
            const item = galleryData[currentIndex];
            lightboxImage.src = item.image;
            lightboxCaption.textContent = `${item.title} · ${item.category}`;
        }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); navigateLightbox(-1); });
    lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); navigateLightbox(1); });
    lightbox.addEventListener('click', function(e) { if (e.target === this) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') navigateLightbox(-1);
        else if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ============================================
    // CUSTOMER REVIEWS - COMPLETE WORKING VERSION
    // ============================================

    let reviews = [];

    function getDefaultReviews() {
        return [
            {
                id: 1,
                name: 'Chioma Okafor',
                service: 'Volume Lash Set',
                rating: 5,
                text: 'Absolutely love my lashes! VeeBeautyBar did an amazing job. The volume set is so natural and beautiful. I\'ve gotten so many compliments! Definitely coming back.',
                image: null,
                date: new Date('2026-06-20').toISOString()
            },
            {
                id: 2,
                name: 'Aisha Mohammed',
                service: 'Brow Lamination',
                rating: 5,
                text: 'Best brow lamination in Abuja! My brows have never looked this good. The service was professional and the results lasted for weeks. Highly recommend!',
                image: null,
                date: new Date('2026-06-18').toISOString()
            },
            {
                id: 3,
                name: 'Tolu Adebayo',
                service: 'Hybrid Lash Set',
                rating: 4,
                text: 'Great experience at VeeBeautyBar. The hybrid lashes are perfect for my wedding coming up. The staff was very professional and made me feel comfortable.',
                image: null,
                date: new Date('2026-06-15').toISOString()
            }
        ];
    }

    function loadReviews() {
        const stored = localStorage.getItem('veebeautybar_reviews');
        if (stored) {
            try {
                reviews = JSON.parse(stored);
            } catch (e) {
                reviews = getDefaultReviews();
            }
        } else {
            reviews = getDefaultReviews();
        }
        return reviews;
    }

    function saveReviews() {
        localStorage.setItem('veebeautybar_reviews', JSON.stringify(reviews));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function renderReviews() {
        const grid = document.getElementById('reviewsGrid');
        if (!grid) return;

        if (reviews.length === 0) {
            grid.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-star"></i>
                    <h3>No Reviews Yet</h3>
                    <p>Be the first to share your VeeBeautyBar experience!</p>
                </div>
            `;
            return;
        }

        const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        grid.innerHTML = sorted.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="review-user-info">
                        <h4>${escapeHtml(review.name)}</h4>
                        <span class="review-service">${escapeHtml(review.service)}</span>
                    </div>
                    <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p class="review-text">${escapeHtml(review.text)}</p>
                ${review.image ? `<div class="review-image"><img src="${review.image}" alt="Review photo"></div>` : ''}
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
        `).join('');
    }

    // ===== STAR RATING =====
    function setupStarRating() {
        const stars = document.querySelectorAll('.star-rating i');
        const ratingInput = document.getElementById('reviewRatingValue');
        const ratingText = document.getElementById('ratingText');
        
        if (!stars.length) return;

        const ratingLabels = {
            0: 'Select a rating',
            1: 'Poor 😕',
            2: 'Fair 😐',
            3: 'Good 🙂',
            4: 'Very Good 😊',
            5: 'Excellent 🤩'
        };

        function updateStars(rating) {
            stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= rating) {
                    star.classList.add('active');
                    star.style.color = '#FFB800';
                } else {
                    star.classList.remove('active');
                    star.style.color = '#ddd';
                }
            });
        }

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                ratingInput.value = rating;
                updateStars(rating);
                ratingText.textContent = ratingLabels[rating] || 'Select a rating';
            });

            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.rating) <= rating ? '#FFB800' : '#ddd';
                });
            });

            star.addEventListener('mouseleave', function() {
                const currentRating = parseInt(ratingInput.value) || 0;
                updateStars(currentRating);
            });
        });

        updateStars(0);
        ratingText.textContent = ratingLabels[0];
    }

    // ===== REVIEW FORM SUBMISSION =====
    function setupReviewForm() {
        const form = document.getElementById('reviewForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewerName').value.trim();
            const service = document.getElementById('reviewerService').value;
            const rating = parseInt(document.getElementById('reviewRatingValue').value);
            const text = document.getElementById('reviewText').value.trim();
            const imageFile = document.getElementById('reviewImage').files[0];

            if (!name || !service || !rating || !text) {
                alert('Please fill in all required fields (Name, Service, Rating, and Review)');
                return;
            }

            const newReview = {
                id: Date.now(),
                name: name,
                service: service,
                rating: rating,
                text: text,
                image: null,
                date: new Date().toISOString()
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    newReview.image = e.target.result;
                    addReview(newReview);
                };
                reader.readAsDataURL(imageFile);
            } else {
                addReview(newReview);
            }
        });
    }

    function addReview(review) {
        reviews.unshift(review);
        saveReviews();
        renderReviews();
        
        const form = document.getElementById('reviewForm');
        const container = form.parentElement;
        
        const existingSuccess = container.querySelector('.review-success');
        if (existingSuccess) existingSuccess.remove();
        
        const success = document.createElement('div');
        success.className = 'review-success show';
        success.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Thank You for Your Review! 🎉</h3>
            <p>Your feedback means the world to us at VeeBeautyBar.</p>
            <button class="btn btn-outline" onclick="location.reload();">
                <i class="fas fa-plus"></i> Write Another Review
            </button>
        `;
        
        form.style.display = 'none';
        container.appendChild(success);
        
        form.reset();
        document.getElementById('reviewRatingValue').value = '0';
        document.querySelectorAll('.star-rating i').forEach(s => {
            s.classList.remove('active');
            s.style.color = '#ddd';
        });
        document.getElementById('ratingText').textContent = 'Select a rating';
        
        document.getElementById('reviewsGrid').scrollIntoView({ behavior: 'smooth' });
    }

    // ===== INITIALIZE =====
    loadReviews();
    renderReviews();
    setupStarRating();
    setupReviewForm();

    console.log('VeeBeautyBar website loaded successfully! ✨');
});
