--- A simple wrapper around SendNUIMessage that you can use to
--- dispatch actions to the React frame.
---
---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
function SendReactMessage(action, data)
  SendNUIMessage({
    action = action,
    data = data
  })
end

local currentResourceName = GetCurrentResourceName()

local debugIsEnabled = GetConvarInt(('%s-debugMode'):format(currentResourceName), 0) == 1

--- A simple debug print function that is dependent on a convar
--- will output a nice prettfied message if debugMode is on
function debugPrint(...)
  if not debugIsEnabled then return end
  local args <const> = { ... }

  local appendStr = ''
  for _, v in ipairs(args) do
    appendStr = appendStr .. ' ' .. tostring(v)
  end
  local msgTemplate = '^3[%s]^0%s'
  local finalMsg = msgTemplate:format(currentResourceName, appendStr)
  print(finalMsg)
end

Utils = {}
Client = {}

Utils.toggleLastEntitySet = function()
  if LastEntitySet ~= nil then
    if IsInteriorEntitySetActive(Client.interiorId, LastEntitySet) then
      DeactivateInteriorEntitySet(Client.interiorId, tostring(LastEntitySet))
      RefreshInterior(Client.interiorId)
    else
      ActivateInteriorEntitySet(Client.interiorId, tostring(LastEntitySet))
      RefreshInterior(Client.interiorId)
    end
  end
end

Utils.drawText = function(string, coords)
  SetTextFont(0)
  SetTextProportional(1)
  SetTextScale(0.36, 0.36)
  SetTextColour(255, 255, 255, 255)
  SetTextDropshadow(0, 0, 0, 0, 255)
  SetTextEdge(5, 0, 0, 0, 255)
  SetTextDropShadow()
  SetTextOutline()
  SetTextRightJustify(false)
  SetTextWrap(0, 0.55)
  SetTextEntry('STRING')

  AddTextComponentString(string)
  DrawText(coords.x, coords.y)
end

Utils.setTimecycle = function(timecycle, roomId)
  if Client.interiorId ~= 0 then
    if not roomId then
      local roomHash = GetRoomKeyFromEntity(cache.ped)
      roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)
    end

    if not Client.defaultTimecycles[Client.interiorId] then
      Client.defaultTimecycles[Client.interiorId] = {}
    end

    if not Client.defaultTimecycles[Client.interiorId][roomId] then
      local currentTimecycle = GetInteriorRoomTimecycle(Client.interiorId, roomId)

      local found
      for _, v in pairs(Client.data.timecycles) do
        if v.value == tostring(currentTimecycle) then
          found = v.label
          break
        end
      end

      if not found then
        found = 'Unknown'
      end

      Client.defaultTimecycles[Client.interiorId][roomId] = {
        label = found,
        value = currentTimecycle
      }
    end

    SetInteriorRoomTimecycle(Client.interiorId, roomId, tonumber(timecycle))
    RefreshInterior(Client.interiorId)
  else
    SetTimecycleModifier(tonumber(timecycle))
  end
end

Utils.Draw3DText = function(DrawCoords, text)
  local onScreen, _x, _y = GetScreenCoordFromWorldCoord(DrawCoords.x, DrawCoords.y, DrawCoords.z)
  local px, py, pz = table.unpack(GetFinalRenderedCamCoord())
  local dist = #(vec3(px, py, pz) - vec3(DrawCoords.x, DrawCoords.y, DrawCoords.z))
  local fov = (1 / GetGameplayCamFov()) * 100
  local scale = (1 / dist) * fov

  if onScreen then
    SetTextScale(0.0 * scale, 1.1 * scale)
    SetTextFont(0)
    SetTextProportional(1)
    SetTextDropshadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 150)
    SetTextDropShadow()
    SetTextOutline()
    BeginTextCommandDisplayText('STRING')
    SetTextCentre(1)
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayText(_x, _y)
  end
end

Utils.setTimecycle = function(timecycle, roomId)
  if Client.interiorId ~= 0 then
    if not roomId then
      local roomHash = GetRoomKeyFromEntity(cache.ped)
      roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)
    end


    SetInteriorRoomTimecycle(Client.interiorId, roomId, tonumber(timecycle))
    RefreshInterior(Client.interiorId)
  else
    SetTimecycleModifier(tonumber(timecycle))
  end
end

Utils.setPortalFlag = function(portal, flag)
  if Client.interiorId ~= 0 then
    local portalIndex = tonumber(portal)
    local newFlag = tonumber(flag)

    SetInteriorPortalFlag(Client.interiorId, portalIndex, newFlag)
    RefreshInterior(Client.interiorId)
  end
end

Utils.setRoomFlag = function(flag)
  local playerPed = cache.ped
  local roomHash = GetRoomKeyFromEntity(playerPed)
  local roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)

  if Client.interiorId ~= 0 and roomId ~= -1 then
    local newFlag = tonumber(flag)

    SetInteriorRoomFlag(Client.interiorId, roomId, newFlag)
    RefreshInterior(Client.interiorId)
  end
end

Utils.enableEntitySet = function(value)
  if IsInteriorEntitySetActive(Client.interiorId, value) then
    DeactivateInteriorEntitySet(Client.interiorId, value)
    LastEntitySet = value
  else
    ActivateInteriorEntitySet(Client.interiorId, value)
    LastEntitySet = value
  end

  RefreshInterior(Client.interiorId)
end


Utils.listFlags = function(totalFlags, type)
  local all_flags = {
    portal = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 },
    room = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 }
  }

  if not all_flags[type] then return end

  local flags = {}

  for _, flag in ipairs(all_flags[type]) do
    if totalFlags & flag ~= 0 then
      flags[#flags + 1] = tostring(flag)
    end
  end

  local result = {}

  for i, flag in ipairs(flags) do
    result[#result + 1] = tostring(flag)
  end

  return result
end

Utils.QMultiply = function(a, b)
  local axx = a.x * 2
  local ayy = a.y * 2
  local azz = a.z * 2
  local awxx = a.w * axx
  local awyy = a.w * ayy
  local awzz = a.w * azz
  local axxx = a.x * axx
  local axyy = a.x * ayy
  local axzz = a.x * azz
  local ayyy = a.y * ayy
  local ayzz = a.y * azz
  local azzz = a.z * azz

  return vec3(((b.x * ((1.0 - ayyy) - azzz)) + (b.y * (axyy - awzz))) + (b.z * (axzz + awyy)),
    ((b.x * (axyy + awzz)) + (b.y * ((1.0 - axxx) - azzz))) + (b.z * (ayzz - awxx)),
    ((b.x * (axzz - awyy)) + (b.y * (ayzz + awxx))) + (b.z * ((1.0 - axxx) - ayyy)))
end


Utils.Lerp = function(a, b, t)
  return a + (b - a) * t
end
