import { Injectable } from '@angular/core';
import { emojiBlast } from 'emoji-blast';

interface AnimatedCookie {
  id: string;
  cancelFn?: () => void;
  element?: HTMLElement;
}

@Injectable({
  providedIn: 'root'
})
export class CookieAnimationService {
  private activeCookies = new Map<string, AnimatedCookie>();
  private containerElement: HTMLElement | null = null;

  setContainer(element: HTMLElement) {
    this.containerElement = element;
  }

  spawnCookie(cookie: any, onClaim: (id: string) => void) {
    // Don't spawn if already exists
    if (this.activeCookies.has(cookie.id)) {
      return;
    }

    const spawnTime = new Date(cookie.spawned_at).getTime();
    const despawnTime = new Date(cookie.despawn_at).getTime();
    const duration = despawnTime - spawnTime;
    
    // Calculate starting position
    const xPosition = (window.innerWidth * cookie.x_pct) / 100;
    
    // Create a wrapper div that will move down the screen
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = xPosition + 'px';
    wrapper.style.top = '-60px';
    wrapper.style.width = '60px';
    wrapper.style.height = '60px';
    wrapper.style.cursor = 'pointer';
    wrapper.style.zIndex = '1000';
    wrapper.style.transition = `transform ${duration}ms linear`;
    wrapper.dataset['cookieId'] = cookie.id;
    
    // Create the emoji element
    const emojiEl = document.createElement('div');
    emojiEl.style.fontSize = '40px';
    emojiEl.style.userSelect = 'none';
    emojiEl.style.textAlign = 'center';
    emojiEl.style.lineHeight = '60px';
    emojiEl.textContent = cookie.type === 'cat' ? '🐱' : '🍪';
    wrapper.appendChild(emojiEl);
    
    // Add click handler
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = wrapper.getBoundingClientRect();
      this.claimEffect(rect.left + 30, rect.top + 30, cookie.type);
      this.removeCookie(cookie.id);
      onClaim(cookie.id);
    });

    // Add hover effect
    wrapper.addEventListener('mouseenter', () => {
      emojiEl.style.transform = 'scale(1.2)';
    });
    wrapper.addEventListener('mouseleave', () => {
      emojiEl.style.transform = 'scale(1)';
    });

    document.body.appendChild(wrapper);
    
    // Start the falling animation
    requestAnimationFrame(() => {
      wrapper.style.transform = `translateY(${window.innerHeight + 100}px)`;
    });

    // Store the cookie info
    this.activeCookies.set(cookie.id, {
      id: cookie.id,
      element: wrapper
    });

    // Auto-remove after duration
    setTimeout(() => {
      this.removeCookie(cookie.id);
    }, duration);
  }

  removeCookie(id: string) {
    const cookie = this.activeCookies.get(id);
    if (cookie) {
      // Remove the element with a fade effect
      if (cookie.element && cookie.element.parentNode) {
        cookie.element.style.opacity = '0';
        cookie.element.style.transition = 'opacity 200ms';
        setTimeout(() => {
          if (cookie.element && cookie.element.parentNode) {
            cookie.element.parentNode.removeChild(cookie.element);
          }
        }, 200);
      }
      
      // Remove from active cookies
      this.activeCookies.delete(id);
    }
  }

  removeAllCookies() {
    this.activeCookies.forEach((_, id) => {
      this.removeCookie(id);
    });
  }

  // Special effect when claiming a cookie
  claimEffect(x: number, y: number, type: 'cookie' | 'cat') {
    // Sparkle effect on claim
    emojiBlast({
      emojiCount: 5,
      emojis: ['✨', '⭐'],
      physics: {
        fontSize: { max: 20, min: 10 },
        gravity: 0.1,
        initialVelocities: {
          x: { max: 10, min: -10 },
          y: { max: -5, min: -15 }
        }
      },
      position: {
        x,
        y
      }
    });

    // Add score popup
    if (type === 'cat') {
      emojiBlast({
        emojiCount: 1,
        emojis: ['+3'],
        physics: {
          fontSize: 30,
          gravity: -0.1,
          initialVelocities: {
            x: 0,
            y: -5
          },
          rotation: 0
        },
        position: {
          x,
          y: y - 20
        }
      });
    }
  }
}