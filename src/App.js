import React, { PureComponent } from 'react';
import './App.css';

import Counter from './Counter/Counter'
import Swan from './Swan/Swan'
import Explainer from './Explainer/Explainer'

const BLACK_SWAN_OCCURRENCE_RATIO = 0.005 // 1 out of 200 swans are black

const MIN_TIME_TRAVEL_DELAY = 5 // Minimum delay between spawning swans during time travel mode, in ms

const SWAN_IMAGE_WIDTH = 100
const SWAN_IMAGE_HEIGHT = 60

const EMPTY_HEADER_HEIGHT = 180

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class App extends PureComponent {

  state = {
    swans: [],
    count: 0,
    currentTimeTravelTimeout: 200,
    hasFoundBlackSwan: false
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyboardEvents, false)
  }

  handleKeyboardEvents = (event) => {
    if (event.keyCode === 32) {
      // SPACE bar
      this.spawnNewSwan()
    } else if (event.keyCode === 84) {
      // T key
      this.timeTravel()
    }
  }

  spawnNewSwan = () => {
    if (!this.state.hasFoundBlackSwan) {
      const swanType = Math.random() <= BLACK_SWAN_OCCURRENCE_RATIO ? 'black' : 'white'

      const randomPositionTop = EMPTY_HEADER_HEIGHT + Math.floor(Math.random() * (window.innerHeight - SWAN_IMAGE_HEIGHT - EMPTY_HEADER_HEIGHT))
      const randomPositionLeft = Math.floor(Math.random() * (window.innerWidth - SWAN_IMAGE_WIDTH))

      const newSwan = {
        id: guid(),
        type: swanType,
        top: randomPositionTop,
        left: randomPositionLeft,
        zIndex: this.state.count + 5 // Minimum z-index is 5 to ensure the swans are above background elements
      }

      this.setState(prevState => ({
        swans: [...prevState.swans, newSwan],
        count: this.state.count + 1,
        hasFoundBlackSwan: swanType === 'black'
      }))
    }
  }

  timeTravel = () => {
    if (!this.state.hasFoundBlackSwan) {
      this.spawnNewSwan()
      setTimeout(() => {
        // Start by spawning every second, and slowly decrease the timeout, until it spawns 20 swans per second
        if (this.state.currentTimeTravelTimeout > MIN_TIME_TRAVEL_DELAY) this.setState({ currentTimeTravelTimeout: this.state.currentTimeTravelTimeout - MIN_TIME_TRAVEL_DELAY })

        this.timeTravel()
      }, this.state.currentTimeTravelTimeout)
    }
  }

  render() {
    return (
      <div className="App" onClick={() => this.spawnNewSwan()}>
        <Counter count={this.state.count} />

        {this.state.swans.map((swan) =>
          <Swan key={swan.id} {...swan} />
        )}

        <Explainer isOpen={this.state.hasFoundBlackSwan} count={this.state.count} />
      </div>
    )
  }
}

export default App;
