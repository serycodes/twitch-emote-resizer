var pica = pica();
var cropper, filename, filetype, refresh = false;
var URL = window.URL || window.webkitURL;

var body = document.querySelector('body');
var sourceImg = document.querySelector('#source');
var croppedImg = document.querySelector('#cropped');
var canvases = [
  document.querySelector('#c28'),
  document.querySelector('#c56'),
  document.querySelector('#c112'),
  document.querySelector('#c18'),
  document.querySelector('#c36'),
  document.querySelector('#c72'),
];

sourceImg.addEventListener('load', () => {
  refresh=true;
  $("#cropModal").modal();
});

$('#cropModal').on('shown.bs.modal', function (e) {
  if(refresh){
    if(cropper)(cropper.destroy())
    cropper = new Cropper(sourceImg, {
      aspectRatio: 1/1,
      viewMode: 1,
      autoCrop: true,
      autoCropArea: 1
    })
    sourceImg.addEventListener('crop', (event) => {
      croppedImg.src = cropper.getCroppedCanvas().toDataURL(filetype)
    });
  }
  refresh=false;
})

croppedImg.addEventListener('load', () => {
  canvases.forEach((e) => {
    pica.resize(croppedImg, e, {
      quality: 3,
      alpha: true,
    });
  });
  document.getElementById("downloadTrigger").hidden=false;
  document.getElementById("recropBtn").hidden=false;
});

body.ondragover = (e) => {
  e.preventDefault();
};

body.ondrop = (e) => {
  e.preventDefault();
  console.log(e.dataTransfer.files);
  filename = e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, "");
  filetype = e.dataTransfer.files[0].type;
  canvases.forEach((c) => {
    c.getContext("2d").clearRect(0,0,c.width,c.height);
  })
  sourceImg.src = URL.createObjectURL(e.dataTransfer.files[0]);
};

var downloadAll = async () => {
  var zip = new JSZip();
  var promises = canvases.map(async (c, id) => {
    var blobData = await new Promise(resolve => c.toBlob(resolve));
    zip.file(c.width + "-" + filename + ".png", blobData)
  })

  await Promise.all(promises);

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, filename + ".zip");
  });

}
