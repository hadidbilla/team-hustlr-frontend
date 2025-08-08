<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Products Section -->
      <ProductGrid />
    </main>

    <!-- Cart Component -->
    <Cart />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()
const route = useRoute()

// Initialize search from URL query on page load
onMounted(async () => {
  const searchQuery = route.query.search as string
  if (searchQuery) {
    await productsStore.initializeFromQuery(searchQuery)
  }
})

// Watch for route changes to handle browser navigation
watch(() => route.query.search, async (newSearch) => {
  if (newSearch && typeof newSearch === 'string') {
    await productsStore.initializeFromQuery(newSearch)
  } else if (!newSearch && productsStore.searchQuery) {
    await productsStore.clearSearch(false)
  }
})
</script>

<style>

</style>