import { useState, useEffect } from 'react'
import axios from 'axios'
import { CLOTHING_CATEGORIES, COLORS, FABRICS } from '@/utils/designData'

const CATALOG_API = 'http://localhost:5000/api/catalog'

export function useCatalog() {
  const [categories, setCategories] = useState(CLOTHING_CATEGORIES as any[])
  const [colors, setColors] = useState(COLORS as any[])
  const [fabrics, setFabrics] = useState(FABRICS as any[])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [catRes, colorRes, fabricRes] = await Promise.all([
          axios.get(`${CATALOG_API}/categories`),
          axios.get(`${CATALOG_API}/colors`),
          axios.get(`${CATALOG_API}/fabrics`),
        ])
        if (catRes.data.categories?.length > 0) setCategories(catRes.data.categories)
        if (colorRes.data.colors?.length > 0) setColors(colorRes.data.colors)
        if (fabricRes.data.fabrics?.length > 0) setFabrics(fabricRes.data.fabrics)
      } catch {
        // Falls back to static data already set
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return { categories, colors, fabrics, loading }
}
