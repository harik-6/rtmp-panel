const CacheService = {
  get: (key) => {
    const value = localStorage.getItem(key);
    if (value === undefined) return "nodata";
    return JSON.parse(value);
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default CacheService;
