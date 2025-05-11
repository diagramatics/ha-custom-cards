import { CarouselCard } from '@/cards/carousel-card';
import { RoomCard } from '@/cards/room-card';
import { DoorOpenCard } from '@/cards/door-open-card';
import { TransportNSWCard } from '@/cards/transportnsw-card';
import { HeaderCard } from '@/cards/header-card';
import { createReactCard } from '@/lib/create-react-card';
import globalStyles from './global.css?inline';
import styles from './index.css?inline';

const globalStyleEl = document.createElement('style');
globalStyleEl.textContent = globalStyles;
document.head.appendChild(globalStyleEl);

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);

document.body.style.position = 'relative';

const isDev = import.meta.env.DEV;

const init = async () => {

  if (!isDev) {
    const response = await fetch('http://localhost:5173/src/ha-dev.ts', {
      method: 'HEAD',
    });
    if (response.ok) {
      return;
    }
  }

  createReactCard('carousel-card', CarouselCard, styleSheet);
  createReactCard('room-card', RoomCard, styleSheet);
  createReactCard('door-open-card', DoorOpenCard, styleSheet);
  createReactCard('header-card', HeaderCard, styleSheet);
  createReactCard('transportnsw-card', TransportNSWCard, styleSheet);
};

init();
