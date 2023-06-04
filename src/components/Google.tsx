import React, { useCallback } from 'react'
import { useReducer } from 'react'
import utils from '../utils/utils'

export function Google() {
  /**
   * value
   */
  const handleKeyDownCardNumber = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >((ev) => {
    const formattedCardNumber = ev.currentTarget.value || ''
    const cardNumber = formattedCardNumber.replace(/\D/g, '')
    const rawKey = (ev as unknown as KeyboardEvent).key
    const key = rawKey.replace(/\D/g, '')

    if (!utils.isStringNum(key)) {
      ev.preventDefault()
    }

    // // const key = (ev as unknown as KeyboardEvent).key
    // const value = ev.currentTarget.value

    // // if (!utils.isStringNum(key)) {
    // //   ev.preventDefault()
    // // }
  }, [])

  const handleKeyPress = (ev: unknown) => {
    console.log(ev.key)
  }

  // 문자키만 막는것으로 하자

  // 1글자
  // 숫자가 아닌
  // 문자

  // before change로 문자키 막고
  // space 추가하고?
  // js keycode list https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/

  // const handleChangeCardNumber = useCallback<
  //   React.FormEventHandler<HTMLInputElement>
  // >((ev) => {
  //   const formattedCardNumber = ev.currentTarget.value || ''
  //   const cardNumber = formattedCardNumber.replace(/\D/g, '')
  //   ev.currentTarget.value = cardNumber
  // }, [])

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
            onBeforeInput={handleBeforeInputCardNumber}
            // onChange={handleChangeCardNumber}
            // onKeyDown={handleKeyDownCardNumber}
            // pattern="\\d{4}\s\d{4}\s\d{4}\s\d{4}"
            pattern="[0-9]{4}"
            placeholder="카드번호"
            type="tel"
          ></input>
        </label>
      </div>
      <div className="flex"></div>
      <input onKeyPress={handleKeyPress} onKeyUp={handleKeyPress}></input>
    </div>
  )
}
