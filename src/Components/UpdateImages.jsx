import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const UpdateImages = ({ images, setImages }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; // Dragged outside the droppable area
    }

    const updatedImages = Array.from(images);
    const [movedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, movedImage);

    setImages(updatedImages);
  };

  const handleDelete = (index) => {
    const updatedImages = Array.from(images);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        {images.length > 0 ? (
          <DraggableImageList images={images} onDelete={handleDelete} />
        ) : (
          "No images found"
        )}
      </div>
    </DragDropContext>
  );
};

export default UpdateImages;

const DraggableImage = ({ img, index, onDelete }) => {
  const handleDelete = () => {
    onDelete(index);
  };

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative bg-gray-200 flex justify-center items-center"
        >
          <Image
            height={844}
            width={844}
            src={URL.createObjectURL(img)}
            alt={`Image ${index + 1}`}
            className="w-44 h-44"
          />
          <span className="absolute top-0 left-0 bg-black text-white p-2">
            {index + 1}
          </span>
          <button
            className="absolute top-0 right-0 bg-red-500 text-white p-2"
            onClick={handleDelete}
          >
            X
          </button>
        </div>
      )}
    </Draggable>
  );
};

const DraggableImageList = ({ images, onDelete }) => {
  return (
    <Droppable droppableId="images" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex gap-4"
        >
          {images.map((img, index) => (
            <DraggableImage
              key={index}
              img={img}
              index={index}
              onDelete={onDelete}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
