function toggleNuiFrame(shouldShow)
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

  SendReactMessage('setPage', 'menuapps')

  TriggerCallback('elz_scripts:server:getPreset', function(dataPreset)
    SendReactMessage('getPreset', {
      preset = dataPreset
    })
  end)

  TriggerCallback('elz_scripts:server:getTimeCycle', function(timeCycles)
    SendReactMessage('timeCycles', timeCycles)
  end)
end, false)

RegisterKeyMapping('show-nui', 'Show NUI frame', 'keyboard', 'H')

RegisterNUICallback('hideFrame', function(_, cb)
  SetNuiFocus(false, false)
  SendNUIMessage({ action = 'hideUI' })
  cb({})
end)

RegisterCommand('hide-nui', function()
  SetNuiFocus(false, false)
  SendNUIMessage({ action = 'hideUI' })
end, false)
