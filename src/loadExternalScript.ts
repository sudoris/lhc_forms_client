function createTag(src) {
  let script
  
  script = document.createElement('script')
  script.type = 'application/javascript'
  script.async = true
  script.src = src
  
  return script
}

function addListeners(script, resolve, reject) {
  script.addEventListener('error', reject)
  script.addEventListener('abort', reject)
  script.addEventListener('load', function loadScriptHandler() {
    script.setAttribute('data-loaded', '')
    resolve(removeScript.bind(null, script))
  })
}

export function removeScript(scriptOrSrc) {
  let script
  
  if (typeof scriptOrSrc === 'string') {
    script = document.querySelector(`script[src="${scriptOrSrc}"]`)
  } else {
    script = scriptOrSrc
  }
  
  if (script) {
    // lhc forms is holding a reference to child node, which causes the following exception:
    // DOMException: Failed to execute 'define' on 'CustomElementRegistry': the name "wc-lhc-form" 
    // has already been used with this registry.
    
    // Possible workaround: treat script as a singleton and only load it once when initializing App,
    // then never remove it until user leaves our site.
    script.parentNode.removeChild(script)
  }
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${src}"]`)
    
    if (script && script.hasAttribute('data-loaded')) {
      resolve(removeScript.bind(null, script))
      console.log('data-loaded')
      return
    }
    
    script = createTag(src)
    addListeners(script, resolve, reject)
    document.head.appendChild(script)
  })
}