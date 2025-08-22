# Scroll Trigger System

This enhanced scroll trigger system provides scroll-triggered animations for all elements on the page, with automatic delay until the preloader completes.

## How It Works

1. **Preloader Phase**: All scroll animations are paused until the preloader finishes
2. **Activation**: Once `@preloader-complete` is emitted, all scroll animations are enabled
3. **Automatic Registration**: Components automatically register their animations when mounted
4. **Cleanup**: Animations are automatically cleaned up when components unmount

## Usage in Components

### Basic Setup

```vue
<template>
  <section ref="sectionRef">
    <div class="animate-on-scroll">
      <!-- Your content here -->
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollTrigger } from '~/composables/useScrollTrigger.js'

const { registerSection, unregisterSection } = useScrollTrigger()
const sectionRef = ref(null)

onMounted(() => {
  if (sectionRef.value) {
    registerSection(`unique-section-id`, {
      trigger: sectionRef.value,
      start: 'top 80%', // Trigger when section is 80% from top of viewport
      onEnter: () => {
        // Your animation logic here
        const gsap = window.gsap
        if (gsap) {
          gsap.to('.animate-on-scroll', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
        }
      }
    })
  }
})

onUnmounted(() => {
  unregisterSection(`unique-section-id`)
})
</script>

<style scoped>
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
}
</style>
```

### Configuration Options

```javascript
registerSection('section-id', {
  trigger: element,           // DOM element to trigger on
  start: 'top 80%',          // When to trigger (default: 'top 80%')
  end: 'bottom 20%',         // When to end (default: 'bottom 20%')
  toggleActions: 'play none none reverse', // GSAP ScrollTrigger actions
  immediateRender: false,     // Whether to render immediately
  onEnter: () => {},         // Called when entering viewport
  onLeave: () => {},         // Called when leaving viewport
  onEnterBack: () => {},     // Called when re-entering from above
  onLeaveBack: () => {},     // Called when leaving upward
  delay: 0                   // Delay before animation starts
})
```

## Example: SectionHeadline Component

The `SectionHeadline.vue` component demonstrates a complete implementation:

- **Sequential Animation**: Headline → Button → Scroll Arrow
- **Staggered Timing**: Each element animates with a slight delay
- **Smooth Transitions**: Fade-in with upward movement
- **Automatic Cleanup**: Removes scroll triggers on unmount

## CSS Classes

### `.animate-on-scroll`
Base class for elements that should animate on scroll. Set initial state:

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
}
```

## Best Practices

1. **Unique IDs**: Always use unique section IDs to avoid conflicts
2. **Cleanup**: Always unregister sections in `onUnmounted`
3. **Performance**: Use `immediateRender: false` for better performance
4. **Accessibility**: Ensure animations don't interfere with user experience
5. **Mobile**: Test animations on mobile devices for performance

## Troubleshooting

### Animations Not Working
- Check if preloader has completed
- Verify GSAP is loaded (`window.gsap`)
- Check console for registration errors
- Ensure elements have proper CSS initial states

### Performance Issues
- Reduce animation complexity
- Use `will-change: transform` sparingly
- Limit concurrent animations
- Consider using `requestAnimationFrame` for complex animations

## Advanced Usage

### Custom Animation Sequences

```javascript
onEnter: () => {
  const gsap = window.gsap
  if (gsap) {
    const tl = gsap.timeline()
    
    // Complex animation sequence
    tl.fromTo('.element-1', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6 })
      .fromTo('.element-2', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3')
      .fromTo('.element-3', { opacity: 0, rotation: -15 }, { opacity: 1, rotation: 0, duration: 0.4 }, '-=0.2')
  }
}
```

### Conditional Animations

```javascript
onEnter: () => {
  // Only animate if certain conditions are met
  if (props.section.someCondition) {
    // Animation logic
  }
}
```
