// Get Random Number up to a max number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  // Create Correct/Incorrect Random Equations
  function createEquations() {
    // Randomly choose how many correct equations there should be
    const correctEquations = getRandomInt(questionAmount);
    // Set amount of wrong equations
    const wrongEquations = questionAmount - correctEquations;
  
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
      firstNumber = getRandomInt(9);
      secondNumber = getRandomInt(9);
      const equationValue = firstNumber * secondNumber;
      const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
      equationObject = { value: equation, evaluated: 'true' };
      equationsArray.push(equationObject);
    }
    // Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
      firstNumber = getRandomInt(9);
      secondNumber = getRandomInt(9);
      const equationValue = firstNumber * secondNumber;
      wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
      wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
      wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
      const formatChoice = getRandomInt(3);
      const equation = wrongFormat[formatChoice];
      equationObject = { value: equation, evaluated: 'false' };
      equationsArray.push(equationObject);
    }
    shuffle(equationsArray);
  }