local usingGizmo = false
local mode = "Translate"
local extraZ = 1000.0
local spawnedProp, pedBoneId = 0, 0
local lastCoord = nil
local position, rotation = vector3(0.0, 0.0, 0.0), vector3(0.0, 0.0, 0.0)

local function useGizmoProp(handle, boneid, dict, anim)
    usingGizmo = true
    spawnedProp = handle
    pedBoneId = boneid
    local playerPed = PlayerPedId()
    lastCoord = GetEntityCoords(playerPed)
    FreezeEntityPosition(playerPed, true)
    SetEntityCoords(playerPed, 0.0, 0.0, extraZ - 1)
    SetEntityHeading(playerPed, 0.0)
    SetEntityRotation(pedBoneId, 0.0, 0.0, 0.0)
    position, rotation = vector3(0.0, 0.0, 0.0), vector3(0.0, 0.0, 0.0)
    AttachEntityToEntity(spawnedProp, playerPed, pedBoneId, position, rotation, true, true, false, true, 1, true)
    Wait(50)
    SendReactMessage('setPage', 'gizmo')
    Wait(50)
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            handle = spawnedProp,
            position = vector3(0.0, 0.0, extraZ),
            rotation = vector3(0.0, 0.0, 0.0)
        }
    })

    if dict and anim then taskPlayAnim(playerPed, dict, anim) end

    SendReactMessage('setVisible', true)
    SetNuiFocus(true, true)
    while usingGizmo do
        DrawScaleformMovieFullscreen(CreateInstuctionScaleform(), 255, 255, 255, 255, 0)
        SendNUIMessage({
            action = 'setCameraPosition',
            data = {
                position = GetFinalRenderedCamCoord(),
                rotation = GetFinalRenderedCamRot()
            }
        })
        if IsControlJustReleased(0, 44) then
            SetNuiFocus(true, true)
        end
        DisableIdleCamera(true)
        Wait(0)
    end
    finish()
    print(
        "AttachEntityToEntity(entity, PlayerPedId(), " ..
        pedBoneId ..
        ", " ..
        (extraZ - position.z) ..
        ", " ..
        position.y ..
        ", " .. position.x .. ", " ..
        rotation.x .. ", " .. rotation.y .. ", " .. rotation.z .. ", true, true, false, true, 1, true)",
        (extraZ - position.z) .. ", " ..
        position.y .. ", " .. position.x .. ", " .. rotation.x .. ", " .. rotation.y .. ", " .. rotation.z)
    return {
        position = {
            x = position.x,
            y = position.y,
            z = (extraZ + position.z) - extraZ
        },
        rotation = {
            x = rotation.x,
            y = rotation.y,
            z = rotation.z
        },
    }
end

RegisterNuiCallback('setAttachProp', function(data, cb)
    local model = joaat(data.propModel or "prop_cs_burger_01")
    Utils.LoadModel(model)
    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    local object = CreateObject(model, playerCoords.x, playerCoords.y, playerCoords.z, false, false, false)
    local boneArg = data.selectedBone
    local boneToNumber = tonumber(boneArg)
    local bone = (boneArg and boneToNumber) and GetPedBoneIndex(playerPed, boneToNumber) or
        boneArg and GetEntityBoneIndexByName(playerPed, boneArg) or 18905
    local objectPositionData = useGizmoProp(object, bone, data.animDict, data.animClip)
    SendNUIMessage({
        action = 'setCoordProp',
        data = objectPositionData
    })
    toggleNuiFrame(true)
    SendReactMessage('setPage', 'menuapps')
    Wait(500)
    cb(objectPositionData)
end)

RegisterNuiCallback('clipOffset', function(data, cb)
    if data then
        local positionStr = string.format(
            'vec3(%.6f, %.6f, %.6f)', data.position.x, data.position.y, data.position.z
        )
        local rotationStr = string.format(
            'vec3(%.4f, %.4f, %.4f)', data.rotation.x, data.rotation.y, data.rotation.z
        )
        local result = 'offset = ' .. positionStr .. ' rotation = ' .. rotationStr
        Utils.setClipBoard(result)
        Utils.Notification('Copied to clipboard')
        cb(true)
    else
        cb(false)
    end
end)


local function toggleNuiFrame(bool)
    usingGizmo = bool
    SetNuiFocus(bool, bool)
end


