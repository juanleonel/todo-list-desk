import { AppConstants } from './constants/app.constants.js';
import { isNullOrUndefined } from './utils.functions.js';

let translations = {};
let currentLang = AppConstants.currentLang;

export async function initI18n() {
  try {
    const locale = await Neutralino.os.getEnv('LANG') || 'es_ES.UTF-8';
    currentLang = locale.startsWith(AppConstants.language.en) ?
      AppConstants.language.en : AppConstants.currentLang;
  } catch {
    currentLang = AppConstants.currentLang;
  }

  await loadLanguage(currentLang);
}

export function getCurrentLang() {
  if (isNullOrUndefined(currentLang)) {
    return AppConstants.currentLang;
  }

  return currentLang;
}

async function loadLanguage(lang) {
    try {
      const response = await fetch(`js/i18n/${lang}.json`);
      translations = await response.json();
      currentLang = lang;
      await Neutralino.storage.setData('preferredLang', lang);
      applyTranslations();
    } catch (error) {
      console.error("Error to load lang:", JSON.stringify(error));
    }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');

    if (translations[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') {
        el.placeholder = translations[key];
      } else {
        el.innerText = translations[key];
      }
    }
  });

  if (translations['window.title']) {
    document.title = translations['window.title'];
  }

  document.querySelectorAll('button').forEach(btn => {
    checkButton(btn);
  });
}

function checkButton(tag) {
  if (!tag || tag.tagName !== 'BUTTON') return;

  if (tag.classList.contains('delete-btn')) {
    tag.textContent = translations['btn.delete'] || 'Eliminar';
  }
}

export async function toggleLanguage() {
    const newLang = currentLang === AppConstants.currentLang ? AppConstants.language.en : AppConstants.currentLang;
    await loadLanguage(newLang);
}

export function translated(key) {
  return translations[key] || key;
}
