import { BaseElement } from '../../common/baseElement.js';
import { LEVELS } from '../levelSettings/levelSettings.js';
import { Keyboard } from '../keyboard/keyboard.js';
import styles from './selectLevel.module.css';

export class SelectLevel extends BaseElement {
  selectLevelSetting = 'easy';
  constructor(keyboard) {
    super('div', [styles.selectLevel]);

    this.keyboard = keyboard;
    console.log(this.keyboard);
    this.levelInputs = Array.from(
      { length: LEVELS.length },
      (_, idx) =>
        new BaseElement('input', [styles.levelInput], {
          type: 'radio',
          id: LEVELS[idx],
          name: 'game_level',
          value: LEVELS[idx],
        }),
    );
    this.levelLabels = Array.from(
      { length: LEVELS.length },
      (_, idx) =>
        new BaseElement(
          'label',
          [styles.levelLabel],
          {
            for: LEVELS[idx],
          },
          `${LEVELS[idx].toUpperCase()}`,
        ),
    );
    this.pseudo = new BaseElement('div', [styles.pseudo]);
    this.levelLabels.forEach((label) =>
      label.addEventListener('click', (event) => {
        this.addChecked(event);
        this.returnSelectedLevel();
        this.keyboard.drawKeyboard(this.returnSelectedLevel());
        console.dir(this.keyboard._elem.innerHTML);
      }),
    );
    this.fillSelectLevel();
  }

  fillSelectLevel() {
    for (let i = 0; i < LEVELS.length; i++) {
      this.append(this.levelInputs[i]);
      this.append(this.levelLabels[i]);
    }
    this.append(this.pseudo);
    this.levelInputs[0].setAttributes({ checked: 'checked' });
  }

  addChecked(event) {
    this.levelInputs.forEach((input) => {
      input.removeAttributes(['checked']);
      const clickIdx = LEVELS.findIndex((elem) => elem === event.currentTarget.getAttribute('for'));
      this.levelInputs[clickIdx].setAttributes({ checked: 'checked' });
    });
  }

  returnSelectedLevel() {
    const selectedLevel = this.levelInputs
      .find((input) => input.hasAttributes('checked'))
      .getAttribute('id');
    this.selectLevelSetting = selectedLevel;
    // console.log(selectedLevel);
    // console.log(this.selectLevelSetting);
    return selectedLevel;
  }
}
