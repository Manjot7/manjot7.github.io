// Particle Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(139, 92, 246, ${Math.random() * 0.5 + 0.5});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        from {
            transform: translateY(0) translateX(0);
        }
        to {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
        }
    }
`;
document.head.appendChild(style);

// Navigation
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '-50% 0px -50% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const text = 'Data Scientist';
let index = 0;
let isDeleting = false;

function typeWriter() {
    if (!typingText) return;
    
    if (!isDeleting) {
        typingText.textContent = text.substring(0, index);
        index++;
        
        if (index > text.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typingText.textContent = text.substring(0, index);
        index--;
        
        if (index === 0) {
            isDeleting = false;
        }
    }
    
    setTimeout(typeWriter, isDeleting ? 50 : 100);
}

// Counter animation
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const countUp = (counter) => {
    const target = +counter.getAttribute('data-target') || parseFloat(counter.innerText);
    const isDecimal = target % 1 !== 0;
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
        if (isDecimal) {
            counter.innerText = (count + increment).toFixed(2);
        } else {
            counter.innerText = Math.ceil(count + increment);
        }
        setTimeout(() => countUp(counter), 10);
    } else {
        counter.innerText = isDecimal ? target.toFixed(2) : target;
    }
};

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            // Special handling for the GPA counter
            if (entry.target.innerText === '9.55') {
                entry.target.innerText = '0';
            }
            countUp(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Scroll reveal animation
const scrollRevealElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .academic-card');

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

scrollRevealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    scrollRevealObserver.observe(el);
});

// Progress bar animation for coming soon projects
const progressBars = document.querySelectorAll('.progress-fill');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Tilt effect for project cards
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setTimeout(typeWriter, 1000);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Mouse trail effect
const mouseTrail = [];
const trailLength = 20;

for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'mouse-trail';
    dot.style.cssText = `
        position: fixed;
        width: ${(trailLength - i) / 2}px;
        height: ${(trailLength - i) / 2}px;
        background: rgba(139, 92, 246, ${0.5 - (i / trailLength) * 0.5});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(dot);
    mouseTrail.push(dot);
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    let x = mouseX;
    let y = mouseY;
    
    mouseTrail.forEach((dot, index) => {
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        
        const nextDot = mouseTrail[index + 1] || mouseTrail[0];
        x += (nextDot.offsetLeft - x) * 0.3;
        y += (nextDot.offsetTop - y) * 0.3;
    });
    
    requestAnimationFrame(animateTrail);
}

animateTrail();

// Disable mouse trail on mobile
if (window.matchMedia('(max-width: 768px)').matches) {
    mouseTrail.forEach(dot => dot.style.display = 'none');
}