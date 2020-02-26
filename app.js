var pica = pica();
var URL = window.URL || window.webkitURL;

var body = document.querySelector('body');
var sourceImg = document.querySelector('#source');
var canvases = [
  document.querySelector('#c28'),
  document.querySelector('#c56'),
  document.querySelector('#c112'),
  document.querySelector('#c18'),
  document.querySelector('#c36'),
  document.querySelector('#c72'),
];

sourceImg.addEventListener('load', () => {
  canvases.forEach((e) => {
    pica.resize(sourceImg, e, {
      quality: 3,
      alpha: true,
    });
  });
  document.getElementById("downloadTrigger").disabled=false;
});

body.ondragover = (e) => {
  e.preventDefault();
};

body.ondrop = (e) => {
  e.preventDefault();
  console.log(e.dataTransfer.files);
  window.filename = e.dataTransfer.files[0].name;
  sourceImg.src = URL.createObjectURL(e.dataTransfer.files[0]);
};

var downloadAll = () => {
  canvases.forEach((c) => {
      var link = document.createElement('a');
      link.download = c.width + "-" + window.filename;
      link.href = c.toDataURL()
      link.click();
  })
}