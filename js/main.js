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
        // Lash Extensions
        { id: 1, title: 'Classic Lash Set', category: 'lashes', image: 'Lash-1.jpeg' },
        { id: 2, title: 'Hybrid Lash Set', category: 'lashes', image: 'assets/images/gallery/Lash-2.jfif' },
        { id: 3, title: 'Volume Lash Set', category: 'lashes', image: 'assets/images/gallery/Lash-3.jfif' },
        { id: 4, title: 'Wispy Lash Effect', category: 'lashes', image: 'assets/images/gallery/Lash-4.jfif' },
        { id: 5, title: 'Custom Lash Design', category: 'lashes', image: 'assets/images/gallery/Lash-5.jfif' },
        { id: 6, title: 'Bottom Lashes', category: 'lashes', image: 'assets/images/gallery/Lash-6.jfif' },
        
        // Brow Services
        { id: 7, title: 'Brow Lamination', category: 'brows', image: 'assets/images/gallery/brow-1.jpg' },
        { id: 8, title: 'Brow Lamination & Tint', category: 'brows', image: 'assets/images/gallery/brow-2.jpg' },
        { id: 9, title: 'Brow Grooming', category: 'brows', image: 'assets/images/gallery/brow-3.jpg' },
        { id: 10, title: 'Brow Shaping', category: 'brows', image: 'assets/images/gallery/brow-4.jpg' },
        
        // Bridal
      //  { id: 11, title: 'Bridal Lash Set', category: 'bridal', image: 'assets/images/gallery/bridal-1.jpg' },
       // { id: 12, title: 'Bridal Makeup & Lashes', category: 'bridal', image: 'assets/images/gallery/bridal-2.jpg' },
      //  { id: 13, title: 'Wedding Day Glam', category: 'bridal', image: 'assets/images/gallery/bridal-3.jpg' },
       // { id: 14, title: 'Bridal Brow & Lash', category: 'bridal', image: 'assets/images/gallery/bridal-4.jpg' },
  //  ];

    // ===== RENDER GALLERY =====
    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreGallery');
    let visibleCount = 6;
    let currentFilter = 'all';

    function renderGalleryItems(filter = 'all', count = visibleCount) {
        const filtered = filter === 'all' 
            ? galleryData 
            : galleryData.filter(item => item.category === filter);
        
        const itemsToShow = filtered.slice(0, count);
        
        galleryGrid.innerHTML = itemsToShow.map(item => `
            <div class="gallery-item" data-category="${item.category}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="placeholder" style="display:none;">
                    <i class="fas fa-image"></i>
                </div>
                <span class="category-badge">${item.category}</span>
                <div class="gallery-item-overlay">
                    <h4>${item.title}</h4>
                    <span>${item.category}</span>
                </div>
            </div>
        `).join('');

        // Add click listeners to gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const index = galleryData.findIndex(g => g.id === id);
                if (index !== -1) {
                    openLightbox(index);
                }
            });
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            const totalFiltered = filter === 'all' ? galleryData.length : galleryData.filter(item => item.category === filter).length;
            if (count >= totalFiltered) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }

    // ===== FILTER BUTTONS =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            currentFilter = this.dataset.filter;
            visibleCount = 6; // Reset visible count on filter change
            renderGalleryItems(currentFilter, visibleCount);
        });
    });

    // ===== LOAD MORE =====
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += 6;
            renderGalleryItems(currentFilter, visibleCount);
        });
    }

    // Initial render
    renderGalleryItems('all', visibleCount);

    // ============================================
    // LIGHTBOX
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const item = galleryData[currentIndex];
        if (item) {
            lightboxImage.src = item.image;
            lightboxImage.alt = item.title;
            lightboxCaption.textContent = `${item.title} · ${item.category}`;
        }
    }

    function navigateLightbox(direction) {
        const filtered = currentFilter === 'all' 
            ? galleryData 
            : galleryData.filter(item => item.category === currentFilter);
        
        if (filtered.length === 0) return;
        
        // Find current item in filtered list
        const currentItem = galleryData[currentIndex];
        const filteredIndex = filtered.findIndex(item => item.id === currentItem.id);
        
        if (filteredIndex === -1) return;
        
        let newFilteredIndex = filteredIndex + direction;
        if (newFilteredIndex < 0) newFilteredIndex = filtered.length - 1;
        if (newFilteredIndex >= filtered.length) newFilteredIndex = 0;
        
        const newItem = filtered[newFilteredIndex];
        const newGlobalIndex = galleryData.findIndex(item => item.id === newItem.id);
        
        if (newGlobalIndex !== -1) {
            currentIndex = newGlobalIndex;
            updateLightbox();
        }
    }

    // Lightbox event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // ============================================
    // WHATSAPP BUTTON TRACKING
    // ============================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            console.log('WhatsApp button clicked');
        });
    }

    // ============================================
    // BOOKING BUTTONS TRACKING
    // ============================================
    document.querySelectorAll('.booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.classList.contains('google-btn') ? 'Google Form' :
                          this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Phone Call';
            console.log(`Booking method selected: ${method}`);
        });
    });

    console.log('VeeBeautyBar website loaded successfully! ✨');
});


