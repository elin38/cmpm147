// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    measure: ["pinches", "teaspoons", "tablespoons", "spoonfuls", "handfuls", "thingies", "ounces", "milliliters"],
    spice: ["salt", "pepper", "garlic powder", "花椒", "🧂", "pixie dust", "white powder", "dirt", "cinnamon", "sesame seeds", "sugar"],
    protein: ["beef", "tofu", "lamb","dragon", "和牛", "chicken", "ostrish", "koala", "catfish", "salmon", "🥩","🥓"],
    greens: ["spinach", "lettuce", "brussel sprouts", "cucumber", "string beans", "kimchi", "🥬", "🥦", "🥦", "seaweed"],
    utensil: ["an axe", "a sword", "a wisk", "a pair of chopsticks", "a spoon", "a club", "a fork", "a battering ram", "your fists", "your finger", "a mace", "someone else's fingers", "magic"],
    chop: ["dice", "chop", "slice", "pound", "quarter", "halve"],
    nation: ["Chinese", "Japanese", "Italian", "French", "British", "American", "Elvish", "Slavic", "Eastern", "Western", "Dwarvish"],
    fruit:["apple", "pineapple", "orange", "guava", "lemon", "devil fruit"],
    drink: ["Domaine de la Romanée-Conti Grand Cru 1945 wine", "water", "milk", "a mana potion", "an Old Fashioned", "champagne", "beer", "$fruit juice"],
    appliance: ["an over", "a microwave", "a convection oven", "a cast iron pan", "a valcano", "Calcifer", "a dragon's mouth", "an air fryer", "🔥"],
    adj: ["delicious", "delectable", "questionable", "mysterious", "delightful", "tasty", "spice-ful", "yummy", "savoury", "fulfilling", "interesting. . . "],
    number: [],
    smallnumber: [],
    diff: ["yes", "Hard", "Easy", "Impossible", "Gordan Ramsay", "Medium"],
    time:["day(s)", "hour(s)", "second(s)", "decasecond(s)", "hectosecond(s)","minute(s)", "moment(s)"],
    bread:["sourdough", "white", "bready", "potato", "rice", "🍞", "fairy", "gluten-free"],
    spread:["evenly onto ", "on the right side of", "on both sides of", "on the left side of", "on the other side of"],
    sauces:["honey mustard", "ranch", "thousand-island", "teriyaki", "ketchup", "mayonnaise"],
    expression:["And Voilà", "There we go", "Good Job", "EYOO", "Poggers", "Yay", "Horray", "👏", "🎉", "Boom"]
  };
  
  //let protein = "";
  
  const template = 
  `Let's make some "authentic" Fantasy $nation cuisine!\n
  <br>
  \n
  Today we will be making some $adj $protein sandwiches with a side of $greens salad.\n
  \n
  Difficulty: $diff | Prep Time: $number $time | Cook Time: $number $time\n
  \n
  1. Start by taking a loaf of $bread bread and slice it in half.\n
  3. Place both halves into $appliance and cook until they are a little crispy.\n
  2. Next, $chop your protein of choice using $utensil and spread it $spread your bread.\n
  3. Sprinkle some $spice (about $smallnumber $measure) and $spice (about $smallnumber $measure) onto your sandwich.\n
  4. Finally take about $smallnumber $measure $sauces and spread it $spread your sandwich.\n
  5. $expression! Your sandwich is complete!\n
  6. Its salad time! Take a large bowl and fill it with the veggie mentioned above.\n
  7. Mix some $sauces sauce into the bowl and mix well using $utensil.\n
  8. Top off your salad with some $spice. And done!\n
  \n
  ⭐ It is recommended to pair this $adj meal with $drink. ⭐
  `;
  
  //fill the array for the "number" fillers with random numbers 
  for (let i = 1; i <= 10; i += 1) {
      fillers["number"].push(Math.floor(Math.random() * (50 - 1) + 1));
  }
  //same as above, just a more limited range
  for (let i = 1; i <= 10; i += 1) {
      fillers["smallnumber"].push(Math.floor(Math.random() * (10 - 1) + 2));
  }
  // STUDENTS: You don't need to edit code below this line.
  
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      // if (fillers[name] === fillers["protein"]) {
      //   protein = options[Math.floor(Math.random() * options.length)];
      //   return protein;
      // } else {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);

  }
  
  /* global clicker */
  $("#clicker").click(generate);

  
  generate();
}

main();