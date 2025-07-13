// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.setupThemeToggle()
    this.updateThemeIcon()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
    this.updateThemeIcon()
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById("theme-toggle")
    const icon = themeToggle.querySelector("i")

    if (this.theme === "light") {
      icon.setAttribute("data-lucide", "moon")
    } else {
      icon.setAttribute("data-lucide", "sun")
    }

    // Re-initialize Lucide icons
    if (typeof window.lucide !== "undefined") {
      window.lucide.createIcons()
    }
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle")
    themeToggle.addEventListener("click", () => this.toggleTheme())
  }
}

// Mobile Menu Management
class MobileMenu {
  constructor() {
    this.isOpen = false
    this.init()
  }

  init() {
    this.setupMobileMenuToggle()
    this.createMobileMenu()
  }

  setupMobileMenuToggle() {
    const toggle = document.getElementById("mobile-menu-toggle")
    toggle.addEventListener("click", () => this.toggleMenu())
  }

  createMobileMenu() {
    const nav = document.querySelector(".nav")
    const mobileMenu = document.createElement("div")
    mobileMenu.className = "mobile-menu"
    mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <a href="#features" class="mobile-nav-link">Features</a>
                <a href="#services" class="mobile-nav-link">Services</a>
                <a href="#apps" class="mobile-nav-link">Apps</a>
                <a href="#testimonials" class="mobile-nav-link">Testimonials</a>
                <button class="btn btn-primary mobile-cta">Get Started</button>
            </div>
        `
    nav.appendChild(mobileMenu)

    // Add mobile menu styles
    const style = document.createElement("style")
    style.textContent = `
            .mobile-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--blur-bg);
                backdrop-filter: blur(12px);
                border-top: 1px solid var(--border-color);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .mobile-menu.open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .mobile-menu-content {
                padding: 2rem 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }
            
            .mobile-nav-link {
                color: var(--text-secondary);
                text-decoration: none;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
                width: 100%;
                text-align: center;
            }
            
            .mobile-nav-link:hover {
                color: var(--orange-500);
                background: var(--bg-card);
            }
            
            .mobile-cta {
                margin-top: 1rem;
                width: 100%;
                justify-content: center;
            }
            
            @media (min-width: 769px) {
                .mobile-menu {
                    display: none;
                }
            }
        `
    document.head.appendChild(style)

    // Add click handlers for mobile menu links
    const mobileLinks = mobileMenu.querySelectorAll(".mobile-nav-link")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu())
    })
  }

  toggleMenu() {
    const mobileMenu = document.querySelector(".mobile-menu")
    this.isOpen = !this.isOpen

    if (this.isOpen) {
      mobileMenu.classList.add("open")
    } else {
      mobileMenu.classList.remove("open")
    }
  }

  closeMenu() {
    const mobileMenu = document.querySelector(".mobile-menu")
    this.isOpen = false
    mobileMenu.classList.remove("open")
  }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", this.handleClick.bind(this))
    })
  }

  handleClick(e) {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = targetElement.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }
}

// Intersection Observer for Animations
class ScrollAnimations {
  constructor() {
    this.init()
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), observerOptions)

    // Observe elements that should animate
    const animatedElements = document.querySelectorAll(`
            .feature-card,
            .service-card,
            .app-card,
            .testimonial-card,
            .stat-card,
            .hero-text,
            .hero-image
        `)

    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      this.observer.observe(el)
    })
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        this.observer.unobserve(entry.target)
      }
    })
  }
}

// Form Handling (for future contact forms)
class FormHandler {
  constructor() {
    this.init()
  }

  init() {
    // Add form handling logic here when forms are added
    const buttons = document.querySelectorAll(".btn")
    buttons.forEach((button) => {
      button.addEventListener("click", this.handleButtonClick.bind(this))
    })
  }

  handleButtonClick(e) {
    const button = e.currentTarget
    const text = button.textContent.trim()

    // Add loading state for CTA buttons
    if (text.includes("Start Your Project") || text.includes("Get Started")) {
      this.showLoadingState(button)

      // Simulate API call
      setTimeout(() => {
        this.resetButtonState(button, text)
        // Here you would typically redirect or show a modal
        console.log("CTA clicked:", text)
      }, 2000)
    }
  }

  showLoadingState(button) {
    const originalText = button.innerHTML
    button.innerHTML = "Loading..."
    button.disabled = true
    button.style.opacity = "0.7"
    button.dataset.originalText = originalText
  }

  resetButtonState(button, originalText) {
    button.innerHTML = originalText
    button.disabled = false
    button.style.opacity = "1"
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    // Lazy load images
    this.setupLazyLoading()

    // Optimize scroll events
    this.setupScrollOptimization()
  }

  setupLazyLoading() {
    const images = document.querySelectorAll("img[src]")

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.classList.add("loaded")
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }
  }

  setupScrollOptimization() {
    let ticking = false

    const updateScrollEffects = () => {
      // Add scroll-based effects here
      ticking = false
    }

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof window.lucide !== "undefined") {
    window.lucide.createIcons()
  }

  // Initialize all components
  new ThemeManager()
  new MobileMenu()
  new SmoothScroll()
  new ScrollAnimations()
  new FormHandler()
  new PerformanceOptimizer()

  // Add loading complete class
  document.body.classList.add("loaded")
})

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize
  const mobileMenu = document.querySelector(".mobile-menu")
  if (mobileMenu && mobileMenu.classList.contains("open")) {
    mobileMenu.classList.remove("open")
  }
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  const mobileMenu = document.querySelector(".mobile-menu")
  if (mobileMenu && mobileMenu.classList.contains("open")) {
    mobileMenu.classList.remove("open")
  }

  if (document.hidden) {
    // Pause any animations or timers when page is hidden
    console.log("Page hidden - pausing animations")
  } else {
    // Resume animations when page becomes visible
    console.log("Page visible - resuming animations")
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

// Service Worker registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration would go here
    console.log("Service Worker support detected")
  })
}
