import { BaseElement } from '../../common/baseElement.js';
import { levels } from '../levelSettings/levelSettings.js';
import styles from './playWindow.module.css';

export class PlayWindow extends BaseElement {
  constructor() {
    super('div', [styles.playWindow]);

    const gameTitle = new BaseElement('h1', [styles.gameTitle], {}, 'Simon Says');

    const selectLevel = new BaseElement('div', [styles.selectLevel]);

    this.levelInputs = Array.from(
      { length: levels.length },
      (_, idx) =>
        new BaseElement('input', [styles.levelInput], {
          type: 'radio',
          id: levels[idx],
          name: 'game_level',
          value: levels[idx],
        }),
    );
    this.levelLabels = Array.from(
      { length: levels.length },
      (_, idx) =>
        new BaseElement(
          'label',
          [styles.levelLabel],
          {
            for: levels[idx],
          },
          `${levels[idx].toUpperCase()}`,
        ),
    );

    const buttonStart = new BaseElement('button', [styles.buttonStart], {}, 'start');

    for (let i = 0; i < levels.length; i++) {
      selectLevel.append(this.levelInputs[i]);
      selectLevel.append(this.levelLabels[i]);
    }
    const pseudo = new BaseElement('div', [styles.pseudo]);
    selectLevel.append(pseudo);
    this.levelInputs[0].setAttributes({ checked: 'checked' });
    this.append(gameTitle, selectLevel, buttonStart);
  }
}
