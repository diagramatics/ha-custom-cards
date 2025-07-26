import { CarouselCard } from '@/cards/carousel-card';
import { createReactCard } from '@/lib/create-react-card';
import styles from './index.css?inline';
import './preview.css';
import { ElementType } from 'react';
import { RoomCard } from '@/cards/room-card';
import { HomeAssistant } from './lib/types';
import { hass } from './mocks/hass';
import { DoorOpenCard } from './cards/door-open-card';
import { CarCard } from './cards/car-card';

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);

const rootEl = document.getElementById('root')!;

const createAndDisplayCard = (
  cardName: string,
  ReactComponent: ElementType,
  config?: HomeAssistant['config'],
  parentElement: HTMLElement = rootEl,
) => {
  createReactCard(cardName, ReactComponent, styleSheet);
  const element = document.createElement(cardName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (element as any).setConfig(config);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (element as any).hass = hass;
  parentElement.appendChild(element);
};

const carouselCardContainer = document.createElement('div');
rootEl.appendChild(carouselCardContainer);
carouselCardContainer.style.minHeight = '300px';
createAndDisplayCard('carousel-card', CarouselCard, {
  entities: [],
  options: {},
} as any, carouselCardContainer);

createAndDisplayCard('room-card', RoomCard, {
  title: 'Living room',
  subtitle: '',
  temperature: 23,
  light_entity: 'light.fake_light_1',
  temperature_entity: 'sensor.fake_temperature_1',
} as any);

createAndDisplayCard('door-open-card', DoorOpenCard, {
  entity: 'sensor.fake_door_open_1',
} as any);

createAndDisplayCard('car-card', CarCard, {
  entity: 'sensor.fake_car_1',
  rangeEntity: 'sensor.fake_car_range_1',
  chargingStatusEntity: 'sensor.fake_car_charging_status_1',
  chargeLevelEntity: 'sensor.fake_car_charge_level_1',
  fullyChargedTimeEntity: 'sensor.fake_car_fully_charged_time_1',
} as any);
