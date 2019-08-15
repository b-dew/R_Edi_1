class ScriptCache {
    constructor(scripts) {}
    onLoad(success, reject) {}
  }
  const cache = new ScriptCache([
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.js',
      'https://cdnjs.com/some/library.js'
  ]).onLoad(() => {
    // everything is loaded after here
  })
  // ...
    scriptTag(src, cb) {
    return new Promise((resolve, reject) => {
      let resolved = false,
          errored = false,
          body = document.getElementsByTagName('body')[0],
          tag = document.createElement('script');

      tag.type = 'text/javascript';
      tag.async = false; // Load in order

      const handleCallback = tag.onreadystatechange = function() {
        if (resolved) return handleLoad();
        if (errored) return handleReject();
        const state = tag.readyState;
        if (state === 'complete') {
          handleLoad()
        } else if (state === 'error') {
          handleReject()
        }
      }

      const handleLoad = (evt) => {resolved = true;resolve(src);}
      const handleReject = (evt) => {errored = true; reject(src) }

      tag.addEventListener('load', handleLoad)
      tag.addEventListener('error', handleReject);
      tag.src = src;
      body.appendChild(tag);
      return tag;
    });
  }
}