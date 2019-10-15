export default function debug (name, data){
  console.log('=========================');
  console.log('data name : ' + name);
  console.log('=========================');
  console.log(data);
  console.log('=========================');
}
// // Show DOM element
// console.dir();

// // Display the call stack of a function
// console.trace();

// // Track execution time
// console.time('point'); // undefined
// console.timeEnd('point'); // point: 1337.42 ms

// // Count the number of executions
// console.count('foo'); // foo: 1
// console.count('foo'); // foo: 2
// console.countReset('foo'); // undefined
// console.count('foo'); // foo: 1

// // Display a table. Takes an array of objects.
// console.table(array);
