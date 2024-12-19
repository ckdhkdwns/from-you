## stacks
- nextjs(app router, typescript)
- aws(sst)
    - dynamodb
    - lambda
    - s3
    - amplify(미정)
- tailwindcss
    - shadcn/ui


## structure

### page
```javascript
.
├── _components
├── _contexts // 해당 라우트 내의 상태 관리
├── _hooks 
├── _types
├── layout.tsx 
└── page.tsx

```

### sst

``` javascript
#
├── infra // sst 관리
│   └── dynamo
└── sst.config.ts // sst 설정
```

#### infra/dynamo
```javascript
.
├── _config.ts // dynamodb client 생성
├── _type.ts // 요청, 응답 타입 정의
└── tables
    └── todo.ts // crud 함수 정의
```

## usage
### 시작
1. `aws configure`
2. `npx sst dev`

### page 폴더 생성
```bash
npx plop
```

## deploy
어떤 방식으로 할지 고민중 ...

### 고려할 사항
- 모니터링 가능해야함

### 배포 방법
- github action ? // sst가 해주는데 필요할까?

### 배포 장소
- amplify
- s3 / cloudfront / lambda@edge
- ec2
    - docker
- ecs
...


## etc
- 모든 것을 AWS 서비스로 처리하고자 함(중요)
- api route 를 쓰지 않고자 함

## reference
- https://sst.dev/docs/
- https://ui.shadcn.com/
- *reddit*