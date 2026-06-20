export interface Business {
  id: string
  created_at: string
  email: string
  business_name: string
  business_slug: string
  whatsapp_number?: string
  website_url?: string
  is_active: boolean
  stripe_customer_id?: string
  plan_tier: 'free' | 'pro'
}

export interface Review {
  id: string
  created_at: string
  business_id: string
  customer_name: string
  customer_phone?: string
  rating: number
  review_text: string
  media_url?: string
  source: 'whatsapp' | 'link' | 'manual'
  is_approved: boolean
  is_featured: boolean
}
