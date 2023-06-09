import React, { PropsWithChildren, ReactNode, useCallback } from 'react'

export function Google() {
  // 카드번호 invalid 메시지
  const [cardNumberInvalidMessage, setCardNumberInvalidMessage] = React.useState('')
  // 유효기간 invalid 메시지
  const [expiryDateInvalidMessage, setExpiryDateInvalidMessage] = React.useState('')
  // 비밀번호 invalid 메시지
  const [passwordInvalidMessage, setPasswordInvalidMessage] = React.useState('')

  // 카드번호 input ref
  const cardNumberField = React.useRef<HTMLInputElement>(null)
  // 유효기간 input ref
  const expiryDateField = React.useRef<HTMLInputElement>(null)
  // 비밀번호 input ref
  const passwordField = React.useRef<HTMLInputElement>(null)

  const handleBlurCardNumber = useCallback<
    React.FocusEventHandler<HTMLInputElement>
  >((ev) => {
    const cardNumber = ev.currentTarget.value
    if (cardNumber.length === 0) {
      setCardNumberInvalidMessage('카드번호를 입력해주세요.')
    } else if (
      cardNumber.length !== 19 &&
      cardNumber.replace(/\D/g, '').length !== 16
    ) {
      setCardNumberInvalidMessage('카드번호가 잘못되었습니다.')
    } else {
      setCardNumberInvalidMessage('')
    }
  }, [])

  const handleInputCardNumber = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >(
    (ev) => {
      if (Number(ev.currentTarget.selectionEnd) >= 19) {
        // 16자리가 다 입력되었을 경우,
        // 커서가 끝에 있을 경우, 다음 input으로 이동
        // 비어있거나 invalid한 input으로 이동
        // 비어있거나 invalid한 input이 없는 경우 이동하지 않음
        if (
          (expiryDateField.current?.value || '').length === 0 ||
          expiryDateInvalidMessage
        ) {
          ev.currentTarget.blur()
          expiryDateField.current?.focus()
          expiryDateField.current?.setSelectionRange(0, 100)
        } else if (
          (passwordField.current?.value || '').replace(/\D/g, '').length === 0 ||
          passwordInvalidMessage
        ) {
          ev.currentTarget.blur()
          passwordField.current?.focus()
          passwordField.current?.setSelectionRange(0, 100)
        }
        ev.preventDefault()
      }

      const formattedCardNumber = ev.currentTarget.value || ''
      const cardNumber = formattedCardNumber.replace(/\D/g, '').substring(0, 16)
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

      if (reformattedCardNumber.length > 0) {
        setCardNumberInvalidMessage('')
      }
    },
    [expiryDateInvalidMessage, passwordInvalidMessage]
  )

  const handleBlurExpiryDate = useCallback<
    React.FocusEventHandler<HTMLInputElement>
  >((ev) => {
    const expiryDate = (ev.currentTarget.value || '').replace(/\D/g, '')
    const mm = Number(expiryDate.slice(0, 2))
    const yy = expiryDate.slice(2, 4)
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const currentYearLastTwoDigits = currentYear % 100
    if (mm < 1 || mm > 12) {
      setExpiryDateInvalidMessage('올바른 월을 입력해주세요.')
    } else if (yy.length != 2) {
      setExpiryDateInvalidMessage('올바른 년도를 입력해주세요.')
    } else if (Number(yy) < currentYearLastTwoDigits) {
      setExpiryDateInvalidMessage('카드가 만료되었습니다.')
    } else if (Number(yy) === currentYearLastTwoDigits && mm < currentMonth) {
      setExpiryDateInvalidMessage('카드가 만료되었습니다.')
    } else {
      setExpiryDateInvalidMessage('')
    }
  }, [])

  const handleInputExpiryDate = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >(
    (ev) => {
      if (Number(ev.currentTarget.selectionEnd) >= 7) {
        // 7자리가 다 입력되었을 경우,
        // 커서가 끝에 있을 경우, 다음 input으로 이동 (순환 탐색)
        // 비어있거나 invalid한 input으로 이동
        // 비어있거나 invalid한 input이 없는 경우 이동하지 않음
        if (
          (passwordField.current?.value || '').replace(/\D/g, '').length === 0 ||
          passwordInvalidMessage
        ) {
          ev.currentTarget.blur()
          passwordField.current?.focus()
          passwordField.current?.setSelectionRange(0, 100)
        } else if (
          (cardNumberField.current?.value || '').replace(/\D/g, '').length === 0 ||
          cardNumberInvalidMessage
        ) {
          ev.currentTarget.blur()
          cardNumberField.current?.focus()
          cardNumberField.current?.setSelectionRange(0, 100)
        }
        ev.preventDefault()
      }

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
      //
      // ''에서 '3'을 입력하게 되면
      // cursorPosition이 이렇게 변화
      // 입력 전: 0, 핸들러 진입: 1, 핸들러 실행 뒤: 2
      if (document.activeElement === ev.currentTarget) {
        if (ev.currentTarget.value[cursorPosition - 1] === ' ') {
          cursorPosition += 3
        } else if (ev.currentTarget.value[cursorPosition - 1] === '0') {
          cursorPosition += 1
        }
        ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
      }
    },
    [cardNumberInvalidMessage, passwordInvalidMessage]
  )

  const handleBlurPassword = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (ev) => {
      const password = (ev.currentTarget.value || '').replace(/\D/g, '')
      if (password.length !== 0 && password.length !== 2) {
        setPasswordInvalidMessage('불완전한 입력란')
      } else {
        setPasswordInvalidMessage('')
      }
    },
    []
  )

  const handleInputPassword = useCallback<React.FormEventHandler<HTMLInputElement>>(
    (ev) => {
      if ((ev.currentTarget.value || '').replace(/\D/g, '').length >= 2) {
        // 2자리가 다 입력되었을 경우,
        // 커서가 끝에 있을 경우, 다음 input으로 이동 (순환 탐색)
        // 비어있거나 invalid한 input으로 이동
        // 비어있거나 invalid한 input이 없는 경우 이동하지 않음
        if (
          (cardNumberField.current?.value || '').replace(/\D/g, '').length === 0 ||
          cardNumberInvalidMessage
        ) {
          ev.currentTarget.blur()
          cardNumberField.current?.focus()
          cardNumberField.current?.setSelectionRange(0, 100)
        } else if (
          (expiryDateField.current?.value || '').length === 0 ||
          expiryDateInvalidMessage
        ) {
          ev.currentTarget.blur()
          expiryDateField.current?.focus()
          expiryDateField.current?.setSelectionRange(0, 100)
        }
        ev.preventDefault()
      }

      const formattedPassword = ev.currentTarget.value || ''
      const password = formattedPassword.replace(/\D/g, '').substring(0, 2)
      const cursorPosition = Math.max(0, 2 * password.length - 1)

      const firstDigit = password[0] ?? '_'
      const secondDigit = password[1] ?? '_'
      const reformattedPassword = `${firstDigit} ${secondDigit} ﹡ ﹡`

      ev.currentTarget.value = reformattedPassword

      if (document.activeElement === ev.currentTarget) {
        ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
      }
    },
    [cardNumberInvalidMessage, expiryDateInvalidMessage]
  )

  const handleKeyDownPassword = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >((ev) => {
    if (ev.key === 'Backspace') {
      // '3 4 ﹡(커서) ﹡' 상태에서 Backspace를 누르면
      // 4가 삭제되고 커서는 3 뒤에 위치해야 함
      const formattedPassword = ev.currentTarget.value || ''
      const password = formattedPassword.replace(/\D/g, '').substring(0, 2)
      ev.currentTarget.value = password
    }
  }, [])

  return (
    <div className="flex flex-col">
      <Row>
        <LabelInput label={'카드번호'} errorMessage={cardNumberInvalidMessage}>
          <input
            aria-label="카드번호"
            autoComplete="cc-number"
            className={`m-2 mb-1 rounded p-2 ring-1 ring-gray-400 ${
              cardNumberInvalidMessage ? 'ring-red-500' : ''
            }`}
            name="cardNumber"
            onBlur={handleBlurCardNumber}
            onInput={handleInputCardNumber}
            pattern="[0-9]{4}"
            placeholder="카드번호"
            ref={cardNumberField}
            required
            type="tel"
          ></input>
        </LabelInput>
      </Row>
      <Row>
        <LabelInput label={'유효기간'} errorMessage={expiryDateInvalidMessage}>
          <input
            aria-label="유효기간"
            autoComplete="cc-exp"
            className={`m-2 mb-1 rounded p-2 ring-1 ring-gray-400 ${
              expiryDateInvalidMessage ? 'ring-red-500' : ''
            }`}
            name="expiryDate"
            onBlur={handleBlurExpiryDate}
            onInput={handleInputExpiryDate}
            pattern="\d{2}\s/\s\d{2}"
            placeholder="MM/YY"
            ref={expiryDateField}
            required
            type="tel"
          ></input>
        </LabelInput>
        <LabelInput label={'비밀번호'} errorMessage={passwordInvalidMessage}>
          <input
            aria-label="비밀번호"
            autoComplete="cc-csc"
            className={`m-2 mb-1 rounded p-2 ring-1 ring-gray-400 ${
              passwordInvalidMessage ? 'ring-red-500' : ''
            }`}
            defaultValue={'_ _ ﹡ ﹡'}
            name="cardNumber"
            onInput={handleInputPassword}
            onKeyDown={handleKeyDownPassword}
            ref={passwordField}
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
  errorMessage = '',
}: PropsWithChildren<{ label: ReactNode; errorMessage?: ReactNode }>) => {
  return (
    <label className="flex w-full flex-col">
      <span>{label}</span>
      {children}
      <span className="mx-2 h-4 text-start text-xs text-red-400">
        {errorMessage}
      </span>
    </label>
  )
}
