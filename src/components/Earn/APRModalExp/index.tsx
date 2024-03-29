import { observer } from 'mobx-react';
import React, { ReactChild, useState, useEffect } from 'react';
import { Modal, Popup } from 'semantic-ui-react';
import Theme from 'themes';
import { getAPRStats, RewardsToken, StastsAPR } from '../EarnRow';
import './style.scss';
import { ExitIcon } from 'ui/Icons/ExitIcon';
import numeral from 'numeral';

interface ModalExplanationProps {
  token: RewardsToken;
  theme: Theme;
  children?: ReactChild;
}
const getLabel = (n: string): string => {
  switch (n) {
    case 'd1':
      return '1 D';
    case 'd7':
      return '7 D';
    case 'd30':
      return '30 D';
    case 'd365':
      return '365 D(APY)';
    default:
      return '';
  }
};

const ModalExplanation = observer(({ token, theme, children }: ModalExplanationProps) => {
  const stats = getAPRStats(token, Number(token.rewardsPrice));

  return (
    <Popup position="bottom center" className={`apr-modal ${theme.currentTheme}`} trigger={children}>
      <div className="apr-modal-header">
        <h3>ROI Calculation</h3>
      </div>
      <div className="apr-base">
        <p>Base APR</p>
        <p>
          <strong>{formatRoi(stats?.apr)}</strong>
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <td>Timeframe</td>
            <td>ROI</td>
            <td>SEFI per $1000</td>
          </tr>
        </thead>
        <tbody>
          {stats ? (
            Object.keys(stats?.roi).map((key, i) => (
              <tr key={key + i}>
                <td>{getLabel(key)}</td>
                <td>{formatRoi(stats?.roi[key])}</td>
                <td>{`${format(stats?.sefiP1000[key])} ($${format(stats?.usdP1000[key])})`}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <div className="extra-content">
        <ul>
          <li>Calculated based on current rates.</li>
          <li>Compounding 1x daily.</li>
          <li>
            All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
          </li>
        </ul>
      </div>
    </Popup>
  );
});

export default ModalExplanation;

const formatRoi = (n: string | number): string => {
  return numeral(n).format('0,0.00%');
};

const format = (n: string | number): string => {
  return numeral(n).format('0,0.00');
};
