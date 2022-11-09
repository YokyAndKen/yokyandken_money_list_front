// clickFlag 为true时，返回click事件回调
let handleObj = {
  clickFlag: true,
  timer: null,
  fn: null,
  params: null,
  cy: null,
  position: null
}

export function addClickEvents(cy, findPathHandler) {
  cy.on("click", (ev) => {
    if (ev.target._private && ev.target._private.container) {
      findPathHandler([]);
    } else if (ev.target.isNode()) {
      findPathHandler([ev.target.id()]);
    } else if (ev.target.isEdge()) {
      findPathHandler([ev.target.source().id(), ev.target.target().id()]);
    }
  });
}


export function addEvents(cy, callback) {
  cy.on("click", async (ev) => {
    handleObj.fn = callback
    handleObj.clickFlag = false
    handleObj.timer = setTimeout(() => {
      handleObj.clickFlag = true
    }, 300)
    handleObj.params = ev.target
    handleObj.cy = cy
    // const res = await import(`/@/store/index`)
    // res.store.dispatch('createModel/SELECT_GRAPH_OBJ_ACTION', {id: ev.target._private.data.id, type: ev.target._private.group})
  })
}

export function dbclickEvents(cy, callback) {
  cy.on('dblclick', ev => {
    if (handleObj.timer) {
      for (let i = 0; i < 1000; i++) {
        clearTimeout(i)
      }
    }
    callback(ev.target._private.data)
  })
}

export function mouseoverEvents(cy, callback) {
  cy.on('tapdragover', ev => {
    if(ev.target._private.group === 'nodes') {
      handleObj.fn = callback
      handleObj.clickFlag = false
      handleObj.timer = setTimeout(() => {
        handleObj.clickFlag = true
      }, 300)
      handleObj.params = ev.target
      handleObj.cy = cy   
    }
  })
}

export function mouseoutEvents(cy, callback) {
  cy.on('tapdragout', ev => {
    if(ev.target._private.group === 'nodes') {
      handleObj.fn = callback
      handleObj.clickFlag = false
      // handleObj.timer = setTimeout(() => {
        handleObj.clickFlag = true
      // }, 300)
      handleObj.params = ev.target
      handleObj.cy = cy   
    }
  })
}

Object.defineProperty(handleObj, 'clickFlag', {
  get: function () {
    return this.clickFlag
  },
  set: function (value) {
    if (value) {
      if (handleObj.params._private && handleObj.params._private.container) {
        handleObj.fn([], handleObj.cy);
      } else if (handleObj.params.isNode()) {
        handleObj.fn([handleObj.params.id()], handleObj.cy);
      } else if (handleObj.params.isEdge()) {
        handleObj.fn([handleObj.params.source().id(), handleObj.params.target().id()], handleObj.cy, handleObj.params);
      }
    }
    return
  }
})
