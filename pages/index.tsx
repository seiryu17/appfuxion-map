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
import ILocation from "../src/interfaces/models/location";
import ILatLng from "../src/interfaces/map-center";

interface IProps {
  map: IMapState;
  GetListPlaces: (
    input: string,
    type: GROUP_MAP.LIST_SUGGESTED
  ) => Promise<any>;
  AddHistory: (data: IMap, type: GROUP_MAP.HISTORY) => void;
  ClearListPlaces: (type: GROUP_MAP.LIST_SUGGESTED) => void;
  SetLangLat: (location: ILocation) => Promise<any>;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Home = (props: IProps) => {
  const { map, AddHistory, ClearListPlaces, SetLangLat } = props;
  const [libraries] = useState<Array<"drawing" | "places" | "geometry">>([
    "places",
  ]);

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
        AddHistory={AddHistory}
        ClearListPlaces={ClearListPlaces}
        SetLangLat={SetLangLat}
        setZoom={setZoom}
        onClose={() => setVisible(false)}
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
      <LoadScript
        libraries={libraries}
        googleMapsApiKey={process.env.NEXT_PUBLIC_BASE_API || ""}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={(map.data as unknown as ILatLng) || currentloc}
          zoom={zoom}
          options={{ mapTypeControl: false, streetViewControl: false }}
        >
          <Marker position={(map.data as unknown as ILatLng) || currentloc} />
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
  SetLangLat: (location: ILocation) =>
    dispatch(Actions.Map.SetLangLat(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
