import { BaseElement } from '../../common/baseElem.js';
import styles from './gifts.module.scss';
import data from '../../data/gifts.json';
import { Card } from '../card/card.js';

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

    const cardsContainer = new BaseElement('div', [styles.cards]);

    const giftCardAmound = 4;
    cardsContainer.append(...this.createArrCard(giftCardAmound));

    this.append(giftsTitle, giftsDescription, cardsContainer);
  }

  createArrCard(cardAmount) {
    const arrCard = [];

    for (let i = 0; i < cardAmount; i++) {
      arrCard.push(new Card());
    }
    return arrCard;
  }
}
