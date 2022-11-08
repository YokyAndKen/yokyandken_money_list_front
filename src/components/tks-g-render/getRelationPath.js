//当前节点的一度关系
import {resetAllClass} from "./pathView";

// hideClass 是否隐藏其他节点或关系
export function getRelationPath(nodes, cy, hideClass) {
  if (!nodes.length) {
    resetAllClass(cy)
  } else {
    cy.startBatch();
    if (hideClass) {
      cy.elements()
        .removeClass("path-node")
        .removeClass("path-edge")
        .addClass("emphsis");
    } else {
      cy.elements()
        .removeClass("path-node")
        .removeClass("path-edge");
    }
    const node = cy.$(`#${nodes[0]}`)
    node.addClass("path-node").removeClass("emphsis")
    node
      .neighborhood()
      .edges().forEach(edge => {
      if (edge.target().id() === node.id()) {
        edge.source().addClass("path-node").removeClass("emphsis")
      } else {
        edge.target().addClass("path-node").removeClass("emphsis")
      }
      edge.addClass('path-edge').removeClass("emphsis")
    })
    cy.endBatch();
  }
}
