<template>
  <div>
    <!-- Cart Toggle Button -->
    <button 
      @click="cartStore.toggleCart"
      class="fixed bottom-6 right-6 z-50 group"
    >
      <div class="relative bg-gray-900 text-white p-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-xl">
        <svg class="w-6 h-6 transition-transform group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
        </svg>
        
        <!-- Cart Badge -->
        <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold border-2 border-white shadow-md">
          {{ cartStore.totalItems }}
        </span>
      </div>
    </button>

    <!-- Cart Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="cartStore.isOpen" 
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        @click="cartStore.toggleCart"
      ></div>
    </Transition>

    <!-- Cart Sidebar -->
    <Transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div 
        v-if="cartStore.isOpen"
        class="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 z-50"
      >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="relative bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <p class="text-gray-500 text-sm mt-1">{{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }}</p>
            </div>
            <button 
              @click="cartStore.toggleCart"
              class="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto">
          <!-- Empty Cart State -->
          <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
            <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p class="text-gray-500 mb-8 max-w-sm leading-relaxed">Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>
            <button 
              @click="cartStore.toggleCart"
              class="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Cart Items List -->
          <div v-else class="p-6">
            <div class="space-y-3">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id"
                class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 hover:bg-white hover:border-gray-300/60 hover:shadow-sm transition-all duration-200"
              >
                <div class="flex items-start gap-4">
                  <!-- Item Image -->
                  <div class="relative">
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-18 h-18 object-cover rounded-xl"
                    />
                  </div>
                  
                  <!-- Item Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-3">
                      <h3 class="font-medium text-gray-900 text-sm leading-tight pr-2">{{ item.title }}</h3>
                      <button 
                        @click="cartStore.removeFromCart(item.id)"
                        class="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 shrink-0"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <!-- Price -->
                      <div class="text-gray-900 font-semibold text-lg">${{ (item.price * item.quantity).toFixed(2) }}</div>
                      
                      <!-- Quantity Controls -->
                      <div class="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        <button 
                          @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                          class="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center transition-all duration-200 shadow-sm"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                        <span class="font-medium text-gray-900 text-sm min-w-[2rem] text-center">{{ item.quantity }}</span>
                        <button 
                          @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                          :disabled="item.quantity >= item.stock"
                          class="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Unit Price -->
                    <div class="mt-2 text-xs text-gray-500">
                      ${{ item.price.toFixed(2) }} each
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div v-if="cartStore.items.length > 0" class="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6">
          <!-- Order Summary -->
          <div class="bg-gray-50/80 rounded-2xl p-5 mb-5">
            <h4 class="font-semibold text-gray-900 mb-4">Order Summary</h4>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal ({{ cartStore.totalItems }} items)</span>
                <span class="font-medium text-gray-900">${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium text-gray-900">${{ (cartStore.totalPrice * 0.08).toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 mt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Total</span>
                  <span class="text-xl font-bold text-gray-900">${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-3">
            <button 
              @click="checkout"
              class="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Secure Checkout
              </span>
            </button>
            
            
          </div>
          
          <!-- Security Badge -->
          <div class="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>Secure SSL encrypted checkout</span>
          </div>
        </div>
      </div>
    </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()

const checkout = () => {
  // Implement checkout logic here
  alert('Checkout functionality would be implemented here!')
  console.log('Checkout with items:', cartStore.items)
}
</script>

