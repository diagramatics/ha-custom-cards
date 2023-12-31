import {
  type ActionConfig,
  type LovelaceCard,
  type LovelaceCardConfig,
  type LovelaceCardEditor,
} from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'transportnsw-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface TransportNswCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
