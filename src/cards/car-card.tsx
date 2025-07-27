import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactCardProps } from '@/lib/create-react-card';
import { useEntityState, useEntityStateValue } from '@/lib/hooks/hass-hooks';
import { useSignals } from '@preact/signals-react/runtime';
import { Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getRelativeTime = (date: Date) => {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return date.toLocaleString() || 'Unknown';
  }
};

type CarCardProps = ReactCardProps<{
  entity: string;
  rangeEntity: string;
  chargingStatusEntity: string;
  chargeLevelEntity: string;
  fullyChargedTimeEntity: string;
  imageUrl: string;
}>;

export const CarCard = ({ hass, config }: CarCardProps) => {
  useSignals();
  const currentConfig = config.value;
  const entityState = useEntityState(hass, currentConfig.entity);
  const entityName = entityState.value.attributes.friendly_name;
  const entityLocation = useEntityStateValue(hass, currentConfig.entity);
  const rangeState = useEntityState(hass, currentConfig.rangeEntity);
  const range = Number(rangeState.value.state);

  const chargingStatus = useEntityStateValue(
    hass,
    currentConfig.chargingStatusEntity,
  );
  const imageUrl = currentConfig.imageUrl;

  const chargeLevelState = useEntityState(
    hass,
    currentConfig.chargeLevelEntity,
  );
  const chargeLevel = Number(chargeLevelState.value.state);
  const isCharging = chargingStatus.value === 'Charging';

  const fullyChargedTimeEntity = useEntityState(
    hass,
    currentConfig.fullyChargedTimeEntity,
  );
  const fullyChargedTime = new Date(fullyChargedTimeEntity.value.state);
  const relativeTime = getRelativeTime(fullyChargedTime);

  return (
    <Card
      className="w-full relative overflow-hidden border-0"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />

      {/* Battery level indicator */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-amber-600 opacity-30"
        style={{ width: `${chargeLevel}%` }}
      />

      {/* Charging animation */}
      {isCharging && (
        <div
          className="absolute top-0 bottom-0 left-0 overflow-hidden"
          style={{ width: `${chargeLevel}%` }}
        >
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent to-yellow-300 opacity-90"
            style={{
              width: '64px',
              animation: 'chargingPulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col text-white">
        <CardHeader>
          <div className="text-3xl font-bold">{chargeLevel}%</div>
          <div className="text-xl">{range} km</div>
        </CardHeader>

        <div className="flex-1" />

        <CardContent>
          <CardTitle className="text-xl font-bold">{entityName}</CardTitle>

          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4" />
            <div>{entityLocation.value}</div>
          </div>

          {isCharging && (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              <div>
                <span className="text-white/80">Full </span>
                <span className="font-semibold">{relativeTime}</span>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
