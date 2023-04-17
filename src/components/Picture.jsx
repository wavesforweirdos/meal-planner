import React from "react";
import { useDrag } from "react-dnd/dist";

function Picture({ id, url }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "image",
    item: {id: id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <img
      ref={dragRef}
      id={id}
      src={url}
      style={{ opacity: isDragging ? "50%" : "100%" }}
    />
  );
}

export default Picture;
