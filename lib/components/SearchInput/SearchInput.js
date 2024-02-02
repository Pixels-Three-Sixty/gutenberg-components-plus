import { useState, useEffect, useContext } from "react";
import { SearchControl, Spinner, Icon } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import styled from "styled-components";
import { closeSmall, dragHandle } from "@wordpress/icons";
import {
  DndBackendProvider,
  DndBackendContext,
  DragAndDropProvider,
  DragAndDropContext,
} from "../../hooks/DragandDropProvider";

export default function SearchInput({
  value,
  onChange,
  posttypes,
  limit,
  label,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customId, setCustomId] = useState("");
  const { pages, hasResolved } = useSelect(
    (select) => {
      const query = {};

      if (searchTerm) {
        query.search = searchTerm;
      }

      let posts = [];
      let resolved = [];

      posttypes.forEach((postType) => {
        const args = ["postType", postType, query];
        posts.push(select(coreDataStore).getEntityRecords(...args));
        resolved.push(
          select(coreDataStore).hasFinishedResolution("getEntityRecords", args)
        );
      });

      //filter out empty arrays
      posts = posts.filter((item) => item?.length);

      return {
        pages: posts,
        hasResolved: resolved.every((item) => item === true),
      };
    },
    [searchTerm]
  );
  const { hasBackend } = useContext(DndBackendContext) || {};

  useEffect(() => {
    if (!limit) return;

    if (value?.length >= limit) {
      setSearchTerm("");
    }
  }, [searchTerm, value, limit]);

  useEffect(() => {
    setCustomId(Math.random().toString(36).substring(7));
  }, []);

  function handleDragCallback(dragIndex, hoverIndex) {
    const dragItem = value[dragIndex];
    const newItems = [...value];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    onChange(newItems);
  }

  //remove selected values from search results
  let results = pages
    ?.map((pageArray) => {
      return pageArray?.filter((page) => {
        return !value.some((selected) => selected.id === page.id);
      });
    })
    .filter((item) => item?.length);

  const limitReached = limit && value?.length >= limit;

  return (
    <DndBackendProvider hasBackend={hasBackend}>
      <SearchWrapper>
        <Label>{label}</Label>
        <InputWrapper>
          {value?.length > 0 &&
            value.map((item, index) => {
              const id = `${item.type}-${item.id}`;
              return (
                <DragAndDropProvider
                  key={id}
                  index={index}
                  name={customId}
                  dragLabel={item.title}
                  callBack={handleDragCallback}
                >
                  <SelectPages
                    key={item.id}
                    value={value}
                    onChange={onChange}
                    item={item}
                    limit={limit}
                  />
                </DragAndDropProvider>
              );
            })}

          {!limitReached && (
            <>
              <SearchControlStyled
                onChange={setSearchTerm}
                value={searchTerm}
              />

              <PagesList
                hasResolved={hasResolved}
                results={results}
                value={value}
                onChange={onChange}
              />
            </>
          )}
        </InputWrapper>
      </SearchWrapper>
    </DndBackendProvider>
  );
}

function SelectPages({ value, onChange, item, limit }) {
  const { handlerId, isDragging, drag, drop, dragRef, previewRef } =
    useContext(DragAndDropContext);

  const opacity = isDragging ? 0 : 1;

  drag(drop(previewRef));

  const condition = limit > 1 || !limit;

  return (
    <div
      data-handler-id={handlerId}
      ref={previewRef}
      style={{
        opacity,
      }}
    >
      <SelectedItem>
        {condition && (
          <span ref={dragRef}>
            <DragIcon icon={dragHandle} />
          </span>
        )}
        <input type="text" value={item.title} readOnly />
        <Icon
          icon={closeSmall}
          onClick={() => {
            onChange([...value.filter((i) => i.id !== item.id)]);
          }}
        />
      </SelectedItem>
    </div>
  );
}

function PagesList({ hasResolved, value, results, onChange }) {
  if (!hasResolved) {
    return <Spinner />;
  }

  if (!results?.length) {
    return <div>No results</div>;
  }

  function handleClick(val) {
    onChange([...value, val]);
  }

  return (
    <PostsMainWrapper>
      {/* <PostsHeading>Results</PostsHeading> */}
      {results?.map((pageArray, index) => {
        const type = pageArray[0].type;
        return (
          <PostsWrapper key={`${type}-${index}`}>
            <PostsTitle>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </PostsTitle>
            {pageArray?.map((page, index) => {
              const id = page.id;
              return (
                <PostItem
                  key={id}
                  index={index}
                  onClick={() => {
                    handleClick({
                      id: id,
                      type: page.type,
                      title: page.title.rendered,
                    });
                  }}
                >
                  {decodeEntities(page.title.rendered)}
                </PostItem>
              );
            })}
          </PostsWrapper>
        );
      })}
    </PostsMainWrapper>
  );
}

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #949494;
  padding: 10px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: calc(8px);
  padding: 0px;
`;

const SearchControlStyled = styled(SearchControl)`
  margin-bottom: 5px !important;
`;

const PostsMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
`;

const PostsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostsTitle = styled.h2`
  font-size: 16px !important;
  font-weight: bold;
  margin: 0 !important;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  background: white;
`;

const PostItem = styled.div`
  display: flex;
  font-size: 14px;
  padding: 10px;
  margin: 0;
  cursor: pointer;

  &:hover {
    background: #007cba;
    color: white;
  }
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0;
  &:first-child {
    margin-top: 0;
  }
  > input {
    flex: 1;
    border: none;
    padding: 10px;
    outline: none;
    font-size: 14px;
  }
  > svg {
    right: 0;
    position: absolute;
    border: none;
    background: none;
    cursor: pointer;
  }
`;

const DragIcon = styled(Icon)`
  cursor: grab;
`;
