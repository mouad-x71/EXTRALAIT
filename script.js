// ===== Wait for DOM to be fully loaded =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Initialize Page =====
    initPage();
    
    // ===== Smooth Scroll Navigation =====
    initNavigation();
    
    // ===== 3D Tilt Effect for Cards =====
    init3DTiltEffect();
    
    // ===== Scroll Reveal Animation =====
    initScrollReveal();
    
    // ===== Quantity Buttons =====
    initQuantityButtons();
    
    // ===== Tab Buttons =====
    initTabButtons();
    
    // ===== Form Submission =====
    initContactForm();
    
    // ===== Mobile Menu =====
    initMobileMenu();
    
    // ===== Parallax Effect =====
    initParallax();
});

// ===== Initialize Page =====
function initPage() {
    // Ensure all content is visible
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    
    // Add loaded class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// ===== Smooth Scroll Navigation =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Click handlers for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===== 3D Tilt Effect for Cards =====
function init3DTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
        });
    });
    
    function handleTilt(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-15px)
            scale(1.02)
        `;
        
        // Add shine effect
        const shine = card.querySelector('.shine') || createShine(card);
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
    }
    
    function resetTilt() {
        this.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        
        const shine = this.querySelector('.shine');
        if (shine) {
            shine.style.background = 'transparent';
        }
    }
    
    function createShine(card) {
        const shine = document.createElement('div');
        shine.className = 'shine';
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border-radius: inherit;
            z-index: 10;
            transition: background 0.3s ease;
        `;
        card.style.position = 'relative';
        card.appendChild(shine);
        return shine;
    }
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        observer.observe(el);
    });
    
    // Also observe elements without data-reveal that should animate
    const additionalElements = document.querySelectorAll('.product-card-3d, .stat-card, .testimonial-card, .hygiene-card');
    additionalElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const elObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    elObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elObserver.observe(el);
    });
}

// ===== Quantity Buttons =====
function initQuantityButtons() {
    const qtyBtns = document.querySelectorAll('.qty-btn');
    
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quantityDiv = this.closest('.quantity');
            const qtyValue = quantityDiv.querySelector('.qty-value');
            let currentValue = parseInt(qtyValue.textContent);
            
            if (this.classList.contains('minus')) {
                if (currentValue > 1) {
                    qtyValue.textContent = currentValue - 1;
                }
            } else if (this.classList.contains('plus')) {
                qtyValue.textContent = currentValue + 1;
            }
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ===== Tab Buttons =====
function initTabButtons() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== Contact Form =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            if (name && email && message) {
                // Show success message
                showNotification('Merci pour votre message! Nous vous contacterons bientôt.', 'success');
                this.reset();
            } else {
                showNotification('Veuillez remplir tous les champs.', 'error');
            }
        });
    }
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Mobile Menu =====
function initMobileMenu() {
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Menu');
        document.body.appendChild(mobileMenuBtn);
        
        const sidebar = document.querySelector('.sidebar');
        
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            this.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
        });
        
        // Close sidebar when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('open');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
}

// ===== Parallax Effect =====
function initParallax() {
    const parallaxImages = document.querySelectorAll('.timeline-image img, .product-image img');
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                
                parallaxImages.forEach(img => {
                    const parent = img.parentElement;
                    const rect = parent.getBoundingClientRect();
                    
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const speed = 0.05;
                        const yPos = (scrolled - parent.offsetTop) * speed;
                        img.style.transform = `translateY(${yPos}px) scale(1.1)`;
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===== Add CSS Animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .product-card-3d {
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
`;
document.head.appendChild(style);

// ===== Console Welcome Message =====
console.log('%c Extralait ', 'background: linear-gradient(135deg, #2d8bc9, #1e3a5f); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%c Bienvenue sur le site web d\'Extralait! ', 'color: #2d8bc9; font-size: 14px;');
