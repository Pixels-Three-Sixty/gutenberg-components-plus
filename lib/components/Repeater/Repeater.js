import React, { createContext, useContext, useEffect, useState } from "react";
import { PanelRow, Button, Flex, FlexItem, Icon } from "@wordpress/components";
import { dragHandle } from "@wordpress/icons";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  DndBackendProvider,
  DndBackendContext,
  DragAndDropProvider,
  DragAndDropContext,
  CustomDragLayer,
} from "../../hooks/DragandDropProvider";
import styled from "styled-components";

export const RepeaterContext = createContext();

function RepeaterItem({
  name,
  values,
  setAttributes,
  children,
  index,
  value,
  duplicate,
  limitReached,
}) {
  const { handlerId, isDragging, drag, drop, preview, dragRef, previewRef } =
    useContext(DragAndDropContext);

  function onChange(val) {
    const newValues = [...values];
    newValues[index] = val;
    setAttributes({
      [name]: newValues,
    });
  }

  function remove() {
    const newValues = [...values];
    newValues.splice(index, 1);
    setAttributes({ [name]: newValues });
  }

  drag(dragRef);
  drop(previewRef);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const opacity = isDragging ? 0 : 1;

  return (
    <RepeaterContext.Provider value={{ value, onChange }}>
      <RepeaterItemWrapper
        data-handler-id={handlerId}
        ref={previewRef}
        style={{
          opacity,
        }}
      >
        <DragAndDeleteRow>
          <span ref={dragRef}>
            <DragIcon icon={dragHandle} />
          </span>
          <div>
            {!limitReached && (
              <Button onClick={() => duplicate(index)}>Duplicate</Button>
            )}
            <TrashButton onClick={remove}>Trash</TrashButton>
          </div>
        </DragAndDeleteRow>
        {React.cloneElement(children)}
      </RepeaterItemWrapper>
    </RepeaterContext.Provider>
  );
}

export function Repeater({
  name,
  defaultValue,
  values,
  setAttributes,
  children,
  addMoreButtonText,
  dragLabel,
  limit,
}) {
  const { hasBackend } = useContext(DndBackendContext) || {};
  const [initialCustomId, setInitialCustomId] = useState("");

  useEffect(() => {
    setInitialCustomId(Math.random().toString(36).substring(7));
  }, []);

  function addMore() {
    const id = Math.random().toString(36);
    const newValues = [...values];
    newValues.push({ ...defaultValue, id });
    setAttributes({ [name]: newValues });
  }

  function duplicate(index) {
    const newValues = [...values];
    const id = Math.random().toString(36);
    newValues.splice(index, 0, { ...newValues[index], id });
    setAttributes({ [name]: newValues });
  }

  function moveRepeaterItem(dragIndex, hoverIndex) {
    const newValues = [...values];
    const draggedItem = newValues[dragIndex];
    newValues.splice(dragIndex, 1);
    newValues.splice(hoverIndex, 0, draggedItem);
    setAttributes({ [name]: newValues });
  }

  const limitReached = limit && values.length >= limit;

  return (
    <DndBackendProvider hasBackend={hasBackend}>
      <CustomDragLayer />
      {(values || []).map((value, index) => {
        const id = value?.id || initialCustomId;
        return (
          <DragAndDropProvider
            key={id}
            index={index}
            name={name}
            dragLabel={dragLabel}
            callBack={moveRepeaterItem}
          >
            <RepeaterItem
              index={index}
              value={value}
              name={name}
              values={values}
              setAttributes={setAttributes}
              children={children}
              duplicate={duplicate}
              limitReached={limitReached}
            />
          </DragAndDropProvider>
        );
      })}
      {!limitReached && (
        <PanelRow>
          <Flex justify="flex-end">
            <FlexItem>
              <Button onClick={addMore} variant="primary">
                {addMoreButtonText}
              </Button>
            </FlexItem>
          </Flex>
        </PanelRow>
      )}
    </DndBackendProvider>
  );
}

const RepeaterItemWrapper = styled.div`
  position: relative;
  padding: 10px;
  border: 1px solid transparent;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 1;
    border: 1px solid #000;
  }
`;

const DragAndDeleteRow = styled(PanelRow)`
  opacity: 0;
  transition: all 0.1s ease-in-out;
  display: flex;

  ${RepeaterItemWrapper}:hover & {
    opacity: 1;
  }
`;

const DragIcon = styled(Icon)`
  cursor: grab;
`;

const TrashButton = styled(Button)`
  color: #dc3232 !important;

  &:hover {
    color: red !important;
  }
`;
