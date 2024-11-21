RegisterNUICallback('getCoords', function(data, cb)
    if data.type == 'coordinates' then
        Utils.setClipBoard('vec3(' .. data.cordinat .. ')')
    else
        Utils.setClipBoard(data.cordinat)
    end
    Utils.Notification('Copied to clipboard')
    cb({ cordinat = GetEntityCoords(PlayerPedId()) })
end)
