<template>
  <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1" :class="{ 'opacity-75': product.stock === 0 }">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <img 
        :src="product.thumbnail || '/placeholder-product.jpg'" 
        :alt="product.title"
        class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        @error="handleImageError"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Stock Badge -->
      <div v-if="product.stock === 0" class="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
        Out of Stock
      </div>
      <div v-else-if="product.stock < 5" class="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
        Low Stock
      </div>
      
      <!-- Rating Badge -->
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
        <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- Quick Actions -->
      <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div class="flex space-x-2">
          <button class="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <button class="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <!-- Brand -->
      <div class="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">{{ product.brand }}</div>
      
      <!-- Product Title -->
      <h3 class="font-semibold text-gray-900 text-base mb-3 line-clamp-2 h-12 leading-6">
        {{ product.title }}
      </h3>

      <!-- Price Section -->
      <div class="flex items-baseline gap-3 mb-4">
        <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.discountPercentage > 0" class="text-sm text-white bg-green-500 px-2 py-1 rounded-full font-semibold">
          -{{ product.discountPercentage.toFixed(0) }}%
        </span>
      </div>

      <!-- Variant Options -->
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
        <select 
          v-model="selectedVariant" 
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          :disabled="product.stock === 0"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <!-- Add to Cart / Out of Stock Button -->
      <div v-if="product.stock === 0" class="space-y-2">
        <!-- Out of Stock Button -->
        <button
          disabled
          class="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-red-100 text-red-600 cursor-not-allowed"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"></path>
            </svg>
            Out of Stock
          </span>
        </button>
        
        
      </div>
      
      <!-- Add to Cart Button (In Stock) -->
      <button
        v-else
        @click="handleAddToCart"
        class="w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-95 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
          </svg>
          Add to Cart
        </span>
      </button>

      <!-- Stock Info -->
      <div class="mt-3 flex items-center justify-between text-xs">
        <span class="text-gray-500">
          <span v-if="product.stock > 0" class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            {{ product.stock }} in stock
          </span>
          <span v-else class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-400 rounded-full"></div>
            No stock available
          </span>
        </span>
        <span class="text-gray-400">Free shipping</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface Props {
  product: Product
}

const props = defineProps<Props>()
const cartStore = useCartStore()

const selectedVariant = ref('medium')

const handleAddToCart = () => {
  if (props.product.stock > 0) {
    cartStore.addToCart({
      id: props.product.id,
      title: props.product.title,
      price: props.product.price,
      thumbnail: props.product.thumbnail,
      stock: props.product.stock
    })
    
    // Show success feedback (you could add a toast notification here)
    console.log('Added to cart:', props.product.title)
  }
}

const notifyWhenAvailable = () => {
  // In a real app, this would send a notification request to the backend
  alert(`We'll notify you when "${props.product.title}" is back in stock!`)
  console.log('Notification requested for:', props.product.title)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-product.jpg'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover .animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>

