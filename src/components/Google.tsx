import React, { PropsWithChildren, ReactNode, useCallback } from 'react'

export function Google() {
  const handleInputCardNumber = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >((ev) => {
    const formattedCardNumber = ev.currentTarget.value || ''
    const cardNumber = formattedCardNumber.replace(/\D/g, '')
    const isSelectionDirectionBackward =
      ev.currentTarget.selectionDirection === 'backward'
    let cursorPosition: number =
      (isSelectionDirectionBackward
        ? ev.currentTarget.selectionEnd
        : ev.currentTarget.selectionStart) ?? 0

    let reformattedCardNumber = ''
    for (let i = 0; i < cardNumber.length; i += 4) {
      const chunk = cardNumber.substring(i, i + 4)
      reformattedCardNumber += chunk + ' '
    }
    reformattedCardNumber = reformattedCardNumber.trim()

    ev.currentTarget.value = reformattedCardNumber

    // '1234'에서 '5'를 입력하게 되면
    // cursorPosition이 4에서 6으로 변화되어야 하기 때문
    if (document.activeElement === ev.currentTarget) {
      if (ev.currentTarget.value[cursorPosition - 1] === ' ') {
        cursorPosition += 1
      }
      ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [])

  return (
    <div className="flex flex-col">
      <Row>
        <LabelInput label={'카드번호'}>
          <input
            aria-label="카드번호"
            autoComplete="cc-number"
            className="m-2 rounded p-2 ring-1 ring-gray-400"
            name="cardNumber"
            onInput={handleInputCardNumber}
            pattern="[0-9]{4}"
            placeholder="카드번호"
            type="tel"
          ></input>
        </LabelInput>
      </Row>
    </div>
  )
}

const Row = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>
}

const LabelInput = ({
  label,
  children,
}: PropsWithChildren<{ label: ReactNode }>) => {
  return (
    <label className="flex w-full flex-col">
      <span>{label}</span>
      {children}
    </label>
  )
}
