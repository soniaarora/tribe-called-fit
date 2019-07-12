import React from 'react';
import logo from './logo.svg';
import './App.css';
import iCal from 'ical-generator';
import {
  startOfWeek,
  addHours,
  addSeconds,
  getSeconds,
  getDay,
  format
} from 'date-fns';

const opportunities = [
  {
    distance: 4.25,
    intensity: 1/(8 * 60 + 22),
    startTime: 24 + 7,
    nRegulars: 8,
    nMaybes: 23
  },
  {
    distance: 7.5,
    intensity: 1/(8 * 60 + 50),
    startTime: 24 * 2 + 12 + 7,
    nRegulars: 5,
    nMaybes: 60
  },
  {
    distance: 26.2,
    intensity: 1/(9 * 60 + 14),
    startTime: 24 * 7 + 6,
    nRegulars: 2,
    nMaybes: 9
  },
  {
    distance: 3.1,
    intensity: 1/(5 * 60 + 50),
    startTime: 24 * 6 + 8,
    nRegulars: 15,
    nMaybes: 28
  }
]

function calcAbsoluteDate(hoursFromStartOfWeek: number): Date {
  return addHours(startOfWeek(new Date()), hoursFromStartOfWeek);
}

function renderStartTime(hoursFromStartOfWeek: number): string {
  const absDate = calcAbsoluteDate(hoursFromStartOfWeek);

  const dayStr = (new Intl.DateTimeFormat('en-US', {weekday: "long"})).format(getDay(absDate));

  const hourStr = format(absDate, 'ha');

  return `${dayStr}s, ${hourStr}`;
}

function renderIntensity(inverseSeconds: number): string {
  return `${Math.floor((1/inverseSeconds) / 60)}:${(1/inverseSeconds) % 60}`;
}

const App: React.FC<any> = () => {
  return (
    <div className="App">
      <div className="Screen">
        <header className="App-header">
          Welcome!
        </header>
        <h1>Getting started</h1>
        <section>
          <p>To roll with this tribe, we need the data from your fitness tracker (e.g. Fitbit, Garmin watch). Click "add device" below to get started.</p>
          <a href="#opportunities">Add device</a>
        </section>
      </div>
      <div className="Screen">
        <header className="App-header" id="opportunities">
          Hey, Patrick!
        </header>
        <h1>This week's opportunities</h1>
        {opportunities.map(renderOpportunity)}
      </div>
    </div>
  );

  function renderOpportunity({
    distance,
    intensity,
    startTime,
    nRegulars,
    nMaybes
  }: any) {
    const endDate = addSeconds(calcAbsoluteDate(startTime), distance * (1/intensity));

    const calendar = iCal({
      domain: 'rallyhealth.com',
      name: 'A tribe called fit'
    });
    const iCalData = calendar.createEvent({
      start: calcAbsoluteDate(startTime),
      end: endDate,
      summary: `run ${distance} miles`
    });
    return (
      <div className="Opportunity" key={startTime}>
        <img src="sprint.svg"/>
        <div className="Opportunity_summary">
          <p>{distance} mi @ ~{renderIntensity(intensity)} min/mi</p>
          <p>{renderStartTime(startTime)}</p>
          <p>{nRegulars} regulars</p>
          <p>{nMaybes} maybes</p>
          <a
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendar.toString())}`}
            download={`training-${startTime}.ics`}
          >Add to calendar</a>
    </div>
  </div>
    );
  }
}

export default App;
