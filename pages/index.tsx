import { AutoComplete, Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import GROUP_MAP from "../src/constant/group-map";
import IMap from "../src/interfaces/models/map";
import IMapState from "../src/interfaces/states/map";
import Actions from "../src/store/actions";
import { ReduxState } from "../src/store/reducers";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { SearchOutlined } from "@ant-design/icons";
import LocationSearchDrawer from "../src/component/drawer/location-search";

interface IProps {
  map: IMapState;
  GetListPlaces: (
    input: string,
    type: GROUP_MAP.LIST_SUGGESTED
  ) => Promise<any>;
  AddHistory: (data: IMap, type: GROUP_MAP.HISTORY) => void;
  ClearListPlaces: (type: GROUP_MAP.LIST_SUGGESTED) => void;
  AddDummyToListPlaces: (list: any, type: GROUP_MAP.LIST_SUGGESTED) => void;
  GetLangLat: (place_id: string) => Promise<any>;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Home = (props: IProps) => {
  const {
    map,
    GetListPlaces,
    AddHistory,
    ClearListPlaces,
    GetLangLat,
    AddDummyToListPlaces,
  } = props;

  const [visible, setVisible] = useState(false);
  const [currentloc, setCurrentLoc] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      setCurrentLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  }, []);

  return (
    <>
      <LocationSearchDrawer
        map={map}
        visible={visible}
        GetListPlaces={GetListPlaces}
        AddHistory={AddHistory}
        ClearListPlaces={ClearListPlaces}
        GetLangLat={GetLangLat}
        setZoom={setZoom}
        onClose={() => setVisible(false)}
        AddDummyToListPlaces={AddDummyToListPlaces}
      />
      <Button
        className="button-drawer"
        type="primary"
        size="large"
        onClick={() => setVisible(true)}
        icon={<SearchOutlined />}
      >
        Search Location
      </Button>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_BASE_API || ""}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={(map.data as any) || currentloc}
          zoom={zoom}
          options={{ mapTypeControl: false, streetViewControl: false }}
        >
          <Marker position={(map.data as any) || currentloc} />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  map: state.map,
});

const mapDispatchToProps = (dispatch: any) => ({
  GetListPlaces: (input: string, type: GROUP_MAP.LIST_SUGGESTED) =>
    dispatch(Actions.Map.GetListPlaces(input, type)),
  AddHistory: (data: IMap, type: GROUP_MAP.HISTORY) =>
    dispatch(Actions.Map.AddHistory(data, type)),
  ClearListPlaces: (type: GROUP_MAP.LIST_SUGGESTED) =>
    dispatch(Actions.Map.ClearListPlaces(type)),
  AddDummyToListPlaces: (list: any, type: GROUP_MAP.LIST_SUGGESTED) =>
    dispatch(Actions.Map.AddDummyToListPlaces(list, type)),
  GetLangLat: (place_id: string) => dispatch(Actions.Map.GetLangLat(place_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
