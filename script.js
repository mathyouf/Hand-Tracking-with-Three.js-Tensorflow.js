let startingHands = [
  [
    230.2885514440872,
    436.1604460447347,
    -0.001051478087902069
  ],
  [
    278.83598541179396,
    400.70012484710116,
    -13.00516414642334
  ],
  [
    320.7652451575862,
    361.40150740442914,
    -18.10481834411621
  ],
  [
    356.3430178004998,
    331.7901745232494,
    -22.119184494018555
  ],
  [
    394.6678136623573,
    310.5431389584797,
    -25.580862045288086
  ],
  [
    303.5536497081789,
    297.2775722583725,
    -5.844025611877441
  ],
  [
    339.80732278879964,
    252.02419093485196,
    -7.106975078582764
  ],
  [
    360.279555145004,
    223.3204845989856,
    -8.44462776184082
  ],
  [
    374.8409263074851,
    197.5326901746746,
    -9.845205307006836
  ],
  [
    273.18808948073183,
    287.09665939832917,
    -2.6453874111175537
  ],
  [
    299.15104879814464,
    235.09291593647512,
    -1.740379810333252
  ],
  [
    310.0897962121776,
    200.25243308578263,
    -1.7101948261260986
  ],
  [
    316.0816666646177,
    171.69483628593565,
    -1.2261834144592285
  ],
  [
    242.9014959132235,
    289.99580894319627,
    -1.5424960851669312
  ],
  [
    251.48972072561497,
    245.79256714474593,
    -0.7397280931472778
  ],
  [
    254.17716882166906,
    208.74425795290603,
    0.3707537055015564
  ],
  [
    255.73443965227017,
    176.43860365698538,
    0.9966648817062378
  ],
  [
    212.36553844191351,
    305.0292860595734,
    -2.1612870693206787
  ],
  [
    196.76072015067552,
    274.78001041608206,
    -2.352511405944824
  ],
  [
    182.18326658866843,
    250.31457336377716,
    -2.211714267730713
  ],
  [
    169.1226739961983,
    224.44596638872133,
    -1.8627172708511353
  ]
]

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
  while(count<10){
    //Obtain hand prediction from the MediaPipe graph.
    const predictions = await model.estimateHands(video);
    renderFingers(predictions, points)
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
    let [x, y, z] = startingHands[i]
    spherePoint.setAttribute('position', {x: -x/100, y:(500-y)/100, z:z/50})
    if(5<=i && i<=8){
      spherePoint.setAttribute("color", "blue")
    }
    if(9<=i && i<=12){
      spherePoint.setAttribute("color", "green")
    }
    if(13<=i && i<=16){
      spherePoint.setAttribute("color", "yellow")
    }
    if(17<=i && i<=20){
      spherePoint.setAttribute("color", "red")
    }
    handCenter.appendChild(spherePoint)
    handPointNodes.push(spherePoint)
  }
  scene.appendChild(handCenter)
  return handPointNodes
}

function renderFingers(predictions, points){
  if(predictions.length>0){
    const keypoints = predictions[predictions.length-1].landmarks
    for(let i=0; i<keypoints.length;i++){
      let [x, y, z] = keypoints[i]
      points[i].setAttribute('position', {x: -x/100, y:(500-y)/100, z:z/50})
    }
  }
}
main()