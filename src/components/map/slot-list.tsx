import useComponentSize from '@rehooks/component-size';
import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';

import { Booking, Slot } from '../../model';

import BatteryCharge from './battery-charge';
import './slot-list.scss';

interface SlotViewProps {
  booking: Booking | null;
  className?: string;
  focusRef: React.Ref<any> | null;
  selectedSlot: Slot | null;
  slot: Slot;
  stationId: number;

  onClick: React.MouseEventHandler;
}

const SlotView: React.FC<SlotViewProps> = ({
  booking,
  className,
  focusRef,
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
      className={classNames('slot-list-item', className)}
      key={slot.stationSlotId}
    >
      <button
        className="slot-button column"
        onClick={handleClick}
        ref={focusRef}
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
            <span className="charge-percentage">
              {Math.round((slot.stateOfCharge || 0) * 100)}%
            </span>
          )}
        </div>

        <span>Slot {slot.stationSlotPosition}</span>
      </button>
    </li>
  );
};

interface SlotListProps {
  availableSlots: Slot[];
  booking: Booking | null;
  className?: string;
  focusRef: React.Ref<HTMLOrSVGElement | undefined>;
  selectedSlot: Slot | null;
  stationId: number;

  onSetSelectedSlot: (slot: Slot) => void;
}

const SlotList: React.FC<SlotListProps> = ({
  availableSlots,
  booking,
  focusRef,
  selectedSlot,
  stationId,

  onSetSelectedSlot,
}) => {
  const measureRef = useRef<any>();
  const { width } = useComponentSize(measureRef);

  // A slot item is 64px wide and there is a 16px margin between each
  const requiredWidth =
    64 * availableSlots.length + 16 * (availableSlots.length - 1);

  return (
    <ul
      className={classNames('slot-list', requiredWidth < width && 'centered')}
      ref={measureRef}
    >
      {availableSlots.map((slot, index) => (
        <SlotView
          key={slot.stationSlotId}
          focusRef={index === 0 ? focusRef : null}
          booking={booking}
          onClick={() => onSetSelectedSlot(slot)}
          selectedSlot={selectedSlot}
          slot={slot}
          stationId={stationId}
        />
      ))}
    </ul>
  );
};

export default SlotList;
