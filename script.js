async function makeHandPoints() {
  const scene = document.querySelector("a-scene");
  let handPointNodes = [];
  let handCenter = document.createElement("a-entity");
  handCenter.classList.add("handCenter");
  handCenter.setAttribute("position", "3 0 0");
  // Create each hand point
  for (let i = 0; i < 21; i++) {
    let spherePoint = document.createElement("a-sphere");
    spherePoint.classList.add(i + "fingerPoint");
    spherePoint.setAttribute("radius", 0.15);
    let [x, y, z] = convertTo3D(startingHands[i]);
    spherePoint.setAttribute("position", {
      x: x,
      y: y,
      z: z
    });
    if (5 <= i && i <= 8) {
      spherePoint.setAttribute("color", "blue");
    }
    if (9 <= i && i <= 12) {
      spherePoint.setAttribute("color", "green");
    }
    if (13 <= i && i <= 16) {
      spherePoint.setAttribute("color", "yellow");
    }
    if (17 <= i && i <= 20) {
      spherePoint.setAttribute("color", "red");
    }
    if (i===4){
      spherePoint.setAttribute("radius", 0.135)
    }
    if (i%4 === 0 && i>4){
      spherePoint.setAttribute("radius", 0.1)
    }
    if (i%4 === 3 && i>4){
      spherePoint.setAttribute("radius", 0.12)
    }
    if (i%4 === 2 && i>4){
      spherePoint.setAttribute("radius", 0.13)
    }
    handCenter.appendChild(spherePoint);
    handPointNodes.push(spherePoint);
  }
  scene.appendChild(handCenter);
  return handPointNodes;
}

async function main(){
  // Make hand points
  const points = await makeHandPoints();

  // Get video permissions to begin rendering what's seen in the user camera
  const video = await getVideoPermissions();

  // Load the MediaPipe handpose model.
  const model = await handpose.load();
}
main()