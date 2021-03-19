import React from 'react';
import {
  getMergeSortAnims,
  getQuickSortAnims,
  getHeapSortAnims,
  getBubbleSortAnims,
} from '../SortingAlgorithms/SortingAlgorithms.js';
import './SortingVisualizer.css';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    // Create as many bars as can fit the width of the container without overflow
    for (let i = 0; i < Math.floor((vw * 0.75) / 4); i++) {
      array.push(randomIntFromInterval(5, 1000));
    }

    this.setState({ array });
  }

  mergeSort() {
    const animations = [];

    getMergeSortAnims(
      this.state.array,
      animations,
      0,
      this.state.array.length - 1
    );
    animate(animations);
  }

  quickSort() {
    const animations = [];

    getQuickSortAnims(
      this.state.array,
      animations,
      0,
      this.state.array.length - 1
    );
    animate(animations);
  }

  heapSort() {
    const animations = [];

    getHeapSortAnims(this.state.array, animations);
    animate(animations);
  }

  bubbleSort() {
    const animations = [];

    getBubbleSortAnims(this.state.array, animations);
    animate(animations);
  }

  render() {
    const { array } = this.state;

    return (
      <div>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${(value / Math.max(...array)) * 100}%`,
              }}
            ></div>
          ))}
        </div>
        <div className="button-container">
          <button className="reset-btn" onClick={() => this.resetArray()}>
            Generate New Array
          </button>
          <button className="sort-btn" onClick={() => this.mergeSort()}>
            Merge Sort
          </button>
          <button className="sort-btn" onClick={() => this.quickSort()}>
            Quick Sort
          </button>
          <button className="sort-btn" onClick={() => this.heapSort()}>
            Heap Sort
          </button>
          <button className="sort-btn" onClick={() => this.bubbleSort()}>
            Bubble Sort
          </button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate(animations) {
  const ANIMATION_SPEED = 0;
  const arrayBars = document.querySelectorAll('.array-bar');
  const buttons = document.querySelectorAll('button');

  // Disables buttons until sorting has completed
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  // Counter to clear interval once animation is completed
  let i = 0;

  // Helper function to animate the sorting algorithms
  const call = () => {
    const anim = animations[Math.floor(i / 2)];

    if (i % 2 === 0) {
      // Highlights compared bars
      if (anim.i >= 0) {
        arrayBars[anim.i].style.backgroundColor = 'var(--ff-accent)';
        arrayBars[anim.j].style.backgroundColor = 'var(--ff-accent)';
      }
    } else {
      // Swap bar heights if needed
      if (anim.swap === true && anim.i >= 0) {
        const temp = arrayBars[anim.i].style.height;
        arrayBars[anim.i].style.height = arrayBars[anim.j].style.height;
        arrayBars[anim.j].style.height = temp;
      }

      if (anim.i >= 0) {
        arrayBars[anim.i].style.backgroundColor = 'var(--bg-bars)';
        arrayBars[anim.j].style.backgroundColor = 'var(--bg-bars)';
      }

      // Re-enables buttons after sorting animation has completed
      if (i === animations.length * 2 - 1) {
        buttons.forEach((btn) => {
          btn.disabled = false;
          clearInterval(interval);
        });
      }
    }

    i++;

    // Calls itself again if the animation should be skipped
    if (anim.skip && i < animations.length * 2) {
      call();
    }
  };

  // Continuously calls the animation function frame by frame at
  // intervals of ANIMATION_SPEED ms.
  const interval = setInterval(call, ANIMATION_SPEED);
}
