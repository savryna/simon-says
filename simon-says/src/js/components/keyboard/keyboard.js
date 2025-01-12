import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
export { KEYBOARD_TYPE } from '../levelSettings/levelSettings.js';
import { getRandomElem } from '../../common/helper.js';

import { KEYBOARD_TYPE, NUMBER_ROW } from '../levelSettings/levelSettings.js';
import styles from './keyboard.module.css';

export class Keyboard extends BaseElement {
  isGaming = false;
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
    this.buttonsElems = Object.values(this.keyButtonsObject);
    // buttonsElems.forEach((button, idx) =>
    //   button.addEventListener('click', () => console.log(this.buttonsLetters[idx])),
    // );
    document.body.addEventListener('keydown', (event) => this.pushPhysicKeyboard(event));
    document.body.addEventListener('keyup', (event) => this.pushPhysicKeyboard(event));
    this.drawKeyboard();
    this.disabledKeyReal();

    // this.changeKeyboard();
  }

  createKeyButtons() {
    return Array.from({ length: this.ALL_KEY.length }, (_, idx) => {
      return [
        this.ALL_KEY[idx],
        new BaseElement('button', [styles.keyButton, styles.active], {}, this.ALL_KEY[idx]),
      ];
    });
  }

  drawKeyboard(keyboardType = 'easy') {
    this.removeChildren();
    for (let rowIdx = 0; rowIdx < KEYBOARD_TYPE[keyboardType].length; rowIdx++) {
      const rowElem = new BaseElement('div', [styles.rowWrapper]);
      for (let buttonIdx = 0; buttonIdx < KEYBOARD_TYPE[keyboardType][rowIdx].length; buttonIdx++) {
        rowElem.append(this.keyButtonsObject[KEYBOARD_TYPE[keyboardType][rowIdx][buttonIdx]]);
      }
      this.append(rowElem);
    }
    return this;
  }

  filterKeyboard(keyboardType) {
    const filter = this.buttonsLetters.filter((elem) =>
      KEYBOARD_TYPE[keyboardType].flat().includes(elem),
    );
    console.log(KEYBOARD_TYPE[keyboardType]);
    // const buttonElems = Array.from(
    //   { length: filter.length },
    //   (_, idx) => this.keyButtonsObject[filter[idx]],
    // );
    // console.log(buttonElems);
    return filter;
  }

  pushPhysicKeyboard(event) {
    // TODO: нужно отключать hover

    const buttonLetter = this.buttonsLetters.find(
      (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
    );

    if (!buttonLetter) return;

    const currentButton = this.keyButtonsObject[buttonLetter];

    if (event.type === 'keydown') {
      if (this.isKeyPressed || currentButton.hasAttributes('disabled')) return;
      console.log(currentButton.hasAttributes('disabled'));
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

  disabledKeyReal() {
    if (!this.isGaming) {
      this.buttonsElems.forEach((button) => {
        button.setAttributes({ disabled: 'disabled' });
      });
    } else {
      this.buttonsElems.forEach((button) => {
        button.removeAttributes(['disabled']);
      });
    }
  }

  upButtons() {
    this.buttonsElems.forEach((button) => button.toggleClass(styles.active, false));
  }

  animateButton(button) {
    return new Promise((resolve) => {
      button.toggleClass(styles.active, true);
      setTimeout(() => {
        button.toggleClass(styles.active, false);
        setTimeout(() => resolve(), 300);
      }, 500);
    });
  }

  createSequence(levelNum, keyboardType) {
    // const sequence = [];
    // for (let i = 0; i < levelNum * 2; i++) {
    //   sequence.push(getRandomElem(this.filterKeyboard(keyboardType)));
    // }
    // // console.log(sequence);
    // return sequence;
    let sequence = '';
    for (let i = 0; i < levelNum * 2; i++) {
      sequence += getRandomElem(this.filterKeyboard(keyboardType));
    }
    return sequence;
  }

  buttonElemsSequence(sequenceStr) {
    const sequenceElem = [];
    for (let i = 0; i < sequenceStr.length; i++) {
      sequenceElem.push(this.keyButtonsObject[sequenceStr[i]]);
    }
    return sequenceElem;
  }

  animateButtonSequence(buttons) {
    return buttons.reduce((promise, button) => {
      return promise.then(() => this.animateButton(button));
    }, Promise.resolve());
    // .then(() => console.log('done'));
  }

  fillInputSequence(event, inputElem, keyboardType) {
    const curKeyboard = this.filterKeyboard(keyboardType);
    console.log(curKeyboard);
    let buttonLetter = null;

    if (event.type === 'keydown') {
      buttonLetter = this.buttonsLetters.find(
        (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
      );
    }
    if (event.type === 'click') {
      console.log(event);
      buttonLetter = this.buttonsLetters.find(
        (letter) => event.currentTarget.innerText.toLowerCase() === letter.toLowerCase(),
      );
    }

    const currentButton = this.keyButtonsObject[buttonLetter];

    if (
      !buttonLetter ||
      currentButton.hasAttributes('disabled') ||
      !curKeyboard.includes(buttonLetter)
    )
      return;

    inputElem.addInnerText(buttonLetter.toUpperCase());
  }
}
