import { defineStore } from 'pinia'
import type { AxiosResponse } from 'axios'

interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Array<{
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
  }>
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  thumbnail: string
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const skip = ref(0)
  const limit = ref(30)
  const searchQuery = ref('')
  const searchResults = ref<Product[]>([])
  const isSearching = ref(false)

  // Getters
  const availableProducts = computed(() => products.value.filter((product: Product) => product.stock > 0))
  const outOfStockProducts = computed(() => products.value.filter((product: Product) => product.stock === 0))
  const getProductById = computed(() => (id: number) => products.value.find((product: Product) => product.id === id))

  // Actions
  const fetchProducts = async (limitParam = 30, skipParam = 0) => {
    loading.value = true
    error.value = null
    
    try {
      const { $axios } = useNuxtApp()
      const response: AxiosResponse<ProductsResponse> = await $axios.get<ProductsResponse>(`/products?limit=${limitParam}&skip=${skipParam}`)
      
      // Get dummy out-of-stock products
      const dummyProducts = generateDummyOutOfStockProducts()
      
      // If this is the first page load, insert dummy products at the beginning
      if (skipParam === 0) {
        products.value = [...dummyProducts, ...response.data.products]
        total.value = response.data.total + dummyProducts.length
      } else {
        // For subsequent pages, just append the real products
        products.value = [...products.value, ...response.data.products]
        total.value = response.data.total + dummyProducts.length
      }
      
      skip.value = response.data.skip
      limit.value = response.data.limit
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number): Promise<Product> => {
    loading.value = true
    error.value = null
    
    try {
      const { $axios } = useNuxtApp()
      const response: AxiosResponse<Product> = await $axios.get<Product>(`/products/${id}`)
      
      // Update or add the product to the store
      const existingIndex = products.value.findIndex((p: Product) => p.id === id)
      if (existingIndex >= 0) {
        products.value[existingIndex] = response.data
      } else {
        products.value.push(response.data)
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
      console.error('Error fetching product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to search through local products
  const searchLocalProducts = (products: Product[], query: string): Product[] => {
    const searchTerm = query.toLowerCase().trim()
    
    return products.filter(product => {
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    })
  }

  const searchProducts = async (query: string, updateUrl = true) => {
    if (!query.trim()) {
      searchResults.value = []
      searchQuery.value = ''
      isSearching.value = false
      if (updateUrl) {
        await navigateTo('/', { replace: true })
      }
      return
    }

    isSearching.value = true
    searchQuery.value = query
    error.value = null

    try {
      const { $axios } = useNuxtApp()
      const response: AxiosResponse<ProductsResponse> = await $axios.get<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`)
      
      // Get dummy products and search through them locally
      const dummyProducts = generateDummyOutOfStockProducts()
      const matchingDummyProducts = searchLocalProducts(dummyProducts, query)
      
      // Combine API results with local dummy product results
      searchResults.value = [...matchingDummyProducts, ...response.data.products]
      
      // Update URL with search query
      if (updateUrl) {
        await navigateTo(`/?search=${encodeURIComponent(query)}`, { replace: true })
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to search products'
      console.error('Error searching products:', err)
    } finally {
      isSearching.value = false
    }
  }

  const clearSearch = async (updateUrl = true) => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
    error.value = null
    
    if (updateUrl) {
      await navigateTo('/', { replace: true })
    }
  }

  const initializeFromQuery = async (searchQuery: string) => {
    if (searchQuery && searchQuery.trim()) {
      await searchProducts(searchQuery.trim(), false)
    }
  }

  // Generate dummy out-of-stock products for demonstration
  const generateDummyOutOfStockProducts = (): Product[] => {
    return [
      
      {
        id: 9002,
        title: "Limited Edition Smartwatch - Out of Stock",
        description: "Exclusive smartwatch with advanced health tracking. Sold out due to limited production run.",
        category: "wearables",
        price: 499.99,
        discountPercentage: 20,
        rating: 4.9,
        stock: 0,
        tags: ["smartwatch", "wearables", "health"],
        brand: "TechTime",
        sku: "TT-SW-002",
        weight: 0.15,
        dimensions: { width: 4.5, height: 4.5, depth: 1.2 },
        warrantyInformation: "1 year warranty",
        shippingInformation: "Currently unavailable",
        availabilityStatus: "Out of Stock",
        reviews: [
          {
            rating: 5,
            comment: "Best smartwatch I've ever owned!",
            date: "2024-01-10T14:20:00.000Z",
            reviewerName: "Tech Enthusiast",
            reviewerEmail: "tech@example.com"
          }
        ],
        returnPolicy: "30 days return policy",
        minimumOrderQuantity: 1,
        meta: {
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
          barcode: "1234567890124",
          qrCode: "QR124"
        },
        thumbnail: "https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/1.png"]
      },
      {
        id: 9003,
        title: "Gaming Mechanical Keyboard - Unavailable",
        description: "Professional gaming keyboard with RGB lighting. Currently out of stock, restocking soon.",
        category: "gaming",
        price: 159.99,
        discountPercentage: 0,
        rating: 4.7,
        stock: 0,
        tags: ["gaming", "keyboard", "mechanical"],
        brand: "GamePro",
        sku: "GP-KB-003",
        weight: 1.2,
        dimensions: { width: 45, height: 15, depth: 3 },
        warrantyInformation: "2 year warranty",
        shippingInformation: "Currently unavailable",
        availabilityStatus: "Out of Stock",
        reviews: [
          {
            rating: 4,
            comment: "Great for gaming, but sold out everywhere!",
            date: "2024-01-08T09:15:00.000Z",
            reviewerName: "Gamer123",
            reviewerEmail: "gamer@example.com"
          }
        ],
        returnPolicy: "30 days return policy",
        minimumOrderQuantity: 1,
        meta: {
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-08T00:00:00.000Z",
          barcode: "1234567890125",
          qrCode: "QR125"
        },
        thumbnail: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png"]
      }
    ]
  }

  return {
    // State
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    skip: readonly(skip),
    limit: readonly(limit),
    searchQuery: readonly(searchQuery),
    searchResults: readonly(searchResults),
    isSearching: readonly(isSearching),
    // Getters
    availableProducts,
    outOfStockProducts,
    getProductById,
    // Actions
    fetchProducts,
    fetchProductById,
    searchProducts,
    clearSearch,
    initializeFromQuery,
    generateDummyOutOfStockProducts
  }
})

