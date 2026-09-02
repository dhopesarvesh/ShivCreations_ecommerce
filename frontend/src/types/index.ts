export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
}
 
export interface HeroSlide {
  id: number
  image: string
  headline: string
  subtext: string
  cta: string
}