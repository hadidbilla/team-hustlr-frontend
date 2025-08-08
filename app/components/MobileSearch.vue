<template>
  <div>
    <!-- Mobile Search Button -->
    <button 
      @click="openModal"
      class="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
      aria-label="Open search dialog"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
    >
      <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </button>

    <!-- Mobile Search Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 h-screen bg-black/60 z-50 lg:hidden"
        @click="closeModal"
        @keydown.esc="closeModal"
        aria-hidden="false"
      >
        <Transition
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="transform translate-y-full opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-full opacity-0"
        >
          <div 
            v-if="isOpen"
            @click.stop
            @keydown.esc="closeModal"
            class="bg-white h-full w-full flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dialog-title"
            aria-describedby="search-dialog-description"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h3 id="search-dialog-title" class="text-xl font-bold text-gray-900">Search Products</h3>
              <button 
                ref="closeButton"
                @click="closeModal"
                class="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                aria-label="Close search dialog"
              >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Search Input -->
            <div class="p-6 bg-white">
              <p id="search-dialog-description" class="sr-only">Enter keywords to search for products. Use the suggestions below or type your own search terms.</p>
              <div class="relative">
                <label for="search-input" class="sr-only">Search for products</label>
                <input 
                  id="search-input"
                  ref="searchInputRef"
                  v-model="searchInput"
                  @input="handleSearch"
                  @keydown.enter="performSearch"
                  @keydown="handleKeydown"
                  type="text" 
                  placeholder="Search for products..."
                  class="w-full pl-14 pr-20 py-5 bg-gray-50 border-0 rounded-2xl text-lg focus:outline-none focus:ring-3 focus:ring-gray-200 focus:bg-white transition-all duration-200 placeholder-gray-500"
                  autocomplete="off"
                  aria-describedby="search-dialog-description"
                  :aria-busy="productsStore.isSearching"
                />
                <svg class="absolute left-5 top-5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                
                <!-- Clear button -->
                <button 
                  v-if="searchInput.length > 0 && !productsStore.isSearching"
                  @click="clearSearchInput"
                  class="absolute right-5 top-5 p-1 hover:bg-gray-200 rounded-full transition-all duration-200 group"
                  aria-label="Clear search"
                >
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                <!-- Loading indicator -->
                <div v-if="productsStore.isSearching" class="absolute right-5 top-5" aria-hidden="true">
                  <svg class="animate-spin w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-if="productsStore.isSearching" class="sr-only" aria-live="polite">Searching for products...</div>
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto bg-gray-50">
              <!-- Popular Searches -->
              <div class="p-6">
                <h4 class="text-base font-semibold text-gray-900 mb-5">Popular Searches</h4>
                <div class="grid grid-cols-2 gap-3" role="group" aria-label="Popular search suggestions">
                  <button 
                    v-for="(suggestion, index) in searchSuggestions" 
                    :key="suggestion"
                    ref="suggestionButtons"
                    @click="selectSuggestion(suggestion)"
                    @keydown="handleSuggestionKeydown($event, index)"
                    class="p-5 text-left bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 text-base font-medium capitalize border border-gray-200 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    :aria-label="`Search for ${suggestion}`"
                  >
                    {{ suggestion }}
                  </button>
                </div>

                <!-- Recent searches if available -->
                <div v-if="recentSearches.length > 0" class="mt-8">
                  <h4 class="text-base font-semibold text-gray-900 mb-5">Recent Searches</h4>
                  <div class="space-y-3" role="group" aria-label="Recent search history">
                    <button 
                      v-for="(recent, index) in recentSearches" 
                      :key="recent"
                      ref="recentButtons"
                      @click="selectSuggestion(recent)"
                      @keydown="handleRecentKeydown($event, index)"
                      class="flex items-center gap-4 p-5 text-left hover:bg-white rounded-2xl transition-all duration-200 text-base w-full font-medium bg-white/50 border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                      :aria-label="`Search for ${recent}`"
                    >
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ recent }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()
const route = useRoute()

const isOpen = ref(false)
const searchInput = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Refs for accessibility
const searchInputRef = ref<HTMLInputElement>()
const closeButton = ref<HTMLButtonElement>()
const suggestionButtons = ref<HTMLButtonElement[]>([])
const recentButtons = ref<HTMLButtonElement[]>([])

// Store previous focus for restoration
const previousFocus = ref<HTMLElement | null>(null)

// Sync search input with store and URL
watch(() => productsStore.searchQuery, (newQuery) => {
  searchInput.value = newQuery
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
  'beauty', 'furniture', 'clothing', 'shoes', 'tablet'
])

