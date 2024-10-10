local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

local getCoords = function()
  local coords, heading = GetEntityCoords(PlayerPedId()), GetEntityHeading(PlayerPedId())
  local data = {
    x = string.format("%.4f", coords.x),
    y = string.format("%.4f", coords.y),
    z = string.format("%.4f", coords.z),
    heading = string.format("%.4f", heading)
  }
  return data
end

RegisterCommand('show-nui', function()
  toggleNuiFrame(true)
  local data = getCoords()
  SendReactMessage('getCordinate', {
    x = data.x,
    y = data.y,
    z = data.z,
    heading = data.heading
  })

  SendReactMessage('getPreset', {
    preset = lib.callback.await('elz_scripts:server:getPreset', false)
  })

  SendReactMessage('timeCycles', lib.callback.await('elz_script:server:getTimeCycle', false))

  debugPrint('Show NUI frame')
end)

RegisterKeyMapping('show-nui', 'Show NUI frame', 'keyboard', 'H')

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getClientData', function(data, cb)
  debugPrint('Data sent by React', json.encode(data))

  -- Lets send back client coords to the React frame for use
  local curCoords = GetEntityCoords(PlayerPedId())

  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
  cb(retData)
end)
