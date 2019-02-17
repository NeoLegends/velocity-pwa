import classNames from 'classnames';
import countries from 'country-info-list/countries.json';
import React, { useContext, useState } from 'react';

import { Address } from '../../model';
import { LanguageContext, LanguageIdContext } from '../../resources/language';

interface ChangeAddressProps {
  className?: string;

  onCancel: React.MouseEventHandler;
  onChangeAddress: (newAddress: Address) => void;
}

const countryListEnglish = countries.map(c => (
  <option key={c.alpha3Code} value={c.alpha3Code}>
    {c.name}
  </option>
));
const countryListGerman = countries
  // Sort by german name
  .sort((a, b) => {
    const aName = a.translations.de || a.name;
    const bName = b.translations.de || b.name;
    return aName.localeCompare(bName);
  })
  .map(c => (
    <option key={c.alpha3Code} value={c.alpha3Code}>
      {c.translations.de || c.name}
    </option>
  ));

const alpha3ToCountryName: Record<string, string> = countries.reduce((acc, c) => {
  acc[c.alpha3Code] = c.name;
  return acc;
}, {});

const ChangeAddress: React.FC<ChangeAddressProps> = ({
  className,

  onCancel,
  onChangeAddress,
}) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [streetAndHousenumber, setStreetAndHousenumber] = useState('');
  const [zip, setZip] = useState('');

  const { PARTICULARS } = useContext(LanguageContext);
  const langId = useContext(LanguageIdContext);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    onChangeAddress({
      city,
      country: alpha3ToCountryName[country],
      streetAndHousenumber,
      zip,
    });
  };

  const canSubmit = Boolean(city && country && streetAndHousenumber && zip);

  return (
    <form
      className={classNames('change-address box', className)}
      onSubmit={handleSubmit}
    >
      <h2>{PARTICULARS.MODAL.ADDRESS.TITLE}</h2>

      <div className="wrapper">
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.STREET_AND_HOUSENUMBER}
          type="text"
          onChange={ev => setStreetAndHousenumber(ev.target.value)}
          value={streetAndHousenumber}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.ZIP}
          type="text"
          onChange={ev => setZip(ev.target.value)}
          value={zip}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.ADDRESS.INPUT.CITY}
          type="text"
          onChange={ev => setCity(ev.target.value)}
          value={city}
        />

        <select
          className="input outline"
          onChange={ev => setCountry(ev.target.value)}
          value={country}
        >
          <option value="">-</option>
          <option value="DEU">
            {langId === 'de' ? "Deutschland" : "Germany"}
          </option>
          {langId === 'de' ? countryListGerman : countryListEnglish}
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
  );
};

export default ChangeAddress;
