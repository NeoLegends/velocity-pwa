import classNames from "clsx";
import React, { useCallback, useContext } from "react";

import { useFormField } from "../../hooks/form";
import { useSavedPin } from "../../hooks/pin";
import { StationDetail } from "../../hooks/rent-popup";
import { Booking, Slot, Station } from "../../model";
import { LanguageContext, LanguageIdContext } from "../../resources/language";
import moment from "../../util/moment";

import "./rent-controls.scss";
import Slider from "./slider";

interface RentControlsProps {
  booking: Booking | null;
  className?: string;
  openedStation: StationDetail;
  selectedSlot: Slot | null;
  stations: Station[];

  onBookBike: React.MouseEventHandler;
  onCancelBooking: React.MouseEventHandler;
  onRefreshBooking: React.MouseEventHandler;
  onRentBike: (pin: string) => void;
}

const RentControls: React.FC<RentControlsProps> = ({
  booking,
  className,
  openedStation,
  selectedSlot,
  stations,

  onBookBike,
  onCancelBooking,
  onRefreshBooking,
  onRentBike,
}) => {
  const [pin, setPin] = useSavedPin();
  const [pinInput, handlePinChange] = useFormField("");

  const handleSliderComplete = useCallback(() => onRentBike(pin!), [
    pin,
    onRentBike,
  ]);
  const handleSubmitPin = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      setPin(pinInput);
    },
    [pinInput, setPin],
  );

  const { map, BUCHUNGEN } = useContext(LanguageContext);
  const langId = useContext(LanguageIdContext);

  const bookedStation =
    booking &&
    stations.find((station) => station.stationId === booking.stationId);
  const isOpenedStationBooked = Boolean(
    booking && booking.stationId === openedStation.station.stationId,
  );
  const canRentBike =
    openedStation.station.state === "OPERATIVE" &&
    openedStation.slots.stationSlots.some((s) =>
      Boolean(
        s.isOccupied &&
          s.state === "OPERATIVE" &&
          s.pedelecInfo &&
          // Either the pedelec must be available or be rented by myself
          (s.pedelecInfo.availability === "AVAILABLE" ||
            (s.pedelecInfo.availability === "RESERVED" &&
              isOpenedStationBooked &&
              booking!.stationSlotPosition === s.stationSlotPosition)),
      ),
    );

  const remainingBookingTime =
    booking &&
    moment(new Date(booking.expiryDateTime), undefined, langId).fromNow(true);

  return pin ? (
    <div className={classNames("rent-controls", className)}>
      <Slider
        background={() => (
          <div className="slider-content column">
            {selectedSlot && ( // Since we auto-select the fullest slot, this check exists just as formality
              <span>
                {map.RENT.SLIDE_FOR_BIKE_NO1} {selectedSlot.stationSlotPosition}{" "}
                {map.RENT.SLIDE_FOR_BIKE_NO2}
              </span>
            )}
          </div>
        )}
        disabled={!canRentBike}
        onCompleted={handleSliderComplete}
      />

      {booking && isOpenedStationBooked && (
        <button className="btn outline book" onClick={onRefreshBooking}>
          {map.BOOKING.REFRESH} ({remainingBookingTime} {map.BOOKING.REMAINING})
        </button>
      )}
      <button
        className="btn outline book"
        disabled={!canRentBike && !booking}
        onClick={!booking ? onBookBike : onCancelBooking}
      >
        {!booking
          ? map.BOOKING.BOOK_BIKE
          : `${BUCHUNGEN.RESERVIERUNG.BUTTON} ${
              !isOpenedStationBooked ? `(${bookedStation!.name})` : ""
            }`}
      </button>
    </div>
  ) : (
    <form
      className={classNames("rent-controls", className)}
      onSubmit={handleSubmitPin}
    >
      <p>{map.PIN.CTA}</p>

      <input
        className="input outline"
        onChange={handlePinChange}
        placeholder="PIN"
        type="tel"
        value={pinInput}
      />

      <button
        className="btn outline"
        disabled={
          !pinInput ||
          isNaN((pinInput as unknown) as number) ||
          !isFinite((pinInput as unknown) as number)
        }
        type="submit"
      >
        {map.PIN.ACTION}
      </button>
    </form>
  );
};

export default RentControls;
