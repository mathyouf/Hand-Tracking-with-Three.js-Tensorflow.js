async function updateTime(lasttime,elapsedseconds){
  let newtime = new Date()
  elapsedseconds += (newtime - lasttime)
  console.log(elapsedseconds)
  return [newtime, elapsedseconds]
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
  while(elapsedseconds<30){
    [lasttime, elapsedseconds] = await updateTime(lasttime,elapsedseconds)
  }
}
main()