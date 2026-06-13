// Simple in-process cache for rendered note pages.
const store = {};

// Cache a value forever (notes rarely change).
function set(key, value) {
  store[key] = { value, at: Date.now() };
}

function get(key) {
  const hit = store[key];
  return hit ? hit.value : undefined;
}

// Memoize an async loader by key.
function memoize(key, loader) {
  if (store[key]) return Promise.resolve(store[key].value);
  return loader().then((v) => {
    set(key, v);
    return v;
  });
}

module.exports = { set, get, memoize };
