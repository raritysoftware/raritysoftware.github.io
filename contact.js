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
                <a href="index.html" class="mobile-nav-link">Home</a>
                <a href="index.html#features" class="mobile-nav-link">Features</a>
                <a href="index.html#services" class="mobile-nav-link">Services</a>
                <a href="index.html#apps" class="mobile-nav-link">Apps</a>
                <a href="contact.html" class="mobile-nav-link">Contact</a>
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

// Form Validation and Handling
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = document.getElementById("submit-btn")
    this.successMessage = document.getElementById("success-message")
    this.validators = {
      firstName: this.validateRequired,
      lastName: this.validateRequired,
      email: this.validateEmail,
      phone: this.validatePhone,
      projectType: this.validateRequired,
      message: this.validateMessage,
      privacy: this.validateCheckbox,
    }
    this.init()
  }

  init() {
    this.setupFormSubmission()
    this.setupRealTimeValidation()
    this.setupSendAnotherButton()
  }

  setupFormSubmission() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSubmit()
    })
  }

  setupRealTimeValidation() {
    // Add real-time validation for all form fields
    Object.keys(this.validators).forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.addEventListener("blur", () => this.validateField(fieldName))
        field.addEventListener("input", () => this.clearError(fieldName))
      }
    })
  }

  setupSendAnotherButton() {
    const sendAnotherBtn = document.getElementById("send-another")
    sendAnotherBtn.addEventListener("click", () => {
      this.resetForm()
      this.hideSuccessMessage()
    })
  }

  async handleSubmit() {
    const isValid = this.validateForm()

    if (!isValid) {
      this.showFormErrors()
      return
    }

    this.showLoadingState()

    try {
      // Simulate API call
      await this.submitForm()
      this.showSuccessMessage()
    } catch (error) {
      this.showSubmissionError(error)
    } finally {
      this.hideLoadingState()
    }
  }

  validateForm() {
    let isValid = true

    Object.keys(this.validators).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(fieldName) {
    const field = document.getElementById(fieldName)
    const validator = this.validators[fieldName]

    if (!field || !validator) return true

    const value = field.type === "checkbox" ? field.checked : field.value.trim()
    const isValid = validator.call(this, value, field)

    if (isValid) {
      this.clearError(fieldName)
      field.classList.remove("error")
    } else {
      field.classList.add("error")
    }

    return isValid
  }

  validateRequired(value) {
    return value && value.length > 0
  }

  validateEmail(value) {
    if (!value) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  validatePhone(value) {
    // Phone is optional, but if provided, should be valid
    if (!value) return true
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))
  }

  validateMessage(value) {
    return value && value.length >= 10
  }

  validateCheckbox(value) {
    return value === true
  }

  showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.add("show")
    }
  }

  clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`)
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.classList.remove("show")
    }
  }

  showFormErrors() {
    // Show specific error messages
    const errors = {
      firstName: "First name is required",
      lastName: "Last name is required",
      email: "Please enter a valid email address",
      phone: "Please enter a valid phone number",
      projectType: "Please select a project type",
      message: "Please provide a project description (minimum 10 characters)",
      privacy: "You must agree to the privacy policy",
    }

    Object.keys(this.validators).forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      if (field && field.classList.contains("error")) {
        this.showError(fieldName, errors[fieldName])
      }
    })

    // Scroll to first error
    const firstError = this.form.querySelector(".error")
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      firstError.focus()
    }
  }

  async submitForm() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Collect form data
    const formData = new FormData(this.form)
    const data = Object.fromEntries(formData.entries())

    // Log form data (in real app, send to server)
    console.log("Form submitted:", data)

    // Simulate random success/failure for demo
    if (Math.random() > 0.1) {
      return { success: true, message: "Form submitted successfully!" }
    } else {
      throw new Error("Submission failed. Please try again.")
    }
  }

  showLoadingState() {
    this.submitBtn.disabled = true
    this.submitBtn.classList.add("loading")
  }

  hideLoadingState() {
    this.submitBtn.disabled = false
    this.submitBtn.classList.remove("loading")
  }

  showSuccessMessage() {
    this.form.style.display = "none"
    this.successMessage.classList.add("show")

    // Scroll to success message
    this.successMessage.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  hideSuccessMessage() {
    this.form.style.display = "block"
    this.successMessage.classList.remove("show")
  }

  showSubmissionError(error) {
    // Create and show error notification
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-notification"
    errorDiv.innerHTML = `
            <div class="error-content">
                <i data-lucide="alert-circle"></i>
                <span>${error.message}</span>
                <button class="close-error">&times;</button>
            </div>
        `

    // Add error notification styles
    const style = document.createElement("style")
    style.textContent = `
            .error-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--red-500);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-xl);
                z-index: 1000;
                animation: slideInRight 0.3s ease;
            }
            
            .error-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .close-error {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `
    document.head.appendChild(style)

    document.body.appendChild(errorDiv)

    // Initialize Lucide icons for the error notification
    if (typeof window.lucide !== "undefined") {
      window.lucide.createIcons()
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove()
      }
    }, 5000)

    // Manual close
    const closeBtn = errorDiv.querySelector(".close-error")
    closeBtn.addEventListener("click", () => errorDiv.remove())
  }

  resetForm() {
    this.form.reset()
    this.form.querySelectorAll(".error").forEach((field) => {
      field.classList.remove("error")
    })
    this.form.querySelectorAll(".error-message").forEach((error) => {
      error.classList.remove("show")
      error.textContent = ""
    })
  }
}

// FAQ Management
class FAQManager {
  constructor() {
    this.init()
  }

  init() {
    const faqQuestions = document.querySelectorAll(".faq-question")
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => this.toggleFAQ(question))
    })
  }

  toggleFAQ(questionElement) {
    const faqItem = questionElement.closest(".faq-item")
    const isActive = faqItem.classList.contains("active")

    // Close all other FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active")
      }
    })

    // Toggle current item
    if (isActive) {
      faqItem.classList.remove("active")
    } else {
      faqItem.classList.add("active")
    }
  }
}

// Scroll Animations
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
            .method-card,
            .contact-form,
            .faq-item,
            .hero-content
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

// Analytics and Tracking
class Analytics {
  constructor() {
    this.init()
  }

  init() {
    this.trackPageView()
    this.setupEventTracking()
  }

  trackPageView() {
    // Track page view
    console.log("Page view tracked: Contact Page")
  }

  setupEventTracking() {
    // Track form interactions
    const form = document.getElementById("contact-form")
    if (form) {
      form.addEventListener("submit", () => {
        this.trackEvent("Form", "Submit", "Contact Form")
      })
    }

    // Track method card clicks
    const methodCards = document.querySelectorAll(".method-card")
    methodCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        this.trackEvent("Contact Method", "Click", `Method ${index + 1}`)
      })
    })

    // Track FAQ interactions
    const faqQuestions = document.querySelectorAll(".faq-question")
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const questionText = question.querySelector("span").textContent
        this.trackEvent("FAQ", "Toggle", questionText)
      })
    })
  }

  trackEvent(category, action, label) {
    // In a real application, send to analytics service
    console.log("Event tracked:", { category, action, label })
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    this.setupLazyLoading()
    this.setupScrollOptimization()
    this.preloadCriticalResources()
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

  preloadCriticalResources() {
    // Preload critical fonts and assets
    const criticalResources = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    ]

    criticalResources.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource
      link.as = "style"
      document.head.appendChild(link)
    })
  }
}

// Accessibility Enhancements
class AccessibilityManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupKeyboardNavigation()
    this.setupFocusManagement()
    this.setupAriaLabels()
  }

  setupKeyboardNavigation() {
    // Handle escape key for closing mobile menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const mobileMenu = document.querySelector(".mobile-menu")
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open")
        }
      }
    })

    // Handle enter key for FAQ items
    const faqQuestions = document.querySelectorAll(".faq-question")
    faqQuestions.forEach((question) => {
      question.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          question.click()
        }
      })
    })
  }

  setupFocusManagement() {
    // Ensure proper focus management for form validation
    const form = document.getElementById("contact-form")
    form.addEventListener("submit", (e) => {
      const firstError = form.querySelector(".error")
      if (firstError) {
        setTimeout(() => {
          firstError.focus()
        }, 100)
      }
    })
  }

  setupAriaLabels() {
    // Add dynamic aria-labels for better screen reader support
    const submitBtn = document.getElementById("submit-btn")
    const form = document.getElementById("contact-form")

    form.addEventListener("submit", () => {
      submitBtn.setAttribute("aria-label", "Submitting contact form, please wait")
    })

    // Update FAQ aria-expanded attributes
    const faqQuestions = document.querySelectorAll(".faq-question")
    faqQuestions.forEach((question) => {
      question.setAttribute("aria-expanded", "false")
      question.addEventListener("click", () => {
        const isExpanded = question.closest(".faq-item").classList.contains("active")
        question.setAttribute("aria-expanded", isExpanded.toString())
      })
    })
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
  new ContactForm()
  new FAQManager()
  new ScrollAnimations()
  new Analytics()
  new PerformanceOptimizer()
  new AccessibilityManager()

  // Add loading complete class
  document.body.classList.add("loaded")

  // Add smooth reveal animation for page load
  const mainContent = document.querySelector(".app")
  mainContent.style.opacity = "0"
  mainContent.style.transform = "translateY(20px)"

  setTimeout(() => {
    mainContent.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    mainContent.style.opacity = "1"
    mainContent.style.transform = "translateY(0)"
  }, 100)
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

  // Show user-friendly error message
  const errorNotification = document.createElement("div")
  errorNotification.className = "error-notification"
  errorNotification.innerHTML = `
    <div class="error-content">
      <i data-lucide="alert-triangle"></i>
      <span>Something went wrong. Please refresh the page and try again.</span>
      <button class="close-error">&times;</button>
    </div>
  `

  document.body.appendChild(errorNotification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorNotification.parentNode) {
      errorNotification.remove()
    }
  }, 5000)

  // Manual close
  const closeBtn = errorNotification.querySelector(".close-error")
  closeBtn.addEventListener("click", () => errorNotification.remove())
})

// Service Worker registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration would go here
    console.log("Service Worker support detected")
  })
}

// Add custom cursor effects for interactive elements
document.addEventListener("mousemove", (e) => {
  const interactiveElements = document.querySelectorAll("button, a, .method-card, .faq-question")

  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    const isHovering =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

    if (isHovering) {
      document.body.style.cursor = "pointer"
    }
  })
})
