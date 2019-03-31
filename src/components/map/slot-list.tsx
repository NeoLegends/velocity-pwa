import useComponentSize from '@rehooks/component-size';
import classNames from 'classnames';
import React, { useCallback, useContext, useRef } from 'react';

import { Booking, Slot } from '../../model';
import { LanguageContext } from '../../resources/language';

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

  const chargePercentage = Math.round((slot.stateOfCharge || 0) * 100);

  return (
    <li
      className={classNames('slot-list-item column', className)}
      key={slot.stationSlotId}
    >
      <button
        className={classNames(
          'slot-icon slot-button outline column',
          isReserved && 'reserved',
          isReservedByMe && 'me',
          selectedSlot &&
            selectedSlot.stationSlotId === slot.stationSlotId &&
            'selected',
        )}
        onClick={handleClick}
        ref={focusRef}
      >
        <BatteryCharge chargePercentage={chargePercentage} />

        {slot.stateOfCharge !== null && (
          <span className="charge-percentage">{chargePercentage}%</span>
        )}
      </button>

      <span>Slot {slot.stationSlotPosition}</span>
    </li>
  );
};

interface SlotListProps {
  availableSlots: Slot[];
  booking: Booking | null;
  className?: string;
  focusRef: React.Ref<HTMLOrSVGElement | undefined>;
  freeSlots: number;
  selectedSlot: Slot | null;
  stationId: number;

  onSetSelectedSlot: (slot: Slot) => void;
}

const SlotList: React.FC<SlotListProps> = ({
  availableSlots,
  booking,
  focusRef,
  freeSlots,
  selectedSlot,
  stationId,

  onSetSelectedSlot,
}) => {
  const measureRef = useRef<any>();
  const { width } = useComponentSize(measureRef);
  const { map } = useContext(LanguageContext);

  // A slot item is 64px wide and there is a 16px margin between each and there
  // is an indicator for the amount of free slots
  const requiredWidth =
    64 + 64 * availableSlots.length + 16 * availableSlots.length;

  return (
    <ul
      className={classNames('slot-list', requiredWidth < width && 'centered')}
      ref={measureRef}
    >
      <li className="slot-list-item column">
        <div
          className={classNames(
            'slot-icon outline column',
            freeSlots === 0 && 'no-slots-free',
          )}
        >
          <span
            className={classNames(
              'slots-free-icon',
              freeSlots <= 0 && 'adjust-margin',
            )}
          >
            {freeSlots > 0 ? '⏎' : '❗'}
          </span>
          <span>{freeSlots}</span>
        </div>
        <span>{freeSlots !== 1 ? map.SLOTS_FREE : map.SLOT_FREE}</span>
      </li>

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
