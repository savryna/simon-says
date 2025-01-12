import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { getRandomElem } from '../../common/helper.js';
import styles from './playWindow.module.css';
import { Keyboard, KEYBOARD_TYPE } from '../keyboard/keyboard.js';

export class PlayWindow extends BaseElement {
  roundNumber = 1;
  incorrectAttempt = 2;

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
    this.buttonRestart = new BaseElement(
      'button',
      [styles.controlButton, styles.pointerEvents],
      {},
      'RESTART',
    );
    this.buttonNext = new BaseElement('button', [styles.controlButton], {}, 'NEXT');
    this.inputSequence = new BaseElement('p', [styles.inputSequence], {}, ' ');
    this.buttonNewGame = new BaseElement(
      'button',
      [styles.controlButton, styles.pointerEvents],
      {},
      'NEW GAME',
    );
    this.gameButtons = new BaseElement('div', [styles.gameButtons]);
    this.gameButtons.append(this.buttonNewGame, this.inputSequence, this.buttonRestart);

    this.curSequence = '';
    this.append(gameTitle, this.selectLevel, this.buttonStart);
    this.buttonStart.addEventListener('click', () => {
      this.upKeyboard();

      this.keyboard.upButtons();
      // console.log(this.selectLevel.selectLevelSetting);
      // this.keyboard = this.keyboard.drawKeyboard(this.selectLevel.selectLevelSetting);
      this.gameButtons.switchChildren(this.buttonNext, this.buttonRestart);
      this.newSequence();
      this.selectLvlAnimation();
      this.startBtnAnimation();
      // console.log(this.keyboard.isGaming);
      // this.keyboard.isGaming = true;
      // this.keyboard.disabledKeyReal();
      // console.log(this.curSequence);
      // this.keyboard.filterKeyboard(this.selectLevel.selectLevelSetting);
      // console.log(this.selectLevel.currentKeyboard);
    });

    this.keyboard.buttonsElems.forEach((button) =>
      button.addEventListener('click', (event) => {
        this.keyboard.fillInputSequence(
          event,
          this.inputSequence,
          this.selectLevel.selectLevelSetting,
        );
        this.compareInputSequence(this.selectLevel.selectLevelSetting, event);
      }),
    );

