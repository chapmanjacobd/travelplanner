const PQueue = require('p-queue');
const QueueClass = require('./helpers/QueueClass');

const options = {
  carryoverConcurrencyCount: true,
  interval: 3600, //60 * 60 * 60 (one hour in seconds)
  intervalCap: 300,
  queueClass: QueueClass,
};

let _queue;

function initQueue(callback){
  if (_queue) {
    console.warn('Trying to initialize queue again');
    return null;
  }
  _queue = new PQueue(options);
}

function getQueue(callback){
  if (_queue) {
    return _queue;
  }
  console.warn('No queue - must initialize queue first');
}

module.exports = {
  getQueue: getQueue,
  initQueue: initQueue,
};
