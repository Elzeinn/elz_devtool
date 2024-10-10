local dataObject = {}

RegisterNUICallback('addPreset', function(data, cb)
    local preset = lib.callback.await('elz_scripts:server:savePreset', false, data)
    cb('ok')
end)

RegisterNUICallback('deletePreset', function(data, cb)
    local delete = lib.callback.await('elz_scripts:server:removePreset', false, data)
end)

RegisterNuiCallback('setObject', function(data, cb)
    SetNuiFocus(false, false)
    SendReactMessage('setVisible', false)
    local offset = GetEntityCoords(cache.ped) + GetEntityForwardVector(cache.ped) * 3
    lib.requestModel(data.propModel)
    local obj = CreateObject(data.propModel, offset.x, offset.y, offset.z, false, false, false)
    dataObject[data.objectId] = obj
    local gizmo = useGizmo(obj)
    local objectData = {
        propModel = data.propModel,
        position = gizmo.position,
        rotation = gizmo.rotation,
        objectId = data.objectId,
        entity = obj
    }
    Wait(1000)
    SetNuiFocus(true, true)
    SendReactMessage('setVisible', true)
    SendReactMessage('updateObject', objectData)
    cb('ok')
end)


RegisterNuiCallback('saveCopiedObject', function(data, cb)
    lib.callback.await('saveCopiedObject', false, data)
end)

RegisterNuiCallback('deleteObject', function(data, cb)
    lib.callback.await('deleteObject', false, data)
    for k, v in pairs(dataObject) do
        if v == data.entity.entity then
            DeleteEntity(data.entity.entity)
        end
    end
end)

RegisterNuiCallback('setClipboard', function(data, cb)
    lib.setClipboard('model = ' ..
        data.updateObject.propModel ..
        ',' ..
        'coords = {"x":' ..
        string.format("%.4f", data.updateObject.position.x) ..
        ',"y":' ..
        string.format("%.4f", data.updateObject.position.y) ..
        ',"z":' ..
        string.format("%.4f", data.updateObject.position.z) ..
        ',"w":' ..
        data.updateObject.rotation.z ..
        '}' ..
        ',' ..
        'rotation = {"x":' ..
        data.updateObject.rotation.x ..
        ',"y":' .. data.updateObject.rotation.y .. ',"z":' .. data.updateObject.rotation.z .. '}')
end)


RegisterNUICallback('saveDataObject', function(data, cb)
    local success = lib.callback.await('elz_scripts:server:saveObjectPrest', false, data)
    cb(success)
end)

RegisterNuiCallback('getdataJson', function(data, cb)
    local callback = lib.callback.await('elz_scripts:server:getPresetObjectFromId', false, data)
    for k, v in pairs(callback) do
        if (next(v) == nil) then
            callback = {}
            break
        end
    end
    for k, v in pairs(callback) do
        callback[k] = v
    end
    cb(callback)
end)
