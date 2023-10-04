import { CSSProperties, useState } from "react";
import { DragStart, DragUpdate } from "react-beautiful-dnd";

export const usePlaceholderStyle = () => {
  const queryAttr = "data-rbd-drag-handle-draggable-id";

  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>();

  const onDragStartOrUpdate = (
    draggedItem: DragStart & Partial<DragUpdate>
  ) => {
    console.log("Drag Start", draggedItem);
    const draggableId = draggedItem.draggableId;
    const destinationIndex = (draggedItem.destination || draggedItem.source)
      .index;
    const droppableId = (draggedItem.destination || draggedItem.source)
      .droppableId;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }

    const targetListElement = document.querySelector(
      `[data-rbd-droppable-id='${droppableId}']`
    );

    const { clientHeight } = draggedDOM;

    if (!targetListElement) {
      return;
    }

    let clientY = 0;

    const isSameDroppable =
      draggedItem.source.droppableId === draggedItem.destination?.droppableId;

    if (destinationIndex > 0) {
      const end =
        destinationIndex > draggedItem.source.index && isSameDroppable
          ? destinationIndex + 1
          : destinationIndex;

      const children = Array.from(targetListElement.children)
        .filter(
          (item) =>
            item !== draggedDOM &&
            item.getAttributeNames().indexOf("data-puck-placeholder") === -1 &&
            item
              .getAttributeNames()
              .indexOf("data-rbd-placeholder-context-id") === -1
        )
        .slice(0, end);

      clientY = children.reduce(
        (total, item) =>
          total +
          item.clientHeight +
          parseInt(window.getComputedStyle(item).marginTop.replace("px", "")) +
          parseInt(
            window.getComputedStyle(item).marginBottom.replace("px", "")
          ),

        0
      );
    }

    setPlaceholderStyle({
      border: "20px dashed purple",
      position: "absolute",
      top: clientY,
      left: 0,
      height: clientHeight,
      width: "100%",
    });
  };

  return { onDragStartOrUpdate, placeholderStyle };
};
