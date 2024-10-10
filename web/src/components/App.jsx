
import { debugData } from "../utils/debugData";
import { useEffect, useState } from 'react';
import './App.css';
import Home from './Pages/Home'; // Import pages
import WorldEditor from './Pages/Worldeditor';
import PropTools from './Pages/PropTools';
import PedSpawner from './Pages/PedSpawner';
import Logo from '../components/assets/logo.svg'
import Interior from './Pages/Interior';
import { useNuiEvent } from "../hooks/useNuiEvent";

debugData([
	{
		action: "setVisible",
		data: true,
	},
]);

function App() {
  const [activeComponent, setActiveComponent] = useState('home');
    const [presetData, setPresetData] = useState([]);
    const [updateObject, setUpdateObject] = useState([]);
    const [interiorId, setInteriorId] = useState(null);
    const [dataInterior, setDataInterior] = useState(null);
    const [dataTimeCycle, setDataTimeCycle] = useState(null);

    useNuiEvent('getPreset', (data) => {
        setPresetData(data.preset || []);
    });

    useNuiEvent('updateObject', (data) => {
        setUpdateObject(data)
    })

    useNuiEvent('setDataInterior', (data) => {
      setDataInterior(data)
    })

    useNuiEvent('setInitInterior', (data) => {
      setInteriorId(data.interiorId)
    })

    useNuiEvent('timeCycles',(data) => {
      setDataTimeCycle(data)
    })
    

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <Home />;
      case 'worldEditor':
        return <WorldEditor presetData={presetData} updateObject={updateObject} />; 
      case 'propTools':
        return <PropTools />;
      case 'pedSpawner':
        return <PedSpawner />;
	  case 'interiorDebugger':
	      return <Interior interiorId={interiorId} dataInterior={dataInterior} dataTimeCycle={dataTimeCycle} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <img className="logo" src={Logo} alt="Logo" />
     	<div className="header-left">
        	<h1>17 MOVEMENT</h1>
        	<p>Development tool</p>
      	</div>
		<div className="link-contact">
			<i class="fa-solid fa-globe"></i>
			<i class="fa-brands fa-discord"></i>
		</div>
      </div>
      <nav>
        <ul>
          <li onClick={() => setActiveComponent('home')}>
            <i className="fa-solid fa-house"></i> {/* Home */}
          </li>
          <li onClick={() => setActiveComponent('propTools')}>
            <i className="fa-solid fa-screwdriver-wrench"></i> {/* Prop Tools */}
          </li>
          <li onClick={() => setActiveComponent('worldEditor')}>
            <i className="fa-solid fa-globe"></i> {/* World Editor */}
          </li>
          <li onClick={() => setActiveComponent('interiorDebugger')}>
            <i className="fa-solid fa-couch"></i> {/* Interior Debugger */}
          </li>
          <li onClick={() => setActiveComponent('pedSpawner')}>
            <i className="fa-solid fa-person"></i> {/* Ped Spawner */}
          </li>
        </ul>
      </nav>
      <div className="content">
        {renderComponent()} {/* Dynamically render components */}
      </div>
    </div>
  );
}


export default App;