import { CustomCardEntry } from './lib/types';

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{
      createCardElement: (entity: any) => HTMLElement;
    }>;
    customCards: CustomCardEntry[];
  }
}
