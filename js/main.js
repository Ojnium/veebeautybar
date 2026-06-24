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
