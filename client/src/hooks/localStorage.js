let isLocalStorageSupported = typeof localStorage === 'object';

try {
  localStorage.setItem("Person", 'test');
  localStorage.removeItem("Person");
} catch (e) {
  isLocalStorageSupported = false;
  
  if (e.code === DOMException.QUOTA_EXCEEDED_ERR && localStorage.length === 0) {} 
  else {throw e;}
}

const LocalStorage = {
  getItem: (key) => {
    if (isLocalStorageSupported) {
      return localStorage.getItem(key);
    }
    return null;
  },

  setItem: (key, value) => {
    if (isLocalStorageSupported) {
      localStorage.setItem(key, value);
    }
  },

  removeItem: (key) => {
    if (isLocalStorageSupported) {
      localStorage.removeItem(key);
    }
  },
};


export default LocalStorage;