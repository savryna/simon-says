import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import styles from './playWindow.module.css';

export class PlayWindow extends BaseElement {
  GAME_STATUS = false;
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
      this.keyboard.getGameStatus(this.toggleClass());

      console.log(this.GAME_STATUS);
    });
  }

  toggleGameStatus() {
    if (this.GAME_STATUS) {
      this.GAME_STATUS = false;
    } else {
      this.GAME_STATUS = true;
    }
    console.log(this.GAME_STATUS);
    return this.GAME_STATUS;
  }
}
