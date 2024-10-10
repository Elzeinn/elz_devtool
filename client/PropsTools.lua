local plyCoords = nil

RegisterNuiCallback('editOffset', function(data, cb)
    SetNuiFocus(false, false)
    SendReactMessage('setVisible', false)
    plyCoords = GetEntityCoords(cache.ped)
    SetEntityCoords(cache.ped, 113.8497, -323.2711, 606.2153)
    FreezeEntityPosition(cache.ped, true)
    SetEntityInvincible(cache.ped, true)
    local offset = GetEntityCoords(cache.ped) + GetEntityForwardVector(cache.ped) * 3
    lib.requestModel(data.propModel)
    obj = CreateObject(data.propModel, offset.x, offset.y, offset.z, false, false, false)
    local gizmo = useGizmo(obj)
    SetEntityCoords(cache.ped, plyCoords)
    FreezeEntityPosition(cache.ped, false)
    SetEntityInvincible(cache.ped, false)
    SendReactMessage('getOffset', { position = gizmo.position, rotation = gizmo.rotation })
    Wait(1000)
    DeleteObject(obj)
    SetNuiFocus(true, true)
    SendReactMessage('setVisible', true)
    cb('ok')
end)

RegisterNuiCallback('clipOffset', function(data, cb)
    if data then
        for k, v in pairs(data) do
            local positionStr = string.format(
                'vec3(%.6f, %.6f, %.6f)', v.position.x, v.position.y, v.position.z
            )
            local rotationStr = string.format(
                'vec3(%.4f, %.4f, %.4f)', v.rotation.x, v.rotation.y, v.rotation.z
            )
            local result = 'offset = ' .. positionStr .. ' rotation = ' .. rotationStr
            lib.setClipboard(result)
        end
        cb(true)
    else
        lib.print.error("Data is invalid or missing!")
        cb(false)
    end
end)

AddEventHandler('onResourceStart', function(resource)
    if resource == GetCurrentResourceName() then
        lib.hideTextUI()
    end
end)
