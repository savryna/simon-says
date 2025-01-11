import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { getRandomElem } from '../../common/helper.js';
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
    this.selectLevel = new SelectLevel(keyboard);

    this.buttonStart = new BaseElement('button', [styles.buttonStart], {}, 'START');

    //round block
    this.roundBlock = new BaseElement('div', [styles.roundBlock]);
    const currentRound = new BaseElement('span', [styles.round], {}, '01');
    this.currentLevel = new BaseElement(
      'span',
      [styles.currentLevel],
      {},
      this.selectLevel.selectLevelSetting,
    );
    const amountRounds = new BaseElement('span', [styles.round], {}, '05');
    this.roundBlock.append(currentRound, this.currentLevel, amountRounds);

    // input block
    this.buttonRestart = new BaseElement('button', [styles.buttonRestart], {}, 'RESTART');
    this.inputSequence = new BaseElement('p', [styles.inputSequence], {}, '8f8s5c');
    this.buttonNewGame = new BaseElement('button', [styles.buttonNew], {}, 'NEW GAME');
    this.gameButtons = new BaseElement('div', [styles.gameButtons]);
    this.gameButtons.append(this.buttonRestart, this.inputSequence, this.buttonNewGame);

    this.append(gameTitle, this.selectLevel, this.buttonStart);
    this.buttonStart.addEventListener('click', () => {
      this.toggleGameStatus();
      this.keyboard.disabledKey();
    });
    this.buttonStart.addEventListener('click', () => {
      // console.log(this.selectLevel.selectLevelSetting);
      // this.keyboard = this.keyboard.drawKeyboard(this.selectLevel.selectLevelSetting);
      this.selectLvlAnimation();
      this.startBtnAnimation();
      // this.keyboard.filterKeyboard(this.selectLevel.selectLevelSetting);
      // console.log(this.selectLevel.currentKeyboard);
    });
  }

  toggleGameStatus() {
    if (this.keyboard.isGaming) {
      this.keyboard.isGaming = false;
    } else {
      this.keyboard.isGaming = true;
    }
    // console.log(this.keyboard.isGaming);
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
      { width: '80%' },
      {
        duration: 1000,
        direction: 'normal',
        easing: 'ease-in-out',
      },
    );
    const resizeWidthAnimation = new Animation(resizeWidth, document.timeline);
    resizeWidthAnimation.play();

    const opacity = new KeyframeEffect(this.buttonStart._elem, [{ opacity: '0' }], {
      delay: 500,
      duration: 300,
      direction: 'normal',
      easing: 'ease-in-out',
    });
    const opacityAnimantion = new Animation(opacity, document.timeline);
    opacityAnimantion.play();
    opacityAnimantion.finished
      .then(() => this.switchChildren(this.buttonStart, this.gameButtons))
      .then(() =>
        this.keyboard.animateButtonSequence(
          // [
          //   this.keyboard.keyButtonsObject['2'],
          //   this.keyboard.keyButtonsObject['2'],
          //   this.keyboard.keyButtonsObject['2'],
          //   this.keyboard.keyButtonsObject['2'],
          // ],

          this.keyboard.createSequence(2, this.selectLevel.selectLevelSetting),
        ),
      );
  }
}
