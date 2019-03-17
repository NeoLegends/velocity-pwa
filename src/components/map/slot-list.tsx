import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';

import { Booking, Slot } from '../../model';

import BatteryCharge from './battery-charge';
import './slot-list.scss';

interface SlotViewProps {
  booking: Booking | null;
  className?: string;
  selectedSlot: Slot | null;
  slot: Slot;
  stationId: number;

  onClick: React.MouseEventHandler;
}

const SlotView: React.FC<SlotViewProps> = ({
  booking,
  className,
  selectedSlot,
  slot,
  stationId,

  onClick,
}) => {
  const isReserved =
    slot.pedelecInfo && slot.pedelecInfo.availability === 'RESERVED';
  const isReservedByMe =
    booking &&
    booking.stationId === stationId &&
    booking.stationSlotPosition === slot.stationSlotPosition;

  const handleClick = useCallback(
    (ev: React.MouseEvent) => (!isReserved || isReservedByMe) && onClick(ev),
    [isReserved, isReservedByMe, onClick],
  );

  return (
    <li
      className={classNames('slot-entry column', className)}
      key={slot.stationSlotId}
      onClick={handleClick}
    >
      <div
        className={classNames(
          'slot-icon outline column',
          isReserved && 'reserved',
          isReservedByMe && 'me',
          selectedSlot &&
            selectedSlot.stationSlotId === slot.stationSlotId &&
            'selected',
        )}
      >
        <BatteryCharge
          chargePercentage={Math.round((slot.stateOfCharge || 0) * 100)}
        />
        {slot.stateOfCharge !== null && (
          <p>{Math.round((slot.stateOfCharge || 0) * 100)}%</p>
        )}
      </div>

      <span>Slot {slot.stationSlotPosition}</span>
    </li>
  );
};

interface SlotListProps {
  availableSlots: Slot[];
  booking: Booking | null;
  className?: string;
  selectedSlot: Slot | null;
  stationId: number;

  onSetSelectedSlot: (slot: Slot) => void;
}

const SlotList: React.FC<SlotListProps> = ({
  availableSlots,
  booking,
  selectedSlot,
  stationId,

  onSetSelectedSlot,
}) => {
  const [useCenteredStyling, setUseCenteredStyling] = useState(true);
  const handlePopupResize = useCallback(
    (ev: ContentRect) => {
      const popupWidth = ev.client!.width;

      // A slot item is 64px wide and there is a 16px margin between each
      const requiredWidth =
        64 * availableSlots.length + 16 * (availableSlots.length - 1);

      setUseCenteredStyling(requiredWidth < popupWidth);
    },
    [availableSlots.length],
  );

  return (
    <Measure client onResize={handlePopupResize}>
      {({ measureRef }) => (
        <ul
          className={classNames('slot-list', useCenteredStyling && 'centered')}
          ref={measureRef}
        >
          {availableSlots.map(slot => (
            <SlotView
              key={slot.stationSlotId}
              booking={booking}
              onClick={() => onSetSelectedSlot(slot)}
              selectedSlot={selectedSlot}
              slot={slot}
              stationId={stationId}
            />
          ))}
        </ul>
      )}
    </Measure>
  );
};

export default SlotList;
