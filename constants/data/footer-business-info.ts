export const COMPANY_INFO = {
  companyName: '회사명: 프롬유(From.You)',
  representative: '대표: 문희원',
  businessNumber: '사업자번호: 281-74-00634',
  communicationNumber: '통신판매업: 제',
  phone: '고객센터: 010-7311-3348',
  fax: '팩스: 123-4567-5678',
  email: '이메일: fromyou@address.com',
  bankAccount: '입금계좌: 우리나라은행 123456-78-123456',
  address: '주소: 서울특별시 강동구 아리수로93길 33-15, 1동 8층 803호(강일동, 강일테라우드)',
  businessHours: '영업시간: 평일 09:00 - 18:00',
  lunchHours: '점심시간: 11:30 - 13:00',
  holidays: '휴무: 토,일,공휴일'
} as const;

export const FOOTER_LINKS = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '고객센터', href: '/support' }
] as const; 