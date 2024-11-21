import { Suspense,useState, useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { fetchNui } from "../../utils/fetchNui";
import { MathUtils } from "three";
import { useVisibility } from "../../providers/VisibilityProvider"; 

export const TransformComponent = ({ mesh, currentEntity, editorMode }) => {
  const [editorModeState, setEditorMode] = useState<"translate" | "rotate" | undefined>(editorMode || "translate");
  const { setGizmoActive } = useVisibility();

  const handleObjectDataUpdate = () => {
    const entity = {
      handle: currentEntity,
      position: {
        x: mesh.current.position.x,
        y: -mesh.current.position.z,
        z: mesh.current.position.y,
      },
      rotation: {
        x: MathUtils.radToDeg(mesh.current.rotation.x),
        y: MathUtils.radToDeg(-mesh.current.rotation.z),
        z: MathUtils.radToDeg(mesh.current.rotation.y),
      },
    };
    fetchNui("moveEntity", entity);
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyR":
          if (editorModeState === "rotate") return;
          setEditorMode("rotate");
          fetchNui("swapMode", { mode: "Rotate" });
          break;
        case "KeyW":
          if (editorModeState === "translate") return;
          setEditorMode("translate");
          fetchNui("swapMode", { mode: "Translate" });
          break;
        case "Escape":
          fetchNui("finishEdit");
          break;
        case "KeyQ":
          fetchNui("cam");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keyup", keyHandler);
    setGizmoActive(true); 
    return () => {
      window.removeEventListener("keyup", keyHandler);
      setGizmoActive(false); 
    };
  }, [editorModeState, setGizmoActive]);

  return (
    <>
      <Suspense fallback={<p>Loading Gizmo</p>}>
        {currentEntity != null && (
          <TransformControls
            object={mesh.current}
            mode={editorModeState}
            onObjectChange={handleObjectDataUpdate}
          />
        )}
        <mesh ref={mesh} position={[0, 0, 0]}>
          <meshStandardMaterial color="orange" />
        </mesh>
      </Suspense>
    </>
  );
};
