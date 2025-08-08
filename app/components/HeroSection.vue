<template>
  <section class="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Hero Content -->
        <div class="mb-8">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Discover
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium
            </span>
            Products
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Explore our curated collection of high-quality products designed to enhance your lifestyle. 
            From tech gadgets to fashion accessories, find everything you need.
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ productsStore.total }}+</div>
            <div class="text-gray-600 font-medium">Premium Products</div>
          </div>
          <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div class="text-3xl font-bold text-purple-600 mb-2">50K+</div>
            <div class="text-gray-600 font-medium">Happy Customers</div>
          </div>
          <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div class="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div class="text-gray-600 font-medium">Support Available</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            @click="scrollToProducts"
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop Now
          </button>
          <button class="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
            Learn More
          </button>
        </div>

        <!-- Scroll Indicator -->
        <div class="mt-16 animate-bounce">
          <svg class="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()

const scrollToProducts = () => {
  const element = document.getElementById('products-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
