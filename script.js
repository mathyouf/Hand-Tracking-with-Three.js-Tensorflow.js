async function updateTime(lasttime,elapsedseconds){
  let newtime = new Date()
  let deltaSeconds = (newtime-lasttime)/1000
  let fps = deltaSeconds
  elapsedseconds += deltaSeconds
  return [newtime, elapsedseconds, fps]
}

async function main(){
  // Make hand points
  const points = await makeHandPoints();

  // Get video permissions to begin rendering what's seen in the user camera
  const video = await getVideoPermissions();

  // Load the MediaPipe handpose model.
  const model = await handpose.load();
  
  let elapsedseconds = 0
  let lasttime = new Date()
  let fps = 0
  while(elapsedseconds<30){
    const predictions = await model.estimateHands(video);
    const wait = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 10);
    });
    console.log(predictions.length)
    [lasttime, elapsedseconds, fps] = await updateTime(lasttime,elapsedseconds)
    console.log(fps)
  }
}
main()