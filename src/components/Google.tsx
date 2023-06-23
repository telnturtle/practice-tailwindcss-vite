import React, { PropsWithChildren, ReactNode, useCallback } from 'react'

const INPUT_DEBOUNCE_DELAY = 600

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
  // 비밀번호 input 필드에서 backspace 혹은 delete 이벤트가 일어났을 경우, 조정된 cursor position을 저장하는 ref
  const adjustedPasswordFieldCursorPosition = React.useRef<{
    type: 'Backspace' | 'Delete' | 'Else'
    cursorPosition: number
  }>({ type: 'Else', cursorPosition: 0 })
  // 비밀번호 input debouncer ref
  const passwordFieldDebouncer = React.useRef<number>(-1)

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
      setExpiryDateInvalidMessage('올바른 연도를 입력해주세요.')
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

  /**
   * 비밀번호 입력란에서 키보드 입력을 처리하는 핸들러
   *
   * 숫자 한 글자 입력 시에만 ev.currentTarget의 value를 변경
   *
   * 그렇지 않은 경우 처리하지 않음
   */
  const handleBeforeInputPassword = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >(
    (ev) => {
      // 이것은 react 18.2에서 실제 beforeinput 이벤트와 스펙이 다르다.
      const nativeEvent = ev.nativeEvent as InputEvent
      const data = nativeEvent.data ?? ''
      if (data.length !== 1) {
        return
      }

      const value = passwordField.current?.value ?? ''

      switch (data) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          {
            // 숫자 입력 처리
            const previousCursorPosition = ev.currentTarget.selectionStart ?? 0
            const nextValue =
              value.slice(0, previousCursorPosition) +
              data +
              value.slice(previousCursorPosition)
            const password = nextValue.replace(/\D/g, '').substring(0, 2)
            const nextCursorPosition = 0 === previousCursorPosition ? 1 : 3

            const firstDigit = password[0] ?? '_'
            const secondDigit = password[1] ?? '_'
            const reformattedPassword = `${firstDigit} ${secondDigit} ﹡ ﹡`

            ev.currentTarget.value = reformattedPassword
            ev.currentTarget.setSelectionRange(
              nextCursorPosition,
              nextCursorPosition
            )

            // handleInputPassword이 실행되지 않도록
            ev.preventDefault()

            if (secondDigit !== '_') {
              // 2자리가 다 입력되었을 경우,
              // 커서가 끝에 있을 경우, 다음 input으로 이동 (순환 탐색)
              // 비어있거나 invalid한 input으로 이동
              // 비어있거나 invalid한 input이 없는 경우 이동하지 않음
              if (
                (cardNumberField.current?.value || '').replace(/\D/g, '').length ===
                  0 ||
                cardNumberInvalidMessage
              ) {
                clearTimeout(passwordFieldDebouncer.current)
                const { currentTarget } = ev
                passwordFieldDebouncer.current = setTimeout(() => {
                  if (
                    (cardNumberField.current?.value || '').replace(/\D/g, '')
                      .length === 0 ||
                    cardNumberInvalidMessage
                  ) {
                    currentTarget.blur()
                    cardNumberField.current?.focus()
                    cardNumberField.current?.setSelectionRange(0, 100)
                  } else {
                    clearTimeout(passwordFieldDebouncer.current)
                  }
                }, INPUT_DEBOUNCE_DELAY)
              } else if (
                (expiryDateField.current?.value || '').length === 0 ||
                expiryDateInvalidMessage
              ) {
                clearTimeout(passwordFieldDebouncer.current)
                const { currentTarget } = ev
                passwordFieldDebouncer.current = setTimeout(() => {
                  if (
                    (expiryDateField.current?.value || '').length === 0 ||
                    expiryDateInvalidMessage
                  ) {
                    currentTarget.blur()
                    expiryDateField.current?.focus()
                    expiryDateField.current?.setSelectionRange(0, 100)
                  } else {
                    clearTimeout(passwordFieldDebouncer.current)
                  }
                }, INPUT_DEBOUNCE_DELAY)
              }
              ev.preventDefault()
            }
          }

          break
        default:
          break
      }
    },
    [cardNumberInvalidMessage, expiryDateInvalidMessage]
  )

  const handleBlurPassword = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (ev) => {
      const password = (ev.currentTarget.value || '').replace(/\D/g, '')
      if (0 < password.length && password.length < 2) {
        setPasswordInvalidMessage('불완전한 입력란')
      } else {
        setPasswordInvalidMessage('')
      }
    },
    []
  )

  /**
   * 비밀번호 input 이벤트 처리 핸들러
   *
   * 2가지 경우를 처리한다
   *
   * 1. 비밀번호 입력란에서 숫자 여러 글자를 입력할 경우 (붙여넣기)
   * 2. 비밀번호 입력란에서 Backspace와 Delete 키를 눌렀을 경우
   *
   * 두 가지 모두 숫자만 남기고 나머지는 제거한다
   *
   * 숫자만 남긴 후에는 숫자가 2개 이상이면 2개만 남기고 나머지는 제거한다
   *
   * formatting을 수행한다
   *
   * cursorPosition을 변경한다
   */
  const handleInputPassword = useCallback<React.FormEventHandler<HTMLInputElement>>(
    (ev) => {
      if (Number(ev.currentTarget.selectionEnd) >= 3) {
        // 2자리가 다 입력되었을 경우,
        // 커서가 끝에 있을 경우, 다음 input으로 이동 (순환 탐색)
        // 비어있거나 invalid한 input으로 이동
        // 비어있거나 invalid한 input이 없는 경우 이동하지 않음
        if (
          (cardNumberField.current?.value || '').replace(/\D/g, '').length === 0 ||
          cardNumberInvalidMessage
        ) {
          clearTimeout(passwordFieldDebouncer.current)
          const { currentTarget } = ev
          passwordFieldDebouncer.current = setTimeout(() => {
            if (
              (cardNumberField.current?.value || '').replace(/\D/g, '').length ===
                0 ||
              cardNumberInvalidMessage
            ) {
              currentTarget.blur()
              cardNumberField.current?.focus()
              cardNumberField.current?.setSelectionRange(0, 100)
            } else {
              clearTimeout(passwordFieldDebouncer.current)
            }
          }, INPUT_DEBOUNCE_DELAY)
        } else if (
          (expiryDateField.current?.value || '').length === 0 ||
          expiryDateInvalidMessage
        ) {
          clearTimeout(passwordFieldDebouncer.current)
          const { currentTarget } = ev
          passwordFieldDebouncer.current = setTimeout(() => {
            if (
              (expiryDateField.current?.value || '').length === 0 ||
              expiryDateInvalidMessage
            ) {
              currentTarget.blur()
              expiryDateField.current?.focus()
              expiryDateField.current?.setSelectionRange(0, 100)
            } else {
              clearTimeout(passwordFieldDebouncer.current)
            }
          }, INPUT_DEBOUNCE_DELAY)
        }
        ev.preventDefault()
      }

      const formattedPassword = ev.currentTarget.value || ''
      const password = formattedPassword.replace(/\D/g, '').substring(0, 2)
      const maxCursorPosition = Math.max(0, 2 * password.length - 1)

      const firstDigit = password[0] ?? '_'
      const secondDigit = password[1] ?? '_'
      const reformattedPassword = `${firstDigit} ${secondDigit} ﹡ ﹡`
      const previousCursorPosition = ev.currentTarget.selectionStart ?? 0

      ev.currentTarget.value = reformattedPassword

      if (document.activeElement === ev.currentTarget) {
        if (adjustedPasswordFieldCursorPosition.current.type === 'Backspace') {
          ev.currentTarget.setSelectionRange(
            adjustedPasswordFieldCursorPosition.current.cursorPosition - 1,
            adjustedPasswordFieldCursorPosition.current.cursorPosition - 1
          )
        } else if (adjustedPasswordFieldCursorPosition.current.type === 'Delete') {
          ev.currentTarget.setSelectionRange(
            adjustedPasswordFieldCursorPosition.current.cursorPosition,
            adjustedPasswordFieldCursorPosition.current.cursorPosition
          )
        } else if (previousCursorPosition >= maxCursorPosition) {
          const cursorPosition = Math.min(maxCursorPosition, previousCursorPosition)
          ev.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
        }
      }

      if (password.length > 0) {
        setCardNumberInvalidMessage('')
      }
    },
    [cardNumberInvalidMessage, expiryDateInvalidMessage]
  )

  /**
   * 비밀번호 입력란에서 키보드 입력을 처리하는 핸들러
   *
   * backspace와 delete 입력에 한해 ev.currentTarget의 커서 위치를 변경
   *
   * selection (text drag) 시 ev.currentTarget의 커서 위치가 변경되지 않음
   *
   * 삭제 동작은 브라우저가 처리
   *
   * input event 전에 실행되므로, input event 핸들러에서는
   * ev.currentTarget의 커서 위치가 변경된 상태로 실행됨
   *
   * 커서 위치를 이동하며, backspace와 delete가 숫자를 올바르게
   * 삭제하도록 커서 위치 조정
   */
  const handleKeyDownPassword = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >((ev) => {
    adjustedPasswordFieldCursorPosition.current = {
      type: 'Else',
      cursorPosition: ev.currentTarget.selectionStart ?? 0,
    }

    if (ev.currentTarget.selectionStart !== ev.currentTarget.selectionEnd) {
      // selection 시 커서 포지션 변화 없음
      return
    }

    if (ev.key === 'Backspace') {
      if (ev.currentTarget.value[2] !== '_') {
        if (ev.currentTarget.selectionStart === 2) {
          // Backspace 입력 시 커서 포지션 변화

          // 2글자가 입력되어 있는 경우
          //
          // 커서 위치 2 -> 1
          // 3 |4 * *
          // 3| 4 * *
          //
          // 커서 위치 4 -> 3
          // 3 4 |* *
          // 3 4| * *
          //
          // 커서 위치 4 이상 -> 3
          // 3 4 *| *
          // 3 4| * *
          //
          // 나머지 케이스: 변화 없음
          ev.currentTarget.setSelectionRange(1, 1)
        } else if (
          // Backspace 입력 시 커서 포지션 변화

          // 1글자가 입력되어 있는 경우
          //
          // 커서 위치 2 -> 1
          // 3 |_ * *
          // 3| _ * *
          //
          // 커서 위치 2 이상 -> 1
          // 3 _ *| *
          // 3| _ * *
          //
          // 나머지 케이스: 변화 없음
          ev.currentTarget.selectionStart !== null &&
          ev.currentTarget.selectionStart >= 4
        ) {
          ev.currentTarget.setSelectionRange(3, 3)
        }
      } else if (ev.currentTarget.value[0] !== '_') {
        if (
          ev.currentTarget.selectionStart !== null &&
          ev.currentTarget.selectionStart >= 2
        ) {
          ev.currentTarget.setSelectionRange(1, 1)
        }
      }

      adjustedPasswordFieldCursorPosition.current = {
        type: 'Backspace',
        cursorPosition: ev.currentTarget.selectionStart ?? 0,
      }
    } else if (ev.key === 'Delete') {
      if (ev.currentTarget.selectionStart === 1) {
        // Delete 입력 시 커서 포지션 변화
        // 커서 위치 1 -> 2
        // 3| 4 * *
        // 3 |4 * *
        //
        // 나머지 케이스: 변화 없음
        ev.currentTarget.setSelectionRange(2, 2)
      }
      adjustedPasswordFieldCursorPosition.current = {
        type: 'Delete',
        cursorPosition: ev.currentTarget.selectionStart ?? 0,
      }
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
        <LabelInput
          label={'비밀번호'}
          infoMessage={'비밀번호 앞 2자리'}
          errorMessage={passwordInvalidMessage}
        >
          <input
            aria-label="비밀번호"
            autoComplete="cc-csc"
            className={`m-2 mb-1 rounded p-2 ring-1 ring-gray-400 ${
              passwordInvalidMessage ? 'ring-red-500' : ''
            }`}
            defaultValue={'_ _ ﹡ ﹡'}
            name="cardNumber"
            onBeforeInput={handleBeforeInputPassword}
            onBlur={handleBlurPassword}
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

interface LabelInputProps {
  label: ReactNode
  infoMessage?: ReactNode
  errorMessage?: ReactNode
}

const LabelInput = ({
  label,
  children,
  infoMessage = '',
  errorMessage = '',
}: PropsWithChildren<LabelInputProps>) => {
  return (
    <label className="flex w-full flex-col">
      <span>{label}</span>
      {children}
      {errorMessage ? (
        <span className="mx-2 h-4 text-start text-xs text-red-400">
          {errorMessage}
        </span>
      ) : (
        <span className="mx-2 h-4 text-start text-xs text-gray-600">
          {infoMessage}
        </span>
      )}
    </label>
  )
}
