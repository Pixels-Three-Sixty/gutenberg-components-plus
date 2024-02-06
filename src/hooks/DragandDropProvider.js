import React, { useRef, createContext } from "react";
import { Icon } from "@wordpress/components";
import { dragHandle } from "@wordpress/icons";
import { useDrag, useDrop, DndProvider, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";

export const DndBackendContext = createContext();
export const DragAndDropContext = createContext();

export function CustomDragLayer() {
  // This component creates what renders when you drag an item also restricts the drag of the item to vertical only
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    let { x, y } = currentOffset;
    x = initialOffset.x;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  }

  if (!isDragging) {
    return null;
  }

  return (
    <DragContainer>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <DragItem>
          <Icon icon={dragHandle} />
          <div> {item?.dragLabel || "Dragged Item"}</div>
        </DragItem>
      </div>
    </DragContainer>
  );
}

export function DragAndDropProvider({
  children,
  index,
  callBack,
  name,
  dragLabel,
}) {
  const dragRef = useRef(null);
  const previewRef = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: name,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!previewRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      callBack(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag, preview] = useDrag({
    type: name,
    item: () => {
      return { index, dragLabel };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });
  return (
    <DragAndDropContext.Provider
      value={{
        handlerId,
        isDragging,
        drag,
        drop,
        preview,
        dragRef,
        previewRef,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
}

export function DndBackendProvider({ children, hasBackend }) {
  if (hasBackend) {
    return children;
  }

  return (
    <DndBackendContext.Provider
      value={{
        hasBackend: true,
      }}
    >
      <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </DndBackendContext.Provider>
  );
}

const DragContainer = styled.div`
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 100;
`;

const DragItem = styled.div`
  border: 1px solid #000;
  padding: 10px;
  display: flex;
  align-items: center;
  background: white;
`;
