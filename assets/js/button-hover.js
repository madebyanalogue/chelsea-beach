/**
 * Directional Button Hover Effect
 * Creates a circular hover effect that follows the mouse direction
 */

// Shared handler so we can bind it once per element
function handleHover(event) {
  const button = event.currentTarget;
  const buttonRect = button.getBoundingClientRect();

  // Get the button's dimensions and center
  const buttonWidth = buttonRect.width;
  const buttonHeight = buttonRect.height;
  const buttonCenterX = buttonRect.left + buttonWidth / 2;
  const buttonCenterY = buttonRect.top + buttonHeight / 2;

  // Calculate mouse position
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Offset from the top-left corner in percentage
  const offsetXFromLeft = ((mouseX - buttonRect.left) / buttonWidth) * 100;
  const offsetYFromTop = ((mouseY - buttonRect.top) / buttonHeight) * 100;

  // Offset from the center in percentage
  let offsetXFromCenter = ((mouseX - buttonCenterX) / (buttonWidth / 2)) * 50;

  // Convert to absolute values
  offsetXFromCenter = Math.abs(offsetXFromCenter);

  // Ensure circle exists
  let circle = button.querySelector('.btn__circle');
  if (!circle) {
    circle = document.createElement('span');
    circle.className = 'btn__circle';
    circle.style.position = 'absolute';
    circle.style.pointerEvents = 'none';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.borderRadius = '50%';
    button.appendChild(circle);
  }

  // Calculate circle size to ensure it covers the entire button
  const diagonal = Math.sqrt(buttonWidth * buttonWidth + buttonHeight * buttonHeight);
  const circleSize = diagonal * 2; // Make it 2x the diagonal to ensure coverage
  
  circle.style.left = `${offsetXFromLeft.toFixed(1)}%`;
  circle.style.top = `${offsetYFromTop.toFixed(1)}%`;
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
}

export function initDirectionalButtonHover() {
  // Button hover animation
  const buttons = document.querySelectorAll('[data-btn-hover]')
  
  buttons.forEach(button => {
    // Idempotent: avoid double-binding across navigations
    if (button.dataset.btnHoverBound === '1') return
    button.dataset.btnHoverBound = '1'

    // Ensure the button is positioned to contain the circle
    const computedStyle = window.getComputedStyle(button)
    if (computedStyle.position === 'static') {
      button.style.position = 'relative'
    }

    // Ensure circle exists immediately
    if (!button.querySelector('.btn__circle')) {
      const circle = document.createElement('span')
      circle.className = 'btn__circle'
      circle.style.position = 'absolute'
      circle.style.pointerEvents = 'none'
      circle.style.transform = 'translate(-50%, -50%)'
      circle.style.borderRadius = '50%'
      button.appendChild(circle)
    }

    button.addEventListener('mouseenter', handleHover);
    button.addEventListener('mouseleave', handleHover);
  });
}

/**
 * Initialize Directional Button Hover
 * Call this function when the DOM is ready
 */
export function initButtonHover() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectionalButtonHover);
  } else {
    initDirectionalButtonHover();
  }
}

/**
 * Clean up button hover events
 * Call this when cleaning up components
 */
export function cleanupButtonHover() {
  document.querySelectorAll('[data-btn-hover]').forEach(button => {
    button.removeEventListener('mouseenter', handleHover);
    button.removeEventListener('mouseleave', handleHover);
    delete button.dataset.btnHoverBound
  });
}

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  initButtonHover();
}
