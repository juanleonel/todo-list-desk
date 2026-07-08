import { AppConstants } from './constants/app.constants.js'

/**
 * @description Verify if a value is null or undefined.
 * @param {any} value - The value to check.
 * @returns {boolean} Return true if object value is null or undefined; otherwise false.
 */
export function isNullOrUndefined(value) {
  return value === null || value === undefined
}

/**
 * @description Verify the values is empty.
 * @param {string} value - The value to check.
 * @returns 
 */
export function isStringEmpty(value) {
  return value?.trim() === AppConstants.stringEmpty
}
