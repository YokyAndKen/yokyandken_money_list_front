export default [
    {
        selector: "node",
        style: {
            label: "data(name)",
            "font-size": 16,
            // "font-weight": "bold",
            "background-color": "transparent",  //节点背景色
            "border-color": "green", //节点border
            "color": "#fff", //节点文字
            "border-width": 2,
            "text-wrap": "ellipsis",
            "text-max-width": 100,
            // "text-margin-y": 5,
            padding: 3,
            width: 20,
            height: 20,
            "background-fit": "contain",
            "background-size": "80%",
            "background-position": "center",
            "text-valign": "center",
            "text-halign": "center"
        },
    },
    // {
    //     selector: ".path-node",//高亮节点
    //     style: {
    //         // "border-color": "rgba(233, 166, 89, 1)",//节点被选中border
    //         "border-width": 4,
    //     },
    // },
    {
        selector: "edge",
        style: {
            // label: "data(label)",
            "line-color": "#939393",
            "target-arrow-color": "#939393",
            color: "#939393",
            "text-background-color": "#939393",
            "text-border-color": "#939393",
            "line-style": "solid",
            "line-dash-pattern": [3, 3],
            width: 1,
            "font-size": 12,
            "target-arrow-shape": "triangle",
            "target-arrow-fill": "fill",
            "arrow-scale": 0.5,
            "curve-style": "unbundled-bezier",
            "control-point-distances": [40, -40],
            "control-point-weights": [0.250, 0.75]
        },
    },
    {
        selector: ".path-edge", //高亮关系
        style: {
            label: "data(label)",
            'curve-style': 'bezier',
            "line-color": "#fff",
            "target-arrow-color": "#939393",
            color: "#fff",
            "text-background-color": "#939393",
            "text-border-color": "#939393",
            "line-style": "dashed",
            "line-dash-pattern": [3, 3],
            width: 2,
            "font-size": 12,
            "target-arrow-shape": "triangle",
            "target-arrow-fill": "fill",
            "arrow-scale": 0.5,
        },
    },
    {
        selector: ".endpoint",
        style: {
            // "border-width": 0,
            // "border-color": "red",
            width: 40,
            height: 40,
        },
    },
    {
        selector: ".emphsis",
        style: {
            opacity: 0.2,
        },
    },
    {
        selector: ".full_name",
        style: {
          "text-wrap": "wrap",
          "color": "rgba(42, 207, 226, 1)",
        },
    },
    // {
    //     selector: "#0",
    //     style: {
    //         "border-width": 0,
    //         "background-image":
    //             "http://t14.baidu.com/it/u=2311018269,4134181727&fm=224&app=112&f=JPEG?w=298&h=310&s=7043FA1E100052EC60B3EBAE0300702A",
    //     },
    // },
];
