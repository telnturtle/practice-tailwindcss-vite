import { useCallback } from 'react'
import { useReducer } from 'react'

export function Google() {
  const handleChangeCardNumber = useCallback((e) => {}, [])

  return (
    <div className="flex flex-col">
      <div className="flex">
        <label className="flex w-full flex-col">
          <span>카드번호</span>
          <input
            aria-label="카드번호"
            autoComplete="cc-number"
            className="m-2 rounded p-2 ring-1 ring-gray-400"
            name="cardNumber"
            placeholder="카드번호"
            type="tel"
          ></input>
        </label>
      </div>
      <div className="flex"></div>
    </div>
  )
}
