async function getVideoPermissions() {
  let video = document.querySelector("video");
  if (navigator.mediaDevices.getUserMedia) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.addEventListener('loadeddata', (event) => {
        return video;
      })
    } catch (err) {
      return err;
    }
  }
}

async function makeHandPoints() {
  const scene = document.querySelector("a-scene");
  const handCenter = document.createElement("a-entity");
  let handPointNodes = []
  handCenter.classList.add("handCenter");
  handCenter.setAttribute("position", "3 0 0");
  // Create each hand point
  for (let i = 0; i < 21; i++) {
    let spherePoint = document.createElement("a-sphere");
    let [x, y, z] = convertTo3D(startingHands[i]);
    spherePoint.classList.add(i + "fingerPoint");
    spherePoint.setAttribute("radius", 0.15);
    spherePoint.setAttribute("position", {x: x, y: y, z: z});
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

async function renderFingers(predictions, points, lastpredictions, current) {
  
  // Check if any hand was detected
  if (predictions.length > 0) {
    
    const keypoints = predictions[predictions.length - 1].landmarks
        
    // Check if eucDist between lastpredictions and keypoints is sufficiently large
    const change = await eucDist(keypoints[8], current[8])
    
    if(change > 3 && change < 400){
      points.forEach((point, i) => {
        let [x, y, z] = convertTo3D(keypoints[i])
        point.setAttribute("position", {x: x, y: y, z: z});    
      })
      return true
    }
  } else {
    return false
  }
}

async function main() {
  // Make hand points in A-frame and return Node List as points
  const points = await makeHandPoints();
  console.log('Hand Points Drawn')

  // Get video permissions to begin rendering what's seen in the user camera
  const video = await getVideoPermissions();
  console.log("Video Permissions Obtained")

  // Load the MediaPipe handpose model.
  const model = await handpose.load(detectionConfidence=0.5);
  console.log("Handpose Model Loaded")
  
  // Main Loop: (1) Get new predictions → 
  //            (2) Check if there are new predictions, if not, use last prediction → Proposal: (2B) Have them continue with current velocity until new prediction is given
  //            (3) Transform values to a valid musculo-skeletal structure → 
  //            (4) Correct for position relative to camera, larger pixel spread means it should be projected further into space → 
  //            (5) Lerp between the current position and the new proposed position → 
  //            (6) Render the final position
  
  let count = 0
  let last_loop = new Date()
  while (count < 2111000){
    // (1) Get new predictions
    const predictions = await model.estimateHands(video);
        
    let render = await renderFingers(predictions, points);
    
    if (predictions.length > 0 && render) {
      count++
    }
    const wait = await new Promise((resolve, reject) => {setTimeout(() => {resolve("done");}, 10)});
    console.log("FPS: ",1000/new Date()-last_loop)
    last_loop = new Date()
  }
}

main();