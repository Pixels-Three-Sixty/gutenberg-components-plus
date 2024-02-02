import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, ResponsiveWrapper, PanelRow } from "@wordpress/components";
import styled from "styled-components";

export default function MediaUploadwithPreview({
  value,
  onSelect,
  label,
  buttonLabel,
  allowedTypes,
}) {
  return (
    <PanelRow
      style={{
        flex: 1,
      }}
    >
      <ImageMainWrapper>
        {label && <Label>{label}</Label>}
        <ImageWrapper>
          {value?.filename && <Label>Filename: {value?.filename}</Label>}
          {value?.url && (
            <ImageUploadWrapper>
              {value?.image?.src && (
                <ResponsiveWrapper>
                  <img src={value?.image?.src} alt="" />
                </ResponsiveWrapper>
              )}
              {value?.sizes?.full?.url && (
                <ResponsiveWrapper>
                  <img src={value?.sizes?.full?.url} alt="" />
                </ResponsiveWrapper>
              )}
              <ImageButtonWrapper>
                <MediaUploadCheck>
                  <MediaUpload
                    allowedTypes={allowedTypes || ["image"]}
                    onSelect={(val) => {
                      onSelect({
                        sizes: val?.sizes,
                        filename: val?.filename,
                        url: val?.url,
                        image: val?.image,
                      });
                    }}
                    render={({ open }) => (
                      <ImageButtonSmall onClick={open} variant="secondary">
                        Replace
                      </ImageButtonSmall>
                    )}
                  />
                </MediaUploadCheck>
                <ImageButtonSmall
                  variant="secondary"
                  onClick={() => {
                    onSelect(null);
                  }}
                >
                  Remove
                </ImageButtonSmall>
              </ImageButtonWrapper>
            </ImageUploadWrapper>
          )}
          {!value.url && (
            <MediaUploadCheckStyled>
              <MediaUpload
                allowedTypes={allowedTypes || ["image"]}
                onSelect={(val) => {
                  onSelect({
                    sizes: val?.sizes,
                    filename: val?.filename,
                    url: val?.url,
                    image: val?.image,
                  });
                }}
                // value={value}
                render={({ open }) => (
                  <ImageButton onClick={open} variant="secondary">
                    {buttonLabel || "Upload"}
                  </ImageButton>
                )}
              />
            </MediaUploadCheckStyled>
          )}
        </ImageWrapper>
      </ImageMainWrapper>
    </PanelRow>
  );
}

const ImageMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border: 1px solid #949494;
  padding: 10px;
`;

const MediaUploadCheckStyled = styled(MediaUploadCheck)`
  width: 100%;
`;

const ImageUploadWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ImageButtonWrapper = styled.div`
  justify-content: space-between;
  position: absolute;
  width: 100%;
  bottom: 10px;
  display: flex;
  opacity: 0;
  /* disable click */
  pointer-events: none;
  transition: all 0.3s ease-in-out;

  ${ImageUploadWrapper}:hover & {
    opacity: 1;
    pointer-events: all;
  }
`;

const ImageButton = styled(Button)`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  background: white;
  margin: 0;
  transition: all 0.3s ease-in-out;
  background: #f1f1f1 !important;

  &:hover {
    background: #007cba !important;
    color: white;
  }
`;

const ImageButtonSmall = styled(Button)`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  background: white;
  margin-right: 5px;
  margin-left: 5px;
  transition: all 0.3s ease-in-out;
  background: #f1f1f1 !important;

  &:hover {
    background: #007cba !important;
    color: white;
  }
`;
