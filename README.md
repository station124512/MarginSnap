# 🚀 셀러마진 119 (SellerMargin 119)
> **초보 및 글로벌 셀러를 위한 역마진 제로(0%) 스마트 마진 계산기 & 목표 마진 역산 솔루션**  
> *Global Smart Margin & Reverse Pricing Calculator for E-Commerce Sellers*

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Coupang%20%7C%20Naver%20%7C%20Amazon%20%7C%20AliExpress%20%7C%20Shopee%20%7C%20Qoo10-blue)
![Languages](https://img.shields.io/badge/Languages-KO%20%7C%20EN%20%7C%20JA%20%7C%20ZH-emerald)
![Currency](https://img.shields.io/badge/Currency-%E2%82%A9%20%7C%20%24%20%7C%20%C2%A5-indigo)
![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20TailwindCSS%20%7C%20Vite-violet)
![License](https://img.shields.io/badge/License-MIT-slate)

</div>

---

## 📌 프로젝트 소개 (Overview)

온라인 이커머스에 진입하는 초보 셀러들의 가장 큰 페인 포인트인 **"물건은 많이 팔리는데 정산받고 나면 통장에 남는 돈이 없거나 적자(역마진)가 발생하는 문제"**를 원천 해결하기 위해 제작된 웹 애플리케이션입니다.

토스(Toss)와 모던 핀테크 SaaS 스타일의 깔끔하고 직관적인 UI를 제공하며, 국내외 8대 주요 이커머스 플랫폼의 복잡한 수수료 구조(부가세 별도, 배송비 수수료 등)와 숨은 비용(포장비, 반품 충당금, 광고비, 세금)을 1원/1센트 단위로 정밀하게 계산합니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 📊 실시간 마진 계산기 (Live Margin Calculator)
- **1초 반응형 연산**: 판매가, 사입원가, 배송비 입력 즉시 실 정산액, 최종 순이익, 순마진율(%), ROI(%) 산출
- **비용 구조 SVG 도넛 차트**: 총매출 100% 기준 원가, 수수료, 물류비, 광고비, 세금, 순이익의 비중을 한눈에 시각화
- **손익분기 광고 ROAS (BEP ROAS)**: 적자가 나지 않는 최소 광고 효율 한계선 자동 제시

### 2. 🚨 역마진 0% 안심 경보 (Red Alert)
- 순이익이 마이너스(< 0원)가 되는 즉시 붉은색 경고 박스와 흔들림(Shake) 효과로 출혈 판매를 원천 차단

### 3. 🎯 목표 마진 판매가 역산기 (Reverse Pricing Engine)
- *"사입가 10,000원에 순마진 20%를 남기려면 얼마에 팔아야 하지?"*
- 원하는 순마진율(%) 또는 목표 순이익 금액을 입력하면, 플랫폼 수수료와 세금을 모두 감안한 **최적 권장 판매가를 자동 역산**하고 계산기에 원클릭 동기화

### 4. 🌐 8대 글로벌 플랫폼 & 3개 통화 연동
플랫폼 선택 시 해당 통화 기호(`₩`, `$`, `¥`) 및 숫자 서식이 인풋과 결과창에 일괄 자동 반영됩니다.

| 플랫폼 | 국가/마켓 | 통화 | 기본 수수료율 | 특이사항 |
| :--- | :--- | :---: | :---: | :--- |
| **쿠팡 윙 (Coupang Wing)** | 한국 | ₩ (KRW) | 10.8% | 카테고리 수수료 부가세 1.1배 별도, 배송비 수수료 3.3% |
| **쿠팡 로켓그로스 (Growth)** | 한국 | ₩ (KRW) | 10.8% | 제트배송 입고/출고 물류 수수료 체계 |
| **스마트스토어 (SmartStore)** | 한국 | ₩ (KRW) | 5.63% | 네이버페이 결제수수료 + 매출연동수수료 2.0% |
| **아마존 미국 (Amazon US)** | 미국/글로벌 | $ (USD) | 15.0% | 카테고리별 Referral Fee 반영 (센트 단위 지원) |
| **알리익스프레스 (AliExpress)** | 글로벌 | $ (USD) | 8.0% | 해외 직판 스토어 커미션 |
| **쇼피 (Shopee Global)** | 동남아/글로벌 | $ (USD) | 8.0% | 거래수수료 및 마켓플레이스 커미션 |
| **큐텐 재팬 (Qoo10 Japan)** | 일본 | ¥ (JPY) | 10.0% | 일본 크로스보더 카테고리 요율 |
| **기타 오픈마켓 (Custom)** | 커스텀 | ₩ (KRW) | 13.0% | 11번가, G마켓, 자사몰 등 수수료 수동 지정 |

### 5. 🌍 4개 국어 다국어 지원 (i18n)
- 상단 우측 토글을 통해 **한국어(KO), 영어(EN), 일본어(日本語), 중국어(中文)**를 원클릭으로 실시간 전환
- 모든 라벨, 진단 메시지, 영수증, 툴팁이 완벽 번역 연동

### 6. 🧾 영수증 카드 팝업 & 클립보드 복사 & 로컬 저장
- 종이 영수증 감성의 정산 명세서 팝업 (인쇄 및 SNS 질문/인증용)
- 메신저나 메모장에 바로 붙여넣는 텍스트 1초 복사
- 브라우저 LocalStorage에 최근 10개 계산 내역 보관 및 불러오기

---

## 📂 프로젝트 문서 (Documentation)

- [docs/01_PRD.md](docs/01_PRD.md) : 제품 요구사항 정의서 (페르소나, 핵심 지표, 계산 공식 상세)
- [docs/02_SPEC.md](docs/02_SPEC.md) : 개발자용 기술 명세서 (TypeScript 인터페이스, 단위 테스트 케이스)
- [docs/03_MARKETING.md](docs/03_MARKETING.md) : 랜딩페이지 카피라이팅 & 셀러 커뮤니티 바이럴 텍스트

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Toss Fintech Style Guide)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage (서버 전송 없는 100% 개인정보 안전 구조)

---

## 💻 로컬 실행 방법 (Getting Started)

### 1. 저장소 클론 및 패키지 설치
```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/`으로 접속합니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

---

## 📄 라이선스 (License)
MIT License. 자유롭게 수정 및 배포하실 수 있습니다.
