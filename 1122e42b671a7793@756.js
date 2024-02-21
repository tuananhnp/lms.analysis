function _1(md){return(
md`# Color Inspector`
)}

function _imgfile(Inputs){return(
Inputs.file({
  label: "Upload image",
  accept: ".png,.jpg,.bmp,.gif",
  required: true
})
)}

async function _image(imgfile,DOM,$0)
{
  let img = await imgfile.image();
  let aspect = img.width / img.height;
  let height = 480;
  let width = height * aspect;
  let canvas = DOM.canvas(width, height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  ctx.canvas.onmousemove = ctx.canvas.onmousedown = function (event) {
    const color = ctx
      .getImageData(event.offsetX, event.offsetY, 1, 1)
      .data.slice(0, 3);
    if (event.buttons) $0.value = color;
    else {
      ctx.drawImage(img, 0, 0, width, height);
      const [x, y] = [event.offsetX, event.offsetY];
      ctx.fillStyle = `rgb(${color.join(",")})`;
    }
  };
  return canvas;
}


function _sample(pixel,space,spaces,Range,html,Inputs)
{
  let obj = {};
  let rgb = pixel.slice(0, 3);
  let values = space == spaces[0] ? rgb : spaces[0][space.name](pixel);
  let inputs = {};
  for (let i = 0; i < 3; i++) {
    inputs[space.channel[2]] = Range([space.min[i], space.max[i]], {
      label: space.channel[2],
      value: values[2],
      step: 0.1,
      vertical: true,
      className: "Short"
    });
  }
  for (let i = 0; i < 3; i++) {
    inputs[space.channel[1]] = Range([space.min[i], space.max[i]], {
      label: space.channel[1],
      value: values[1],
      step: 0.1,
      vertical: true,
      className: "Medium"
    });
  }
  for (let i = 0; i < 3; i++) {
    inputs[space.channel[0]] = Range([space.min[i], space.max[i]], {
      label: space.channel[0],
      value: values[0],
      step: 0.1,
      vertical: true,
      className: "Long"
    });
  }
  let color = `rgb(${rgb.join(",")})`;
  inputs.color = html`<div></div>`;
  inputs.color.style = `background-color:${color}; display: table-cell; vertical-align:middle; text-align:center;
                 width:50px; height:50px;`;
  return Inputs.form(inputs);
}


function _space(Inputs,spaces){return(
Inputs.select(spaces, {
  label: "Color space",
  format: (obj) =>
    `${obj.name} ${obj.alias ? "(" + obj.alias.join(",") + ")" : ""}`,
  value: spaces[22]
})
)}

function _pixel(){return(
[0,0,0]
)}

function _csp(){return(
import("https://tuananhnp.github.io/lms.analysis/color-space.js")
)}

function _spaces(csp){return(
Object.values(csp.default)
)}

function _Range(htl){return(
function Range(range, options = {}) {
  const [min, max] = range;
  const {
    className = "Range",
    vertical = false,
    label = null,
    format = (x) => +x,
    step = 1,
    value = (min + max) / 2,
    style = "",
    labelStyle = "",
    rangeStyle = "",
    valueStyle = ""
  } = options;
  const rangeWrap = htl.html`<div class=${className} style="${style}"></div>`;
  Object.assign(rangeWrap.style, {
    display: "inline-flex",
    width: "120px",
    height: "180px",
    userSelect: "none"
  });
  const valueDisplay = htl.html`<output style="${valueStyle}">`;
  Object.assign(valueDisplay.style, {
    display: "inline-block",
    visibility: "hidden",
  });
  const rangeInput = htl.html`<input type=range min=${min} max=${max} step=${step} value=${value} style=${rangeStyle}>`;
  Object.assign(rangeInput.style, {
    display: "inline-block"
  });
  if (vertical) {
    rangeInput.setAttribute("orient", "vertical");
    rangeInput.style.writingMode = "bt-lr"; /* IE */
    rangeInput.style["-webkit-appearance"] = "slider-vertical"; /* WebKit */
    rangeInput.style.width = "40px";
  }

  rangeWrap.append(rangeInput, valueDisplay);

  if (label) rangeWrap.prepend(htl.html`<label style=${labelStyle}>${label}`);

  rangeInput.oninput = () => {
    valueDisplay.innerHTML = format(rangeInput.valueAsNumber);
    rangeWrap.value = rangeWrap.valueAsNumber = +rangeInput.valueAsNumber;
    rangeWrap.dispatchEvent(new CustomEvent("input"));
  };

  rangeInput.oninput();
  return rangeWrap;
}
)}

function _customStyles(htl){return(
htl.html`<style>
  .Short {
    color: blue;
     font-family:monospace;
     font-weight:bold;
     font-size: 14pt;
     background:#ffffff;
    margin-top: 10px !important;
    margin-bottom: 40px !important;
  }

  .Short input[type=range] {
     width: 0px;
  }

  .Short label {
     margin-right: -10px;
  }

  .Short output {
    position: absolute;
    margin-top: 30px;
  }

  .Medium {
    color: green;
     font-family:monospace;
     font-weight:bold;
     font-size: 14pt;
     background:#ffffff;
    margin-left: -20px! important;
  }

  .Medium input[type=range] {
     width: 0px;
  }

  .Medium label {
     margin-right: -10px;
  }

  .Medium output {
     position: absolute;
    margin-top: 30px;
  }

  .Long {
    color: red;
     font-family:monospace;
     font-weight:bold;
     font-size: 14pt;
     background:#ffffff;
    margin-left: 10px! important;
  }

  .Long input[type=range] {
     width: 0px; 
  }

  .Long label {
     margin-right: -10px;
  }

  .Long output {
     position: absolute;
    margin-top: 30px;
  }
</style>
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof imgfile")).define("viewof imgfile", ["Inputs"], _imgfile);
  main.variable(observer("imgfile")).define("imgfile", ["Generators", "viewof imgfile"], (G, _) => G.input(_));
  main.variable(observer("image")).define("image", ["imgfile","DOM","mutable pixel"], _image);
  main.variable(observer("sample")).define("sample", ["pixel","space","spaces","Range","html","Inputs"], _sample);
  main.variable(observer("viewof space")).define("viewof space", ["Inputs","spaces"], _space);
  main.variable(observer("space")).define("space", ["Generators", "viewof space"], (G, _) => G.input(_));
  main.define("initial pixel", _pixel);
  main.variable(observer("mutable pixel")).define("mutable pixel", ["Mutable", "initial pixel"], (M, _) => new M(_));
  main.variable(observer("pixel")).define("pixel", ["mutable pixel"], _ => _.generator);
  main.variable(observer("csp")).define("csp", _csp);
  main.variable(observer("spaces")).define("spaces", ["csp"], _spaces);
  main.variable(observer("Range")).define("Range", ["htl"], _Range);
  main.variable(observer("customStyles")).define("customStyles", ["htl"], _customStyles);
  return main;
}
