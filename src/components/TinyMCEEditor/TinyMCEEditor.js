import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  PanelRow,
  Flex,
  FlexBlock,
  FlexItem,
  Modal,
  Button,
} from "@wordpress/components";
import styled from "styled-components";

function PopupEditor({ children, isOpen, closeModal, label, value }) {
  return (
    <>
      {!isOpen && children}
      {isOpen && (
        <>
          <EditorPlaceHolder>
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </EditorPlaceHolder>
          <Modal onRequestClose={closeModal} size={"large"}>
            <Label>{label}</Label>
            {children}
            <PanelRow>
              <Flex justify="flex-end">
                <FlexItem>
                  <Button onClick={closeModal} variant="primary">
                    Done
                  </Button>
                </FlexItem>
              </Flex>
            </PanelRow>
          </Modal>
        </>
      )}
    </>
  );
}

export default function TinyMCEEditor({ label, value, onChange }) {
  const [isOpen, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  function toggleModal() {
    setOpen((prev) => !prev);
  }

  function handleChange(content) {
    onChange(content);
  }

  return (
    <>
      <PanelRow>
        <div
          style={{
            flex: 1,
          }}
        >
          <Flex direction="column" expanded={true}>
            <FlexBlock>
              <Label>{label}</Label>
              <PopupEditor
                isOpen={isOpen}
                closeModal={closeModal}
                label={label}
                value={value}
              >
                <TextareaContainer>
                  <Editor
                    value={value}
                    onEditorChange={handleChange}
                    init={{
                      height: 300,
                      menubar: false,
                      setup: function (editor) {
                        editor.addButton("custompopup", {
                          text: "Popup",
                          icon: "fullscreen",
                          onclick: toggleModal,
                        });
                      },
                      plugins: ["lists link paste"],
                      toolbar:
                        "formatselect | alignleft aligncenter alignright alignjustify | " +
                        "bold italic underline | numlist bullist | link | " +
                        "removeformat undo redo | paste pastetext | custompopup ",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </TextareaContainer>
              </PopupEditor>
            </FlexBlock>
          </Flex>
        </div>
      </PanelRow>
    </>
  );
}

const TextareaContainer = styled.div`
  .mce-tinymce {
    border: 1px solid #949494;
    box-shadow: unset;
  }
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 500;
  line-height: 22px;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: calc(8px);
  padding: 0px;
`;

const EditorPlaceHolder = styled.div`
  height: 300px;
  border: 1px solid #949494;
  box-shadow: unset;
  padding: 10px;
  overflow: auto;
  font-size: 14px;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 24px;
  color: #000;
`;
