import {
  PanelRow,
  SelectControl,
  TextControl,
  Flex,
  FlexBlock,
} from "@wordpress/components";
import SearchInput from "../SearchInput/SearchInput";

export const CtalinkType = {
  label: "Link",
  value: "link",
  component: CtalinkComponent,
};

export const CtaHubspotType = {
  label: "Hubspot popup",
  value: "hubspot",
  component: CtaHubspotComponent,
};

export const CtaVideoType = {
  label: "Video popup",
  value: "video",
  component: CtaVideoComponent,
};

export const CtaSearchType = {
  label: "Search page link",
  value: "search",
  component: CtaSearchComponent,
};

function CtalinkComponent({ value, onChange, label }) {
  return (
    <>
      <FlexBlock>
        <TextControl
          label={`${label} label`}
          value={value?.label || ""}
          onChange={(val) => {
            onChange({
              label: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <TextControl
          label={`${label} URL`}
          value={value?.url || ""}
          onChange={(val) => {
            onChange({
              url: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <SelectControl
          label={`${label} Target`}
          value={value?.target || "_self"}
          onChange={(val) => {
            onChange({
              target: val,
            });
          }}
          options={[
            {
              disabled: true,
              label: "Select an Option",
              value: "",
            },
            {
              label: "Self",
              value: "_self",
            },
            {
              label: "Blank",
              value: "_blank",
            },
          ]}
        />
      </FlexBlock>
    </>
  );
}

function CtaHubspotComponent({ value, onChange, label }) {
  return (
    <>
      <FlexBlock>
        <TextControl
          label={`${label} label`}
          value={value?.label || ""}
          onChange={(val) => {
            onChange({
              label: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <TextControl
          label={`${label} Hubspot Form Heading`}
          value={value?.hubspotformheading || ""}
          onChange={(val) => {
            onChange({
              hubspotformheading: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <TextControl
          label={`${label} Hubspot Id`}
          value={value?.hubspotformid || ""}
          onChange={(val) => {
            onChange({
              hubspotformid: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <TextControl
          label={`${label} Hubspot Submit Button Text`}
          value={value?.hubspotsubmittext || ""}
          onChange={(val) => {
            onChange({
              hubspotsubmittext: val,
            });
          }}
        />
      </FlexBlock>
    </>
  );
}

function CtaVideoComponent({ value, onChange, label }) {
  return (
    <>
      <FlexBlock>
        <TextControl
          label={`${label} label`}
          value={value?.label || ""}
          onChange={(val) => {
            onChange({
              label: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <TextControl
          label={`${label} Video URL`}
          value={value?.videourl || ""}
          onChange={(val) => {
            onChange({
              videourl: val,
            });
          }}
        />
      </FlexBlock>
    </>
  );
}

function CtaSearchComponent({ value, onChange, label, posttypes }) {
  return (
    <>
      <FlexBlock>
        <TextControl
          label={`${label} label`}
          value={value?.label || ""}
          onChange={(val) => {
            onChange({
              label: val,
            });
          }}
        />
      </FlexBlock>
      <FlexBlock>
        <SearchInput
          label={`${label} Page link`}
          value={value?.searchresults || []}
          onChange={(val) => {
            onChange({
              searchresults: val,
            });
          }}
          posttypes={posttypes}
          limit={1}
        />
      </FlexBlock>
    </>
  );
}

export function CtaButton({ onChange, value, types, name, label, posttypes }) {
  let typesSelect = types.map((type) => ({
    label: type.label,
    value: type.value,
  }));

  return (
    <PanelRow>
      <div
        style={{
          flex: 1,
        }}
      >
        <Flex direction="column" expanded={true}>
          {types ? (
            <>
              <FlexBlock>
                <SelectControl
                  label={`${label} Type`}
                  value={value?.type || ""}
                  onChange={(val) => {
                    onChange({
                      ...value,
                      type: val,
                    });
                  }}
                  options={[
                    {
                      disabled: true,
                      label: "Select an Option",
                      value: "",
                    },
                    {
                      label: "None",
                      value: "none",
                    },
                    ...typesSelect,
                  ]}
                />
              </FlexBlock>
              {types.map((type, index) => {
                return type.value === value?.type ? (
                  <type.component
                    key={`${name}-${index}`}
                    label={label}
                    value={value}
                    posttypes={posttypes}
                    onChange={(val) => {
                      onChange({
                        ...value,
                        ...val,
                      });
                    }}
                  />
                ) : null;
              })}
            </>
          ) : (
            <CtalinkComponent value={value} onChange={onChange} />
          )}
        </Flex>
      </div>
    </PanelRow>
  );
}
