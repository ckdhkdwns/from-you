<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://fromyou.co.kr">
    <img src="https://fromyou.co.kr/favicons/apple-touch-icon.png" alt="from-you" width="120" height="120">
  </a>

<h3 align="center">프롬유(From.You)</h3>

  <p align="center">
    멀리 있어도, 마음은 가까이
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">사이트 링크</a>
    &middot;
    <a href="https://desk.channel.io/2v05e/groups/고객피드백-449705">채널톡 문의</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## 프로젝트 소개

프롬유는 인터넷으로 편지 내용을 입력하면 **우체국을 통해 편지를 발송해주는 서비스**입니다

- **개발 기간 :** 2025.02.20 ~ 현재
- **참여 인원 :** 디자인 1명, 개발 1명 (본인)
- **진행 상태 :** 개발 중
- **접속 링크 :**
    - https://fromyou.co.kr
    - https://프롬유.com
- **사용 기술 :** [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](#) [![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?logo=amazondynamodb&logoColor=fff)](#) [![S3](https://img.shields.io/badge/S3-569A31?logo=amazons3&logoColor=fff)](#) [![Next.js](https://img.shields.io/badge/SST-E27152?logo=sst&logoColor=white)](#)

<br/>
<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- GETTING STARTED -->

## 시작하기

로컬 환경에서 프로젝트를 설정하는 방법입니다.

### 사전 요구사항

- npm
    ```sh
    npm install npm@latest -g
    ```
- Node.js (18.x 이상)

### 설치

1. 레포지토리 클론

    ```sh
    git clone https://github.com/ckdhkdwns/from-you.git
    ```

2. AWS CLI 설치

    - macOS (Homebrew 사용)
        ```sh
        brew install awscli
        ```
    - Windows
        ```sh
        # AWS CLI 설치 프로그램 다운로드 후 실행
        # https://aws.amazon.com/ko/cli/ 에서 다운로드
        ```
    - Linux
        ```sh
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        ```

3. AWS 계정 설정

    ```sh
    aws configure
    ```

4. SST(Serverless Stack Toolkit) 설치 및 설정

    ```sh
    npx sst@3.9.39 init
    ```

    - 프로젝트 이름 및 기본 설정 입력

5. NPM 패키지 설치

    ```sh
    npm install
    ```

6. 환경 변수 설정
    ```sh
    cp .env.example .env.development
    cp .env.example .env.production
    ```
7. SST 실행
    ```sh
    npx sst dev
    ```

<!-- FEATURES -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
