RegisterNUICallback('getCoords', function(data, cb)
    if data.type == 'coordinates' then
        lib.setClipboard('vec3(' .. data.cordinat .. ')')
    else
        lib.setClipboard(data.cordinat)
    end
    cb({ cordinat = GetEntityCoords(PlayerPedId()) })
end)
