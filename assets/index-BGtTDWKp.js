true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

class BaseElement {
  constructor(tag, cssClasses = [], attributes = {}, innerContent = '') {
    this._elem = document.createElement(tag);

    this.addClasses(cssClasses);

    this.setAttributes(attributes);

    this._elem.innerText = innerContent;
  }

  addClasses(cssClasses) {
    this._elem.classList.add(...cssClasses);
  }

  removeClasses(cssClasses) {
    this._elem.classList.remove(...cssClasses);
  }

  setInnerHTML(innerContent) {
    this._elem.innerText = innerContent;
  }

  getInnerHTML() {
    return this._elem.innerHTML;
  }

  removeAttributes(attributes) {
    attributes.forEach((atr) => this._elem.removeAttribute(atr));
  }

  append(...children) {
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        this._elem.append(child);
      } else if (child instanceof BaseElement) {
        this._elem.append(child._elem);
      }
    });
  }

  appendTo(parent) {
    if (parent instanceof HTMLElement || parent instanceof BaseElement) {
      parent.append(this._elem);
    } else {
      throw new Error('parent not instanceof HTMLElement or BaseElement');
    }
  }

  setAttributes(atrs) {
    Object.entries(atrs).forEach(([key, val]) => this._elem.setAttribute(key, val));
  }

  hasAttributes(atr) {
    return this._elem.hasAttribute(atr);
  }

  getAttribute(atr) {
    return this._elem.getAttribute(atr);
  }

  remove() {
    this._elem.remove();
  }

  removeChildren() {
    this._elem.replaceChildren();
  }

  removeThisChild(child) {
    if (this._elem.contains(child._elem)) {
      this._elem.removeChild(child._elem);
    } else {
      return;
    }
  }

  switchChildren(removedChild, addedChild) {
    if (this._elem.contains(removedChild._elem)) {
      this.removeThisChild(removedChild);
      this.append(addedChild);
    } else {
      return;
    }
  }

  toggleClass(style, option) {
    this._elem.classList.toggle(style, option);
  }

  hasClass(style) {
    return this._elem.classList.contains(style);
  }

  addEventListener(event, callback) {
    this._elem.addEventListener(event, callback);
  }

  getInnerText() {
    return this._elem.innerText;
  }

  setInnerText(textContent) {
    this._elem.textContent = textContent;
  }

  addInnerText(textContent) {
    this._elem.textContent += textContent;
  }
}

const LEVELS = ['easy', 'medium', 'hard'];

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const QWERTY = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const KEYBOARD_TYPE = {
  easy: [NUMBER_ROW],
  medium: [...QWERTY],
  hard: [NUMBER_ROW, ...QWERTY],
};

const selectLevel = "_selectLevel_jfwko_1";
const levelInput = "_levelInput_jfwko_14";
const levelLabel = "_levelLabel_jfwko_18";
const pseudo = "_pseudo_jfwko_41";
const styles$3 = {
	selectLevel: selectLevel,
	levelInput: levelInput,
	levelLabel: levelLabel,
	pseudo: pseudo
};

