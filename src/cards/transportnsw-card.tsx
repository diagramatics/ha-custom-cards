import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactCardProps } from '@/lib/create-react-card';
import { handleAction } from '@/lib/ha/panels/lovelace/common/handle-actions';
import { useEntityState } from '@/lib/hooks/hass-hooks';
import { HomeAssistant } from '@/lib/types';
import { Signal } from '@preact/signals-react';
import { parseISO } from 'date-fns';
import { useRef } from 'react';

type TransportNSWConfiguration = {
  due_entity: string;
  departure_entity: string;
  arrival_time_entity: string;
  line_name: string;
  transport_name: string;
};

type TransportNSWCardProps = ReactCardProps<{
  title: string;
  configuration: TransportNSWConfiguration[];
}>;

const trainLineColors: { [k: string]: string } = {
  T1: '#F99D1C',
  T2: '#0098CD',
  T3: '#F37021',
  T4: '#005AA3',
  T5: '#C4258F',
  T7: '#6F818E',
  T8: '#00954C',
  T9: '#D11F2F',
  M1: '#108489',
};

const busColor = '#02ade8';

const timeFormatter = new Intl.DateTimeFormat('en-AU', {
  hour: '2-digit',
  minute: '2-digit',
});

export const TransportNSWCard = ({ hass, config }: TransportNSWCardProps) => {
  const currentConfig = config.value;
  const title = currentConfig.title;
  return (
    <Card>
      {title && (
        <CardHeader className="pt-4 pb-0">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-2 py-2">
        {currentConfig.configuration.map((config, i) => (
          <TransportInfo
            key={`${config.line_name}-${i}`}
            hass={hass}
            due_entity={config.due_entity}
            departure_entity={config.departure_entity}
            arrival_time_entity={config.arrival_time_entity}
            line_name={config.line_name}
            transport_name={config.transport_name}
          />
        ))}
      </CardContent>
    </Card>
  );
};

type TransportInfoProps = {
  hass: Signal<HomeAssistant>;
  due_entity: string;
  departure_entity: string;
  arrival_time_entity: string;
  line_name: string;
  transport_name: string;
};

const TransportInfo = ({
  hass,
  due_entity,
  departure_entity,
  arrival_time_entity,
  line_name,
  transport_name,
}: TransportInfoProps) => {
  const rootRef = useRef<HTMLButtonElement>(null);
  const dueState = useEntityState(hass, due_entity);
  const departureState = useEntityState(hass, departure_entity);
  const arrivalTimeState = useEntityState(hass, arrival_time_entity);
  const due = dueState.value.state;
  const departureTime = departureState.value.state;
  const arrivalTime = arrivalTimeState.value.state;

  const lineName = line_name;
  const transportName = transport_name;

  const handleTapAction = () => {
    handleAction(
      rootRef.current!,
      hass.value as unknown as HomeAssistant,
      { entity: due_entity, tap_action: { action: 'more-info' } },
      'tap',
    );
  };

  const departureTimeFormatted =
    departureTime && timeFormatter.format(parseISO(departureTime));
  const arrivalTimeFormatted =
    arrivalTime && timeFormatter.format(parseISO(arrivalTime));

  const color = transportName === 'BUS' ? busColor : trainLineColors[lineName];

  return (
    <button
      className="@container flex items-center gap-4 px-3 py-2 w-full text-left"
      ref={rootRef}
      onClick={handleTapAction}
    >
      <div
        className="inline-block px-3 py-2 text-bold text-white rounded-sm"
        style={{ backgroundColor: color }}
      >
        {lineName}
      </div>
      <div className="@md:hidden">
        <div className="text-lg">
          <em>{departureTimeFormatted}</em>
        </div>
        <div className="text-sm">Arrive by {arrivalTimeFormatted}</div>
      </div>
      <div className="ml-auto text-right">
        <div className="text-2xl font-bold">{due}</div>
        <div className="text-sm">{due === '1' ? 'min' : 'mins'}</div>
      </div>
    </button>
  );
};
