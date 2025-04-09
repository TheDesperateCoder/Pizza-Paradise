import React, { useEffect } from 'react';

/**
 * SvgFixer component to fix SVG attributes after render
 * Finds SVGs with invalid width/height "auto" values and fixes them
 */
const SvgFixer = () => {
  useEffect(() => {
    // Fix SVG attributes after component mounts
    const fixSvgAttributes = () => {
      const svgs = document.querySelectorAll('svg[width="auto"], svg[height="auto"]');
      svgs.forEach(svg => {
        if (svg.getAttribute('width') === 'auto') {
          svg.removeAttribute('width');
          svg.style.width = '100%';
        }
        if (svg.getAttribute('height') === 'auto') {
          svg.removeAttribute('height');
          svg.style.height = '100%';
        }
      });
    };

    // Initial fix
    fixSvgAttributes();

    // Set up a mutation observer to fix newly added SVGs
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          fixSvgAttributes();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
};

export default SvgFixer;