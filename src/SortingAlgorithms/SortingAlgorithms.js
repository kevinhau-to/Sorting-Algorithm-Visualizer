// An object containing the relevant information to visualize the sorting.
class Animation {
  constructor(i = -1, j = -1, swap = false, skip = false) {
    this.i = i; // Index of elements to be compared
    this.j = j;

    this.swap = swap; // If the elements need to be swapped
    this.skip = skip; // For any animations that should be skipped
  }
}


/*
  Merge Sort - Recursively splits the array in half until there are
  only single-element arrays then concatenates them in sorted order.

  Time complexity (Worst Case): O(nlogn)
  Time complexity (Average Case): O(nlogn)
*/
export const getMergeSortAnims = (array, animations, start, end) => {
  if (start < end) {
    let mid = Math.floor((start + end) / 2);

    // Sort first and second halves
    getMergeSortAnims(array, animations, start, mid);
    getMergeSortAnims(array, animations, mid + 1, end);
    // Combines and sorts the two halves together
    // merge(array, animations, start, end);
    merge(array, animations, start, mid, end);
  }
};

/*
  Helper function for Merge Sort. Merges two sorted halves into a
  a single sorted array between the start and end indices.

  ***
  Note: This is not the correct implementation of merge sort although
  it was necessary in order for the resulting animation sequence to 
  conform to the in-place sorting of the graphical array bars.
  ***
*/
function merge(array, animations, start, mid, end) {
  let i = start;
  let j = mid + 1;

  while (i <= mid && j <= end) {
    let swap = false;

    if (array[i] < array[j]) {
      animations.push(new Animation(i, j, swap));
      i++;
    } else {
      animations.push(i, j, swap);
      swap = true;

      const temp = array[j];
      let k = j;

      while (k > i) {
        animations.push(new Animation(k, k - 1, swap, true));
        array[k] = array[k - 1];
        k--;
      }

      // animations.push(new Animation(i, i + 1, swap));
      array[i] = temp;
      i++;
      j++;
      mid++;
    }
  }
}


/*
  Quick Sort - Recursively chooses a pivot and moves all values
  greater than it to the right of the pivot and all values lower
  to the left of the pivot.

  Time complexity (Worst Case): O(n^2)
  Time complexity (Average Case): O(nlogn)

  ***
  Note: Choosing pivot using median of three method (not implemented)
  is optimal.
  ***
*/
export const getQuickSortAnims = (array, animations, start, end) => {
  if (start < end) {
    // Sorts and splits the array at the pivot
    const partitionIndex = partition(array, animations, start, end);

    // Recursively sort the left and right sides of the pivot
    getQuickSortAnims(array, animations, start, partitionIndex - 1);
    getQuickSortAnims(array, animations, partitionIndex + 1, end);
  }
};

/*
  Helper function for Quick Sort. Sorts all values below the pivot
  to the left and all values above to the right of the pivot. Returns
  the index of the pivot to begin recursively Quick Sorting the left and
  right sides.

  TODO: Implement median-of-three to optimize sorting distribution.
*/
function partition(array, animations, start, end) {
  const pivotIndex = getPivotIndex(array, start, end);
  const pivotValue = array[pivotIndex];
  array[pivotIndex] = array[end];
  array[end] = pivotValue;

  animations.push(new Animation(pivotIndex, end, true));

  const pivot = array[end];
  let i = start - 1;

  // Swaps all values below the pivot to the start
  for (let j = start; j < end; j++) {
    let swap = false;
    if (array[j] < pivot) {
      swap = true;
      i++;

      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;

      animations.push(new Animation(i, j, swap));

      continue;
    }
    animations.push(new Animation(i, j, swap));
  }

  // Swaps pivot element into its proper position
  const temp = array[i + 1];
  array[i + 1] = array[end];
  array[end] = temp;

  animations.push(new Animation(i + 1, end, true));

  return i + 1;
}

/*
  Helper function for Quick Sort. Selects the first, middle, and
  last elements and finds the median. This method is called the
  median-of-three and makes the assumption that the median of
  three values should be close to the true median and is thus
  more consistent in its partition than the standard method of
  taking the last value in the array.
*/
function getPivotIndex(array, start, end) {
  const candidates = new Map();

  candidates.set(array[start], start);
  candidates.set(array[end], end);
  candidates.set(
    array[Math.floor(array.length / 2)],
    Math.floor(array.length / 2)
  );

  if (start - end > 1) {
    const minCandidate = Math.min(
      array[start],
      array[end],
      array[Math.floor(array.length / 2)]
    );
    const maxCandidate = Math.max(
      array[start],
      array[end],
      array[Math.floor(array.length / 2)]
    );

    candidates.delete(minCandidate);
    candidates.delete(maxCandidate);

    return candidates.values().next().value;
  } else {
    return array[start] < array[end] ? start : end;
  }
}


/*
  Heap Sort - Recursively builds a max heap (root > children) binary
  tree to extract the maximum value. Once extracted, the reamining
  heap will be sorted again through the same method until the entire
  array is sorted.

  Time complexity (Worst Case): O(nlogn)
  Time complexity (Average Case): O(nlogn)
*/
export const getHeapSortAnims = (array, animations) => {
  const size = array.length;

  // Build heap; bottom half of the array are all children as it is a
  // binary tree so we only need to build our heap from the first half.
  for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
    heapify(array, animations, size, i);
  }

  // Extract max value (first element) and replace it with the last
  // element. Everything after the last element is sorted.
  for (let i = size - 1; i >= 0; i--) {
    const x = array[0];
    array[0] = array[i];
    array[i] = x;
    animations.push(new Animation(0, i, true));

    // Restructure remaining heap to satisfy heuristic
    heapify(array, animations, i, 0);
  }
};

function heapify(array, animations, size, i) {
  // Initializes the root and it's children's index in the array
  let root = i;
  // Children are at these indices as a property of binary trees
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && array[left] > array[root]) {
    root = left;
  }
  if (right < size && array[right] > array[root]) {
    root = right;
  }

  // If root has changed, swap it with the largest child
  if (root != i) {
    const temp = array[i];
    array[i] = array[root];
    array[root] = temp;
    animations.push(new Animation(i, root, true));

    // Recursive call to  heapify the sub-tree
    heapify(array, animations, size, root);
  }
}


/*
  Bubble Sort - compares neighbouring values and swaps them if the
  value to the left is larger than the value to the right. This is
  repeated n = array.length times.

  Time complexity (Worst Case): O(n^2)
  Time complexity (Best Case): O(n^2)

  ***
  Note: Small optimization implemented by eliminating already
  sorted elements from being checked more than once.
  ***
*/
export const getBubbleSortAnims = (array, animations) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      let swap = false;

      if (array[j] > array[j + 1]) {
        swap = true;

        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }

      animations.push(new Animation(j, j + 1, swap));
    }
  }
};
