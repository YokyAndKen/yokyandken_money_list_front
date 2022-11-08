// import {Graph, GraphNode, GraphRelationship, RawData} from "./defs";
import { makePy } from './translateZn-En.js'
import md5 from "md5";
export function formatData(data,points) {
    const res = {
        nodes: [],
        edges: [],
    };
    data.nodes.forEach((node) => {
      let labelEn = 'class' + md5(node.label)
      // if (labelEn.charCodeAt() > 255) labelEn = makePy(labelEn)[0].toLowerCase()
        res.nodes.push({
            data: {
                id: node.id + "",
                name: node.name,
                label: node.label,
                properties: node.properties||null,
                endpoint: points.includes(String(node.id)),
                rootId: node.rootId ? node.rootId : ''
            },
            classes: (points.includes(String(node.id)) ? ["endpoint"] : []).concat(labelEn).join(" "),
        });
    });
    data.edges.forEach((edge) => {
        res.edges.push({
            data: {
                source: edge.source + "",
                target: edge.target + "",
                label: edge.label,
                rootId: edge.rootId ? edge.rootId : '',
                properties: {
                    ...edge.properties
                },
            },
        });
    });
    return res;
}
