let falses = {}

async function getVideoPermissions() {
  let video = document.querySelector("video");
  if (navigator.mediaDevices.getUserMedia) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      return video;
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

async function renderFingers(predictions, points, lastpredictions, current, scale) {
  if (predictions.length<1){
    predictions = lastpredictions
  }
  // Check if any hand was detected
  if (predictions.length > 0) {
    
    const keypoints = predictions[predictions.length - 1].landmarks
    
    // Check that internal distances are sufficiently correct
    const validHand = await validateHand(keypoints)
    
    // Check if eucDist between lastpredictions and keypoints is sufficiently large
    const change = await eucDist(keypoints[8], current[8])
    if(change > 3 && change < 400 && validHand){
      let lastpred = []
      let newcurrent = []
      // let newScale = await eucDist(convertTo3D(keypoints[0]), convertTo3D(keypoints[1]))
      // Wanted to set scale so that difference between points due to closeness to the camera didn't matter, but it looks bad. To reimplement, uncomment above and add scale/newScale as a second parameter to convertTo3D() below
      points.forEach((point, i) => {
        let [x, y, z] = convertTo3D(keypoints[i])
        let [xlast, ylast, zlast] = lastpredictions[i]
        const xj = lerp(xlast, x)
        const yj = lerp(ylast, y)
        const zj = lerp(zlast, z)
        console.log(xj,yj,zj)
        point.setAttribute("position", {
          x: xj,
          y: yj,
          z: zj
        });    
        lastpred.push([x,y,z])
        newcurrent.push([xj,yj,zj])
      })
      return [lastpred, newcurrent]
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
        
    let [render, newcurrent] = await renderFingers(predictions, points, lastpredictions, current, scale);
    if (predictions.length > 0 && render) {
      lastpredictions = render;
      count++
    }
    current = newcurrent
    const wait = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 10);
    });
    console.log("FPS: ",1000/new Date()-last_loop)
    last_loop = new Date()
  }
}

main();