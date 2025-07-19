// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true
    });

    // Initialize particles.js
    initParticles();

    // Initialize other features
    initNavigation();
    initSmoothScrolling();
    initPortfolioFilter();
    initContactForm();
    initSkillBarsAnimation();
    initScrollReveal();
    initTypewriter();
    initNavbarScroll();
});

// Particles.js Configuration
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#F6B17A'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#F6B17A',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Mobile Navigation Toggle
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
}

// Portfolio Filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });
}

// Notification System
function showNotification(type, title, message) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification elements
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' 
        ? 'fas fa-check-circle'
        : 'fas fa-exclamation-circle';
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'notification-title';
    titleElement.textContent = title;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    
    // Assemble notification
    content.appendChild(titleElement);
    content.appendChild(messageElement);
    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Close button handler
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Form validation and submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show sending state
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                form.reset();
                showNotification('success', 'Success!', 'Thank you for your message. I will get back to you soon!');
                submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error!', 'Oops! There was a problem submitting your form. Please try again.');
            submitBtn.innerHTML = '<span>Error!</span> <i class="fas fa-exclamation-circle"></i>';
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // Real-time validation feedback
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.value.trim()) {
                field.classList.remove('error');
            }
        });
    });
}

// Form validation helper
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                field.classList.add('error');
            }
        }
    });
    
    return isValid;
}

// Skill bars animation
function initSkillBarsAnimation() {
    const skillBars = document.querySelectorAll('.skill-level');
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const percent = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = percent;
            }, 100);
        });
    };

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelector('.skills-grid')?.forEach(grid => {
        observer.observe(grid);
    });
}

// ScrollReveal initialization
function initScrollReveal() {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '20px',
        duration: 1000,
        reset: false
    });

    sr.reveal('.skill-item', { interval: 200 });
    sr.reveal('.service-card', { interval: 200 });
    sr.reveal('.portfolio-item', { interval: 200 });
}

// Typewriter effect
function initTypewriter() {
    const typewriterText = document.querySelector('.typewriter');
    if (!typewriterText) return;

    const text = typewriterText.textContent;
    typewriterText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typewriterText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing when the element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(typewriterText);
}

// Navbar background change on scroll
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(30, 33, 50, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
        }
    });
}
