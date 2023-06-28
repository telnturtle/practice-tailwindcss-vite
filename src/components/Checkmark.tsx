import './Checkmark.css'

/**
 * https://stackoverflow.com/q/41078478/17327804
 * 
 * @returns 애니메이션 초록색 체크 표시
 */
export function Checkmark() {
  return (
    <svg className="checkmark-41078478" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="checkmark-41078478__circle" cx="26" cy="26" r="25" fill="none" />
      <path className="checkmark-41078478__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  )
}
