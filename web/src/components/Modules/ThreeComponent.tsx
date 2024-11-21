import { Canvas } from "@react-three/fiber";
import { CameraComponent } from "./CameraComponent";
import { TransformComponent } from "./TransformComponent";

export const ThreeComponent = ({
  setPage,
  mesh, 
  currentEntity,
  editorMode
}) => {


  return (
    <div>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
      >
        <CameraComponent />
        <TransformComponent
          mesh={mesh}
          currentEntity={currentEntity}
          editorMode={editorMode}
        />
      </Canvas>
    </div>
  );
};
