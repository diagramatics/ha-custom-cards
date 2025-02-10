import { ElementType, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { signal, Signal } from '@preact/signals-react';
import { HomeAssistant } from './types';

export type ReactCardProps<T> = {
  hass: Signal<HomeAssistant>;
  config: Signal<T>;
  cardSize: Signal<number>;
};

export const createReactCard = (
  cardName: string,
  ReactComponent: ElementType,
  styles: CSSStyleSheet,
) => {
  class Card extends HTMLElement {
    root: Root;

    signals = {
      hass: signal({}),
      config: signal({}),
      cardSize: signal(1),
    };

    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      this.root = createRoot(shadow);
      shadow.adoptedStyleSheets = [styles];
      this.render();
    }

    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass: HomeAssistant) {
      this.signals.hass.value = hass;
    }

    render() {
      this.root.render(
        <StrictMode>
          <ReactComponent
            cardName={cardName}
            hass={this.signals.hass}
            config={this.signals.config}
            cardSize={this.signals.cardSize}
          />
        </StrictMode>,
      );
    }

    /**
     * Your card can define a getConfigElement method that returns a custom element for editing the user configuration. Home Assistant will display this element in the card editor in the dashboard.
     */
    static getConfigElement() {
      return document.createElement(`${cardName}-editor`);
    }

    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config: HomeAssistant['config']) {
      this.signals.config.value = config;
    }

    configChanged(newConfig: HomeAssistant['config']) {
      this.signals.config.value = newConfig;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      if (!this.shadowRoot) {
        return 1;
      }

      this.signals.cardSize.value = Math.max(
        1,
        Math.ceil(this.shadowRoot.host.getBoundingClientRect().height / 50),
      );

      return this.signals.cardSize.value;
    }

    getLayoutOptions() {
      // TODO: Implement this: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
      return {
        grid_rows: 2,
        grid_columns: 2,
        grid_min_rows: 2,
      }
    }
  };

  customElements.define(cardName, Card);
  console.info(
    `%c${cardName} %cregistered.`,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
  );

  return Card;
};
