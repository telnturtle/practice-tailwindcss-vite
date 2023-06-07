# practice-tailwindcss-vite

Tailwind CSS, Vite를 사용해보는 프로젝트이다.

Tailwind CSS 사용을 연습해보기 위해 시작했다.

### 구동 방법

먼저 dependency를 터미널에 이렇게 입력해서 설치해야 한다.

```
yarn
```

Yarn v1을 사용하지 않는다면, npm 명령어로도 사용 가능하다.

```
npm i
```

설치한 후, 개발 모드로 구동하려면 터미널에 이렇게 입력하면 된다.

```
yarn dev --host
```

Yarn v1을 사용하지 않는다면, npm 명령어로도 사용 가능하다.

```
npm run dev --host
```

### 아이디어 및 주제

결제용 신용카드 정보를 입력하는 폼을 작성해 보았다.

Google Play, Notion의 카드 정보 입력 폼을 모사해 보았다.

입력 필드의 동작은 노션에서 사용하는 (것으로 추정되는) [medipass/react-payment-inputs](https://github.com/medipass/react-payment-inputs) 라이브러리를 참고했다.

신용카드 유효기간이 만료되어서 한꺼번에 서비스들의 결제 정보를 업데이트하며 아이디어를 떠올렸다.

### 커밋 메시지

ChatGPT를 이용해서 커밋 메시지를 작성했다.

예시:

```
User
내가 말하는 내용의 git commit message를 영어로 써줘

ChatGPT
Sure, I can help you translate your git commit message into English. Please provide the content you want to translate.

User
카드번호 입력 필드를 추가했어
ChatGPT
Added card number input field.
```

평소 내가 작성하던 커밋 메시지와 다른 점은, 챗지피티는 과거형 동사로 작성했지만 나는 현재형 동사를 사용한다. 예시: Add card number input field.
