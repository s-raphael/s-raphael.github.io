$(document).ready(function() {
    
    // Mobile Navigation Toggle
    $('.nav-toggle').click(function() {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('active');
    });

    // Close mobile menu when clicking on a link
    $('.nav-link').click(function() {
        $('.nav-menu').removeClass('active');
        $('.nav-toggle').removeClass('active');
    });

    // Smooth scrolling for navigation links
    $('.nav-link').click(function(e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        const targetSection = $(targetId);
        
        if (targetSection.length) {
            $('html, body').animate({
                scrollTop: targetSection.offset().top - 70
            }, 800);
        }
    });

    // Add easing function for smooth scrolling
    $.easing.easeInOutCubic = function(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    // Header background change on scroll
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        
        if (scrollTop > 100) {
            $('.header').addClass('scrolled');
        } else {
            $('.header').removeClass('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        // Animate elements on scroll
        animateOnScroll();
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            const refElement = $($(this).attr('href'));
            if (refElement.length && 
                refElement.offset().top <= scrollPos && 
                refElement.offset().top + refElement.outerHeight() > scrollPos) {
                $('.nav-link').removeClass('active');
                $(this).addClass('active');
            }
        });
    }

    // Animate elements when they come into view
    function animateOnScroll() {
        $('.stat-item, .skill-item, .project-item').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate');
            }
        });
        
        // Animate skill bars
        $('.skill-progress').each(function() {
            const skillBar = $(this);
            const skillPercentage = skillBar.data('skill');
            const elementTop = skillBar.offset().top;
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementTop < viewportBottom && !skillBar.hasClass('animated')) {
                skillBar.addClass('animated');
                skillBar.css('--skill-width', skillPercentage + '%');
                skillBar[0].style.setProperty('--skill-width', skillPercentage + '%');
                skillBar.find('::before').css('width', skillPercentage + '%');
                
                // Alternative method using direct style manipulation
                setTimeout(function() {
                    const beforeElement = window.getComputedStyle(skillBar[0], '::before');
                    skillBar[0].style.setProperty('--skill-percentage', skillPercentage + '%');
                }, 100);
            }
        });
    }

    // Add CSS for skill bar animation and other dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        .skill-progress.animated::before {
            animation: skillFill 1.5s ease forwards;
        }
        @keyframes skillFill {
            to {
                width: var(--skill-percentage, 0%);
            }
        }
        section {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        section.section-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .hero {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);

    // Counter animation for stats
    function animateCounters() {
        $('.stat-number').each(function() {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            
            if (!$this.hasClass('counted')) {
                $this.addClass('counted');
                $({ counter: 0 }).animate({ counter: target }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.ceil(this.counter));
                    },
                    complete: function() {
                        $this.text(target);
                    }
                });
            }
        });
    }

    // Trigger counter animation when stats section is visible
    $(window).scroll(function() {
        const statsSection = $('.stats');
        if (statsSection.length) {
            const sectionTop = statsSection.offset().top;
            const sectionBottom = sectionTop + statsSection.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
                animateCounters();
            }
        }
    });

    // Learn More button functionality
    $('#learnMore').click(function() {
        $('html, body').animate({
            scrollTop: $('#about').offset().top - 70
        }, 1000);
    });

    // Project filtering
    $('.filter-btn').click(function() {
        const filter = $(this).data('filter');
        
        // Update active button
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Filter projects
        $('.project-item').each(function() {
            const category = $(this).data('category');
            
            if (filter === 'all' || category === filter) {
                $(this).removeClass('hidden').addClass('visible');
            } else {
                $(this).addClass('hidden').removeClass('visible');
            }
        });
    });

    // Contact form handling
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        // Simple form validation and feedback
        const name = $(this).find('input[type="text"]').val();
        const email = $(this).find('input[type="email"]').val();
        const message = $(this).find('textarea').val();
        
        if (name && email && message) {
            // Show success message
            showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        } else {
            showMessage('Please fill in all fields.', 'error');
        }
    });

    // Message display function
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageEl = document.createElement('div');
        messageEl.className = 'message ' + type;
        messageEl.textContent = text;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Parallax effect for hero section
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const parallax = $('.hero');
        const speed = scrolled * 0.5;
        
        parallax.css('transform', 'translateY(' + speed + 'px)');
    });

    // Add hover effects to interactive elements
    $('.cta-button, .filter-btn, .contact-form button').hover(
        function() {
            $(this).addClass('hover-effect');
        },
        function() {
            $(this).removeClass('hover-effect');
        }
    );

    // Smooth reveal animation for sections
    function revealSections() {
        $('section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
                $(this).addClass('section-visible');
            }
        });
    }



    // Initial animations
    $(window).scroll();
    revealSections();
    
    // Re-run animations on scroll
    $(window).scroll(revealSections);

    // Add loading animation
    $('body').css('opacity', '0');
    $(window).on('load', function() {
        $('body').animate({
            opacity: 1
        }, 500);
    });

    // Skill bar animation fix
    $(window).scroll(function() {
        $('.skill-progress').each(function() {
            const skillBar = $(this);
            const skillPercentage = skillBar.data('skill');
            const elementTop = skillBar.offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < viewportBottom && !skillBar.hasClass('skill-animated')) {
                skillBar.addClass('skill-animated');
                skillBar.css({
                    'position': 'relative',
                    'background': '#f0f0f0',
                    'border-radius': '25px',
                    'overflow': 'hidden'
                });
                
                // Create progress bar
                const progressBar = $('<div></div>').css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'height': '100%',
                    'background': 'linear-gradient(135deg, #3498db, #9b59b6)',
                    'border-radius': '25px',
                    'width': '0%',
                    'transition': 'width 1.5s ease'
                });
                
                skillBar.append(progressBar);
                
                setTimeout(function() {
                    progressBar.css('width', skillPercentage + '%');
                }, 100);
            }
        });
    });

    console.log('Personal Website with jQuery loaded successfully!');
});