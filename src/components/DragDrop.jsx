import React, { useState } from "react";
import { useDrop } from "react-dnd/dist";
import Picture from "./Picture";

const PictureList = [
  {
    id: 1,
    url: "https://source.unsplash.com/random/200x200?sig=1",
  },
  {
    id: 2,
    url: "https://source.unsplash.com/random/200x200?sig=2",
  },
  {
    id: 3,
    url: "https://source.unsplash.com/random/200x200?sig=3",
  },
];

function DragDrop() {
  const [board, setBoard] = useState([]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) => addImageToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addImageToBoard = (id) => {
    const pictureList = PictureList.filter((picture) => id === picture.id);
    setBoard((board) => [...board, pictureList[0]]);
  };
  return (
    <>
      <div className="Pictures">
        {PictureList.map((picture, index) => {
          return <Picture key={index} url={picture.url} id={picture.id} />;
        })}
      </div>
      <p
        className="Board"
        ref={drop}
        style={{ border: "3px solid pink", width: "300px", height: "300px" }}
      >
        {board.map((picture, index) => {
          return <Picture key={index} url={picture.url} id={picture.id} />;
        })}
      </p>
    </>
  );
}

export default DragDrop;
