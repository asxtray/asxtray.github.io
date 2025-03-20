/**
 * Internationalization (i18n) utility functions
 */

// Cache for loaded translations
const translationsCache = {}

/**
 * Load translations for a specific language
 * @param {string} lang - Language code (e.g., 'en', 'ru')
 * @returns {Promise<Object>} - Translation object
 */
export async function loadTranslations(lang) {
  try {
    // Return from cache if available
    if (translationsCache[lang]) {
      return translationsCache[lang]
    }

    // Fetch translations file
    const response = await fetch(`common/translations/${lang}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`)
    }

    // Parse and cache translations
    const translations = await response.json()
    translationsCache[lang] = translations
    return translations
  } catch (error) {
    console.error("Error loading translations:", error)
    // Fallback to English if translation file can't be loaded
    if (lang !== "en") {
      return loadTranslations("en")
    }
    return {}
  }
}

/**
 * Update page content with translations
 * @param {Object} translations - Translation object
 */
export function updatePageContent(translations) {
  const elements = document.querySelectorAll("[data-i18n]")
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n")
    if (translations[key]) {
      el.textContent = translations[key]
    }
  })
}

/**
 * Get user's preferred language
 * @returns {string} - Language code
 */
export function getPreferredLanguage() {
  // Check localStorage first
  const savedLang = localStorage.getItem("safeTunnelLang")
  if (savedLang) {
    return savedLang
  }

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang && browserLang.startsWith("ru")) {
    return "ru"
  }

  // Default to English
  return "en"
}

/**
 * Save language preference
 * @param {string} lang - Language code
 */
export function saveLanguagePreference(lang) {
  localStorage.setItem("safeTunnelLang", lang)
}

