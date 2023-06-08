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
    // cursorPosition이 이렇게 변화되어야 하기 때문
    // 입력 전: 4, 핸들러 진입: 5, 핸들러 실행 뒤: 6
    if (document.activeElement === ev.currentTarget) {
      if (ev.currentTarget.value[cursorPosition - 1] === ' ') {
        cursorPosition += 1
      }
      ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [])

  const handleInputExpiryDate = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >((ev) => {
    const formattedExpiryDate = (ev.currentTarget.value || '').substring(0, 7)
    let expiryDate = formattedExpiryDate.replace(/\D/g, '')
    const isSelectionDirectionBackward =
      ev.currentTarget.selectionDirection === 'backward'
    let cursorPosition: number =
      (isSelectionDirectionBackward
        ? ev.currentTarget.selectionEnd
        : ev.currentTarget.selectionStart) ?? 0

    let reformattedExpiryDate = ''
    if (expiryDate) {
      if (/[2-9]/.test(expiryDate[0])) {
        reformattedExpiryDate = '0' + expiryDate[0]
        expiryDate = expiryDate.slice(1)
      } else {
        reformattedExpiryDate = expiryDate.slice(0, 2)
        expiryDate = expiryDate.slice(2)
      }
    }
    if (expiryDate) {
      reformattedExpiryDate += ' / ' + expiryDate.slice(0, 2)
    }

    reformattedExpiryDate = reformattedExpiryDate.trim()

    ev.currentTarget.value = reformattedExpiryDate

    // '12'에서 '3'를 입력하게 되면
    // cursorPosition이 이렇게 변화되어야 하기 때문
    // 입력 전: 2, 핸들러 진입: 3, 핸들러 실행 뒤: 6
    if (document.activeElement === ev.currentTarget) {
      if (ev.currentTarget.value[cursorPosition - 1] === ' ') {
        cursorPosition += 3
      }
      ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [])

  const handleInputPassword = useCallback<React.FormEventHandler<HTMLInputElement>>(
    (ev) => {
      const formattedPassword = ev.currentTarget.value || ''
      const password = formattedPassword.replace(/\D/g, '').substring(0, 2)
      const cursorPosition = Math.max(0, 2 * password.length - 1)

      const firstDigit = password[0] ?? ' '
      const secondDigit = password[1] ?? ' '
      const reformattedPassword = `${firstDigit} ${secondDigit} ﹡ ﹡`

      ev.currentTarget.value = reformattedPassword

      if (document.activeElement === ev.currentTarget) {
        ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
      }
    },
    []
  )

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
            required
            type="tel"
          ></input>
        </LabelInput>
      </Row>
      <Row>
        <LabelInput label={'유효기간'}>
          <input
            aria-label="유효기간"
            autoComplete="cc-exp"
            className="m-2 rounded p-2 ring-1 ring-gray-400"
            name="expiryDate"
            onInput={handleInputExpiryDate}
            pattern="\d{2}\s/\s\d{2}"
            placeholder="MM/YY"
            required
            type="tel"
          ></input>
        </LabelInput>
        <LabelInput label={'비밀번호'}>
          <input
            aria-label="비밀번호"
            autoComplete="cc-csc"
            className="m-2 rounded p-2 ring-1 ring-gray-400"
            defaultValue={'    ﹡ ﹡'}
            name="cardNumber"
            onInput={handleInputPassword}
            placeholder="CVC"
            required
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