// ============================================
// CUSTOMER REVIEWS
// ============================================

// Initialize reviews from localStorage or use defaults
let reviews = [];

// Load reviews from localStorage
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

// Default reviews (sample data)
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

// Save reviews to localStorage
function saveReviews() {
    localStorage.setItem('veebeautybar_reviews', JSON.stringify(reviews));
}

// Render reviews
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

    // Sort by date (newest first)
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

// Helper: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Handle star rating
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('reviewRatingValue');
    const ratingText = document.getElementById('ratingText');

    if (!stars.length) return;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            // Update stars
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
            });

            // Update rating text
            const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
            ratingText.textContent = texts[rating] || 'Select a rating';
        });

        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach(s => {
                s.style.color = parseInt(s.dataset.rating) <= rating ? '#FFB800' : '#ddd';
            });
        });

        star.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value);
            stars.forEach(s => {
                s.style.color = parseInt(s.dataset.rating) <= currentRating ? '#FFB800' : '#ddd';
            });
        });
    });
}

// Handle review submission
function setupReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('reviewerName').value.trim();
        const service = document.getElementById('reviewerService').value;
        const rating = parseInt(document.getElementById('reviewRatingValue').value);
        const text = document.getElementById('reviewText').value.trim();
        const imageFile = document.getElementById('reviewImage').files[0];

        // Validate
        if (!name || !service || !rating || !text) {
            alert('Please fill in all required fields (Name, Service, Rating, and Review)');
            return;
        }

        // Create review object
        const newReview = {
            id: Date.now(),
            name: name,
            service: service,
            rating: rating,
            text: text,
            image: null,
            date: new Date().toISOString()
        };

        // Handle image upload
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

// Add review and update UI
function addReview(review) {
    reviews.unshift(review);
    saveReviews();
    renderReviews();
    
    // Show success message
    const form = document.getElementById('reviewForm');
    const container = form.parentElement;
    
    const success = document.createElement('div');
    success.className = 'review-success show';
    success.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Thank You for Your Review! 🎉</h3>
        <p>Your feedback means the world to us at VeeBeautyBar.</p>
        <button class="btn btn-outline" onclick="this.parentElement.remove(); document.getElementById('reviewForm').reset(); location.reload();">
            <i class="fas fa-plus"></i> Write Another Review
        </button>
    `;
    
    form.style.display = 'none';
    container.appendChild(success);
    
    // Reset form
    form.reset();
    document.getElementById('reviewRatingValue').value = '0';
    document.querySelectorAll('.star-rating i').forEach(s => s.classList.remove('active'));
    document.getElementById('ratingText').textContent = 'Select a rating';
    
    // Scroll to reviews
    document.getElementById('reviewsGrid').scrollIntoView({ behavior: 'smooth' });
}

// Initialize reviews on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    renderReviews();
    setupStarRating();
    setupReviewForm();
});






