document.addEventListener("DOMContentLoaded", () => {
  // Translations object
  const translations = {
    en: {},
    ru: {},
  }

  // Get current language from localStorage or default to 'en'
  let currentLang = localStorage.getItem("safeTunnelLang") || "en"

  // Function to load translations
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`common/translations/${lang}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang}`)
      }
      const data = await response.json()
      translations[lang] = data
      return true
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error)
      return false
    }
  }

  // Update all translations on the page
  function updateTranslations() {
    if (!translations[currentLang]) return

    const elements = document.querySelectorAll("[data-i18n]")
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n")
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key]
      }
    })
  }

  // Update language buttons
  function updateLanguageButtons() {
    document.querySelectorAll(".lang-btn, .mobile-lang-btn").forEach((btn) => {
      const lang = btn.getAttribute("data-lang")
      if (lang === currentLang) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Language switcher functionality
  document.querySelectorAll(".lang-btn, .mobile-lang-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const lang = this.getAttribute("data-lang")
      if (lang === currentLang) return // Skip if already selected

      // Try to load translations if not already loaded
      if (!translations[lang] || Object.keys(translations[lang]).length === 0) {
        const success = await loadTranslations(lang)
        if (!success) {
          console.error(`Failed to switch to language: ${lang}`)
          return
        }
      }

      // Update current language
      currentLang = lang
      localStorage.setItem("safeTunnelLang", currentLang)

      // Update UI
      updateLanguageButtons()
      updateTranslations()
    })
  })

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active")
    mobileMenu.classList.toggle("active")
    document.body.classList.toggle("menu-open")
  })

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("active")
      mobileMenu.classList.remove("active")
      document.body.classList.remove("menu-open")
    })
  })

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active")
      })

      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add("active")
      }
    })
  })

  // Sticky header
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Initialize translations
  ;(async function init() {
    // Load current language translations
    await loadTranslations(currentLang)

    // If current language failed to load and it's not English, try loading English
    if (Object.keys(translations[currentLang]).length === 0 && currentLang !== "en") {
      currentLang = "en"
      localStorage.setItem("safeTunnelLang", "en")
      await loadTranslations("en")
    }

    // Update UI
    updateLanguageButtons()
    updateTranslations()

    // Preload the other language for faster switching
    if (currentLang === "en") {
      loadTranslations("ru")
    } else {
      loadTranslations("en")
    }
  })()
})

