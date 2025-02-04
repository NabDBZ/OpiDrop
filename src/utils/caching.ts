// Caching utilities
const CACHE_PREFIX = 'optidrop_';
const CACHE_VERSION = 'v1';

// Cache configuration
const cacheConfig = {
  drugData: {
    key: `${CACHE_PREFIX}drug_data_${CACHE_VERSION}`,
    expiration: 24 * 60 // 24 hours
  },
  userPreferences: {
    key: `${CACHE_PREFIX}user_prefs_${CACHE_VERSION}`,
    expiration: 7 * 24 * 60 // 7 days
  },
  calendarData: {
    key: `${CACHE_PREFIX}calendar_${CACHE_VERSION}`,
    expiration: 60 // 1 hour
  }
};

// Cache management
export const cacheManager = {
  // Initialize cache
  init() {
    this.cleanExpiredCache();
  },

  // Clean expired cache entries
  cleanExpiredCache() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const value = storage.get(key);
        if (!value) {
          localStorage.removeItem(key);
        }
      }
    });
  },

  // Cache drug data
  cacheDrugData(data: any) {
    storage.set(cacheConfig.drugData.key, data, cacheConfig.drugData.expiration);
  },

  // Get cached drug data
  getCachedDrugData() {
    return storage.get(cacheConfig.drugData.key);
  },

  // Cache user preferences
  cacheUserPreferences(prefs: any) {
    storage.set(
      cacheConfig.userPreferences.key,
      prefs,
      cacheConfig.userPreferences.expiration
    );
  },

  // Get cached user preferences
  getCachedUserPreferences() {
    return storage.get(cacheConfig.userPreferences.key);
  },

  // Cache calendar data
  cacheCalendarData(data: any) {
    storage.set(
      cacheConfig.calendarData.key,
      data,
      cacheConfig.calendarData.expiration
    );
  },

  // Get cached calendar data
  getCachedCalendarData() {
    return storage.get(cacheConfig.calendarData.key);
  },

  // Clear all cache
  clearCache() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};