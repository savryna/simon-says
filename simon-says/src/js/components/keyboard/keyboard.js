import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { KEYBOARD_TYPE, NUMBER_ROW } from '../levelSettings/levelSettings.js';
import styles from './keyboard.module.css';

export class Keyboard extends BaseElement {
  ASCII_EN_SHIFT = 97;
  EN_LENGTH = 26;
  EN_ALPHABET = Array.from({ length: this.EN_LENGTH }, (_, i) =>
    String.fromCharCode(i + this.ASCII_EN_SHIFT),
  );
  ALL_KEY = NUMBER_ROW.concat(this.EN_ALPHABET);
  QWERTY = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];
  isKeyPressed = false;

  constructor() {
    super('div', [styles.keyboardWrapper]);

    // this.selectedLevel = new SelectLevel();
    // this.keyboardType = this.selectedLevel.returnSelectedLevel();
    // this.selectedLevel.levelLabels.forEach((label) =>
    //   label.addEventListener('click', this.drawKeyboard(this.keyboardType)),
    // );

    this.keyButtonsObject = Object.fromEntries(this.createKeyButtons());

    this.buttonsLetters = Object.keys(this.keyButtonsObject);
    // console.log(this.buttonsLetters);
    const buttonsElems = Object.values(this.keyButtonsObject);
    // buttonsElems.forEach((button, idx) =>
    //   button.addEventListener('click', () => console.log(this.buttonsLetters[idx])),
    // );
    document.body.addEventListener('keydown', (event) => this.pushPhysicKeyboard(event));
    document.body.addEventListener('keyup', (event) => this.pushPhysicKeyboard(event));
    this.drawKeyboard();
    // this.changeKeyboard();
  }

  createKeyButtons() {
    return Array.from({ length: this.ALL_KEY.length }, (_, idx) => {
      return [
        this.ALL_KEY[idx],
        new BaseElement('button', [styles.keyButton], {}, this.ALL_KEY[idx]),
      ];
    });
  }

  drawKeyboard(keyboardType = 'easy') {
    this.removeChildren();
    // console.log(KEYBOARD_TYPE[keyboardType].length);
    for (let rowIdx = 0; rowIdx < KEYBOARD_TYPE[keyboardType].length; rowIdx++) {
      const rowElem = new BaseElement('div', [styles.rowWrapper]);
      for (let buttonIdx = 0; buttonIdx < KEYBOARD_TYPE[keyboardType][rowIdx].length; buttonIdx++) {
        // console.log(KEYBOARD_TYPE[keyboardType][rowIdx][buttonIdx]);
        rowElem.append(this.keyButtonsObject[KEYBOARD_TYPE[keyboardType][rowIdx][buttonIdx]]);
      }
      // console.log(rowElem);
      this.append(rowElem);
    }
  }

  pushPhysicKeyboard(event) {
    // нужно отключать hover

    const buttonLetter = this.buttonsLetters.find(
      (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
    );

    if (!buttonLetter) return;

    const currentButton = this.keyButtonsObject[buttonLetter];

    if (event.type === 'keydown') {
      if (this.isKeyPressed) return;

      this.isKeyPressed = true;
      this.currentLetter = buttonLetter;
      currentButton.toggleClass(styles.active, true);
    }

    if (event.type === 'keyup') {
      if (this.currentLetter === buttonLetter) {
        this.isKeyPressed = false;
        this.currentLetter = null;
        currentButton.toggleClass(styles.active, false);
      }
    }
  }
}
