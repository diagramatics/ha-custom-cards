import { ReactCardProps } from '@/lib/create-react-card';
import { useEffect, useRef } from 'react';

type RefreshCardProps = ReactCardProps<{
  refreshInterval: number;
}>;

export const RefreshCard = ({ config, editMode }: RefreshCardProps) => {
  const currentConfig = config.value;
  const refreshInterval = currentConfig.refreshInterval;
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (refreshInterval < 60) {
      throw new Error('Refresh interval must be at least 60 seconds');
    }

    interval.current = setInterval(() => {
      window.location.reload();
    }, refreshInterval * 1000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [refreshInterval]);

  return (
    <>
      {editMode.value &&
        (refreshInterval > 60 ? (
          <div className="w-full h-full border border-dashed bg-muted rounded-md p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-medium text-muted-foreground">Refresh Card</div>
            <div className="text-sm text-muted-foreground">
              Refresh interval: {refreshInterval} seconds
            </div>
          </div>
        ) : (
          <div className="w-full h-full border border-dashed border-destructive bg-destructive/10 rounded-md p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-medium text-muted-foreground">Refresh Card</div>
            <div className="text-sm text-muted-foreground">
              Refresh interval must be at least 60 seconds. Please update the card configuration.
            </div>
          </div>
        ))}
    </>
  );
};
