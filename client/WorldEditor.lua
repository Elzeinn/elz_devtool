local dataObject = {}

local function InitiateJsonData()
    TriggerCallback('elz_scripts:server:getAllObjectList', function(result)
        dataObject = result
        SendReactMessage('updateObject', dataObject)
    end)
end

local function spawnObject(data)
    local propModel = data.propModel
    local pos = data.position
    local rot = data.rotation

    if not IsModelValid(propModel) then
        print("Invalid model: " .. propModel)
        return
    end
    Utils.LoadModel(propModel)
    local entity = CreateObject(propModel, pos.x, pos.y, pos.z, true, true, false)
    SetEntityRotation(entity, rot.x, rot.y, rot.z, 2, true)
    SetModelAsNoLongerNeeded(propModel)
    FreezeEntityPosition(entity, true)
    return entity
end

local function InitiateObject()
    for k, v in pairs(dataObject) do
        if #v.objects > 0 then
            for i = 1, #v.objects do
                local data = v.objects[i]
                local entity = spawnObject(data)
                data.entity = entity
            end
        end
    end
end

-- For Restart script
CreateThread(function()
    if LocalPlayer.state.isLoggedIn then
        InitiateJsonData()
        Wait(1000)
        InitiateObject()
    end
end)

AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    InitiateJsonData()
    Wait(1000)
    InitiateObject()
end)

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function(playerData)
    InitiateJsonData()
    Wait(1000)
    InitiateObject()
end)


RegisterNUICallback('addPreset', function(data, cb)
    TriggerCallback('elz_scripts:server:savePreset', function(result) end, data)
    local presetId = tostring(data.id)
    dataObject[presetId] = {
        name = data.name,
        label = data.label or "Preset " .. presetId,
        objects = {}
    }
    cb('ok')
end)

RegisterNUICallback('deletePreset', function(data, cb)
    TriggerCallback('elz_scripts:server:removePreset', function(result)

    end, data)
    cb('ok')
end)

RegisterNuiCallback('setObject', function(data, cb)
    local presetId, objectId, propModel = data.presetId, data.objectId, data.propModel
    if not presetId or not objectId or not propModel then
        cb('error: presetId, objectId, or propModel missing')
        return
    end

    dataObject[presetId] = dataObject[presetId] or {}

    if dataObject[presetId].objects?[objectId] then
        print("Updating existing object position/rotation...")
        local obj = dataObject[presetId].objects[objectId].entity
        local gizmo = useGizmo(obj)
        dataObject[presetId].objects[objectId].position = gizmo.position
        dataObject[presetId].objects[objectId].rotation = gizmo.rotation
    else
        if type(presetId) == "number" then
            presetId = tostring(presetId)
        end
        presetId = tostring(presetId)
        local offset = GetEntityCoords(PlayerPedId()) + GetEntityForwardVector(PlayerPedId()) * 3
        Utils.LoadModel(propModel)
        local obj = CreateObject(propModel, offset.x, offset.y, offset.z, false, false, false)
        local gizmo = useGizmo(obj)
        if not dataObject[presetId].objects then
            dataObject[presetId].objects = {}
        end
        dataObject[presetId].objects[objectId] = {
            propModel = propModel,
            position = gizmo.position,
            rotation = gizmo.rotation,
            objectId = objectId,
            entity = obj
        }
    end
    SendReactMessage('updateObject', dataObject)
    toggleNuiFrame(true)
    Wait(1000)
    SendReactMessage('setPage', 'menuapps')
    cb('ok')
end)

RegisterNuiCallback('saveCopiedObject', function(data, cb)
    TriggerCallback('elz_scripts:server:saveCopiedObject', function() end, data)
    cb('ok')
end)

RegisterNuiCallback('deleteObject', function(data, cb)
    local presetId = data.presetId
    if dataObject[presetId] then
        local objectId
        for k, v in pairs(data.objects) do
            if v.entity == data.entity then
                objectId = k
            end
        end
        DeleteEntity(data.entity)
        table.remove(dataObject[presetId].objects, objectId)
        SendReactMessage('updateObject', dataObject)
        Utils.Notification('Object deleted')
    end
    cb('ok')
end)

RegisterNuiCallback('setClipboard', function(data, cb)
    for k, v in pairs(dataObject) do
        if v.objects then
            for a, b in pairs(v.objects) do
                if b.entity == data.entity then
                    local stringFormat = 'prop: ' .. b.propModel ..
                        ',' ..
                        'coords = {"x":' ..
                        string.format("%.4f", b.position.x) ..
                        ',"y":' ..
                        string.format("%.4f", b.position.y) ..
                        ',"z":' ..
                        string.format("%.4f", b.position.z) ..
                        ',"w":' ..
                        b.rotation.z ..
                        '}' ..
                        ',' ..
                        'rotation = {"x":' ..
                        b.rotation.x ..
                        ',"y":' .. b.rotation.y .. ',"z":' .. b.rotation.z .. '}'
                    Utils.setClipBoard(stringFormat)
                    Utils.Notification('Copied to clipboard')
                    break
                end
            end
        end
    end
    cb('ok')
end)


RegisterNUICallback('saveDataObject', function(data, cb)
    local success = TriggerCallback('elz_scripts:server:saveObjectPreset', function()

    end, data)
    Utils.Notification('Preset saved')
    cb(success)
end)

RegisterNuiCallback('getdataJson', function(data, cb)
    local presetId = data
    if type(presetId) == "number" then
        presetId = tostring(presetId)
    end
    if dataObject[presetId] then
        cb(dataObject[presetId].objects)
    else
        print('No data found for preset:', presetId)
        cb({})
    end
end)

RegisterNuiCallback('eyeToCoords', function(data, cb)
    for k, v in pairs(dataObject) do
        if v.objects then
            for a, b in pairs(v.objects) do
                if b.entity == data.entity then
                    SetEntityCoords(PlayerPedId(), b.position.x, b.position.y, b.position.z)
                    Utils.Notification('Moved to coordinates')
                    break
                end
            end
        end
    end
    cb('ok')
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        for k, v in pairs(dataObject) do
            if v.objects then
                for i = 1, #v.objects do
                    local entity = v.objects[i].entity
                    if DoesEntityExist(entity) then
                        DeleteEntity(entity)
                    end
                end
            end
        end
        print("All spawned entities have been deleted.")
    end
end)
