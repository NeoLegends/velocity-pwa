import React from 'react';

import { Tariff, UserTariff } from '../model';
import {
  activateAutoRenewal,
  bookTariff,
  deactivateAutoRenewal,
  getCurrentTariff,
  getTariffs,
} from '../model/tariff';
import { LanguageContext, LanguageIdentifier } from '../util/language';

import './tariff.scss';

interface TariffProps {
  languageId: LanguageIdentifier;
}

interface TariffState {
  tariffs: Tariff[];
  userTariff: UserTariff | null;
}

interface TariffBodyProps extends TariffState {
  hasDefaultTariff: boolean;

  onBookTariff: (tariffId: number) => void;
  onToggleAutomaticRenewal: React.MouseEventHandler;
}

const DEFAULT_TARIFF_ID = 5;

// tslint:disable:jsx-no-lambda

const TariffBody: React.FC<TariffBodyProps> = ({
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
      {({ STATE, TARIFF }) => (
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
                    Automatische Verlängerung {userTariff.automaticRenewal
                      ? "deaktivieren"
                      : "aktivieren"}
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

class TariffView extends React.Component<TariffProps, TariffState> {
  state = {
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
        onBookTariff={this.onBookTariff}
        onToggleAutomaticRenewal={this.onToggleAutomaticRenewal}
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

  private onBookTariff = async (tariffId: number) => {
    await bookTariff(tariffId);
    await this.fetchUserData();
  }

  private onToggleAutomaticRenewal = async () => {
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