// Recent searches (you could persist this in localStorage)
const recentSearches = ref<string[]>([])

// Handle search input with debouncing
const handleSearch = () => {
  const trimmedValue = searchInput.value.trim()
  
  // Immediately update URL without debounce for better UX
  if (trimmedValue.length === 0) {
    // Clear search immediately when empty
    clearSearch()
  } else {
    // Update URL immediately for any input
    updateUrlOnly(trimmedValue)
  }
  
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set new timeout for debounced search (only for actual searching)
  searchTimeout.value = setTimeout(() => {
    if (trimmedValue.length >= 2) {
      performSearchWithoutUrlUpdate()
    }
  }, 300)
}

// Update URL only without performing search
const updateUrlOnly = async (query: string) => {
  if (query && query.trim()) {
    // Update URL with partial search query
    await navigateTo(`/?search=${encodeURIComponent(query.trim())}`, { replace: true })
  }
}

// Clear search function
const clearSearch = async () => {
  await productsStore.clearSearch()
}

// Clear search input manually
const clearSearchInput = async () => {
  searchInput.value = ''
  await clearSearch()
  // Focus back to the input for better UX
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Perform search without URL update (URL already updated)
const performSearchWithoutUrlUpdate = async () => {
  if (searchInput.value.trim()) {
    const query = searchInput.value.trim()
    
    // Add to recent searches
    if (!recentSearches.value.includes(query)) {
      recentSearches.value.unshift(query)
      // Keep only last 5 searches
      recentSearches.value = recentSearches.value.slice(0, 5)
    }
    
    // Search without updating URL (already updated in handleSearch)
    await productsStore.searchProducts(query, false)
    isOpen.value = false
    
    // Scroll to products section
    const element = document.getElementById('products-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// Perform the actual search (with URL update)
const performSearch = async () => {
  if (searchInput.value.trim()) {
    // Add to recent searches
    const query = searchInput.value.trim()
    if (!recentSearches.value.includes(query)) {
      recentSearches.value.unshift(query)
      // Keep only last 5 searches
      recentSearches.value = recentSearches.value.slice(0, 5)
    }
    
    await productsStore.searchProducts(query)
    isOpen.value = false
    
    // Scroll to products section
    const element = document.getElementById('products-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// Select a suggestion
const selectSuggestion = async (suggestion: string) => {
  searchInput.value = suggestion
  await performSearch()
}

// Open modal with accessibility
const openModal = () => {
  previousFocus.value = document.activeElement as HTMLElement
  isOpen.value = true
  
  // Focus the search input after the modal animation
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Close modal with accessibility
const closeModal = () => {
  isOpen.value = false
  
  // Restore focus to the trigger button
  nextTick(() => {
    previousFocus.value?.focus()
  })
}

// Handle keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    // Focus first suggestion button
    if (suggestionButtons.value?.[0]) {
      suggestionButtons.value[0].focus()
    }
  } else if (event.key === 'Escape') {
    closeModal()
  }
}

// Handle suggestion button keyboard navigation
const handleSuggestionKeydown = (event: KeyboardEvent, index: number) => {
  const buttons = suggestionButtons.value
  if (!buttons) return

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      if (index % 2 === 0 && buttons[index + 1]) {
        buttons[index + 1]?.focus()
      }
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (index % 2 === 1 && buttons[index - 1]) {
        buttons[index - 1]?.focus()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (buttons[index + 2]) {
        buttons[index + 2]?.focus()
      } else if (recentButtons.value?.[0]) {
        recentButtons.value[0]?.focus()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (buttons[index - 2]) {
        buttons[index - 2]?.focus()
      } else {
        searchInputRef.value?.focus()
      }
      break
    case 'Escape':
      closeModal()
      break
  }
}

// Handle recent button keyboard navigation
const handleRecentKeydown = (event: KeyboardEvent, index: number) => {
  const buttons = recentButtons.value
  if (!buttons) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (buttons[index + 1]) {
        buttons[index + 1]?.focus()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (buttons[index - 1]) {
        buttons[index - 1]?.focus()
      } else if (suggestionButtons.value?.length) {
        const lastIndex = suggestionButtons.value.length - 1
        suggestionButtons.value[lastIndex]?.focus()
      } else {
        searchInputRef.value?.focus()
      }
      break
    case 'Escape':
      closeModal()
      break
  }
}

// Handle clicks outside modal to close
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  // Restore body scroll
  document.body.style.overflow = ''
})
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
