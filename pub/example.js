const skelly = new AutoSkelly();

function darkTheme() {
  console.log("Dark Theme");
  skelly.changeSkellyColor("#000000");
}

function lightTheme() {
  console.log("Light Theme");
  skelly.changeSkellyColor("#e1e1e1");
}

function submitColor() {
  console.log("Random Color");
  var color = $("#colorField").val();
  skelly.changeSkellyColor(color);
}

function standardAnimation() {
  console.log("Standard Animation");
  skelly.changeSkellyAnimation("standard");
}

function bigPulseAnimation() {
  console.log("Big Pulse Animation");
  skelly.changeSkellyAnimation("bigPulse");
}

function gradientAnimation() {
  console.log("Gradient Animation");
  skelly.changeSkellyAnimation("gradient");
}

function activate() {
  console.log("Activate Autoskelly");
  skelly.activateSkelly(true);
}

function deactivate() {
  console.log("Deactivate Autoskelly");
  skelly.activateSkelly(false);
}
