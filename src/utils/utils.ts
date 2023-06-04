export const ARROW_LEFT_KEY_CODE = 'ArrowLeft'
export const ARROW_RIGHT_KEY_CODE = 'ArrowRight'

export const BACKSPACE_KEY_CODE = 'Backspace'
export const ENTER_KEY_CODE = 'Enter'
export const TAB_KEY_CODE = 'Tab'

export const isStringNum = (str: string): boolean => {
  return /^\d$/.test(str)
}

export default {
  ARROW_LEFT_KEY_CODE,
  ARROW_RIGHT_KEY_CODE,
  BACKSPACE_KEY_CODE,
  TAB_KEY_CODE,
  isStringNum,
}
