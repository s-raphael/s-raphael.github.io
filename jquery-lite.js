// jQuery-lite: A minimal jQuery-compatible library for this project
(function(window) {
    'use strict';

    function $(selector) {
        if (typeof selector === 'function') {
            // $(document).ready() or $(function() {}) functionality
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', selector);
            } else {
                selector();
            }
            return this;
        }
        return new jQueryLite(selector);
    }

    function jQueryLite(selector) {
        if (typeof selector === 'function') {
            // $(document).ready() functionality
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', selector);
            } else {
                selector();
            }
            return this;
        }

        if (typeof selector === 'string') {
            this.elements = Array.from(document.querySelectorAll(selector));
        } else if (selector && selector.nodeType) {
            this.elements = [selector];
        } else if (selector && selector.length !== undefined) {
            this.elements = Array.from(selector);
        } else {
            this.elements = [];
        }

        this.length = this.elements.length;
        return this;
    }

    jQueryLite.prototype = {
        // Iteration
        each: function(callback) {
            this.elements.forEach((el, index) => callback.call(el, index, el));
            return this;
        },

        // Event handling
        on: function(event, handler) {
            return this.each(function() {
                this.addEventListener(event, handler);
            });
        },

        click: function(handler) {
            if (handler) {
                return this.on('click', handler);
            } else {
                return this.each(function() {
                    this.click();
                });
            }
        },

        hover: function(mouseenter, mouseleave) {
            return this.on('mouseenter', mouseenter).on('mouseleave', mouseleave || mouseenter);
        },

        scroll: function(handler) {
            if (handler) {
                return this.on('scroll', handler);
            }
        },

        submit: function(handler) {
            if (handler) {
                return this.on('submit', handler);
            } else {
                return this.each(function() {
                    if (this.tagName === 'FORM') {
                        this.submit();
                    }
                });
            }
        },

        // DOM manipulation
        addClass: function(className) {
            return this.each(function() {
                this.classList.add(className);
            });
        },

        removeClass: function(className) {
            return this.each(function() {
                this.classList.remove(className);
            });
        },

        toggleClass: function(className) {
            return this.each(function() {
                this.classList.toggle(className);
            });
        },

        hasClass: function(className) {
            return this.elements.some(el => el.classList.contains(className));
        },

        attr: function(name, value) {
            if (value === undefined) {
                return this.elements[0] ? this.elements[0].getAttribute(name) : null;
            }
            return this.each(function() {
                this.setAttribute(name, value);
            });
        },

        data: function(key, value) {
            if (value === undefined) {
                const el = this.elements[0];
                return el ? el.dataset[key] : null;
            }
            return this.each(function() {
                this.dataset[key] = value;
            });
        },

        prop: function(name, value) {
            if (value === undefined) {
                return this.elements[0] ? this.elements[0][name] : null;
            }
            return this.each(function() {
                this[name] = value;
            });
        },

        val: function(value) {
            if (value === undefined) {
                return this.elements[0] ? this.elements[0].value : '';
            }
            return this.each(function() {
                this.value = value;
            });
        },

        text: function(text) {
            if (text === undefined) {
                return this.elements[0] ? this.elements[0].textContent : '';
            }
            return this.each(function() {
                this.textContent = text;
            });
        },

        html: function(html) {
            if (html === undefined) {
                return this.elements[0] ? this.elements[0].innerHTML : '';
            }
            return this.each(function() {
                this.innerHTML = html;
            });
        },

        css: function(property, value) {
            if (typeof property === 'object') {
                return this.each(function() {
                    Object.assign(this.style, property);
                });
            }
            if (value === undefined) {
                return this.elements[0] ? getComputedStyle(this.elements[0])[property] : null;
            }
            return this.each(function() {
                this.style[property] = value;
            });
        },

        append: function(content) {
            return this.each(function() {
                if (typeof content === 'string') {
                    this.insertAdjacentHTML('beforeend', content);
                } else if (content && content.nodeType) {
                    this.appendChild(content);
                } else if (content && content.elements && content.elements.length) {
                    // Handle jQuery-like objects
                    for (let i = 0; i < content.elements.length; i++) {
                        this.appendChild(content.elements[i]);
                    }
                }
            });
        },

        appendTo: function(target) {
            const $target = $(target);
            this.each(function() {
                $target.append(this);
            });
            return this;
        },

        remove: function() {
            return this.each(function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            });
        },

        find: function(selector) {
            const elements = [];
            this.elements.forEach(el => {
                elements.push(...el.querySelectorAll(selector));
            });
            return new jQueryLite(elements);
        },

        // Position and dimensions
        offset: function() {
            const el = this.elements[0];
            if (!el) return { top: 0, left: 0 };
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            };
        },

        outerHeight: function() {
            const el = this.elements[0];
            return el ? el.offsetHeight : 0;
        },

        scrollTop: function(value) {
            if (value === undefined) {
                if (this.elements[0] === window || this.elements[0] === document) {
                    return window.pageYOffset;
                }
                return this.elements[0] ? this.elements[0].scrollTop : 0;
            }
            return this.each(function() {
                if (this === window || this === document) {
                    window.scrollTo(window.pageXOffset, value);
                } else {
                    this.scrollTop = value;
                }
            });
        },

        height: function() {
            if (this.elements[0] === window) {
                return window.innerHeight;
            }
            return this.elements[0] ? this.elements[0].offsetHeight : 0;
        },

        // Animation
        animate: function(properties, duration, easing, complete) {
            if (typeof duration === 'function') {
                complete = duration;
                duration = 400;
                easing = 'ease';
            }
            if (typeof easing === 'function') {
                complete = easing;
                easing = 'ease';
            }
            
            duration = duration || 400;
            easing = easing || 'ease';

            return this.each(function() {
                const el = this;
                const startStyles = {};
                const endStyles = {};
                
                // Special handling for scrollTop on html/body elements
                const isScrollTop = 'scrollTop' in properties;
                const isDocumentElement = el === document.documentElement || el === document.body;
                
                // Get starting values
                for (let prop in properties) {
                    if (prop === 'scrollTop') {
                        if (isDocumentElement) {
                            startStyles[prop] = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                        } else {
                            startStyles[prop] = el.scrollTop;
                        }
                        endStyles[prop] = properties[prop];
                    } else {
                        startStyles[prop] = parseFloat(getComputedStyle(el)[prop]) || 0;
                        endStyles[prop] = parseFloat(properties[prop]);
                    }
                }

                const startTime = performance.now();
                
                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Apply easing
                    let easedProgress = progress;
                    if (easing === 'swing' || easing === 'ease') {
                        easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
                    }
                    
                    // Update styles
                    for (let prop in properties) {
                        const start = startStyles[prop];
                        const end = endStyles[prop];
                        const current = start + (end - start) * easedProgress;
                        
                        if (prop === 'scrollTop') {
                            if (isDocumentElement) {
                                window.scrollTo(window.pageXOffset || 0, current);
                            } else {
                                el.scrollTop = current;
                            }
                        } else if (prop === 'opacity') {
                            el.style.opacity = current;
                        } else {
                            el.style[prop] = current + (prop.includes('color') ? '' : 'px');
                        }
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else if (complete) {
                        complete.call(el);
                    }
                }
                
                requestAnimationFrame(animate);
            });
        }
    };

    // Export to global scope
    window.$ = window.jQuery = $;
    
    // Static methods
    $.easing = {
        easeInOutCubic: function(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
    };
    
    // Add ready method support for different jQuery patterns
    $.fn = jQueryLite.prototype;
    
    // Support for $(document).ready()
    jQueryLite.prototype.ready = function(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
        return this;
    };

})(window);