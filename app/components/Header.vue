<template>
  <header class="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <!-- Main Header -->
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Team Hustlr
            </h1>
            <p class="text-xs text-gray-500 -mt-1">Premium Products</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          
          
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="hidden lg:flex items-center">
            <div class="relative">
              <input 
                v-model="searchInput"
                @input="handleSearch"
                @keydown.enter="performSearch"
                @focus="showSuggestions = true"
                type="text" 
                placeholder="Search products..."
                class="w-64 pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
              />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              
              <!-- Clear button -->
              <button 
                v-if="searchInput"
                @click="clearSearch"
                class="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <!-- Loading indicator -->
              <div v-if="productsStore.isSearching" class="absolute right-3 top-2.5">
                <svg class="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <!-- Search suggestions dropdown -->
              <div 
                v-if="showSuggestions && searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50"
              >
                <div 
                  v-for="suggestion in searchSuggestions" 
                  :key="suggestion"
                  @click="selectSuggestion(suggestion)"
                  class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                >
                  {{ suggestion }}
                </div>
              </div>
            </div>
          </div>

          

          <!-- Mobile Search -->
          <MobileSearch />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()
const route = useRoute()

// Search state
const searchInput = ref('')
const showSuggestions = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Sync search input with store and URL
watch(() => productsStore.searchQuery, (newQuery) => {
  // Only update input if user is not currently typing (no pending timeout)
  if (!searchTimeout.value) {
    searchInput.value = newQuery
  }
})

// Initialize search input from URL
onMounted(() => {
  const urlSearch = route.query.search as string
  if (urlSearch) {
    searchInput.value = urlSearch
  }
})

// Popular search suggestions
const searchSuggestions = ref([
  'phone', 'laptop', 'headphones', 'watch', 'camera', 
  'smartphone', 'beauty', 'furniture', 'clothing', 'shoes'
])

// Handle search input with debouncing
const handleSearch = () => {
  showSuggestions.value = true
  
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Capture the current search value to avoid race conditions
  const currentSearchValue = searchInput.value
  
  // Set new timeout for debounced search
  searchTimeout.value = setTimeout(() => {
    if (currentSearchValue.trim().length >= 1) {
      // Ensure we're still searching for the same value
      if (searchInput.value === currentSearchValue) {
        performSearchWithValue(currentSearchValue.trim())
      }
    } else if (currentSearchValue.trim().length === 0) {
      // Clear search if input is empty
      if (searchInput.value === currentSearchValue) {
        clearSearch()
      }
    }
  }, 300)
}

// Perform the actual search with a specific value
const performSearchWithValue = async (searchValue: string) => {
  if (searchValue) {
    showSuggestions.value = false
    await productsStore.searchProducts(searchValue)
    
    // Clear the timeout since search is done
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }
    
    // Now sync the input with the search query
    searchInput.value = searchValue
    
    // Scroll to products section
    const element = document.getElementById('products-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// Perform the actual search with current input value
const performSearch = async () => {
  await performSearchWithValue(searchInput.value.trim())
}

// Select a suggestion
const selectSuggestion = async (suggestion: string) => {
  searchInput.value = suggestion
  showSuggestions.value = false
  await performSearch()
}

// Clear search
const clearSearch = async () => {
  searchInput.value = ''
  showSuggestions.value = false
  await productsStore.clearSearch()
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
}

// Close suggestions when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showSuggestions.value = false
    }
  })
})

onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
