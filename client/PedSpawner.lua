local pedGizmo

RegisterNuiCallback('addPedData', function(data, cb)
    local coords, heading = GetEntityCoords(cache.ped), GetEntityHeading(cache.ped)
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
        model = data.model,
        name = data.name
    }
    cb(dataPed)
end)

RegisterNuiCallback('showGizmo', function(data, cb)
    local model = tostring(data.model)
    local offset = GetEntityCoords(cache.ped) + GetEntityForwardVector(cache.ped) * 3
    lib.requestModel(model)
    pedGizmo = CreatePed(4, model, offset.x, offset.y, offset.z - 1, 0, false, true)
    FreezeEntityPosition(pedGizmo, true)
    SetEntityInvincible(pedGizmo, true)
    SetEntityCollision(pedGizmo, false, false)
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
    local gizmo = useGizmo(pedGizmo)
    SendReactMessage('getPedPosition', { position = gizmo.position, rotation = gizmo.rotation, model = model })
    print(json.encode(gizmo, { indent = true }))
    cb(gizmo)
end)

RegisterNuiCallback('applyPedChanges', function(data, cb)
    local coords, heading = GetEntityCoords(cache.ped), GetEntityHeading(cache.ped)
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
            RequestAnimDict(data.ped.animation.dict)
            while not HasAnimDictLoaded(data.ped.animation.dict) do
                Wait(100)
            end
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
    lib.setClipboard(data)
end)
