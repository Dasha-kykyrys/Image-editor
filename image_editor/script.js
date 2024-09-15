const fileInput = document.querySelector(".file-img"),

tabsBtn = document.querySelectorAll(".tabs-buttons button"),

BtnInCrop = document.querySelectorAll(".crop button"),

btnDoneResize = document.querySelector(".resize-function button"),
textBoxWidth = document.querySelector(".resize-function .width"),
textBoxHeight = document.querySelector(".resize-function .height"),

sliderBrightnessValue = document.querySelector(".brightness .value"),
sliderBrightness = document.querySelector(".brightness input"),
sliderContrastValue = document.querySelector(".contrast .value"),
sliderContrast = document.querySelector(".contrast input"),
sliderSaturation = document.querySelector(".saturation input"),
sliderSaturationValue = document.querySelector(".saturation .value"),

imageContainer = document.querySelector(".image"),
image = document.querySelector(".image img"),

resetBtn = document.querySelector(".reset"),
chooseBtn = document.querySelector(".choose"),
saveBtn = document.querySelector(".save");

let brightness = 100, contrast = 100, saturation = 100;

const applySliders = () => {
    image.style.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;
}

const saveNewSize = () => {
    newHeight = parseInt(textBoxHeight.value);
    newWidth = parseInt(textBoxWidth.value);
    if (!isNaN(newHeight) && !isNaN(newWidth)) {
        Height = newHeight;
        Width = newWidth;
        image.style.width = newWidth + "px";
        image.style.height = newHeight + "px";
        if ((newHeight != image.naturalHeight) || (newWidth != image.naturalWidth)){
            image.style.objectFit = 'fill';
        }
    } else {
        alert("Please enter valid numbers for height and width.");
        textBoxHeight.value = Height;
        textBoxWidth.value =  Width;
    }
}

const loadImage = (file) => {
    let loadFile = file 
    if(!loadFile) return;

    const allowedTypes = ['image/jpeg', 'image/png']; 

    if (!allowedTypes.includes(loadFile.type)) {
        alert("Invalid file type. Please upload a JPEG or PNG.");
        return; 
    }

    image.src = URL.createObjectURL(loadFile);
    image.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
        reset();
    });
}

tabsBtn.forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        tab.classList.add("active");

        if (tab.id === "settings"){
            document.querySelector(".slider").classList.remove("disable");
            document.querySelector(".add").classList.add("disable");
            document.querySelector(".crop").classList.add("disable");
        }
        else if(tab.id === "crop"){
            document.querySelector(".crop").classList.remove("disable");
            document.querySelector(".slider").classList.add("disable");
            document.querySelector(".add").classList.add("disable");
        }
        else{
            document.querySelector(".add").classList.remove("disable");
            document.querySelector(".slider").classList.add("disable");
            document.querySelector(".crop").classList.add("disable");
        }
    })
})

BtnInCrop.forEach(btnIn => {
    btnIn.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        btnIn.classList.add("active");

        if (btnIn.id === "crop"){
            document.querySelector(".crop-function").classList.remove("disable");
            document.querySelector(".resize-function").classList.add("disable");
        }
        else if (btnIn.id === "resize"){
            document.querySelector(".resize-function").classList.remove("disable");
            document.querySelector(".crop-function").classList.add("disable");
            textBoxHeight.value = newHeight;
            textBoxWidth.value = newWidth;
        }
    })
})

const updateSlider = () => {
    sliderBrightnessValue.innerText = `${sliderBrightness.value}%`;
    sliderContrastValue.innerText = `${sliderContrast.value}%`;
    sliderSaturationValue.innerText = `${sliderSaturation.value}%`;

    brightness = sliderBrightness.value;
    contrast = sliderContrast.value;
    saturation = sliderSaturation.value;
    
    applySliders();
}

const reset = () => {
    sliderBrightness.value = brightness = 100;
    sliderContrast.value = contrast = 100; 
    sliderSaturation.value = saturation = 100;
    sliderBrightnessValue.innerText = `${sliderBrightness.value}%`;
    sliderContrastValue.innerText = `${sliderContrast.value}%`;
    sliderSaturationValue.innerText = `${sliderSaturation.value}%`;
    newHeight = image.naturalHeight; 
    newWidth = image.naturalWidth;
    image.style.width = image.naturalWidth + "px";
    image.style.height = image.naturalHeight + "px";
    textBoxHeight.value = image.naturalHeight;
    textBoxWidth.value = image.naturalWidth;
    image.style.objectFit = 'contain';
    applySliders();
}

const saveImage = () =>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = newWidth;
    canvas.height = newHeight; 

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2,canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();  
}

fileInput.addEventListener("change", () => loadImage(fileInput.files[0]));

sliderBrightness.addEventListener("input", updateSlider);
sliderContrast.addEventListener("input", updateSlider);
sliderSaturation.addEventListener("input", updateSlider);

btnDoneResize.addEventListener("click", saveNewSize);

resetBtn.addEventListener("click", reset);
saveBtn.addEventListener("click", saveImage);
chooseBtn.addEventListener("click", () => fileInput.click());

imageContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; 
});
  
imageContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    loadImage(file);
});

