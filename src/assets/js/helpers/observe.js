export class Observe {
  static handlers = {};

  static create(config, once = true) {
    config = config || {
      "root": null,
      "rootMargin": "0px",
      "threshold": 0.1
    };

    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const hasCallback = 'cbObserve' in entry.target && typeof entry.target['cbObserve'] === 'function';
        if (hasCallback) {
          entry.target.cbObserve(entry);
        }

        if (entry.isIntersecting && once) {
          observer.unobserve(entry.target);
          if (hasCallback) {
            entry.target.cbObserve = null;
            delete entry.target.cbObserve;
          }
        }
      });
    }, config);
  }

  static watch(handler = false, el, callback) {
    if (handler) {
      el.cbObserve = callback;
      return handler.observe(el);
    }
    return false;
  }
}
