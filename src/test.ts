function boot() {
  let time = new Date().getTime(); // get your number
  time = 1682315563996;
  const date = new Date(time); // create Date object

  console.log(date.toString());
}

boot();
