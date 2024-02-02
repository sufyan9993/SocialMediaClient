import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import {  IconButton, Stack } from "@mui/material";
import {  CheckCircleRounded } from "@mui/icons-material";


function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const CropImage = ({ ratio = (3 / 4), imageFile, setCropData }) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect] = useState(ratio);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function getCropImageData() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );


    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    return formData.get('image')
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        );
      }
    },
    100,
    [completedCrop],
  );
  const handleGetData = async (e) => {
    const cropData = await getCropImageData()
    setCropData(cropData)
    setImgSrc('')

  }

  useEffect(() => {
    function onSelectFile() {
      if (imageFile) {
        setCrop(undefined);
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setImgSrc(reader.result ? reader.result.toString() : "")

        );

        reader.readAsDataURL(imageFile);
      }
    }
    onSelectFile()
  }, [imageFile])

  return !!imgSrc && <Stack sx={{
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '90vh',
    background: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Stack border={'2px solid'} >
      <ReactCrop
        keepSelection={true}
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={setCompletedCrop}
        aspect={aspect}
      >
        <img
          ref={imgRef}
          alt="Crop me"
          src={imgSrc}
          onLoad={onImageLoad}
          style={{ maxHeight: '400px' }}
        />
      </ReactCrop>
    </Stack>
    {!!completedCrop && (
      <canvas
        ref={previewCanvasRef}
        style={{
          display: 'none',
          width: completedCrop.width,
          height: completedCrop.height,
        }}
      />
    )}
    <IconButton onClick={handleGetData} >
      <CheckCircleRounded fontSize='large'/> 
    </IconButton>
  </Stack>
}


export default CropImage;
