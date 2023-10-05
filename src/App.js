import { useEffect, useState } from 'react';
import { FaSadTear } from 'react-icons/fa'
import { BiSolidHappyHeartEyes } from 'react-icons/bi';

import Card from './components/SingleCard/SingleCard';

import './App.css';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false },
]

const ActionIcon = ({ action, ...props }) => {
  const emojis = {
    "happy": BiSolidHappyHeartEyes,
    "sad": FaSadTear
  }
  const Icon = emojis[action];
  return (<Icon  {...props} />)
}


function App() {
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [timer, setTimer] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [win, setWin] = useState(false);

  // shuffle cards
  const shuffleCards = () => {
    setSeconds(30);
    setWin(false);
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setCards(shuffledCards);
    setTimer(true);
  }

  useEffect(() => {
    let intervalId;
    if (timer) {
      if (seconds > 0) {
        intervalId = setInterval(() => {
          setSeconds(seconds => seconds - 1)
        }, 1000);
      } else {
        setTimer(false);
      }
    } else {
      setWin(() => cards.every((card) => card.matched))
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, seconds])

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  useEffect(() => {
    if (cards.length > 0) {
      if (cards.every(card => card.matched)) {
        setTimer(false);
        setWin(true);
      }
    }
  }, [cards])

  // comparing choices
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards =>
          prevCards.map(card => (
            card.src === choiceTwo.src ? { ...card, matched: true }
              : card)
          )
        )
      }
      setTimeout(() => resetTurn(), 1000);
    }

  }, [choiceTwo, choiceOne])

  // reset choices and increase Turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
  }

  return (
    <div className="App">
      {timer ?
        <div className='new-game'>
          <h3>Time Left: {seconds}</h3>
          <div className='card-grid'>
            {cards.map(card => (
              <Card
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={card === choiceOne || card === choiceTwo || card.matched}
              />
            ))}
          </div>
        </div>
        : (
          <div>
            <h2>Do you have a sharp memory???? Know by clicking button below :P</h2>
            <button onClick={shuffleCards}>New Game</button>
            {cards.length > 0 &&
              <h1 style={{ color: win ? 'green' : 'red' }}>
                <ActionIcon action={win ? 'happy' : 'sad'} size={60} />
                {win ? 'You won' : 'Sorry! Better luck next time'}
              </h1>}
          </div>
        )
      }
    </div>
  );
}

export default App;
