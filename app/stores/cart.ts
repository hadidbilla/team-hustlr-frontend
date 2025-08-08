import { defineStore } from 'pinia'

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
  stock: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  // Getters
  const totalItems = computed(() => items.value.reduce((total: number, item: CartItem) => total + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0))
  const getItemById = computed(() => (id: number) => items.value.find((item: CartItem) => item.id === id))

  // Actions
  const addToCart = (product: { id: number; title: string; price: number; thumbnail: string; stock: number }) => {
    const existingItem = items.value.find((item: CartItem) => item.id === product.id)
    
    if (existingItem) {
      // If item already exists, increase quantity if stock allows
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++
      }
    } else {
      // Add new item to cart
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.thumbnail,
        stock: product.stock
      })
    }
  }

  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex((item: CartItem) => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((item: CartItem) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else if (quantity <= item.stock) {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  return {
    // State
    items: readonly(items),
    isOpen: readonly(isOpen),
    // Getters
    totalItems,
    totalPrice,
    getItemById,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  }
})

