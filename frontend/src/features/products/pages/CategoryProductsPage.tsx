import { useEffect, useState } from 'react'
import ProductCard from '../../../components/product/ProductCard'
import { fetchFromApi } from '../../../services/api'
import type { Product } from '../../../types'

interface CategoryProductsPageProps {
  category: 'Flowers' | 'Letters' | 'Swastika'
  description: string
}

export default function CategoryProductsPage({ category, description }: CategoryProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFromApi<Product[]>('/products/')
      .then((data) => {
        setProducts(data.filter((product) => product.category === category))
      })
      .catch((error) => {
        console.error('Failed to load category products:', error)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [category])

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ marginBottom: '30px' }}>
        <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
          Shop by design
        </p>
        <h1 style={{ margin: '10px 0 8px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--charcoal)' }}>
          {category}
        </h1>
        <p style={{ margin: 0, color: 'rgba(34,25,22,0.65)', fontSize: '16px' }}>{description}</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--charcoal)' }}>Loading products...</p>
      ) : (
        <div
          className="category-products-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .category-products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 560px) {
          .category-products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
