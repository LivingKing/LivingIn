## 개발환경 세팅하기

### 설치할 것
- Node - https://nodejs.org/en/


### Repogitory Clone
```
$ git clone https://github.com/LivingKing/LivingIn.git
```

### NPM 설치
#### NPM 설치방법

```
npm i npm-name --save
```

#### client, server 공통
```
$ npm init
```


#### server list(계속 추가될 수도 있음)
- pm2

### 실행 방법
#### server
```
pm2 start main.js --watch --no-daemon
```

#### client
```
npm start
```

### 주소
#### client
http://localhost:3000

#### server
https://localhost:5000
