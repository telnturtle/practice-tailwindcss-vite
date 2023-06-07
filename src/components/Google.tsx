import React, { useCallback } from 'react'
import { useReducer } from 'react'
import utils from '../utils/utils'

export function Google() {
  const handleInputCardNumber = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >((ev) => {
    const formattedCardNumber = ev.currentTarget.value || ''
    const cardNumber = formattedCardNumber.replace(/\D/g, '')

    let reformattedCardNumber = ''
    for (let i = 0; i < cardNumber.length; i += 4) {
      const chunk = cardNumber.substring(i, i + 4)
      reformattedCardNumber += chunk + ' '
    }
    reformattedCardNumber = reformattedCardNumber.trim()

    console.log({formattedCardNumber, cardNumber, reformattedCardNumber})

    ev.currentTarget.value = reformattedCardNumber
  }, [])

  // TODO add backspace and delete processing

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
            // onBeforeInput={handleBeforeInputCardNumber}
            // onChange={handleChangeCardNumber}
            onInput={handleInputCardNumber}
            // onKeyDown={handleKeyDownCardNumber}
            // pattern="\\d{4}\s\d{4}\s\d{4}\s\d{4}"
            pattern="[0-9]{4}"
            placeholder="카드번호"
            type="tel"
          ></input>
        </label>
      </div>
      <div className="flex"></div>
      {/* <input onKeyPress={handleKeyPress} onKeyUp={handleKeyPress}></input> */}
    </div>
  )
}
