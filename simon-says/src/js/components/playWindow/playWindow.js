import { BaseElement } from '../../common/baseElement.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { getRandomElem } from '../../common/helper.js';
import styles from './playWindow.module.css';
import { Keyboard, KEYBOARD_TYPE } from '../keyboard/keyboard.js';

export class PlayWindow extends BaseElement {
  roundNumber = 1;
  replicability = 1;
  incorrectAttempt = 1;

  strLose = 'wah-wah-wah';
  strWinLvl = 'Cool!';
  strWinGame = 'You win!';

  constructor(keyboard) {
    super('div', [styles.playWindow]);

    this.keyboard = keyboard;
    const gameTitle = new BaseElement('h1', [styles.gameTitle], {}, 'Simon Says');

    this.selectLevel = new SelectLevel(keyboard);

    this.buttonStart = new BaseElement('button', [styles.buttonStart], {}, 'START');

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

    this.buttonRestart = new BaseElement(
      'button',
      [styles.controlButton, styles.pointerEvents],
      {},
      'REPEAT',
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
        this.compareInputSequence(this.selectLevel.selectLevelSetting, event);
      }),
    );

    document.addEventListener('keydown', (event) => {
      if (this.incorrectAttempt <= 0 && this.replicability) return;
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

    opacityAnimantion.finished
      .then(() => this.switchChildren(this.buttonStart, this.gameButtons))
      .then(() =>
        this.keyboard.animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence)),
      )
      .then(() => this.enabledInteraction());
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

  compareInputSequence(keyboardType, event) {
    const curSequence = this.curSequence;
    const userInputSequence = this.inputSequence.getInnerText().toLowerCase();
    // let userInputSequenceStr = '';
    // массив массивов
    const keyArray = KEYBOARD_TYPE[keyboardType];

    // кажется мне этот код не нужен, он уже есть в филл
    // const buttonLetter = this.keyboard.buttonsLetters.find(
    //   (letter) => event.code === `Key${letter.toUpperCase()}` || event.key === letter,
    // );
    // if (event.type === 'keydown') {
    //   if (!keyArray.flat().includes(buttonLetter)) {
    //     console.log('not includes');
    //     return;
    //   }
    // }

    for (let i = 0; i < userInputSequence.length; i++) {
      //что оно тут делает?? вроде тоже не надо
      // ПРОЗРЕЛА
      // console.log('flat', keyArray.flat());
      // console.log('input', userInputSequence[i]);
      // if (!keyArray.flat().includes(userInputSequence[i])) {
      //   console.log('wtf');
      //   return;
      // }
      // if (!this.incorrectAttempt && !this.replicability) return;
      // if (this.userInputSequence === this.strLose || this.userInputSequence === this.strWinGame) {
      //   return;
      // }
      if (userInputSequence === this.strLose || userInputSequence === this.strWinGame) {
        return;
      }

      if (userInputSequence[i - 1] !== curSequence[i - 1]) return;

      if (userInputSequence[i] !== curSequence[i]) {
        if (this.incorrectAttempt <= 0 || this.replicability <= 0) {
          this.buttonRestart.toggleClass(styles.pointerEvents, true);
          this.buttonRestart.toggleClass(styles.disabled, true);
          this.buttonRestart.setAttributes({ disabled: 'disabled' });
          this.inputSequence.toggleClass(styles.error, true);

          this.opacityAnimation(this.inputSequence);
          this.inputSequence.setInnerText(this.strLose);
        }

        if (this.inputSequence.getInnerText() && this.incorrectAttempt >= 0) {
          this.errorAnimation();
        }
        this.inputSequence.toggleClass(styles.error, true);

        this.incorrectAttempt -= 1;
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        return;
      }
    }
    if (userInputSequence === curSequence) {
      if (this.roundNumber === 5) {
        this.buttonRestart.addClasses([styles.disabled, styles.pointerEvents]);
        this.opacityAnimation(this.inputSequence);
        this.inputSequence.setInnerText(this.strLose.strWinGame);
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
      } else if (this.roundNumber < 5) {
        this.inputSequence.setInnerText(this.strWinLvl);
        this.keyboard.isGaming = false;
        this.keyboard.disabledKeyReal();
        this.gameButtons.switchChildren(this.buttonRestart, this.buttonNext);
        this.opacityAnimation(this.inputSequence);
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
    this.disableInteraction();
    this.inputSequence.toggleClass(styles.error, false);
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
    this.buttonRestart.addClasses([styles.pointerEvents, styles.disabled]);
    this.buttonNewGame.addClasses([styles.pointerEvents, styles.disabled]);
    this.buttonNewGame.setAttributes({ disabled: 'disabled' });
    this.buttonRestart.setAttributes({ disabled: 'disabled' });
    this.keyboard.isGaming = false;
    this.keyboard.disabledKeyReal();
  }

  enabledInteraction() {
    this.buttonNewGame.removeClasses([styles.pointerEvents, styles.disabled]);
    if (this.replicability >= 1) {
      this.buttonRestart.removeAttributes(['disabled']);
      this.buttonRestart.removeClasses([styles.pointerEvents, styles.disabled]);
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
    this.inputSequence.toggleClass(styles.error, false);
    this.keyboard
      .animateButtonSequence(this.keyboard.buttonElemsSequence(this.curSequence))
      .then(() => this.enabledInteraction());
  }

  newGame() {
    this.inputSequence.setInnerText('');
    this.inputSequence.toggleClass(styles.error, false);
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
