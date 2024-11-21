import { useEffect, useState } from "react";
import { useVisibility } from "../../providers/VisibilityProvider";
import "../App.css";
import Home from "../Pages/Home";
import WorldEditor from "../Pages/Worldeditor";
import PropTools from "../Pages/PropTools";
import PedSpawner from "../Pages/PedSpawner";
import Interior from "../Pages/Interior";
import home from "../assets/home.svg";
import home2 from "../assets/home2.svg";
import one from "../assets/one.svg";
import seven from "../assets/seven.svg";
import Logo from "../assets/logo.svg";
import tools from "../assets/tools.svg";
import tools2 from "../assets/tools2.svg";
import world from "../assets/world.svg";
import world2 from "../assets/world2.svg";
import ped from "../assets/pedSpawner.svg";
import ped2 from "../assets/pedSpawnColor.svg";
import interior from "../assets/interior.svg";
import interior2 from "../assets/interior2.svg";
import discord from "../assets/discord.svg";
import { fetchNui } from "../../utils/fetchNui";

const NAV_ITEMS = [
  { id: "home", icon: home, iconActive: home2 },
  { id: "propTools", icon: tools, iconActive: tools2 },
  { id: "worldEditor", icon: world, iconActive: world2 },
  { id: "interiorDebugger", icon: interior, iconActive: interior2 },
  { id: "pedSpawner", icon: ped2, iconActive: ped },
];

export const MenuApps = ({
  presetData,
  updateObject,
  interiorId,
  dataInterior,
  dataTimeCycle,
  coordinates,
  propCoords,
  pedCoords,
}) => {
  const [activeComponent, setActiveComponent] = useState(
    () => localStorage.getItem("activeComponent") || "home"
  );
  const { visible, setVisible, isGizmoActive } = useVisibility();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && visible && !isGizmoActive) {
        setVisible(false);
        fetchNui("hideFrame");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [visible, isGizmoActive, setVisible]);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <Home coordinates={coordinates} />;
      case "worldEditor":
        return <WorldEditor presetData={presetData} updateObject={updateObject} />;
      case "propTools":
        return <PropTools propCoords={propCoords} />;
      case "pedSpawner":
        return <PedSpawner pedCoords={pedCoords} />;
      case "interiorDebugger":
        return (
          <Interior
            interiorId={interiorId}
            dataInterior={dataInterior}
            dataTimeCycle={dataTimeCycle}
          />
        );
      default:
        return <Home />;
    }
  };

  if (!visible) return null;

  const renderNavItem = (id, icon, iconActive) => (
    <li
      key={id}
      className={activeComponent === id ? "active" : ""}
      onClick={() => setActiveComponent(id)}
    >
      <img src={activeComponent === id ? iconActive : icon} alt="" />
    </li>
  );

  return (
    <div className="container">
      <div className="efek"></div>
      <Header />
      <nav>
        <ul>
          {NAV_ITEMS.map(({ id, icon, iconActive }) => renderNavItem(id, icon, iconActive))}
        </ul>
      </nav>
      <div className="content">{renderComponent()}</div>
    </div>
  );
};

const Header = () => (
  <div className="header">
    <img className="one" src={one} alt="" />
    <img className="seven" src={seven} alt="" />
    <img className="logo" src={Logo} alt="Logo" />
    <div className="header-left">
      <h1>17 MOVEMENT</h1>
      <p>Development tool</p>
    </div>
    <div className="link-contact">
      <img src={world} alt="World" />
      <img src={discord} alt="Discord" />
    </div>
  </div>
);
