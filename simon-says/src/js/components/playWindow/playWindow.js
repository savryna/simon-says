import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { getRandomElem } from '../../common/helper.js';
import styles from './playWindow.module.css';

export class PlayWindow extends BaseElement {
  roundNumber = 1;

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
    this.currentRound = new BaseElement('span', [styles.round], {}, `0${this.roundNumber}`);
    this.currentLevel = new BaseElement(
      'span',
      [styles.currentLevel],
      {},
      this.selectLevel.selectLevelSetting,
    );
    const amountRounds = new BaseElement('span', [styles.round], {}, '05');
    this.roundBlock.append(this.currentRound, this.currentLevel, amountRounds);

    // input block
    this.buttonRestart = new BaseElement('button', [styles.controlButton], {}, 'RESTART');
    this.buttonNext = new BaseElement('button', [styles.controlButton], {}, 'NEXT');
    this.inputSequence = new BaseElement('p', [styles.inputSequence], {}, ' ');
    this.buttonNewGame = new BaseElement('button', [styles.controlButton], {}, 'NEW GAME');
    this.gameButtons = new BaseElement('div', [styles.gameButtons]);
    this.gameButtons.append(this.buttonNewGame, this.inputSequence, this.buttonRestart);

    this.curSequence = '';
    this.append(gameTitle, this.selectLevel, this.buttonStart);
    this.buttonStart.addEventListener('click', () => {
      this.upKeyboard();
      this.keyboard.upButtons();
      // console.log(this.selectLevel.selectLevelSetting);
      // this.keyboard = this.keyboard.drawKeyboard(this.selectLevel.selectLevelSetting);
      this.selectLvlAnimation();
      this.startBtnAnimation();
      this.newSequence();
      console.log(this.curSequence);
      // this.keyboard.filterKeyboard(this.selectLevel.selectLevelSetting);
      // console.log(this.selectLevel.currentKeyboard);
    });

    document.addEventListener('keydown', (event) => {
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
  }

  toggleGameStatus() {
    if (this.keyboard.isGaming) {
      this.keyboard.isGaming = false;
    } else {
      this.keyboard.isGaming = true;
    }
    // console.log(this.keyboard.isGaming);
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
        this.keyboard.animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence)),
      )
      // .then(() =>
      //   this.keyboard
      //     .animateButtonSequence
      //     // [
      //     //   this.keyboard.keyButtonsObject['2'],
      //     //   this.keyboard.keyButtonsObject['2'],
      //     //   this.keyboard.keyButtonsObject['2'],
      //     //   this.keyboard.keyButtonsObject['2'],
      //     // ],

      //     // this.returnCurrentSequence().sequenceElem,
      //     (),
      // )
      .then(() => this.toggleGameStatus())
      .then(() => this.keyboard.disabledKeyReal());
  }

  addRoundNumber() {
    this.roundNumber += 1;
    this.currentRound.setInnerText(`0${this.roundNumber}`);
    if (this.roundNumber >= 5) {
      console.log('You win');
      this.roundNumber = 0;
    }
  }

  newSequence() {
    this.curSequence = this.keyboard.createSequence(
      this.roundNumber,
      // 2,
      this.selectLevel.selectLevelSetting,
    );
    console.log(this.curSequence);
  }

  compareInputSequence() {
    const curSequence = this.curSequence;
    const userInputSequence = this.inputSequence.getInnerText().toLowerCase();

    for (let i = 0; i < userInputSequence.length; i++) {
      console.log(userInputSequence[i], curSequence[i]);
      if (userInputSequence[i] !== curSequence[i]) {
        console.log(userInputSequence[i], curSequence[i]);
        console.log('error');
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
      }
    }
    if (userInputSequence === curSequence) {
      console.log('correct');
      this.keyboard.isGaming = false;
      this.keyboard.disabledKeyReal();
      this.gameButtons.switchChildren(this.buttonRestart, this.buttonNext);
      return;
    }
    return;
  }

  moveNextRound() {
    this.addRoundNumber();
    this.gameButtons.switchChildren(this.buttonNext, this.buttonRestart);
    this.inputSequence.setInnerText('');
    this.newSequence();
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => this.toggleGameStatus())
      .then(() => this.keyboard.disabledKeyReal());
  }
}
