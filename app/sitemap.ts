import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fromyou.co.kr'
  
  // 현재 날짜
  const today = new Date().toISOString().split('T')[0]
  
  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/mypage`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mypage/profile`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mypage/reviews`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mypage/points`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mypage/address`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mypage/letters`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support/notice`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support/faq`,
      lastModified: today, 
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms/refund`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/payment/success`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/payment/fail`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
} 