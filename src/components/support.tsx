import React from 'react';

import { Station, SupportType } from '../model';
import { getAllStations } from '../model/stations';
import {
  submitFeedback,
  submitPedelecError,
  submitStationError,
} from '../model/support';

import './support.scss';

interface SupportState {
  defectBikeNumber: string;
  defectCategory: string;
  defectMessage: string;
  defectStation: string;
  defectType: Exclude<SupportType, 'feedback'>;
  feedbackHeading: string;
  feedbackMessage: string;
  stations: Station[];
}

interface BodyProps extends SupportState {
  canSubmitFeedback: boolean;
  canSubmitProblemReport: boolean;

  onChangeDefectBikeNumber: React.ChangeEventHandler<HTMLInputElement>;
  onChangeDefectCategory: React.ChangeEventHandler<HTMLSelectElement>;
  onChangeDefectMessage: React.ChangeEventHandler<HTMLTextAreaElement>;
  onChangeDefectStation: React.ChangeEventHandler<HTMLSelectElement>;
  onChangeDefectType: React.ChangeEventHandler<HTMLInputElement>;

  onChangeFeedbackHeading: React.ChangeEventHandler<HTMLInputElement>;
  onChangeFeedbackMessage: React.ChangeEventHandler<HTMLTextAreaElement>;

  onSubmitFeedback: React.FormEventHandler;
  onSubmitProblemReport: React.FormEventHandler;
}

const bikeDefectCategories = {
  TIRE: "Reifen platt oder beschädigt",
  TRACTION: "Keine Tretunterstützung vorhanden",
  SOILED: "Pedelec verschmutzt",
  BELL: "Klingel defekt",
  BRAKE: "Bremse defekt",
  LIGHT: "Licht defekt",
  MISC: "Sonstiges",
};
const stationDefectCategories = {
  TERMINAL: "Terminal nicht bedienbar",
  SCREEN: "Bildschirm zeigt schwarzes Bild",
  SOILED: "Station verschmutzt",
  SLOT: "Einer der Slots schließt oder öffnet nicht",
  MISC: "Sonstiges",
};

