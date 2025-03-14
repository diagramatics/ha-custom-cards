import type {
  HassEntityAttributeBase,
  HassEntityBase,
} from "home-assistant-js-websocket";
import { HomeAssistant } from "../types";

interface MediaPlayerEntityAttributes extends HassEntityAttributeBase {
  media_content_id?: string;
  media_content_type?: string;
  media_artist?: string;
  media_playlist?: string;
  media_series_title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  media_season?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  media_episode?: any;
  app_name?: string;
  media_position_updated_at?: string | number | Date;
  media_duration?: number;
  media_position?: number;
  media_title?: string;
  icon?: string;
  entity_picture_local?: string;
  is_volume_muted?: boolean;
  volume_level?: number;
  repeat?: string;
  shuffle?: boolean;
  source?: string;
  source_list?: string[];
  sound_mode?: string;
  sound_mode_list?: string[];
}

export interface MediaPlayerEntity extends HassEntityBase {
  attributes: MediaPlayerEntityAttributes;
  state:
    | "playing"
    | "paused"
    | "idle"
    | "off"
    | "on"
    | "unavailable"
    | "unknown";
}

export const MEDIA_PLAYER_SUPPORT_PAUSE = 1;
export const MEDIA_PLAYER_SUPPORT_SEEK = 2;
export const MEDIA_PLAYER_SUPPORT_VOLUME_SET = 4;
export const MEDIA_PLAYER_SUPPORT_VOLUME_MUTE = 8;
export const MEDIA_PLAYER_SUPPORT_PREVIOUS_TRACK = 16;
export const MEDIA_PLAYER_SUPPORT_NEXT_TRACK = 32;
export const MEDIA_PLAYER_SUPPORT_TURN_ON = 128;
export const MEDIA_PLAYER_SUPPORT_TURN_OFF = 256;
export const MEDIA_PLAYER_SUPPORT_PLAY_MEDIA = 512;
export const MEDIA_PLAYER_SUPPORT_VOLUME_BUTTONS = 1024;
export const MEDIA_PLAYER_SUPPORT_SELECT_SOURCE = 2048;
export const MEDIA_PLAYER_SUPPORT_STOP = 4096;
export const MEDIA_PLAYER_SUPPORT_PLAY = 16384;
export const MEDIA_PLAYER_SUPPORT_REPEAT_SET = 262144;
export const MEDIA_PLAYER_SUPPORT_SELECT_SOUND_MODE = 65536;
export const MEDIA_PLAYER_SUPPORT_SHUFFLE_SET = 32768;
export const MEDIA_PLAYER_SUPPORT_BROWSE_MEDIA = 131072;

export type MediaPlayerBrowseAction = "pick" | "play";

export const BROWSER_PLAYER = "browser";

export type MediaClassBrowserSetting = {
  icon: string;
  thumbnail_ratio?: string;
  layout?: "grid";
  show_list_images?: boolean;
};

export interface MediaPlayerItemId {
  media_content_id: string | undefined;
  media_content_type: string | undefined;
}

export interface MediaPickedEvent {
  item: MediaPlayerItem;
  navigateIds: MediaPlayerItemId[];
}

export interface MediaPlayerThumbnail {
  content_type: string;
  content: string;
}

export interface MediaPlayerItem {
  title: string;
  media_content_type: string;
  media_content_id: string;
  media_class: string;
  children_media_class?: string;
  can_play: boolean;
  can_expand: boolean;
  thumbnail?: string;
  children?: MediaPlayerItem[];
  not_shown?: number;
}

export const browseMediaPlayer = (
  hass: HomeAssistant,
  entityId: string,
  mediaContentId?: string,
  mediaContentType?: string
): Promise<MediaPlayerItem> =>
  hass.callWS<MediaPlayerItem>({
    type: "media_player/browse_media",
    entity_id: entityId,
    media_content_id: mediaContentId,
    media_content_type: mediaContentType,
  });

export const getCurrentProgress = (stateObj: MediaPlayerEntity): number => {
  let progress = stateObj.attributes.media_position!;

  if (stateObj.state !== "playing") {
    return progress;
  }
  progress +=
    (Date.now() -
      new Date(stateObj.attributes.media_position_updated_at!).getTime()) /
    1000.0;
  return progress;
};

export const computeMediaDescription = (
  stateObj: MediaPlayerEntity
): string => {
  let secondaryTitle: string;

  switch (stateObj.attributes.media_content_type) {
    case "music":
    case "image":
      secondaryTitle = stateObj.attributes.media_artist!;
      break;
    case "playlist":
      secondaryTitle = stateObj.attributes.media_playlist!;
      break;
    case "tvshow":
      secondaryTitle = stateObj.attributes.media_series_title!;
      if (stateObj.attributes.media_season) {
        secondaryTitle += " S" + stateObj.attributes.media_season;

        if (stateObj.attributes.media_episode) {
          secondaryTitle += "E" + stateObj.attributes.media_episode;
        }
      }
      break;
    default:
      secondaryTitle = stateObj.attributes.app_name || "";
  }

  return secondaryTitle;
};