    document.addEventListener('keydown', (event) => {
      this.keyboard.fillInputSequence(
        event,
        this.inputSequence,
        this.selectLevel.selectLevelSetting,
      );
      this.compareInputSequence(this.selectLevel.selectLevelSetting, event);
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

      // this.keyboard.drawKeyboard(this.selectLevel.selectLevelSetting);
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

  startBtnAnimation(status = 'active') {
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

    const opacity = new KeyframeEffect(this.buttonStart._elem, [{ opacity: '0' }], {
      delay: 500,
      duration: 300,
      direction: 'normal',
      easing: 'ease-in-out',
    });
    const opacityAnimantion = new Animation(opacity, document.timeline);

    resizeWidthAnimation.play();
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
      .then(() => this.keyboard.disabledKeyReal())
      .then(() => {
        this.buttonNewGame.toggleClass(styles.pointerEvents, false);
        this.buttonRestart.toggleClass(styles.pointerEvents, false);
      });
    // .then(() => this.buttonRestart.toggleClass(styles.pointerEvents, false));

    // if (clickBtn === this.buttonNewGame) {
    //   // if (opacityAnimantion.playState === 'running' || opacityAnimantion.playState === 'pending') {
    //   //   opacityAnimantion.cancel();
    //   // }

    //   // console.log(opacityAnimantion.playState); // Должно быть 'running' или 'pending'

    //   opacityAnimantion.finish();
    //   // return;
  }

  addRoundNumber() {
    this.roundNumber += 1;
    this.currentRound.setInnerText(`0${this.roundNumber}`);
  }

  newSequence() {
    this.curSequence = this.keyboard.createSequence(
      this.roundNumber,
      // 2,
      this.selectLevel.selectLevelSetting,
    );
    console.log(this.curSequence);
  }

  compareInputSequence(keyboardType, event) {
    const curSequence = this.curSequence;
    const userInputSequence = this.inputSequence.getInnerText().toLowerCase();
    const keyArray = KEYBOARD_TYPE[keyboardType];
    console.log(keyArray);

    const buttonLetter = this.keyboard.buttonsLetters.find(
      (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
    );
    console.log(buttonLetter);
    if (!keyArray.flat().includes(buttonLetter)) return;

    for (let i = 0; i < userInputSequence.length; i++) {
      if (!keyArray.flat().includes(userInputSequence[i])) return;
      if (userInputSequence[i - 1] !== curSequence[i - 1]) return;
      // console.log(this.incorrectAttempt);
      // console.log(userInputSequence[i], curSequence[i]);
      if (userInputSequence[i] !== curSequence[i]) {
        this.errorAnimation();
        this.incorrectAttempt -= 1;
        // console.log(userInputSequence[i], curSequence[i]);
        // console.log('error');
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        // if (this.incorrectAttempt <= 0) {
        //   this.buttonRestart.addClasses([styles.pointerEvents, styles.disabled]);
        //   this.keyboard.isGaming = true;
        //   this.keyboard.disabledKeyReal();
        // }
        break;
      }
    }
    if (userInputSequence === curSequence) {
      if (this.roundNumber === 5) {
        // console.log('You win');
        this.buttonRestart.addClasses([styles.disabled, styles.pointerEvents]);
        this.opacityAnimation(this.inputSequence);
        this.inputSequence.setInnerText('You win!');
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
      } else if (this.roundNumber < 5) {
        // console.log('correct');
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        this.gameButtons.switchChildren(this.buttonRestart, this.buttonNext);
        this.opacityAnimation(this.inputSequence);
        this.inputSequence.setInnerText('Cool!');
        return;
      }
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
    this.inputSequence.toggleClass(styles.error, true);
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
    this.inputSequence.toggleClass(styles.error, false);
    this.addRoundNumber();
    this.gameButtons.switchChildren(this.buttonNext, this.buttonRestart);
    this.buttonRestart.toggleClass(styles.disabled, false);
    this.buttonRestart.toggleClass(styles.pointerEvents, false);
    this.inputSequence.setInnerText('');
    this.newSequence();
    this.incorrectAttempt = 2;
    this.buttonNewGame.toggleClass(styles.pointerEvents, true);
    this.buttonRestart.toggleClass(styles.pointerEvents, true);
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => this.toggleGameStatus())
      .then(() => this.keyboard.disabledKeyReal())
      .then(() => {
        this.buttonNewGame.toggleClass(styles.pointerEvents, false);
        this.buttonRestart.toggleClass(styles.pointerEvents, false);
      });
  }

  repeatSequence() {
    this.incorrectAttempt--;
    this.inputSequence.toggleClass(styles.error, false);
    this.buttonNewGame.toggleClass(styles.pointerEvents, true);
    this.buttonRestart.toggleClass(styles.pointerEvents, true);
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => {
        this.buttonNewGame.toggleClass(styles.pointerEvents, false);
        this.buttonRestart.toggleClass(styles.pointerEvents, false);
      });
    this.buttonRestart.addClasses([styles.pointerEvents, styles.disabled]);
    this.inputSequence.setInnerText('');
    this.keyboard.isGaming = true;
    this.keyboard.disabledKeyReal();
  }

  newGame() {
    this.inputSequence.setInnerText('');
    this.inputSequence.toggleClass(styles.error, false);
    this.incorrectAttempt = 2;
    this.roundNumber = 1;
    this.switchChildren(this.roundBlock, this.selectLevel);
    this.switchChildren(this.gameButtons, this.buttonStart);
    this.buttonRestart.toggleClass(styles.disabled, false);
    this.buttonRestart.toggleClass(styles.pointerEvents, false);
    this.selectLevel.append(this.selectLevel.pseudo);
    // this.toggleGameStatus();
    this.keyboard.isGaming = false;
    this.keyboard.disabledKeyReal();
    this.keyboard.downButtons();
  }
}
