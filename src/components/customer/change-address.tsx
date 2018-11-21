import { RouteComponentProps } from '@reach/router';
import countries from 'country-info-list/countries.json';
import React from 'react';

import { Address } from '../../model';
import { LanguageContext } from '../../util/language';

interface ChangeAddressProps {
  onCancel: React.MouseEventHandler;
  onChangeAddress: (newAddress: Address) => void;
}

interface ChangeAddressState {
  city: string;
  country: string;
  streetAndHousenumber: string;
  zip: string;
}

interface ChangeAddressBodyProps extends ChangeAddressState {
  canSubmit: boolean;

  onCancel: React.MouseEventHandler;
  onCityChange: React.ChangeEventHandler;
  onCountryChange: React.ChangeEventHandler;
  onStreetChange: React.ChangeEventHandler;
  onSubmit: React.FormEventHandler;
  onZipChange: React.ChangeEventHandler;
}

const countryList = countries.map(c => (
  <option key={c.alpha3Code} value={c.alpha3Code}>
    {c.name}
  </option>
));

const alpha3ToCountryName: Record<string, string> = countries.reduce((acc, c) => {
  acc[c.alpha3Code] = c.name;
  return acc;
}, {});

const ChangeAddressBody: React.FC<ChangeAddressBodyProps> = ({
  canSubmit,
  city,
  country,
  streetAndHousenumber,
  zip,

  onCancel,
  onCityChange,
  onCountryChange,
  onStreetChange,
  onSubmit,
  onZipChange,
}) => (
  <LanguageContext.Consumer>
    {({ PARTICULARS }) => (
      <form className="change-address box" onSubmit={onSubmit}>
        <h2>{PARTICULARS.MODAL.ADDRESS.TITLE}</h2>

        <div className="wrapper">
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.STREET_AND_HOUSENUMBER}
            type="text"
            onChange={onStreetChange}
            value={streetAndHousenumber}
          />
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.ZIP}
            type="text"
            onChange={onZipChange}
            value={zip}
          />
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.CITY}
            type="text"
            onChange={onCityChange}
            value={city}
          />

          <select
            className="input outline"
            onChange={onCountryChange}
            value={country}
          >
            <option value="">-</option>
            <option value="DEU">Germany</option>
            {countryList}
          </select>
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn outline"
            disabled={!canSubmit}
          >
            {PARTICULARS.MODAL.ADDRESS.BUTTON.SUBMIT}
          </button>

          <button
            className="btn outline"
            onClick={onCancel}
          >
            {PARTICULARS.MODAL.ADDRESS.BUTTON.CANCEL}
          </button>
        </div>
      </form>
    )}
  </LanguageContext.Consumer>
);

class ChangeAddress extends React.Component<
  ChangeAddressProps & RouteComponentProps,
  ChangeAddressState
> {
  state = {
    city: '',
    country: '',
    streetAndHousenumber: '',
    zip: '',
  };

  render() {
    const canSubmit = Boolean(
      this.state.city &&
      this.state.country &&
      this.state.streetAndHousenumber &&
      this.state.zip,
    );

    return (
      <ChangeAddressBody
        {...this.state}
        canSubmit={canSubmit}
        onCancel={this.props.onCancel}
        onCityChange={this.handleCityChange}
        onCountryChange={this.handleCountryChange}
        onStreetChange={this.handleStreetChange}
        onSubmit={this.handleSubmit}
        onZipChange={this.handleZipChange}
      />
    );
  }

  private handleCityChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ city: ev.target.value })

  private handleCountryChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ country: ev.target.value })

  private handleStreetChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ streetAndHousenumber: ev.target.value })

  private handleZipChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ zip: ev.target.value })

  private handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    this.props.onChangeAddress({
      ...this.state,
      country: alpha3ToCountryName[this.state.country],
    });
  }
}

export default ChangeAddress;
