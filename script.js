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
  while(count<1000){
    //Obtain hand prediction from the MediaPipe graph.
    const predictions = await model.estimateHands(video);
    if(predictions.length>0){
      const render = await renderFingers(predictions[predictions.length-1], points)
    } else {
      const wait = await new Promise((resolve, reject)=>{setTimeout(()=>{resolve('waited')},500)})
    }
    count++
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
  // for (let i = 0; i < predictions.length; i++) {
  const keypoints = predictions.landmarks
  console.log('keypoints', points)
  points.forEach((point, j) => {
    let [x, y, z] = keypoints[j]
    console.log(x,y,z)
    point.setAttribute('position', {x: -x/100, y:(500-y)/100, z:z/50})
  })
  // }
  return true
}
main()