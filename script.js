async function updateTime(lasttime,elapsedseconds, fps_div){
  let newtime = new Date()
  let deltaSeconds = (newtime-lasttime)/1000
  let fps = Math.ceil(1.0/deltaSeconds)
  fps = fps>90 ? 90 : fps
  elapsedseconds += deltaSeconds
  fps_div.innerHTML = "fps:" + fps
  return [newtime, elapsedseconds, fps]
}

async function main(){
  const fps_div = document.querySelector('#fps')
  
  // Make hand points
  const points = await makeHandPoints();

  // Get video permissions to begin rendering what's seen in the user camera
  const video = await getVideoPermissions();

  // Load the MediaPipe handpose model.
  const model = await handpose.load();
  
  let elapsedseconds = 0.0
  let lasttime = new Date()
  let fps = 0
  while(elapsedseconds<30){
    const predictions = await model.estimateHands(video);
    const wait = await new Promise((resolve, reject) => {setTimeout(() => {resolve("done");}, 5);});
    [lasttime, elapsedseconds, fps] = await updateTime(lasttime,elapsedseconds, fps_div)
    if(predictions.length>0){
      console.log(predictions)
    }
  }
}
main()