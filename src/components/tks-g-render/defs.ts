export interface Graph extends cytoscape.ElementsDefinition {    nodes: GraphNode[];    edges: GraphRelationship[];}export type NodeType = "country" | "person" | "city" | "event";export interface GraphNode extends cytoscape.NodeDefinition {    data: {        id: string;        name: string;        type: NodeType;        endpoint?: boolean;    };}export interface GraphRelationship extends cytoscape.EdgeDefinition {    data: {        source: string;        target: string;        classes?: string[];        data: {            type: string;        };    };}export interface RawData {    nodes: RawNode[];    relationships: RawEdge[];}export interface RawNode {    id: number;    name: string;    type: NodeType;    endpoint?: boolean;}export interface RawEdge {    source: number;    target: number;    data: {        type: string;    };}