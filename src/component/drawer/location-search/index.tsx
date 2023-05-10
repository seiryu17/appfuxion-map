import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Col,
  Drawer,
  List,
  Radio,
  RadioChangeEvent,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import DUMMY_DATA from "../../../constant/dummy-data";
import GROUP_MAP from "../../../constant/group-map";
import IMap from "../../../interfaces/models/map";
import IMapState from "../../../interfaces/states/map";
import useDebounce from "../../../utils/debounce";
import stringSimilarity from "string-similarity";
import { Autocomplete } from "@react-google-maps/api";
import ILocation from "../../../interfaces/models/location";

interface IProps {
  visible: boolean;
  map: IMapState;
  onClose: () => void;
  AddHistory: (data: IMap, type: GROUP_MAP.HISTORY) => void;
  ClearListPlaces: (type: GROUP_MAP.LIST_SUGGESTED) => void;
  SetLangLat: (location: ILocation) => Promise<any>;
  setZoom: (value: number) => void;
  AddDummyToListPlaces: (list: any, type: GROUP_MAP.LIST_SUGGESTED) => void;
}

const LocationSearchDrawer = (props: IProps) => {
  const {
    visible,
    onClose,
    map,
    AddHistory,
    ClearListPlaces,
    SetLangLat,
    setZoom,
    AddDummyToListPlaces,
  } = props;
  const [autocomplete, setAutocomplete] = useState<any>();
  const [options, setOptions] = useState<IMap[]>(
    map.groupedList[GROUP_MAP.LIST_SUGGESTED]?.list || []
  );
  const [search, setSearch] = useState("");
  const searchVal = useDebounce(search, 500);
  const [valueRadio, setValueRadio] = useState(1);

  const addDummy = () => {
    return (
      AddDummyToListPlaces(DUMMY_DATA, GROUP_MAP.LIST_SUGGESTED),
      setOptions(
        DUMMY_DATA.predictions.map((x: any) => {
          return { value: x.description, key: x.place_id };
        })
      )
    );
  };

  const clearList = () => {
    ClearListPlaces(GROUP_MAP.LIST_SUGGESTED);
    setOptions([]);
  };

  useEffect(() => {
    if (search) {
      if (valueRadio === 1) {
      } else {
        let matches = stringSimilarity.findBestMatch(
          searchVal,
          DUMMY_DATA.predictions.map((x) => x.description.toLowerCase())
        );
        let bestMatches = matches.ratings.filter((x: any) => x.rating > 0.1);
        let data: IMap[] = [];
        bestMatches.map((x) => {
          return DUMMY_DATA.predictions.map((xx) => {
            if (xx.description.toLowerCase() === x.target)
              return data.push({ value: xx.description, key: xx.place_id });
          });
        });
        setOptions(data);
      }
    } else if (search === "" && valueRadio === 1) {
      clearList();
    } else if (search === "" && valueRadio === 2) {
      addDummy();
    }
  }, [searchVal]);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setSearch(""), setValueRadio(e.target.value);
    if (e.target.value === 2) {
      addDummy();
    } else {
      clearList();
    }
  };

  const onLoad = (value: any) => {
    setAutocomplete(value);
  };

  const onPlaceChanged = () => {
    const res = autocomplete.getPlace();

    setSearch(res.formatted_address), onClose();
    (map.list || [])?.filter((x) => x.value === res.formatted_address).length <
      1 &&
      AddHistory(
        {
          key: res.place_id,
          value: res.formatted_address,
          lat: res.geometry.location.lat(),
          lng: res.geometry.location.lng(),
        },
        GROUP_MAP.HISTORY
      ),
      SetLangLat({
        lat: res.geometry.location.lat(),
        lng: res.geometry.location.lng(),
      });
    setZoom(16);
  };

  return (
    <Drawer
      title={
        <>
          <Row style={{ width: "100%" }} justify="space-between">
            <Radio.Group onChange={onChangeRadio} value={valueRadio}>
              <Radio value={1}>API</Radio>
              <Radio value={2}>Fake Static Data</Radio>
            </Radio.Group>
            <CloseOutlined
              className="use-pointer"
              style={{ fontSize: "20px" }}
              onClick={() => onClose()}
            />
          </Row>
          {/* <AutoComplete
            options={options}
            value={search}
            className="autocomplete-textbox"
            style={{ width: "100%", marginTop: 8 }}
            allowClear
            onSearch={(searchText: string) => setSearch(searchText)}
            onSelect={(data, option) => (
              setSearch(data),
              onClose(),
              (map.list || [])?.filter((x) => x.value === data).length < 1 &&
                AddHistory(option, GROUP_MAP.HISTORY),
              SetLangLat(option.key),
              setZoom(16)
            )}
            placeholder="Input location here"
          /> */}
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Input location here"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `100%`,
                marginTop: `10px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
              }}
            />
          </Autocomplete>
        </>
      }
      className="drawer-location-search"
      placement="left"
      closable={false}
      onClose={onClose}
      open={visible}
      key="left"
    >
      <Typography.Title style={{ marginTop: 0 }} level={4}>
        Search History
      </Typography.Title>
      <List
        dataSource={map.groupedList[GROUP_MAP.HISTORY]?.list || []}
        grid={{
          column: 1,
          gutter: 8,
        }}
        renderItem={(t) => (
          <Row
            className="list-item use-pointer"
            onClick={() => (
              setSearch(t.value),
              SetLangLat({
                lat: t.lat || "",
                lng: t.lng || "",
              }),
              onClose()
            )}
            gutter={8}
            wrap={false}
          >
            <Col>
              <ClockCircleOutlined />
            </Col>
            <Col>{t.value}</Col>
          </Row>
        )}
      />
    </Drawer>
  );
};

export default LocationSearchDrawer;
