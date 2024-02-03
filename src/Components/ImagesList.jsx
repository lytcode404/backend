import Image from "next/image";
import React, { useMemo } from "react";

const ImagesList = ({ images, setImages }) => {
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => {
      const extension = file.name.split(".").pop();
      return ["jpg", "jpeg", "png", "gif", "bmp"].includes(
        extension.toLowerCase()
      );
    });
    setImages(imageFiles);
  };

  const handleImageDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index);
  };

  const handleImageDrop = (event, dropIndex) => {
    const dragIndex = event.dataTransfer.getData("text/plain");
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    setImages(newImages);
  };

  const MemoizedImage = React.memo(({ index, image }) => {
    return (
      <Image
        src={URL.createObjectURL(image)}
        alt={image.name}
        draggable
        onDragStart={(event) => handleImageDragStart(event, index)}
        onDrop={(event) => handleImageDrop(event, index)}
        onDragOver={(event) => event.preventDefault()}
        width={200}
        height={200}
        className="sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
      />
    );
  });

  const imageComponents = useMemo(
    () =>
      images.map((image, index) => (
        <MemoizedImage key={image.name} index={index} image={image} />
      )),
    [images]
  );

  // Set display name for MemoizedImage component
  MemoizedImage.displayName = "MemoizedImage";

  return (
    <div>
      <h1 className="w-full text-center mb-4 text-3xl capitalize">
        Image Picker
      </h1>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="w-full md:w-auto"
      />
      <div className="flex flex-wrap justify-center items-start mt-6 w-full gap-3">
        {imageComponents}
      </div>
    </div>
  );
};

ImagesList.displayName = "ImagesList"; // Set display name explicitly

export default ImagesList;
