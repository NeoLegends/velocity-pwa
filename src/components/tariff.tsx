import React from 'react';

import { Tariff, UserTariff } from '../model';
import {
  activateAutoRenewal,
  bookTariff,
  deactivateAutoRenewal,
  getCurrentTariff,
  getTariffs,
} from '../model/tariff';
import { LanguageContext, LanguageIdentifier } from '../resources/language';

import './tariff.scss';

interface TariffProps {
  languageId: LanguageIdentifier;
}

interface TariffState {
  currentlyBookingTariff: number | null;
  tariffs: Tariff[];
  userTariff: UserTariff | null;
}

interface TariffBodyProps extends TariffState {
  hasDefaultTariff: boolean;

  onBookTariff: (tariffId: number) => void;
  onCancelBookingProcess: React.MouseEventHandler;
  onConfirmBooking: React.MouseEventHandler;
  onToggleAutomaticRenewal: React.MouseEventHandler;
}

const DEFAULT_TARIFF_ID = 5;

// tslint:disable:jsx-no-lambda

const TariffOverview: React.FC<TariffBodyProps> = ({
  hasDefaultTariff,
  tariffs,
  userTariff,

  onBookTariff,
  onToggleAutomaticRenewal,
}) => {
  const tariffExpiry = userTariff && userTariff.expiryDateTime &&
    (new Date(userTariff.expiryDateTime)).toLocaleDateString();
  const tariffInfo = userTariff &&
    tariffs.find(t => t.tariffId === userTariff.tariffId)!.description;

  return (
    <LanguageContext.Consumer>
      {({ tariff, STATE, TARIFF }) => (
        <div className="tariff box-list">
          {userTariff && (
            <div className="box">
              <h2>{TARIFF.CURRENT.TITLE}</h2>

              <div className="wrapper">
                <ul>
                  <li>{TARIFF.CURRENT.NAME}: {userTariff.name}</li>
                  {userTariff.expiryDateTime && (
                    <li>
                      {TARIFF.CURRENT.EXPIRY} {tariffExpiry}
                    </li>
                  )}
                  <li>
                    {TARIFF.ALL.INFO}: {tariffInfo}
                  </li>
                  {!hasDefaultTariff && (
                    <li>
                      {TARIFF.CURRENT.RENEWAL} {userTariff.automaticRenewal
                        ? STATE.ACTIVE
                        : STATE.IDLE}
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
            <div className="note info">
              {TARIFF.ALERT.NOTE_NOT_CHANGEABLE}
            </div>
          )}

          {tariffs.map(tariff => (
            <div key={tariff.tariffId} className="box">
              <h2>{tariff.name}</h2>

              <div className="wrapper">
                <ul>
                  <li>{TARIFF.ALL.INFO}: {tariff.description}</li>
                  <li>{TARIFF.ALL.DURATION}: {tariff.term} {TARIFF.ALL.TAGE}</li>
                  <li>{TARIFF.ALL.PREIS}: {tariff.periodicRate.toEuro()}</li>
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
      )}
    </LanguageContext.Consumer>
  );
};

// tslint:enable

const TariffBookingConfirmation: React.FC<TariffBodyProps> = ({
  currentlyBookingTariff,
  tariffs,

  onCancelBookingProcess,
  onConfirmBooking,
}) => {
  const tariff = tariffs.find(t => t.tariffId === currentlyBookingTariff)!;

  return (
    <LanguageContext.Consumer>
      {({ TARIFF }) => (
        <div className="tariff box-list">
          <div className="box">
            <h2>{tariff.name}</h2>

            <div className="wrapper">
              {TARIFF.MODAL.ORDER_OPTION.INFO} {tariff.name}
            </div>

            <div className="actions">
              <button
                className="btn outline"
                onClick={onConfirmBooking}
              >
                {TARIFF.MODAL.ORDER_OPTION.CONFIRM}
              </button>

              <button
                className="btn outline"
                onClick={onCancelBookingProcess}
              >
                {TARIFF.MODAL.ORDER_OPTION.ABBRECHEN}
              </button>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Consumer>
  );
};

const TariffBody: React.FC<TariffBodyProps> = props =>
  (props.currentlyBookingTariff !== null)
    ? <TariffBookingConfirmation {...props}/>
    : <TariffOverview {...props}/>;

class TariffView extends React.Component<TariffProps, TariffState> {
  state = {
    currentlyBookingTariff: null,
    tariffs: [],
    userTariff: null,
  };

  componentDidMount() {
    this.fetchUserData();
  }

  componentDidUpdate() {
    this.fetchUserData();
  }

  render() {
    const userTariff = this.state.userTariff as UserTariff | null;
    const hasDefaultTariff = Boolean(userTariff && userTariff.tariffId === DEFAULT_TARIFF_ID);

    return (
      <TariffBody
        {...this.state}
        {...this.props}
        hasDefaultTariff={hasDefaultTariff}
        onBookTariff={this.handleBookTariff}
        onCancelBookingProcess={this.handleCancelBookingProcess}
        onConfirmBooking={this.handleConfirmBooking}
        onToggleAutomaticRenewal={this.handleToggleAutomaticRenewal}
      />
    );
  }

  private async fetchUserData() {
    const [tariffs, userTariff] = await Promise.all([
      getTariffs(this.props.languageId),
      getCurrentTariff(),
    ]);

    this.setState({ tariffs, userTariff });
  }

  private handleBookTariff = (tariffId: number) =>
    this.setState({ currentlyBookingTariff: tariffId })

  private handleCancelBookingProcess = () =>
    this.setState({ currentlyBookingTariff: null })

  private handleConfirmBooking = async () => {
    if (!this.state.currentlyBookingTariff) {
      console.error("Missing tariff to book.");
      return;
    }

    await bookTariff(this.state.currentlyBookingTariff!);
    await this.fetchUserData();
  }

  private handleToggleAutomaticRenewal = async () => {
    const userTariff = this.state.userTariff as UserTariff | null;
    if (!userTariff) {
      return;
    }

    await (userTariff.automaticRenewal
      ? deactivateAutoRenewal()
      : activateAutoRenewal());
    await this.fetchUserData();
  }
}

export default TariffView;
