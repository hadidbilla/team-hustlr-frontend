<template>
  <section id="products-section" class="container mx-auto px-4 py-16">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <!-- Search Results Header -->
      <div v-if="productsStore.searchQuery">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Search Results for 
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            "{{ productsStore.searchQuery }}"
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Found {{ productsStore.searchResults.length }} {{ productsStore.searchResults.length === 1 ? 'product' : 'products' }}
        </p>
        <button 
          @click="() => clearSearch()"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Search
        </button>
      </div>
      
      <!-- Default Header -->
      <div v-else>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our 
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Products
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of premium products designed to enhance your lifestyle
        </p>
      </div>
    </div>

    <!-- Loading State with Skeletons -->
    <div v-if="productsStore.loading || productsStore.isSearching" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <ProductCardSkeleton v-for="n in 10" :key="n" />
    </div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="text-center py-20">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
        <p class="text-gray-600 mb-6">{{ productsStore.error }}</p>
        <button 
          @click="loadProducts"
          class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in currentProducts" 
          :key="product.id" 
          :product="product as any"
          class="animate-fade-in"
        />
      </div>

      <!-- Empty State -->
      <div v-if="currentProducts.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            {{ productsStore.searchQuery ? 'No Search Results' : 'No Products Found' }}
          </h3>
          <p class="text-gray-600">
            {{ productsStore.searchQuery 
              ? `No products found for "${productsStore.searchQuery}". Try searching for something else.`
              : 'No products are currently available. Check back soon!'
            }}
          </p>
          <button 
            v-if="productsStore.searchQuery"
            @click="() => clearSearch()"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </div>

    
  </section>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()

// Computed property to determine which products to show
const currentProducts = computed(() => {
  return productsStore.searchQuery 
    ? productsStore.searchResults 
    : productsStore.products
})

// Load products on component mount
onMounted(() => {
  loadProducts()
})

const loadProducts = async () => {
  await productsStore.fetchProducts()
}

const loadMoreProducts = async () => {
  const currentSkip = productsStore.products.length
  await productsStore.fetchProducts(30, currentSkip)
}

const clearSearch = async () => {
  await productsStore.clearSearch()
}
</script>

