async function getVideoPermissions() {
  let video = document.querySelector('video')
  if (navigator.mediaDevices.getUserMedia) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream;
      return video
    } catch(err) {
      return err
    }
  }
}
async function main() {
  // Make hand points
  const points = await makeHandPoints();
  
  // Get video permissions to begin rendering what's seen in the user camera
  const video = await getVideoPermissions();
  
  // Load the MediaPipe handpose model.
  const model = await handpose.load();
  
  let count = 0
  while(count<100){
    //Obtain hand prediction from the MediaPipe graph.
    let predictions = await model.estimateHands(video);
    console.log(predictions.length)
    if(predictions.length>0){
      const render = await renderFingers(predictions[predictions.length-1], points)
      count++
      }
    }
}

async function makeHandPoints(){
  const scene = document.querySelector('a-scene');
  let handPointNodes = []
  let handCenter = document.createElement('a-entity')
  handCenter.classList.add('handCenter')
  handCenter.setAttribute('position', '3 0 0')
  // Create each hand point
  for (let i = 0; i < 21; i++) {
    let spherePoint = document.createElement('a-sphere')
    spherePoint.classList.add(i+'fingerPoint')
    spherePoint.setAttribute('radius', 0.15)
    handCenter.appendChild(spherePoint)
    handPointNodes.push(spherePoint)
  }
  scene.appendChild(handCenter)
  return handPointNodes
}

async function renderFingers(predictions, points){
  const keypoints = predictions.landmarks
  keypoints.forEach((keypoint, j) => {
    let [x, y, z] = keypoint
    console.log(x,y,z)
    points[j].setAttribute('position', {x: -x/100, y:(500-y)/100, z:z/50})
  })
  return true
}
main()