import React, {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Flex, Spinner } from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";
import styled from "styled-components";

function loadingCallback({ callBack, height }) {
  useEffect(() => {
    return () => {
      if (callBack) {
        callBack();
      }
    };
  }, []);
  return (
    <SpinnerWrapper
      justify="center"
      align="center"
      expanded={true}
      height={height}
    >
      <SpinnerStyled />
    </SpinnerWrapper>
  );
}

export default function ServersideRenderWithLoader({
  block,
  attributes,
  callBack,
}) {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (containerRef?.current?.offsetHeight) {
      const height = containerRef?.current?.offsetHeight || 0;
      setHeight(height + "px");
    }
  }, [containerRef?.current?.offsetHeight]);

  const memoizedLoadingCallback = useCallback(() => {
    return loadingCallback({ callBack, height });
  }, [height]);

  return (
    <div ref={containerRef}>
      <ServerSideRender
        LoadingResponsePlaceholder={memoizedLoadingCallback}
        block={block}
        attributes={attributes}
        httpMethod="POST"
      />
    </div>
  );
}

const SpinnerWrapper = styled(Flex)`
  height: ${(props) => props.height || "100%"};
`;

const SpinnerStyled = styled(Spinner)`
  height: calc(4px * 15);
  width: calc(4px * 15);
`;
