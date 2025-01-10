import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import styles from './playWindow.module.css';

export class PlayWindow extends BaseElement {
  constructor(keyboard) {
    super('div', [styles.playWindow]);

    this.keyboard = keyboard;
    const gameTitle = new BaseElement('h1', [styles.gameTitle], {}, 'Simon Says');

    // const selectLevel = new BaseElement('div', [styles.selectLevel]);

    // this.levelInputs = Array.from(
    //   { length: LEVELS.length },
    //   (_, idx) =>
    //     new BaseElement('input', [styles.levelInput], {
    //       type: 'radio',
    //       id: LEVELS[idx],
    //       name: 'game_level',
    //       value: LEVELS[idx],
    //     }),
    // );
    // this.levelLabels = Array.from(
    //   { length: LEVELS.length },
    //   (_, idx) =>
    //     new BaseElement(
    //       'label',
    //       [styles.levelLabel],
    //       {
    //         for: LEVELS[idx],
    //       },
    //       `${LEVELS[idx].toUpperCase()}`,
    //     ),
    // );
    const selectLevel = new SelectLevel(keyboard);

    const buttonStart = new BaseElement('button', [styles.buttonStart], {}, 'start');

    this.append(gameTitle, selectLevel, buttonStart);
    buttonStart.addEventListener('click', () => {
      this.toggleGameStatus();
      this.keyboard.disabledKey();
    });
  }

  toggleGameStatus() {
    if (this.keyboard.isGaming) {
      this.keyboard.isGaming = false;
    } else {
      this.keyboard.isGaming = true;
    }
    console.log(this.keyboard.isGaming);
  }
}
