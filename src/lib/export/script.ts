/** Shipped as script.js in the ZIP. No dependencies. Menu links close the <details> menu; nav highlights the section in view. */
export const PF_SCRIPT = `(function(){var d=document;
d.querySelectorAll('[data-pf-menu] a').forEach(function(a){a.addEventListener('click',function(){var m=a.closest('details');if(m)m.removeAttribute('open')})});
var links=[].slice.call(d.querySelectorAll('header nav a[href^="#"]'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.removeAttribute('aria-current')});var l=d.querySelector('header nav a[href="#'+e.target.id+'"]');if(l)l.setAttribute('aria-current','true')}})},{rootMargin:'-40% 0px -55% 0px'});d.querySelectorAll('section[id]').forEach(function(s){io.observe(s)})}
})();
`;
