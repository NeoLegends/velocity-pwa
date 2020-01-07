import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import { useTariffs, useUserTariff } from '../hooks/tariff';
import { Tariff, UserTariff } from '../model';
import {
  activateAutoRenewal,
  bookTariff,
  deactivateAutoRenewal,
} from '../model/tariff';
import { LanguageContext } from '../resources/language';
import { toEuro } from '../util/to-euro';
import { toast } from '../util/toast';

import './tariff.scss';

interface TariffProps {
  className?: string;
}

interface TariffOverviewProps extends TariffProps {
  hasDefaultTariff: boolean;
  tariffs: Tariff[];
  userTariff: UserTariff | null;

  onBookTariff: (tariffId: number) => void;
  onToggleAutomaticRenewal: React.MouseEventHandler;
}
interface TariffConfirmationProps extends TariffProps {
  currentlyBookingTariff: Tariff;

  onCancelBookingProcess: React.MouseEventHandler;
  onConfirmBooking: React.MouseEventHandler;
}

const DEFAULT_TARIFF_ID = 5;

// tslint:disable:jsx-no-lambda

const TariffOverview: React.FC<TariffOverviewProps> = ({
  className,
  hasDefaultTariff,
  tariffs,
  userTariff,

  onBookTariff,
  onToggleAutomaticRenewal,
}) => {
  const { tariff, STATE, TARIFF } = useContext(LanguageContext);

  const tariffExpiry =
    userTariff &&
    userTariff.expiryDateTime &&
    new Date(userTariff.expiryDateTime).toLocaleDateString();
  const tariffInfo =
    userTariff && tariffs.find(t => t.tariffId === userTariff.tariffId);

  return (
    <div className={classNames('tariff box-list', className)}>
      {userTariff && (
        <div className="box">
          <h2>{TARIFF.CURRENT.TITLE}</h2>

          <div className="wrapper">
            <ul>
              <li>
                {TARIFF.CURRENT.NAME}: {userTariff.name}
              </li>
              {userTariff.expiryDateTime && (
                <li>
                  {TARIFF.CURRENT.EXPIRY} {tariffExpiry}
                </li>
              )}
              <li>
                {TARIFF.ALL.INFO}: {tariffInfo ? tariffInfo.description : 'N/A'}
              </li>
              {!hasDefaultTariff && (
                <li>
                  {TARIFF.CURRENT.RENEWAL}{' '}
                  {userTariff.automaticRenewal ? STATE.ACTIVE : STATE.IDLE}
                </li>
              )}
            </ul>
          </div>

          {!hasDefaultTariff && (
            <div className="actions">
              <button
                className="btn outline"
                onClick={onToggleAutomaticRenewal}
              >
                {userTariff.automaticRenewal
                  ? tariff.DEACTIVATE_AUTOMATIC_RENEWAL
                  : tariff.ACTIVATE_AUTOMATIC_RENEWAL}
              </button>
            </div>
          )}
        </div>
      )}

      {userTariff && !hasDefaultTariff && (
        <div className="note info">{TARIFF.ALERT.NOTE_NOT_CHANGEABLE}</div>
      )}

      {tariffs.map(tariff => (
        <div key={tariff.tariffId} className="box">
          <h2>{tariff.name}</h2>

          <div className="wrapper">
            <ul>
              <li>
                {TARIFF.ALL.INFO}: {tariff.description}
              </li>
              <li>
                {TARIFF.ALL.DURATION}: {tariff.term} {TARIFF.ALL.TAGE}
              </li>
              <li>
                {TARIFF.ALL.PREIS}: {toEuro(tariff.periodicRate)}
              </li>
            </ul>
          </div>

          {hasDefaultTariff && tariff.tariffId !== DEFAULT_TARIFF_ID && (
            <div className="actions">
              <button
                className="btn outline"
                onClick={() => onBookTariff(tariff.tariffId)}
              >
                {TARIFF.ALL.BUCHEN}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// tslint:enable

const TariffBookingConfirmation: React.FC<TariffConfirmationProps> = ({
  className,
  currentlyBookingTariff,

  onCancelBookingProcess,
  onConfirmBooking,
}) => {
  const { TARIFF } = useContext(LanguageContext);

  return (
    <div className={classNames('tariff box-list', className)}>
      <div className="box">
        <h2>{currentlyBookingTariff.name}</h2>

        <div className="wrapper">
          {TARIFF.MODAL.ORDER_OPTION.INFO} {currentlyBookingTariff.name}
        </div>

        <div className="actions">
          <button className="btn outline" onClick={onConfirmBooking}>
            {TARIFF.MODAL.ORDER_OPTION.CONFIRM}
          </button>

          <button className="btn outline" onClick={onCancelBookingProcess}>
            {TARIFF.MODAL.ORDER_OPTION.ABBRECHEN}
          </button>
        </div>
      </div>
    </div>
  );
};

const TariffView: React.FC<TariffProps> = props => {
  const tariffs = useTariffs();
  const { userTariff, fetchTariff } = useUserTariff();
  const [tariffToBook, setTariffToBok] = useState<Tariff | null>(null);

  const { TARIFF } = useContext(LanguageContext);

  const handleBookTariff = (tariffId: number) => {
    const tariff = tariffs.find(t => t.tariffId === tariffId);
    setTariffToBok(tariff!);
  };

  const handleConfirmBooking = async () => {
    if (!tariffToBook) {
      console.error('Missing tariff to book.');
      return;
    }

    try {
      await bookTariff(tariffToBook.tariffId);
    } catch (err) {
      console.error('Error while changing tariff:', err);
      return toast(TARIFF.ALERT.CHANGE_TARIFF_FAIL, { type: 'error' });
    }

    fetchTariff();

    toast(TARIFF.ALERT.CHANGE_TARIFF_SUCCESS, { type: 'success' });
  };

  const handleToggleAutoRenewal = async () => {
    if (!userTariff) {
      console.error('Cannot toggle renewal without user tariff.');
      return;
    }

    try {
      await (userTariff.automaticRenewal
        ? deactivateAutoRenewal()
        : activateAutoRenewal());
    } catch (err) {
      return toast(TARIFF.ALERT.ALTER_RENEWAL_FAIL, { type: 'error' });
    }

    fetchTariff();
  };

  const hasDefaultTariff = Boolean(
    userTariff && userTariff.tariffId === DEFAULT_TARIFF_ID,
  );

  return tariffToBook !== null ? (
    <TariffBookingConfirmation
      {...props}
      currentlyBookingTariff={tariffToBook}
      onCancelBookingProcess={() => setTariffToBok(null)}
      onConfirmBooking={handleConfirmBooking}
    />
  ) : (
    <TariffOverview
      {...props}
      hasDefaultTariff={hasDefaultTariff}
      tariffs={tariffs}
      userTariff={userTariff}
      onBookTariff={handleBookTariff}
      onToggleAutomaticRenewal={handleToggleAutoRenewal}
    />
  );
};

export default TariffView;
