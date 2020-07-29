/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

function getVideoPermissions(){
  video = document.querySelector('video')
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        main()
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}
async function main() {
  // Load the MediaPipe handpose model.
  const model = await handpose.load();
  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
  // hand prediction from the MediaPipe graph.
  const predictions = await model.estimateHands(video);
  renderFingers(predictions)
  // if (predictions.length > 0) {
    /*
    `predictions` is an array of objects describing each detected hand, for example:
    [
      {
        handInViewConfidence: 1, // The probability of a hand being present.
        boundingBox: { // The bounding box surrounding the hand.
          topLeft: [162.91, -17.42],
          bottomRight: [548.56, 368.23],
        },
        landmarks: [ // The 3D coordinates of each hand landmark.
          [472.52, 298.59, 0.00],
          [412.80, 315.64, -6.18],
          ...
        ],
        annotations: { // Semantic groupings of the `landmarks` coordinates.
          thumb: [
            [412.80, 315.64, -6.18]
            [350.02, 298.38, -7.14],
            ...
          ],
          ...
        }
      }
    ]
    */

//     for (let i = 0; i < predictions.length; i++) {
//       const keypoints = predictions[i].landmarks;

//       // Log hand keypoints.
//       for (let i = 0; i < keypoints.length; i++) {
//         const [x, y, z] = keypoints[i];
//         console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
//       }
//     }
//  }
}

function renderFingers(predictions){
  for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].landmarks;

      // Log hand keypoints.
      for (let i = 0; i < keypoints.length; i++) {
        const [x, y, z] = keypoints[i];
        let spherePoint = document.createElement('a-sphere')
        spherePoint.setAttribute('radius', 0.2)
        scene.appendChild(spherePoint)
        spherePoint.setAttribute('position', {x: x/100, y:y/100, z:z/10})
      }
    }
    main()
}
const scene  = document.querySelector('a-scene')
let video = undefined
getVideoPermissions()