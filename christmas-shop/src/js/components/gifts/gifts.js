import { BaseElement } from '../../common/baseElem.js';
import styles from './gifts.module.scss';
import data from '../../data/gifts.json';
import { Card } from '../card/card.js';
import { PopUp } from '../popUp/popUp.js';

export class GiftsElement extends BaseElement {
  constructor() {
    super('section', [styles.giftsSection], { id: 'gifts' });

    const giftsTitle = new BaseElement(
      'h2',
      [styles.giftsTitle],
      {},
      'Best Gifts',
    );
    const giftsDescription = new BaseElement(
      'p',
      [styles.giftsDescription],
      {},
      'especially for you',
    );

    this.cardsContainer = new BaseElement('div', [styles.cards]);

    this.cardsArray = this.createArrCard();
    this.cardsContainer.append(...this.cardsArray);

    const popUp = new PopUp();
    this.cardsArray.forEach((card) =>
      card.addEventListener('click', () => {
        popUp.createPopUp(card);
      }),
    );

    this.append(giftsTitle, giftsDescription, this.cardsContainer);
  }

  getRandomData() {
    const giftCardAmound = 4;
    const setIdxs = new Set();
    while (setIdxs.size < giftCardAmound) {
      const randomCard = data.indexOf(this.getRandomElem(data));
      setIdxs.add(randomCard);
    }
    return setIdxs;
  }

  createArrCard() {
    const arrCard = [];

    const cardAmount = 4;
    this.ArrayFromSet = Array.from(this.getRandomData());

    for (let i = 0; i < cardAmount; i++) {
      this.curCard = new Card();

      this.cardJSON = data[this.ArrayFromSet[i]];
      arrCard.push(this.curCard.createCard(this.cardJSON));
    }
    return arrCard;
  }
}
