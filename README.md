## 개발환경 세팅하기

### 설치할 것

- Node - https://nodejs.org/en/

### Repogitory Clone

```
$ git clone https://github.com/LivingKing/LivingIn.git
```
### PowerShell 설정
https://dog-developers.tistory.com/183

### NPM 설치

#### NPM 설치방법

```
npm i packageName --save
```

#### client, server 공통

```
npm i --save
```

#### 서버 설치 리스트(계속 추가될 수도 있음)

- pm2
- mongoose

### 실행 방법

#### server

```
pm2 start main.js --watch --no-daemon
```

#### client

```
npm start
```

### URL

#### client

http://localhost:3000

#### server

https://localhost:5000

## API

#####

| METHOD | URL                                  | Description                             |
| ------ | ------------------------------------ | --------------------------------------- |
| GET    | http://localhost:5000/api/users      | DB에 저장된 회원정보 JSON 포맷으로 출력 |
| GET    | http://localhost5000:/api/all_delete | DB 저장된 회원정보 전체삭제             |

#####

## Models

#####

| Parameter         | Required | Type      | Default | Description                                        |
| ----------------- | -------- | --------- | ------- | -------------------------------------------------- |
| email             | O        | _String_  | -       |                                                    |
| password          | O        | _String_  | -       |                                                    |
| nickname          | O        | _String_  | -       |                                                    |
| icon              | O        | _String_  | -       | 프로필 사진 경로                                   |
| Favorite_HashTage | O        | _String_  | -       | 선호하는 해시태그                                  |
| refresh_token     | O        | _String_  | -       | access_token이 만료되있을 경우 재발급을 위한 token |
| created_At        | O        | _Date_    | -       | 생성날짜                                           |
| is_admin          | O        | _Boolean_ | -       | 관리자 계정 여부                                   |

#####
