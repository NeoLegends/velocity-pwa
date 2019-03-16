import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { useFormField } from '../hooks/form';
import { useStations } from '../hooks/stations';
import { DeviceSupportType } from '../model';
import {
  submitFeedback,
  submitPedelecError,
  submitStationError,
} from '../model/support';
import { LanguageContext } from '../resources/language';

import './support.scss';

interface SupportProps {
  className?: string;
}

const Support: React.FC<SupportProps> = ({ className }) => {
  const { stations } = useStations();

  const [feedbackHeading, handleFeedbackHeadingChange] = useFormField('');
  const [feedbackMessage, handleFeedbackMessageChange] = useFormField('');

  const [defectBikeNumber, handleDefectBikeNumberChange] = useFormField('');
  const [defectCategory, handleDefectCategoryChange] = useFormField('');
  const [defectMessage, handleDefectMessageChange] = useFormField('');
  const [defectStation, handleDefectStationChange] = useFormField('');
  const [defectType, setDefectType] = useState<DeviceSupportType>('pedelec');

  const { BUCHUNGEN, SUPPORT } = useContext(LanguageContext);

  const canSubmitFeedback = Boolean(feedbackHeading && feedbackMessage);
  const canSubmitProblemReport = Boolean(
    defectMessage &&
      (defectType === 'pedelec'
        ? !isNaN((defectBikeNumber as unknown) as number)
        : !isNaN((defectStation as unknown) as number)),
  );

  const handleSubmitFeedback = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      await submitFeedback(feedbackHeading, feedbackMessage);

      toast(SUPPORT.FEEDBACK.ALERT.SUCCESS, { type: 'success' });
    } catch (err) {
      toast(SUPPORT.FEEDBACK.ALERT.ERROR.DEFAULT, { type: 'error' });
    }
  };

  const handleSubmitProblemReport = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      await (defectType === 'pedelec'
        ? submitPedelecError(
            defectMessage,
            defectCategory,
            Number(defectBikeNumber),
          )
        : submitStationError(
            defectMessage,
            defectCategory,
            Number(defectStation),
          ));

      toast(SUPPORT.ERROR_REPORT.ALERT.SUCCESS, { type: 'success' });
    } catch (err) {
      toast(SUPPORT.ERROR_REPORT.ALERT.ERROR.DEFAULT, { type: 'error' });
    }
  };

  return (
    <div className={classNames('support box-list', className)}>
      <form className="box" onSubmit={handleSubmitFeedback}>
        <h2>{SUPPORT.FEEDBACK.TITLE}</h2>

        <div className="wrapper">
          <input
            className="input outline"
            placeholder={SUPPORT.FEEDBACK.FORM.SUBJECT}
            value={feedbackHeading}
            onChange={handleFeedbackHeadingChange}
          />
          <textarea
            className="input outline"
            placeholder={SUPPORT.FEEDBACK.FORM.CONTENT}
            value={feedbackMessage}
            onChange={handleFeedbackMessageChange}
          />
        </div>

        <div className="actions">
          <button
            className="btn outline"
            disabled={!canSubmitFeedback}
            type="submit"
          >
            {SUPPORT.BUTTON.SUBMIT}
          </button>
        </div>
      </form>

      <form className="box" onSubmit={handleSubmitProblemReport}>
        <h2>{SUPPORT.ERROR_REPORT.TITLE}</h2>

        <div className="wrapper">
          <div className="defect-type">
            <label>
              <input
                className="input"
                type="radio"
                name="defect-type"
                value="pedelec"
                checked={defectType === 'pedelec'}
                onChange={() => setDefectType('pedelec')}
              />
              <span>Pedelec</span>
            </label>

            <label>
              <input
                className="input"
                type="radio"
                name="defect-type"
                value="station"
                checked={defectType === 'station'}
                onChange={() => setDefectType('station')}
              />
              <span>{BUCHUNGEN.RESERVIERUNG.STATION}</span>
            </label>
          </div>

          {defectType === 'pedelec' ? (
            <input
              className="input outline"
              type="number"
              placeholder={SUPPORT.ERROR_REPORT.BIKE.BIKE_ID}
              value={defectBikeNumber}
              onChange={handleDefectBikeNumberChange}
            />
          ) : (
            <select
              className="input outline"
              value={defectStation}
              onChange={handleDefectStationChange}
            >
              <option value="" disabled hidden>
                {SUPPORT.ERROR_REPORT.STATION.STATION_NAME}...
              </option>
              {stations.map(stat => (
                <option key={stat.stationId} value={stat.stationId}>
                  {stat.name}
                </option>
              ))}
            </select>
          )}

          <select
            className="input outline"
            value={defectCategory}
            onChange={handleDefectCategoryChange}
          >
            <option value="" disabled hidden>
              {SUPPORT.ERROR_REPORT.STATION.DEFECT}...
            </option>
            {defectType === 'pedelec'
              ? Object.keys(SUPPORT.ERROR_REPORT.ERROR_MESSAGES.BIKE).map(k => (
                  <option key={`bike-${k}`} value={k}>
                    {SUPPORT.ERROR_REPORT.ERROR_MESSAGES.BIKE[k]}
                  </option>
                ))
              : Object.keys(SUPPORT.ERROR_REPORT.ERROR_MESSAGES.STATION).map(
                  k => (
                    <option key={`station-${k}`} value={k}>
                      {SUPPORT.ERROR_REPORT.ERROR_MESSAGES.STATION[k]}
                    </option>
                  ),
                )}
          </select>

          <textarea
            className="input outline"
            placeholder={SUPPORT.ERROR_REPORT.STATION.NOTES}
            value={defectMessage}
            onChange={handleDefectMessageChange}
          />
        </div>

        <div className="actions">
          <button
            className="btn outline"
            disabled={!canSubmitProblemReport}
            type="submit"
          >
            {SUPPORT.BUTTON.SUBMIT}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Support;