RegisterNuiCallback('moveEntity', function(data, cb)
    local entity = data.handle
    local setposition = data.position
    local setrotation = data.rotation

    local bonePosition = GetWorldPositionOfEntityBone(PlayerPedId(), pedBoneId)

    local offset = vector3(
        setposition.x - bonePosition.x,
        setposition.y - bonePosition.y,
        setposition.z - bonePosition.z
    )

    local newPosition = vector3(
        bonePosition.x + offset.x,
        bonePosition.y + offset.y,
        bonePosition.z + offset.z - extraZ
    )
    position, rotation = newPosition, setrotation
    AttachEntityToEntity(entity, PlayerPedId(), pedBoneId, newPosition.x, newPosition.y, newPosition.z,
        setrotation.x,
        setrotation.y,
        setrotation.z, true, true, false, true, 1, true)

    cb('ok')
end)

RegisterNUICallback('finishEdit', function(data, cb)
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            handle = nil,
        }
    })
    toggleNuiFrame(false)
    cb('ok')
end)

RegisterNUICallback('swapMode', function(data, cb)
    mode = data.mode
    cb('ok')
end)

RegisterNUICallback('cam', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

function CreateInstuctionScaleform()
    local scaleform = RequestScaleformMovie("instructional_buttons")
    while not HasScaleformMovieLoaded(scaleform) do Wait(10) end

    PushScaleformMovieFunction(scaleform, "CLEAR_ALL")
    PopScaleformMovieFunctionVoid()

    PushScaleformMovieFunction(scaleform, "SET_CLEAR_SPACE")
    PushScaleformMovieFunctionParameterInt(200)
    PopScaleformMovieFunctionVoid()

    InstructionButtonCreate(scaleform, 200, "Done Editing", 1)
    InstructionButtonCreate(scaleform, 44, "NUI Focus", 2)

    if mode == "Translate" then
        InstructionButtonCreate(scaleform, 45, "Rotate Mode", 3)
    else
        InstructionButtonCreate(scaleform, 32, "Translate Mode", 4)
    end

    PushScaleformMovieFunction(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
    PopScaleformMovieFunctionVoid()

    PushScaleformMovieFunction(scaleform, "SET_BACKGROUND_COLOUR")
    PushScaleformMovieFunctionParameterInt(0)
    PushScaleformMovieFunctionParameterInt(0)
    PushScaleformMovieFunctionParameterInt(0)
    PushScaleformMovieFunctionParameterInt(80)
    PopScaleformMovieFunctionVoid()

    return scaleform
end

function InstructionButtonCreate(scaleform, key, text, number)
    PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
    PushScaleformMovieFunctionParameterInt(number)
    PushScaleformMovieMethodParameterButtonName(GetControlInstructionalButton(0, key, true))
    InstructionButtonMessage(text)
    PopScaleformMovieFunctionVoid()
end

function InstructionButtonMessage(text)
    BeginTextCommandScaleformString("STRING")
    AddTextComponentScaleform(text)
    EndTextCommandScaleformString()
end

function finish()
    if DoesEntityExist(spawnedProp) then
        DeleteEntity(spawnedProp)
    end
    local playerPed = PlayerPedId()
    FreezeEntityPosition(playerPed, false)
    ClearPedTasks(playerPed)
    if lastCoord then
        SetEntityCoords(playerPed, lastCoord)
        lastCoord = nil
    end
end

function taskPlayAnim(ped, dict, anim, flag)
    CreateThread(function()
        while usingGizmo do
            if not IsEntityPlayingAnim(ped, dict, anim, 1) then
                while not HasAnimDictLoaded(dict) do
                    RequestAnimDict(dict)
                    Wait(10)
                end
                TaskPlayAnim(ped, dict, anim, 5.0, 5.0, -1, (flag or 15), 0, false, false, false)
                RemoveAnimDict(dict)
            end
            Wait(1000)
        end
    end)
end

AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        finish()
    end
end)


--Example: /prop prop_sandwich_01 18905 mp_player_inteat@burger mp_player_int_eat_burger
RegisterCommand('prop', function(source, args, rawCommand)
    local model = joaat(args[1] or "prop_cs_burger_01")
    if not HasModelLoaded(model) then
        RequestModel(model)
        while not HasModelLoaded(model) do Wait(1) end
    end
    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    local object = CreateObject(model, playerCoords.x, playerCoords.y, playerCoords.z, false, false, false)
    local boneArg = args[2]
    local boneToNumber = tonumber(boneArg)
    local bone = (boneArg and boneToNumber) and GetPedBoneIndex(playerPed, boneToNumber) or
        boneArg and GetEntityBoneIndexByName(playerPed, boneArg) or 18905
    local objectPositionData = useGizmoTes(object, bone, args[3], args[4])
    print(json.encode(objectPositionData, { indent = true }))
end)

AddEventHandler('onResourceStart', function(resource)
    if resource == GetCurrentResourceName() then
        Utils.HideTextUi()
    end
end)
