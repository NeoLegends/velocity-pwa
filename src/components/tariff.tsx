import React from 'react';

import { Tariff, UserTariff } from '../model';
import {
  activateAutoRenewal,
  bookTariff,
  deactivateAutoRenewal,
  getCurrentTariff,
  getTariffs,
} from '../model/tariff';

import './tariff.scss';

interface TariffBodyProps extends TariffState {
  hasDefaultTariff: boolean;

  onBookTariff: (tariffId: number) => void;
  onToggleAutomaticRenewal: React.MouseEventHandler;
}

interface TariffState {
  tariffs: Tariff[];
  userTariff: UserTariff | null;
}

// tslint:disable:jsx-no-lambda

const TariffBody: React.FC<TariffBodyProps> = ({
  hasDefaultTariff,
  tariffs,
  userTariff,

  onBookTariff,
  onToggleAutomaticRenewal,
}) => (
  <div className="tariff box-list">
    {userTariff && (
      <div className="box">
        <h2>Ihr Konto</h2>

        <div className="wrapper">
          <ul>
            <li>Aktueller Tarif: {userTariff.name}</li>
            {userTariff.expiryDateTime && (
              <li>
                Läuft aus zum {(new Date(userTariff.expiryDateTime)).toLocaleDateString()}
              </li>
            )}
            <li>
              Info: {tariffs.find(t => t.tariffId === userTariff!.tariffId)!.description}
            </li>
            <li>
              Automatische Verlängerung {userTariff.automaticRenewal
                ? "aktiviert"
                : "deaktiviert"}
            </li>
          </ul>
        </div>

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
      </div>
    )}

    {!hasDefaultTariff && (
      <div className="note info">
        Eine Tarifänderung ist nicht möglich, solange ein Tarif gebucht ist.
        Um den Tarif zu wechseln, deaktivieren Sie zunächst die automatische
        Verlängerung. Nach Ablauf Ihres aktuellen Tarifs haben Sie die Möglichkeit,
        einen neuen Tarif zu buchen.
      </div>
    )}

    {tariffs.map(tariff => (
      <div className="box">
        <h2>Tarif {tariff.name}</h2>

        <div className="wrapper">
          <ul>
            <li>Info: {tariff.description}</li>
            <li>Laufzeit: {tariff.term} Tage</li>
            <li>Preis: {tariff.periodicRate},00 Euro</li>
          </ul>
        </div>

        {hasDefaultTariff && (
          <div className="actions">
            <button
              className="btn outline"
              onClick={() => onBookTariff(tariff.tariffId)}
            >
              {tariff.name} buchen
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
);

class TariffView extends React.Component<{}, TariffState> {
  state = {
    tariffs: [],
    userTariff: null,
  };

  componentDidMount() {
    this.fetchUserData();
  }

  render() {
    const userTariff = this.state.userTariff as UserTariff | null;
    const hasDefaultTariff = Boolean(userTariff && userTariff.tariffId === 5);

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
      getTariffs('de'),
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
