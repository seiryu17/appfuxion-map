import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
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

interface IProps {
  visible: boolean;
  map: IMapState;
  onClose: () => void;
  GetListPlaces: (
    input: string,
    type: GROUP_MAP.LIST_SUGGESTED
  ) => Promise<any>;
  AddHistory: (data: IMap, type: GROUP_MAP.HISTORY) => void;
  ClearListPlaces: (type: GROUP_MAP.LIST_SUGGESTED) => void;
  GetLangLat: (place_id: string) => Promise<any>;
  setZoom: (value: number) => void;
  AddDummyToListPlaces: (list: any, type: GROUP_MAP.LIST_SUGGESTED) => void;
}

const LocationSearchDrawer = (props: IProps) => {
  const {
    visible,
    onClose,
    map,
    GetListPlaces,
    AddHistory,
    ClearListPlaces,
    GetLangLat,
    setZoom,
    AddDummyToListPlaces,
  } = props;
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
        GetListPlaces(
          (searchVal || "").toLowerCase(),
          GROUP_MAP.LIST_SUGGESTED
        ).then((res) => {
          if (res.data)
            setOptions(
              res.data.predictions.map((x: any) => {
                return { value: x.description, key: x.place_id };
              })
            );
        });
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
          <AutoComplete
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
              GetLangLat(option.key),
              setZoom(16)
            )}
            placeholder="Input location here"
          />
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
            onClick={() => (setSearch(t.value), GetLangLat(t.key), onClose())}
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
