import { debugData } from "../utils/debugData";
import React, { Suspense, useRef, useState, useEffect } from "react";
import "./App.css";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { setClipboard } from "../utils/setClipBoard";
import { usePage } from "../providers/PageProvider";
import { ThreeComponent } from "./Modules/ThreeComponent";
import { MenuApps } from "./mainPage/menuapps";
import { isEnvBrowser } from "../utils/misc";
import { Mesh, MathUtils } from "three";
import TextUI from "./Elements/TextUi.jsx";
import Notification from "./Elements/Notification";

debugData([
  {
    action: "setVisible",
    data: true,
  },
  {
    action: "setPage",
    data: "menuapps",
  },
]);

const App: React.FC = () => {
  const [presetData, setPresetData] = useState([]);
  const [updateObject, setUpdateObject] = useState([]);
  const [interiorId, setInteriorId] = useState(null);
  const [dataInterior, setDataInterior] = useState(null);
  const [dataTimeCycle, setDataTimeCycle] = useState(null);
  const [textUIVisible, setTextUIVisible] = useState(false);
  const [textUIMessage, setTextUIMessage] = useState("");
  const { visiblePage, setPage } = usePage();
  const [propCoords, setPropCoords] = useState(null);
  const mesh = useRef<Mesh>(null); // Use null instead of null!
  const [currentEntity, setCurrentEntity] = useState<number>();
  const [pedCoords, setPedCoords] = useState(null);
  const [editorMode, setEditorMode] = useState<
    "translate" | "rotate" | undefined
  >("translate");
  const [coordinates] = useState({
    x: -803.717,
    y: 176.49,
    z: 72.841,
    heading: 213.635,
  });
  const [notification, setNotification] = useState({ message: "" });
  const closeNotification = () => setNotification({ message: "" });

  const showNotification = (message) => {
    setNotification({ message });
  };
  // Handle NUI events
  useNuiEvent("getPreset", (data) => setPresetData(data.preset || []));
  useNuiEvent("updateObject", (data) => setUpdateObject(data));
  useNuiEvent("setPage", (data) => setPage(data));
  useNuiEvent("setDataInterior", (data) => setDataInterior(data || null));
  useNuiEvent("setTextUI", (data) => {
    setTextUIMessage(data.message);
    setTextUIVisible(data.visible);
  });
  useNuiEvent("setInitInterior", (data) => setInteriorId(data.interiorId));
  useNuiEvent("timeCycles", (data) => setDataTimeCycle(data));
  useNuiEvent("setClipBoard", (data) => setClipboard(data));
  useNuiEvent("getCordinate", (data) => {
    coordinates.x = data.x;
    coordinates.y = data.y;
    coordinates.z = data.z;
    coordinates.heading = data.heading;
  });
  useNuiEvent("setCoordProp", (data) => {
    setPropCoords(data);
  });

  useNuiEvent("getPedPosition", (data) => {
    setPedCoords(data);
  });

  useNuiEvent("setNotification", (data) => {
    showNotification(data.message);
  });

  useNuiEvent("setGizmoEntity", (entity: any) => {
    setCurrentEntity(entity.handle);
    mesh.current.position.set(
      entity.position.x,
      entity.position.z,
      -entity.position.y
    );

    mesh.current.rotation.order = "YZX";
    mesh.current.rotation.set(
      MathUtils.degToRad(entity.rotation.x),
      MathUtils.degToRad(entity.rotation.z),
      MathUtils.degToRad(entity.rotation.y)
    );
  });

  const displayPage = () => {
    switch (visiblePage) {
      case "menuapps":
        return (
          <MenuApps
            presetData={presetData}
            updateObject={updateObject}
            dataInterior={dataInterior}
            dataTimeCycle={dataTimeCycle}
            interiorId={interiorId}
            textUIVisible={textUIVisible}
            textUIMessage={textUIMessage}
            coordinates={coordinates}
            setPage={setPage}
            propCoords={propCoords}
            pedCoords={pedCoords}
          />
        );
      case "gizmo":
        return (
          <ThreeComponent
            setPage={setPage}
            mesh={mesh}
            currentEntity={currentEntity}
            editorMode={editorMode}
          />
        );
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: isEnvBrowser()
            ? "url(https://cdn.discordapp.com/attachments/1056145358780121108/1193090103413841950/image.png?ex=65ab72bf&is=6598fdbf&hm=88cbf238b835fd9ef306514ff316a4c68eb6b5ed6cb10bd1671c1256fd4951d4&)"
            : "",
        }}
      >
        {displayPage()}
        {notification.message && (
          <Notification
            message={notification.message}
            onClose={closeNotification}
            duration={10000}
          />
        )}
        <TextUI text={textUIMessage} visible={textUIVisible} />
      </div>
    </>
  );
};

export default App;
