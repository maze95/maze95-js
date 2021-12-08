import "./game/keydrown.min.js" // input

window.playerInput = {
    wDown: false,
    aDown: false,
    sDown: false,
    dDown: false,

    arrowUpDown: false,
    arrowDownDown: false,
    arrowLeftDown: false,
    arrowRightDown: false,

    uniUpDown: false,
    uniDownDown: false,
    uniLeftDown: false,
    uniRightDown: false
}

kd.W.down(()=> {window.playerInput.wDown = true; window.uniUpDown = true})
kd.A.down(()=> {window.playerInput.aDown = true; window.uniLeftDown = true})
kd.S.down(()=> {window.playerInput.sDown = true; window.uniDownDown = true})
kd.D.down(()=> {window.playerInput.dDown = true; window.uniRightDown = true})

kd.UP.down(()=>    {window.playerInput.arrowUpDown = true; window.uniUpDown = true})
kd.LEFT.down(()=>  {window.playerInput.arrowLeftDown = true; window.uniLeftDown = true})
kd.DOWN.down(()=>  {window.playerInput.arrowDownDown = true; window.uniDownDown = true})
kd.RIGHT.down(()=> {window.playerInput.arrowRightDown = true; window.uniRightDown = true})

kd.run(()=>{kd.tick()})