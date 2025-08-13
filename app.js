// Электрико - Исправленная интерактивная функциональность

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initMobileMenu();
    initSmoothScroll();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const breadcrumbs = document.getElementById('breadcrumbs');

    // Handle scroll effect on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
        if (breadcrumbs) {
            updateBreadcrumbs();
        }
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    function updateBreadcrumbs() {
        const activeLink = document.querySelector('.nav-link.active');
        const breadcrumbText = breadcrumbs.querySelector('span');

        if (activeLink && breadcrumbText) {
            const sectionName = activeLink.textContent;
            breadcrumbText.textContent = `Главная > ${sectionName}`;
        } else if (breadcrumbText) {
            breadcrumbText.textContent = 'Главная';
        }
    }
}

// Fixed smooth scrolling for navigation links
function initSmoothScroll() {
    // Handle all navigation links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        }
    });

    // Handle buttons that should scroll to contact
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (button && (
            button.textContent.includes('Получить бесплатную консультацию') ||
            button.textContent.includes('Заказать звонок') ||
            button.textContent.includes('Оставить заявку') ||
            button.textContent.includes('Заказать')
        )) {
            e.preventDefault();
            scrollToContact();
        }
    });
}

// Global scroll functions - Fixed
function scrollToSection(sectionId) {
    // Check if we're on the main page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbar = document.getElementById('navbar');
            const breadcrumbs = document.getElementById('breadcrumbs');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const breadcrumbHeight = breadcrumbs ? breadcrumbs.offsetHeight : 0;
            const offsetTop = section.offsetTop - navbarHeight - breadcrumbHeight - 20;

            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMobileMenu();
        }
    } else {
        // If we're on a different page, redirect to main page with anchor
        window.location.href = `index.html#${sectionId}`;
    }
}

function scrollToContact() {
    // Check if we're on the main page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        scrollToSection('contact');
    } else {
        // If we're on a different page, redirect to main page contact section
        window.location.href = 'index.html#contact';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        resetHamburgerIcon();
    }
}

function resetHamburgerIcon() {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Animate hamburger
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            resetHamburgerIcon();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Add mobile menu styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: var(--color-surface);
                flex-direction: column;
                padding: var(--space-16);
                box-shadow: var(--shadow-lg);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all var(--duration-normal) var(--ease-standard);
                z-index: 999;
            }

            .nav-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .nav-menu li {
                margin: var(--space-8) 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .review-card, .tip-card, .team-card');

    // Add animation classes
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        if (index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else {
            el.classList.add('slide-in-right');
        }
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Add counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

// Counter animation for statistics
function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+$/.test(target);

    if (isNumber) {
        const targetValue = parseInt(target);
        let currentValue = 0;
        const increment = targetValue / 50;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 30);
    }
}

// ИСПРАВЛЕННАЯ FAQ функциональность
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        if (question && answer && toggle) {
            // Remove any existing event listeners
            const newQuestion = question.cloneNode(true);
            question.parentNode.replaceChild(newQuestion, question);

            // Add click event to new question element
            newQuestion.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        }
    });
}

// Fixed contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameField = document.getElementById('name');
    const phoneField = document.getElementById('phone');
    const serviceField = document.getElementById('service');
    const messageField = document.getElementById('message');

    if (!form) return;

    // Phone number formatting
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Handle Russian phone numbers
            if (value.startsWith('8')) {
                value = '7' + value.substring(1);
            }

            if (value.startsWith('7') && value.length <= 11) {
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length > 4) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length > 7) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length > 9) {
                    formatted += '-' + value.substring(9, 11);
                }
                e.target.value = formatted;
            } else if (value && !value.startsWith('7')) {
                e.target.value = '+7 ' + value.substring(0, 10);
            }
        });
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Clear any existing errors
        clearFormErrors();

        if (validateForm()) {
            submitForm();
        }

        return false;
    });

    function clearFormErrors() {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());

        [nameField, phoneField].forEach(field => {
            if (field) {
                field.style.borderColor = '';
            }
        });
    }

    function validateForm() {
        let isValid = true;

        // Validate name
        if (!nameField || nameField.value.trim().length < 2) {
            if (nameField) {
                showFieldError(nameField, 'Введите корректное имя');
                isValid = false;
            }
        }

        // Validate phone
        if (!phoneField || !phoneField.value.trim()) {
            if (phoneField) {
                showFieldError(phoneField, 'Введите номер телефона');
                isValid = false;
            }
        } else {
            const phoneValue = phoneField.value.replace(/\D/g, '');
            if (phoneValue.length !== 11 || !phoneValue.startsWith('7')) {
                showFieldError(phoneField, 'Введите корректный номер телефона');
                isValid = false;
            }
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.style.borderColor = 'var(--color-error)';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
        `;
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);

        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
                field.style.borderColor = '';
            }
        }, 5000);
    }

    function submitForm() {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Get form data
        const formData = {
            name: nameField.value.trim(),
            phone: phoneField.value.trim(),
            service: serviceField ? serviceField.value : '',
            message: messageField ? messageField.value.trim() : ''
        };

        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showSuccessMessage();

            // Reset form
            form.reset();

            // Track form submission
            trackEvent('form_submission', formData);
        }, 2000);
    }

    function showSuccessMessage() {
        // Remove existing success message
        const existingSuccess = form.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <h4>Спасибо за заявку!</h4>
            <p>Наш менеджер свяжется с вами в течение 15 минут.</p>
        `;
        form.appendChild(successDiv);

        // Hide success message after 5 seconds
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('scroll', debounce(() => {
    // Throttled scroll events
}, 10));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Analytics placeholder
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
}

// Track phone clicks
document.addEventListener('click', function(e) {
    const phoneLink = e.target.closest('a[href^="tel:"]');
    if (phoneLink) {
        trackEvent('phone_click', {
            phone_number: phoneLink.getAttribute('href')
        });
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 20px;
        font-weight: bold;
        box-shadow: var(--shadow-md);
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
initBackToTop();

// Make functions globally available
window.scrollToSection = scrollToSection;
window.scrollToContact = scrollToContact;
window.closeMobileMenu = closeMobileMenu;
