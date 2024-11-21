local pedGizmo
local setGizmo = false
local dataPed = {}

RegisterNuiCallback('addPedData', function(data, cb)
    local coords, rotation, heading = GetEntityCoords(PlayerPedId()), GetEntityRotation(PlayerPedId()),
        GetEntityHeading(PlayerPedId())
    local dataPed = {
        position = {
            coords = {
                x = string.format("%.4f", coords.x),
                y = string.format("%.4f", coords.y),
                z = string.format("%.4f", coords.z),
            },
            rotation = {
                x = string.format("%.4f", rotation.x),
                y = string.format("%.4f", rotation.y),
                z = string.format("%.4f", rotation.z),
            }
        },
        heading = string.format("%.4f", heading),
        model = data.model,
        name = data.name
    }
    cb(dataPed)
end)

RegisterNuiCallback('showGizmo', function(data, cb)
    if setGizmo then
        return print('dont show gizmo')
    end
    local model = tostring(data.model)
    local offset = GetEntityCoords(PlayerPedId()) + GetEntityForwardVector(PlayerPedId()) * 3
    Utils.LoadModel(model)
    pedGizmo = CreatePed(4, model, offset.x, offset.y, offset.z - 1, 0, false, true)
    FreezeEntityPosition(pedGizmo, true)
    SetEntityInvincible(pedGizmo, true)
    SetEntityAsMissionEntity(pedGizmo, true, true)
    SetModelAsNoLongerNeeded(model)
    SetBlockingOfNonTemporaryEvents(pedGizmo, true)
    SetPedCanRagdoll(pedGizmo, false)
    TaskStandStill(pedGizmo, -1)
    SetPedFleeAttributes(pedGizmo, 0, false)
    SetPedCombatAttributes(pedGizmo, 46, true)
    SetPedCombatAttributes(pedGizmo, 17, true)
    DisablePedPainAudio(pedGizmo, true)
    SetEntityDynamic(pedGizmo, false)
    SetPedGravity(pedGizmo, false)
    ClearPedTasksImmediately(pedGizmo)
    SetEntityCollision(pedGizmo, false, true)
    setGizmo = true
    local gizmo = useGizmo(pedGizmo)
    setGizmo = false
    SendReactMessage('getPedPosition',
        { position = gizmo.position, rotation = gizmo.rotation, model = model, handle = gizmo.handle })
    dataPed[#dataPed + 1] = {
        position = gizmo.position,
        rotation = gizmo.rotation,
        model = model,
        handle = gizmo.handle
    }
    cb('ok')
end)

RegisterNuiCallback('deletePed', function(data, cb)
    cb('ok')
end)

RegisterNuiCallback('applyPedChanges', function(data, cb)
    local coords, heading = GetEntityCoords(PlayerPedId()), GetEntityHeading(PlayerPedId())
    local dataPed = {
        position = {
            coords = {
                x = string.format("%.4f", coords.x),
                y = string.format("%.4f", coords.y),
                z = string.format("%.4f", coords.z),
            },
            rotation = {
                x = string.format("%.4f", heading),
                y = string.format("%.4f", heading),
                z = string.format("%.4f", heading),
            }
        },
        heading = string.format("%.4f", heading),
        model = data.ped.model,
        name = data.ped.name,
        animation = {
            dict = data.ped.animation.dict,
            clip = data.ped.animation.clip,
        }
    }
    cb(dataPed)
    if data.ped.animation.dict ~= "" and data.ped.animation.clip ~= "" then
        if pedGizmo and DoesEntityExist(pedGizmo) then
            Utils.requestAnimDict(data.ped.animation.dict)
            TaskPlayAnim(
                pedGizmo,
                data.ped.animation.dict,
                data.ped.animation.clip,
                8.0,
                -8.0,
                -1,
                49,
                0,
                false,
                false,
                false
            )
        end
    end
end)

RegisterNuiCallback('copyDataPed', function(data, cb)
    Utils.setClipBoard(data)
    Utils.Notification('Copied to clipboard')
    cb('ok')
end)
