import { AppConstants } from './app.constants.js'

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