class SelectLevel extends BaseElement {
  selectLevelSetting = 'easy';
  constructor(keyboard) {
    super('div', [styles$3.selectLevel]);

    this.keyboard = keyboard;
    this.levelInputs = Array.from(
      { length: LEVELS.length },
      (_, idx) =>
        new BaseElement('input', [styles$3.levelInput], {
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
          [styles$3.levelLabel],
          {
            for: LEVELS[idx],
          },
          `${LEVELS[idx].toUpperCase()}`,
        ),
    );
    this.pseudo = new BaseElement('div', [styles$3.pseudo]);
    this.levelLabels.forEach((label) =>
      label.addEventListener('click', (event) => {
        this.addChecked(event);
        this.returnSelectedLevel();
        this.keyboard.drawKeyboard(this.returnSelectedLevel());
        // console.dir(this.keyboard._elem.innerHTML);
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

function getRandomElem(array) {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

const keyboardWrapper = "_keyboardWrapper_112ci_8";
const keyButton = "_keyButton_112ci_22";
const active = "_active_112ci_66";
const disabled$1 = "_disabled_112ci_73";
const rowWrapper = "_rowWrapper_112ci_82";
const styles$2 = {
	keyboardWrapper: keyboardWrapper,
	keyButton: keyButton,
	active: active,
	disabled: disabled$1,
	rowWrapper: rowWrapper
};

class Keyboard extends BaseElement {
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
    super('div', [styles$2.keyboardWrapper]);

    this.keyButtonsObject = Object.fromEntries(this.createKeyButtons());

    this.buttonsLetters = Object.keys(this.keyButtonsObject);
    this.buttonsElems = Object.values(this.keyButtonsObject);
    // );
    document.body.addEventListener('keydown', (event) => {
      if (event.type === 'mousedown') return;
      this.pushPhysicKeyboard(event);
    });
    document.body.addEventListener('keyup', (event) => this.pushPhysicKeyboard(event));
    this.buttonsElems.forEach((button) =>
      button.addEventListener('mouseover', (event) => this.pushPhysicKeyboard(event)),
    );
    this.buttonsElems.forEach((button) =>
      button.addEventListener('mouseup', (event) => this.pushPhysicKeyboard(event)),
    );

    this.drawKeyboard();
    this.disabledKeyReal();
  }

  createKeyButtons() {
    return Array.from({ length: this.ALL_KEY.length }, (_, idx) => {
      return [
        this.ALL_KEY[idx],
        new BaseElement(
          'button',
          [styles$2.keyButton, styles$2.active, styles$2.disabled],
          {},
          this.ALL_KEY[idx],
        ),
      ];
    });
  }

  drawKeyboard(keyboardType = 'easy') {
    this.removeChildren();
    for (let rowIdx = 0; rowIdx < KEYBOARD_TYPE[keyboardType].length; rowIdx++) {
      const rowElem = new BaseElement('div', [styles$2.rowWrapper]);
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
    return filter;
  }

  pushPhysicKeyboard(event) {
    const buttonLetter = this.buttonsLetters.find(
      (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
    );

    if (!buttonLetter) return;

    const currentButton = this.keyButtonsObject[buttonLetter];

    if (event.type === 'keydown' || event.type === 'mouseover') {
      if (this.isKeyPressed || currentButton.hasAttributes('disabled')) return;
      this.isKeyPressed = true;
      this.currentLetter = buttonLetter;
      currentButton.toggleClass(styles$2.active, true);
    }

    if (event.type === 'keyup' || event.type === 'mouseup') {
      if (this.currentLetter === buttonLetter) {
        this.isKeyPressed = false;
        this.currentLetter = null;
        currentButton.toggleClass(styles$2.active, false);
      }
    }
  }

  disabledKeyReal() {
    if (!this.isGaming) {
      this.buttonsElems.forEach((button) => {
        button.setAttributes({ disabled: 'disabled' });
        button.toggleClass(styles$2.disabled, true);
      });
    } else {
      this.buttonsElems.forEach((button) => {
        button.removeAttributes(['disabled']);
        button.toggleClass(styles$2.disabled, false);
      });
    }
  }

  upButtons() {
    this.buttonsElems.forEach((button) => button.toggleClass(styles$2.active, false));
  }

  downButtons() {
    this.buttonsElems.forEach((button) => button.toggleClass(styles$2.active, true));
  }

  animateButton(button) {
    return new Promise((resolve) => {
      button.toggleClass(styles$2.active, true);
      setTimeout(() => {
        button.toggleClass(styles$2.active, false);
        setTimeout(() => resolve(), 300);
      }, 500);
    });
  }

  createSequence(levelNum, keyboardType) {
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
  }

  fillInputSequence(event, inputElem, keyboardType) {
    const curKeyboard = this.filterKeyboard(keyboardType);
    let buttonLetter = null;

    if (event.type === 'keydown') {
      buttonLetter = this.buttonsLetters.find(
        (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
      );
    } else {
      buttonLetter = this.buttonsLetters.find(
        (letter) => event.currentTarget.innerText.toLowerCase() === letter.toLowerCase(),
      );
    }

    const currentButton = this.keyButtonsObject[buttonLetter];

    if (
      !buttonLetter ||
      currentButton.hasAttributes('disabled') ||
      !curKeyboard.includes(buttonLetter) ||
      event.repeat
    )
      return;

    inputElem.addInnerText(buttonLetter.toUpperCase());
  }
}

const playWindow = "_playWindow_18azk_15";
const gameTitle = "_gameTitle_18azk_31";
const buttonStart = "_buttonStart_18azk_39";
const gameButtons = "_gameButtons_18azk_62";
const controlButton = "_controlButton_18azk_73";
const inputSequence = "_inputSequence_18azk_92";
const roundBlock = "_roundBlock_18azk_105";
const currentLevel = "_currentLevel_18azk_115";
const round = "_round_18azk_105";
const pointerEvents = "_pointerEvents_18azk_134";
const disabled = "_disabled_18azk_138";
const error = "_error_18azk_143";
const styles$1 = {
	playWindow: playWindow,
	gameTitle: gameTitle,
	buttonStart: buttonStart,
	gameButtons: gameButtons,
	controlButton: controlButton,
	inputSequence: inputSequence,
	roundBlock: roundBlock,
	currentLevel: currentLevel,
	round: round,
	pointerEvents: pointerEvents,
	disabled: disabled,
	error: error
};

class PlayWindow extends BaseElement {
  roundNumber = 1;
  replicability = 1;
  incorrectAttempt = 1;

  strLose = 'wah-wah-wah';
  strWinLvl = 'cool!';
  strWinGame = 'you win!';

  constructor(keyboard) {
    super('div', [styles$1.playWindow]);

    this.keyboard = keyboard;
    const gameTitle = new BaseElement('h1', [styles$1.gameTitle], {}, 'Simon Says');

    this.selectLevel = new SelectLevel(keyboard);

    this.buttonStart = new BaseElement('button', [styles$1.buttonStart], {}, 'START');

    this.roundBlock = new BaseElement('div', [styles$1.roundBlock]);
    this.currentRound = new BaseElement('span', [styles$1.round], {}, `0${this.roundNumber}`);
    this.currentLevel = new BaseElement(
      'span',
      [styles$1.currentLevel],
      {},
      this.selectLevel.selectLevelSetting,
    );
    const amountRounds = new BaseElement('span', [styles$1.round], {}, '05');
    this.roundBlock.append(this.currentRound, this.currentLevel, amountRounds);

    this.buttonRestart = new BaseElement(
      'button',
      [styles$1.controlButton, styles$1.pointerEvents],
      {},
      'REPEAT',
    );
    this.buttonNext = new BaseElement('button', [styles$1.controlButton], {}, 'NEXT');
    this.inputSequence = new BaseElement('p', [styles$1.inputSequence], {}, ' ');
    this.buttonNewGame = new BaseElement(
      'button',
      [styles$1.controlButton, styles$1.pointerEvents],
      {},
      'NEW GAME',
    );
    this.gameButtons = new BaseElement('div', [styles$1.gameButtons]);
    this.gameButtons.append(this.buttonNewGame, this.inputSequence, this.buttonRestart);

    this.curSequence = '';
    this.append(gameTitle, this.selectLevel, this.buttonStart);
    this.buttonStart.addEventListener('click', () => {
      this.upKeyboard();
      this.disableInteraction();
      this.keyboard.upButtons();
      this.gameButtons.switchChildren(this.buttonNext, this.buttonRestart);
      this.newSequence();
      this.selectLvlAnimation();
      this.startBtnAnimation();
    });

    this.keyboard.buttonsElems.forEach((button) =>
      button.addEventListener('click', (event) => {
        if (this.incorrectAttempt <= 0 && this.replicability) return;
        this.keyboard.fillInputSequence(
          event,
          this.inputSequence,
          this.selectLevel.selectLevelSetting,
        );
        this.compareInputSequence();
      }),
    );

    document.addEventListener('keydown', (event) => {
      if (this.incorrectAttempt <= 0 && this.replicability) return;
      this.keyboard.pushPhysicKeyboard(event);
      this.keyboard.fillInputSequence(
        event,
        this.inputSequence,
        this.selectLevel.selectLevelSetting,
      );
      this.compareInputSequence();
    });

    this.buttonNext.addEventListener('click', () => {
      this.moveNextRound();
    });

    this.buttonRestart.addEventListener('click', () => {
      this.repeatSequence();
    });

    this.buttonNewGame.addEventListener('click', () => {
      this.newGame();
      this.switchChildren(
        this.keyboard,
        this.keyboard.drawKeyboard(this.selectLevel.selectLevelSetting),
      );
    });
  }

  toggleGameStatus() {
    if (this.keyboard.isGaming) {
      this.keyboard.isGaming = false;
    } else {
      this.keyboard.isGaming = true;
    }
  }

  upKeyboard() {
    if (this.keyboard.isKeyUp) {
      this.keyboard.isKeyUp = false;
    } else {
      this.keyboard.isKeyUp = true;
    }
  }

  selectLvlAnimation() {
    this.selectLevel.pseudo.remove();

    const resizeWidth = new KeyframeEffect(this.selectLevel._elem, [{ width: '30%' }], {
      duration: 1000,
      direction: 'normal',
      easing: 'ease-in-out',
    });
    const resizeWidthAnimation = new Animation(resizeWidth, document.timeline);
    resizeWidthAnimation.play();

    const opacity = new KeyframeEffect(this.selectLevel._elem, [{ opacity: '0' }], {
      delay: 500,
      duration: 300,
      direction: 'normal',
      easing: 'ease-in-out',
    });
    const opacityAnimantion = new Animation(opacity, document.timeline);
    opacityAnimantion.play();

    const currentLetterText = this.selectLevel.selectLevelSetting;
    opacityAnimantion.finished.then(() => {
      this.switchChildren(this.selectLevel, this.roundBlock);
      this.currentLevel.setInnerText(currentLetterText.toUpperCase());
    });
  }

  startBtnAnimation() {
    const resizeWidth = new KeyframeEffect(
      this.buttonStart._elem,
      { width: '100%' },
      {
        duration: 1000,
        direction: 'normal',
        easing: 'ease-in-out',
      },
    );
    const resizeWidthAnimation = new Animation(resizeWidth, document.timeline);

    const opacity = new KeyframeEffect(this.buttonStart._elem, [{ opacity: '0' }], {
      delay: 500,
      duration: 300,
      direction: 'normal',
      easing: 'ease-in-out',
    });
    const opacityAnimantion = new Animation(opacity, document.timeline);

    resizeWidthAnimation.play();
    opacityAnimantion.play();
    this.buttonStart.setAttributes({ disabled: 'disabled' });
    this.buttonStart.addClasses([styles$1.disabled, styles$1.pointerEvents]);
    opacityAnimantion.finished
      .then(() => this.switchChildren(this.buttonStart, this.gameButtons))
      .then(() =>
        this.keyboard.animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence)),
      )
      .then(() => {
        this.enabledInteraction();
        this.buttonStart.removeAttributes(['disabled']);
        this.buttonStart.removeClasses([styles$1.disabled, styles$1.pointerEvents]);
      });
  }

  addRoundNumber() {
    this.roundNumber += 1;
    this.currentRound.setInnerText(`0${this.roundNumber}`);
  }

  newSequence() {
    this.curSequence = this.keyboard.createSequence(
      this.roundNumber,
      this.selectLevel.selectLevelSetting,
    );
    console.log('Cross-check hint:', this.curSequence.toUpperCase());
  }

  compareInputSequence() {
    const curSequence = this.curSequence;
    const userInputSequence = this.inputSequence.getInnerText().toLowerCase();

    for (let i = 0; i < userInputSequence.length; i++) {
      if (userInputSequence === this.strLose || userInputSequence === this.strWinGame) {
        return;
      }

      if (userInputSequence[i - 1] !== curSequence[i - 1]) {
        console.log('1');
        return;
      }

      if (userInputSequence[i] !== curSequence[i]) {
        if (userInputSequence === this.strWinLvl) return;
        if (this.incorrectAttempt <= 0 || this.replicability <= 0) {
          this.buttonRestart.toggleClass(styles$1.pointerEvents, true);
          this.buttonRestart.toggleClass(styles$1.disabled, true);
          this.buttonRestart.setAttributes({ disabled: 'disabled' });
          this.inputSequence.toggleClass(styles$1.error, true);

          this.opacityAnimation(this.inputSequence);
          this.inputSequence.setInnerText(this.strLose);
        }

        if (this.inputSequence.getInnerText() && this.incorrectAttempt >= 0) {
          this.errorAnimation();
        }
        this.inputSequence.toggleClass(styles$1.error, true);
        this.incorrectAttempt -= 1;
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        return;
      }
    }
    if (userInputSequence === curSequence) {
      if (this.roundNumber === 5) {
        this.buttonRestart.addClasses([styles$1.disabled, styles$1.pointerEvents]);
        this.opacityAnimation(this.inputSequence);
        this.inputSequence.setInnerText(this.strWinGame);
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
      } else if (this.roundNumber < 5) {
        this.gameButtons.switchChildren(this.buttonRestart, this.buttonNext);
        this.opacityAnimation(this.inputSequence);
        this.inputSequence.setInnerText(this.strWinLvl);
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        return;
      }
      return;
    }
    return;
  }

  errorAnimation() {
    const errorShaking = [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(5deg)' },
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-5deg)' },
      { transform: 'rotate(0deg)' },
    ];
    const errorShakingTiming = {
      duration: 300,
      iterations: 1,
    };
    this.inputSequence.toggleClass(styles$1.error, true);
    this.gameButtons._elem.animate(errorShaking, errorShakingTiming);
  }

  opacityAnimation(baseElement) {
    const opacityAnim = [{ opacity: '0' }, { opacity: '1' }];
    const opacityAnimTiming = {
      duration: 500,
      iterations: 1,
    };
    baseElement._elem.animate(opacityAnim, opacityAnimTiming);
  }

  moveNextRound() {
    this.disableInteraction();
    this.inputSequence.toggleClass(styles$1.error, false);
    this.addRoundNumber();
    this.gameButtons.switchChildren(this.buttonNext, this.buttonRestart);
    this.inputSequence.setInnerText('');
    this.newSequence();
    this.incorrectAttempt = 1;
    this.replicability = 1;
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => this.enabledInteraction());
  }

  disableInteraction() {
    this.buttonRestart.addClasses([styles$1.pointerEvents, styles$1.disabled]);
    this.buttonNewGame.addClasses([styles$1.pointerEvents, styles$1.disabled]);
    this.buttonNewGame.setAttributes({ disabled: 'disabled' });
    this.buttonRestart.setAttributes({ disabled: 'disabled' });
    this.keyboard.isGaming = false;
    this.keyboard.disabledKeyReal();
  }

  enabledInteraction() {
    this.buttonNewGame.removeClasses([styles$1.pointerEvents, styles$1.disabled]);
    if (this.replicability >= 1) {
      this.buttonRestart.removeAttributes(['disabled']);
      this.buttonRestart.removeClasses([styles$1.pointerEvents, styles$1.disabled]);
    }
    this.buttonNewGame.removeAttributes(['disabled']);
    this.keyboard.isGaming = true;
    this.keyboard.disabledKeyReal();
  }

  repeatSequence() {
    if (this.replicability <= 0) return;
    this.replicability -= 1;
    this.disableInteraction();
    this.inputSequence.setInnerText('');
    this.inputSequence.toggleClass(styles$1.error, false);
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => this.enabledInteraction());
  }

  newGame() {
    this.inputSequence.setInnerText('');
    this.inputSequence.toggleClass(styles$1.error, false);
    this.incorrectAttempt = 1;
    this.roundNumber = 1;
    this.replicability = 1;
    this.currentRound.setInnerHTML(`0${this.roundNumber}`);
    this.switchChildren(this.roundBlock, this.selectLevel);
    this.switchChildren(this.gameButtons, this.buttonStart);
    this.disableInteraction();
    this.selectLevel.append(this.selectLevel.pseudo);
    this.keyboard.downButtons();
  }
}

const root$1 = "_root_1an27_1";
const styles = {
	root: root$1
};

class Root extends BaseElement {
  constructor() {
    super('div', [styles.root]);

    const keyboard = new Keyboard();
    const playWindow = new PlayWindow(keyboard);

    this.append(playWindow, keyboard);
  }

  init() {
    this.appendTo(document.body);
  }
}

const root = new Root();
root.init();
//# sourceMappingURL=index-BGtTDWKp.js.map