const Body: React.FC<BodyProps> = ({
  canSubmitFeedback,
  canSubmitProblemReport,

  defectBikeNumber,
  defectCategory,
  defectMessage,
  defectStation,
  defectType,
  feedbackHeading,
  feedbackMessage,
  stations,

  onChangeFeedbackHeading,
  onChangeFeedbackMessage,

  onChangeDefectBikeNumber,
  onChangeDefectCategory,
  onChangeDefectMessage,
  onChangeDefectStation,
  onChangeDefectType,

  onSubmitFeedback,
  onSubmitProblemReport,
}) => (
  <div className="support box-list">
    <form className="box" onSubmit={onSubmitFeedback}>
      <h2>Feedback</h2>

      <div className="wrapper">
        <input
          className="input outline"
          placeholder="Betreff"
          value={feedbackHeading}
          onChange={onChangeFeedbackHeading}
        />
        <textarea
          className="input outline"
          placeholder="Nachricht"
          value={feedbackMessage}
          onChange={onChangeFeedbackMessage}
        />
      </div>

      <div className="actions">
        <button
          className="btn outline"
          disabled={!canSubmitFeedback}
          type="submit"
        >
          Absenden
        </button>
      </div>
    </form>

    <form className="box" onSubmit={onSubmitProblemReport}>
      <h2>Ausfallbericht</h2>

      <div className="wrapper">
        <div className="defect-type">
          <label>
            <input
              className="input"
              type="radio"
              name="defect-type"
              value="bike"
              checked={defectType === 'pedelec'}
              onChange={onChangeDefectType}
            />
            <span>Fahrrad</span>
          </label>

          <label>
            <input
              className="input"
              type="radio"
              name="defect-type"
              value="station"
              checked={defectType === 'station'}
              onChange={onChangeDefectType}
            />
            <span>Station</span>
          </label>
        </div>

        {defectType === 'pedelec' ? (
          <input
            className="input outline"
            type="number"
            placeholder="Fahrradnummer"
            value={defectBikeNumber}
            onChange={onChangeDefectBikeNumber}
          />
        ) : (
          <select
            className="input outline"
            value={defectStation}
            onChange={onChangeDefectStation}
          >
            <option value="" disabled hidden>Station wählen...</option>
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
          onChange={onChangeDefectCategory}
        >
          <option value="" disabled hidden>Defekt wählen...</option>
          {defectType === 'pedelec' ? (
            Object.keys(bikeDefectCategories).map(k => (
              <option key={`bike-${k}`} value={k}>{bikeDefectCategories[k]}</option>
            ))
          ) : (
            Object.keys(stationDefectCategories).map(k => (
              <option key={`station-${k}`} value={k}>{stationDefectCategories[k]}</option>
            ))
          )}
        </select>

        <textarea
          className="input outline"
          placeholder="Bericht"
          value={defectMessage}
          onChange={onChangeDefectMessage}
        />
      </div>

      <div className="actions">
        <button
          className="btn outline"
          disabled={!canSubmitProblemReport}
          type="submit"
        >
          Absenden
        </button>
      </div>
    </form>
  </div>
);

class Support extends React.Component<{}, SupportState> {
  state = {
    defectBikeNumber: '',
    defectCategory: '',
    defectMessage: '',
    defectStation: '',
    defectType: 'pedelec' as 'pedelec',
    feedbackHeading: '',
    feedbackMessage: '',
    stations: [],
  };

  componentDidMount() {
    this.fetchStations();
  }

  render() {
    const canSubmitFeedback = Boolean(
      this.state.feedbackHeading &&
      this.state.feedbackMessage,
    );
    const canSubmitProblemReport = Boolean(
      this.state.defectMessage &&
      (this.state.defectType === 'pedelec'
        ? !isNaN(this.state.defectBikeNumber as unknown as number)
        : !isNaN(this.state.defectStation as unknown as number)),
    );

    return (
      <Body
        {...this.state}
        canSubmitFeedback={canSubmitFeedback}
        canSubmitProblemReport={canSubmitProblemReport}
        onChangeDefectBikeNumber={this.handleChangeDefectBikeNumber}
        onChangeDefectCategory={this.handleChangeDefectCategory}
        onChangeDefectMessage={this.handleChangeDefectMessage}
        onChangeDefectStation={this.handleChangeDefectStation}
        onChangeDefectType={this.handleChangeDefectType}
        onChangeFeedbackHeading={this.handleChangeFeedbackHeading}
        onChangeFeedbackMessage={this.handleChangeFeedbackMessage}
        onSubmitFeedback={this.handleSubmitFeedback}
        onSubmitProblemReport={this.handleSubmitProblemReport}
      />
    );
  }

  private async fetchStations() {
    const stations = await getAllStations();
    this.setState({
      stations: stations.sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  private handleChangeFeedbackHeading = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ feedbackHeading: ev.target.value })

  private handleChangeFeedbackMessage = (ev: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ feedbackMessage: ev.target.value })

  private handleChangeDefectBikeNumber = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ defectBikeNumber: ev.target.value })

  private handleChangeDefectCategory = (ev: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ defectCategory: ev.target.value })

  private handleChangeDefectMessage = (ev: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ defectMessage: ev.target.value })

  private handleChangeDefectStation = (ev: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ defectStation: ev.target.value })

  private handleChangeDefectType = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ defectType: ev.target.value as 'pedelec' | 'station' })

  private handleSubmitFeedback = async (ev: React.FormEvent) => {
    ev.preventDefault();

    await submitFeedback(this.state.feedbackHeading, this.state.feedbackMessage);
  }

  private handleSubmitProblemReport = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const {
      defectMessage,
      defectCategory,
      defectBikeNumber,
      defectStation,
    } = this.state;

    await (this.state.defectType === 'pedelec'
      ? submitPedelecError(defectMessage, defectCategory, Number(defectBikeNumber))
      : submitStationError(defectMessage, defectCategory, Number(defectStation)));
  }
}

export default Support;
