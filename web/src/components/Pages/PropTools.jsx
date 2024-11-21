import React, { useEffect, useState } from "react";
import "../Style/Proptools.css";
import { fetchNui } from "../../utils/fetchNui";
import propTool from "../assets/proptool.svg";

function PropTools({ propCoords }) {
  const [isPropToolsOpen, setIsPropToolsOpen] = useState(false);
  const [propModel, setPropModel] = useState("prop_tool_pickaxe");
  const [selectedBone, setSelectedBone] = useState("SKEL_ROOT");
  const [animDict, setAnimDict] = useState("");
  const [animClip, setAnimClip] = useState("");

  const bones = [
    { name: "SKEL_ROOT", id: 0x0 },
    { name: "SKEL_Pelvis", id: 0x2e28 },
    { name: "SKEL_L_Thigh", id: 0xe39f },
    { name: "SKEL_L_Calf", id: 0xf9bb },
    { name: "SKEL_L_Foot", id: 0x3779 },
    { name: "SKEL_L_Toe0", id: 0x83c },
    { name: "EO_L_Foot", id: 0x84c5 },
    { name: "EO_L_Toe", id: 0x68bd },
    { name: "IK_L_Foot", id: 0xfedd },
    { name: "PH_L_Foot", id: 0xe175 },
    { name: "MH_L_Knee", id: 0xb3fe },
    { name: "SKEL_R_Thigh", id: 0xca72 },
    { name: "SKEL_R_Calf", id: 0x9000 },
    { name: "SKEL_R_Foot", id: 0xcc4d },
    { name: "SKEL_R_Toe0", id: 0x512d },
    { name: "EO_R_Foot", id: 0x1096 },
    { name: "EO_R_Toe", id: 0x7163 },
    { name: "IK_R_Foot", id: 0x8aae },
    { name: "PH_R_Foot", id: 0x60e6 },
    { name: "MH_R_Knee", id: 0x3fcf },
    { name: "RB_L_ThighRoll", id: 0x5c57 },
    { name: "RB_R_ThighRoll", id: 0x192a },
    { name: "SKEL_Spine_Root", id: 0xe0fd },
    { name: "SKEL_Spine0", id: 0x5c01 },
    { name: "SKEL_Spine1", id: 0x60f0 },
    { name: "SKEL_Spine2", id: 0x60f1 },
    { name: "SKEL_Spine3", id: 0x60f2 },
    { name: "SKEL_L_Clavicle", id: 0xfcd9 },
    { name: "SKEL_L_UpperArm", id: 0xb1c5 },
    { name: "SKEL_L_Forearm", id: 0xeeeb },
    { name: "SKEL_L_Hand", id: 0x49d9 },
    { name: "SKEL_L_Finger00", id: 0x67f2 },
    { name: "SKEL_L_Finger01", id: 0xff9 },
    { name: "SKEL_L_Finger02", id: 0xffa },
    { name: "SKEL_L_Finger10", id: 0x67f3 },
    { name: "SKEL_L_Finger11", id: 0x1049 },
    { name: "SKEL_L_Finger12", id: 0x104a },
    { name: "SKEL_L_Finger20", id: 0x67f4 },
    { name: "SKEL_L_Finger21", id: 0x1059 },
    { name: "SKEL_L_Finger22", id: 0x105a },
    { name: "SKEL_L_Finger30", id: 0x67f5 },
    { name: "SKEL_L_Finger31", id: 0x1029 },
    { name: "SKEL_L_Finger32", id: 0x102a },
    { name: "SKEL_L_Finger40", id: 0x67f6 },
    { name: "SKEL_L_Finger41", id: 0x1039 },
    { name: "SKEL_L_Finger42", id: 0x103a },
    { name: "PH_L_Hand", id: 0xeb95 },
    { name: "IK_L_Hand", id: 0x8cbd },
    { name: "RB_L_ForeArmRoll", id: 0xee4f },
    { name: "RB_L_ArmRoll", id: 0x1470 },
    { name: "MH_L_Elbow", id: 0x58b7 },
    { name: "SKEL_R_Clavicle", id: 0x29d2 },
    { name: "SKEL_R_UpperArm", id: 0x9d4d },
    { name: "SKEL_R_Forearm", id: 0x6e5c },
    { name: "SKEL_R_Hand", id: 0xdead },
    { name: "SKEL_R_Finger00", id: 0xe5f2 },
    { name: "SKEL_R_Finger01", id: 0xfa10 },
    { name: "SKEL_R_Finger02", id: 0xfa11 },
    { name: "SKEL_R_Finger10", id: 0xe5f3 },
    { name: "SKEL_R_Finger11", id: 0xfa60 },
    { name: "SKEL_R_Finger12", id: 0xfa61 },
    { name: "SKEL_R_Finger20", id: 0xe5f4 },
    { name: "SKEL_R_Finger21", id: 0xfa70 },
    { name: "SKEL_R_Finger22", id: 0xfa71 },
    { name: "SKEL_R_Finger30", id: 0xe5f5 },
    { name: "SKEL_R_Finger31", id: 0xfa40 },
    { name: "SKEL_R_Finger32", id: 0xfa41 },
    { name: "SKEL_R_Finger40", id: 0xe5f6 },
    { name: "SKEL_R_Finger41", id: 0xfa50 },
    { name: "SKEL_R_Finger42", id: 0xfa51 },
    { name: "PH_R_Hand", id: 0x6f06 },
    { name: "IK_R_Hand", id: 0x188e },
    { name: "RB_R_ForeArmRoll", id: 0xab22 },
    { name: "RB_R_ArmRoll", id: 0x90ff },
    { name: "MH_R_Elbow", id: 0xbb0 },
    { name: "SKEL_Neck_1", id: 0x9995 },
    { name: "SKEL_Head", id: 0x796e },
    { name: "IK_Head", id: 0x322c },
    { name: "FACIAL_facialRoot", id: 0xfe2c },
    { name: "FB_L_Brow_Out_000", id: 0xe3db },
    { name: "FB_L_Lid_Upper_000", id: 0xb2b6 },
    { name: "FB_L_Eye_000", id: 0x62ac },
    { name: "FB_L_CheekBone_000", id: 0x542e },
    { name: "FB_L_Lip_Corner_000", id: 0x74ac },
    { name: "FB_R_Lid_Upper_000", id: 0xaa10 },
    { name: "FB_R_Eye_000", id: 0x6b52 },
    { name: "FB_R_CheekBone_000", id: 0x4b88 },
    { name: "FB_R_Brow_Out_000", id: 0x54c },
    { name: "FB_R_Lip_Corner_000", id: 0x2ba6 },
    { name: "FB_Brow_Centre_000", id: 0x9149 },
    { name: "FB_UpperLipRoot_000", id: 0x4ed2 },
    { name: "FB_UpperLip_000", id: 0xf18f },
    { name: "FB_L_Lip_Top_000", id: 0x4f37 },
    { name: "FB_R_Lip_Top_000", id: 0x4537 },
    { name: "FB_Jaw_000", id: 0xb4a0 },
    { name: "FB_LowerLipRoot_000", id: 0x4324 },
    { name: "FB_LowerLip_000", id: 0x508f },
    { name: "FB_L_Lip_Bot_000", id: 0xb93b },
    { name: "FB_R_Lip_Bot_000", id: 0xc33b },
    { name: "FB_Tongue_000", id: 0xb987 },
    { name: "RB_Neck_1", id: 0x8b93 },
    { name: "SPR_L_Breast", id: 0xfc8e },
    { name: "SPR_R_Breast", id: 0x885f },
    { name: "IK_Root", id: 0xdd1c },
    { name: "SKEL_Neck_2", id: 0x5fd4 },
    { name: "SKEL_Pelvis1", id: 0xd003 },
    { name: "SKEL_PelvisRoot", id: 0x45fc },
    { name: "SKEL_SADDLE", id: 0x9524 },
    { name: "MH_L_CalfBack", id: 0x1013 },
    { name: "MH_L_ThighBack", id: 0x600d },
    { name: "SM_L_Skirt", id: 0xc419 },
    { name: "MH_R_CalfBack", id: 0xb013 },
    { name: "MH_R_ThighBack", id: 0x51a3 },
    { name: "SM_R_Skirt", id: 0x7712 },
    { name: "SM_M_BackSkirtRoll", id: 0xdbb },
    { name: "SM_L_BackSkirtRoll", id: 0x40b2 },
    { name: "SM_R_BackSkirtRoll", id: 0xc141 },
    { name: "SM_M_FrontSkirtRoll", id: 0xcdbb },
    { name: "SM_L_FrontSkirtRoll", id: 0x9b69 },
    { name: "SM_R_FrontSkirtRoll", id: 0x86f1 },
    { name: "SM_CockNBalls_ROOT", id: 0xc67d },
    { name: "SM_CockNBalls", id: 0x9d34 },
    { name: "MH_MulletRoot", id: 0x3e73 },
    { name: "MH_MulletScaler", id: 0xa1c2 },
    { name: "MH_Hair_Scale", id: 0xc664 },
    { name: "MH_Hair_Crown", id: 0x1675 },
    { name: "SM_Torch", id: 0x8d6 },
    { name: "FX_Light", id: 0x8959 },
    { name: "FX_Light_Scale", id: 0x5038 },
    { name: "FX_Light_Switch", id: 0xe18e },
    { name: "BagRoot", id: 0xad09 },
    { name: "BagPivotROOT", id: 0xb836 },
    { name: "BagPivot", id: 0x4d11 },
    { name: "BagBody", id: 0xab6d },
    { name: "BagBone_R", id: 0x937 },
    { name: "BagBone_L", id: 0x991 },
    { name: "SM_LifeSaver_Front", id: 0x9420 },
    { name: "SM_R_Pouches_ROOT", id: 0x2962 },
    { name: "SM_R_Pouches", id: 0x4141 },
    { name: "SM_L_Pouches_ROOT", id: 0x2a02 },
    { name: "SM_L_Pouches", id: 0x4b41 },
    { name: "SM_Suit_Back_Flapper", id: 0xda2d },
    { name: "SPR_CopRadio", id: 0x8245 },
    { name: "SM_LifeSaver_Back", id: 0x2127 },
    { name: "MH_BlushSlider", id: 0xa0ce },
    { name: "SKEL_Tail_01", id: 0x347 },
    { name: "SKEL_Tail_02", id: 0x348 },
    { name: "MH_L_Concertina_B", id: 0xc988 },
    { name: "MH_L_Concertina_A", id: 0xc987 },
    { name: "MH_R_Concertina_B", id: 0xc8e8 },
    { name: "MH_R_Concertina_A", id: 0xc8e7 },
    { name: "MH_L_ShoulderBladeRoot", id: 0x8711 },
    { name: "MH_L_ShoulderBlade", id: 0x4eaf },
    { name: "MH_R_ShoulderBladeRoot", id: 0x3a0a },
    { name: "MH_R_ShoulderBlade", id: 0x54af },
    { name: "FB_R_Ear_000", id: 0x6cdf },
    { name: "SPR_R_Ear", id: 0x63b6 },
    { name: "FB_L_Ear_000", id: 0x6439 },
    { name: "SPR_L_Ear", id: 0x5b10 },
    { name: "FB_TongueA_000", id: 0x4206 },
    { name: "FB_TongueB_000", id: 0x4207 },
    { name: "FB_TongueC_000", id: 0x4208 },
    { name: "SKEL_L_Toe1", id: 0x1d6b },
    { name: "SKEL_R_Toe1", id: 0xb23f },
    { name: "SKEL_Tail_03", id: 0x349 },
    { name: "SKEL_Tail_04", id: 0x34a },
    { name: "SKEL_Tail_05", id: 0x34b },
    { name: "SPR_Gonads_ROOT", id: 0xbfde },
    { name: "SPR_Gonads", id: 0x1c00 },
    { name: "FB_L_Brow_Out_001", id: 0xe3db },
    { name: "FB_L_Lid_Upper_001", id: 0xb2b6 },
    { name: "FB_L_Eye_001", id: 0x62ac },
    { name: "FB_L_CheekBone_001", id: 0x542e },
    { name: "FB_L_Lip_Corner_001", id: 0x74ac },
    { name: "FB_R_Lid_Upper_001", id: 0xaa10 },
    { name: "FB_R_Eye_001", id: 0x6b52 },
    { name: "FB_R_CheekBone_001", id: 0x4b88 },
    { name: "FB_R_Brow_Out_001", id: 0x54c },
    { name: "FB_R_Lip_Corner_001", id: 0x2ba6 },
    { name: "FB_Brow_Centre_001", id: 0x9149 },
    { name: "FB_UpperLipRoot_001", id: 0x4ed2 },
    { name: "FB_UpperLip_001", id: 0xf18f },
    { name: "FB_L_Lip_Top_001", id: 0x4f37 },
    { name: "FB_R_Lip_Top_001", id: 0x4537 },
    { name: "FB_Jaw_001", id: 0xb4a0 },
    { name: "FB_LowerLipRoot_001", id: 0x4324 },
    { name: "FB_LowerLip_001", id: 0x508f },
    { name: "FB_L_Lip_Bot_001", id: 0xb93b },
    { name: "FB_R_Lip_Bot_001", id: 0xc33b },
    { name: "FB_Tongue_001", id: 0xb987 },
  ];

  const togglePropTools = () => {
    setIsPropToolsOpen(!isPropToolsOpen);
  };

  const sendDataToNui = () => {
    const data = {
      propModel,
      selectedBone,
      animDict,
      animClip,
    };
    fetchNui("setAttachProp", data);
  };

  const sendOffsetClip = () => {
    if (propCoords) {
      fetchNui("clipOffset", propCoords);
    }
  };

  return (
    <>
      <div className="prop-tools">
        <div className="prop-tools-header" onClick={togglePropTools}>
          <img src={propTool} className="icon" alt="" />
          <h1>Prop tool</h1>
          <i
            className={`arrow fa-solid ${isPropToolsOpen ? "fa-chevron-up open" : "fa-chevron-down"}`}
          />
        </div>
        {isPropToolsOpen && (
          <div className="prop-tools-container">
            <div className="prop-tools-content"></div>
            <div className="prop-tools-model">
              <label>Prop Model</label>
              <input
                type="text"
                placeholder="prop_tool_fireaxe"
                value={propModel}
                onChange={(e) => setPropModel(e.target.value)}
              />
            </div>
            <div className="prop-tools-targetEntity select-container">
              <label>Target Entity</label>
              <select name="" id="">
                <option value="">Select</option>
                <option value="Player">Player</option>
                <option value="Vehicle">Vehicle</option>
              </select>
              <i className="arrow fa-solid fa-chevron-down" />
            </div>

            <div className="prop-tools-model-animation">
              <label>Animation</label>
              <div className="prop-tools-model-animation-input">
                <input
                  className="dict"
                  type="text"
                  placeholder="Animation dict"
                  value={animDict}
                  onChange={(e) => setAnimDict(e.target.value)}
                />
                <input
                  className="clip"
                  type="text"
                  placeholder="Animation clip"
                  value={animClip}
                  onChange={(e) => setAnimClip(e.target.value)}
                />
              </div>
            </div>
            <div className="prop-tools-targetEntity select-container">
              <label>Bones</label>
              <select
                value={selectedBone}
                onChange={(e) => setSelectedBone(e.target.value)}
              >
                {bones.map((bone) => (
                  <option key={bone.id} value={bone.id}>
                    {bone.name}
                  </option>
                ))}
              </select>
              <i className="arrow fa-solid fa-chevron-down" />
            </div>
            <div className="prop-tool-btn">
              <button className="copy" onClick={sendOffsetClip}>
                Copy native
              </button>
              <button className="edit" onClick={sendDataToNui}>
                Edit offset
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PropTools;
