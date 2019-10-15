// have each request have how many times it has been requested --> everytime it is requested it gets bumped to be right behind

class QueueClass {
  constructor () {
    this._queue = [];
    // this._count = 0;
    console.log('Queue started');
  }
  enqueue (run, options) {
    // console.log(run)
    // this._count =
    if (
      this.size > 0 &&
      this.existsInQueue(run, [
        ...this._queue,
      ])
    ) {
    } else {
      // console.log(run.route, " doesn't exist in the queue. adding it to the queue")
      run.requests = 1;
      this._queue.push(run);
    }
    console.log(this.pending);
    // console.log(this.queue)
  }
  dequeue () {
    // const {route,promise} =
    // console.log('dequeueing: ',route)
    return this._queue.shift();
  }
  // change this to return the index of the already existing
  existsInQueue (run) {
    let route = run.route;
    let i;
    for (i = 0; i < this._queue.length; i++) {
      if (
        this._queue[i].route.to_city === route.to_city &&
        this._queue[i].route.from_city === route.from_city
      ) {
        // move it higher in position.
        this._queue[i].requests++;
        const index = this.getNewIndexForElement(i);
        this._queue.splice(index, 0, this._queue.splice(i, 1)[0]);
        return true;
      }
    }
    return false;
  }

  getNewIndexForElement (index) {
    let i;
    for (i = index - 1; i >= 0; i--) {
      if (this._queue[i].requests >= this._queue[index].requests) {
        return i;
      }
    }
    return 0;
  }

  get size () {
    return this._queue.length;
  }
  get queue () {
    return this._queue;
  }
}

module.exports = QueueClass;

// const queue = new QueueClass()

// // const getPromise = () =>  new Promise()
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'sea'}})
// queue.enqueue({promise:'', route: {to_city: 'sea', from_city: 'nyc'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'sea', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'nyc'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'sfb'}})
// queue.enqueue({promise:'', route: {to_city: 'sfb', from_city: 'sea'}})
// queue.enqueue({promise:'', route: {to_city: 'aus', from_city: 'sea'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'sfb'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'aus'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'sea'}})
// queue.enqueue({promise:'', route: {to_city: 'lax', from_city: 'sea'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// queue.enqueue({promise:'', route: {to_city: 'nyc', from_city: 'lax'}})
// console.log(queue.queue)

// console.log(queue.existsInQueue({route: {to_city: 'lax', from_city: 'sea'}, promise: ''}, queue.queue))
