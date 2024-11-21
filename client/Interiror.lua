local lastRoomId = 0

Client = {
    currentTab = 'home',
    portalPoly = false,
    portalLines = false,
    portalCorners = false,
    portalInfos = false,
    interiorId = GetInteriorFromEntity(PlayerPedId()),
    defaultTimecycles = {},
}

CreateThread(function()
    while true do
        Wait(150)
        if DoesEntityExist(PlayerPedId()) then
            Client.interiorId = GetInteriorFromEntity(PlayerPedId())
        else
            Client.interiorId = 0
        end
    end
end)

function GetInteriorData(fromThread)
    local currentRoomHash = GetRoomKeyFromEntity(PlayerPedId())
    local currentRoomId = GetInteriorRoomIndexByHash(Client.interiorId, currentRoomHash)
    if fromThread then
        lastRoomId = currentRoomId
        local roomCount = GetInteriorRoomCount(Client.interiorId) - 1
        local portalCount = GetInteriorPortalCount(Client.interiorId)

        local rooms = {}

        for i = 1, roomCount do
            local totalFlags = GetInteriorRoomFlag(Client.interiorId, i)
            rooms[i] = {
                index = i,
                name = GetInteriorRoomName(Client.interiorId, i),
                timecycle = tostring(GetInteriorRoomTimecycle(Client.interiorId, i)),
                isCurrent = currentRoomId == i and true or nil,
                flags = {
                    list = Utils.listFlags(totalFlags, 'room'),
                    total = totalFlags
                }
            }
        end

        local portals = {}

        for i = 0, portalCount - 1 do
            local totalFlags = GetInteriorPortalFlag(Client.interiorId, i)
            portals[i] = {
                index = i,
                roomFrom = GetInteriorPortalRoomFrom(Client.interiorId, i),
                roomTo = GetInteriorPortalRoomTo(Client.interiorId, i),
                flags = {
                    list = Utils.listFlags(totalFlags, 'portal'),
                    total = totalFlags
                }
            }
        end
        local intData = {
            interiorId = Client.interiorId,
            roomCount = roomCount,
            portalCount = portalCount,
            rooms = rooms,
            portals = portals,
            currentRoom = {
                index = currentRoomId > 0 and currentRoomId or 0,
                name = currentRoomId > 0 and rooms[currentRoomId].name or 'none',
                timecycle = currentRoomId > 0 and rooms[currentRoomId].timecycle or 0,
                flags = currentRoomId > 0 and rooms[currentRoomId].flags or { list = {}, total = 0 },
            }
        }
        SendReactMessage('setDataInterior', intData)

        Client.intData = intData
    else
        if Client.interiorId == 0 then
            SendReactMessage('setInitInterior', { interiorId = 0 })
        end
        Wait(500)
    end
end

CreateThread(function()
    Wait(500)
    GetInteriorData()
end)


CreateThread(function()
    while true do
        if Client.interiorId and Client.interiorId > 0 then
            GetInteriorData(true)
        else
            GetInteriorData()
            Wait(200)
        end
        Wait(200)
    end
end)

-- Draw interior portals
CreateThread(function()
    while true do
        if Client.interiorId and Client.interiorId > 0 then
            if Client.portalPoly or Client.portalLines or Client.portalCorners or Client.portalInfos then
                local ix, iy, iz = GetInteriorPosition(Client.interiorId)
                local rotX, rotY, rotZ, rotW = GetInteriorRotation(Client.interiorId)
                local interiorPosition = vec3(ix, iy, iz)
                local interiorRotation = quat(rotW, rotX, rotY, rotZ)
                local pedCoords = GetEntityCoords(PlayerPedId())

                for portalId = 0, GetInteriorPortalCount(Client.interiorId) - 1 do
                    local corners = {}
                    local pureCorners = {}

                    for cornerIndex = 0, 3 do
                        local cornerX, cornerY, cornerZ = GetInteriorPortalCornerPosition(Client.interiorId, portalId,
                            cornerIndex)
                        local cornerPosition = interiorPosition +
                            Utils.QMultiply(interiorRotation, vec3(cornerX, cornerY, cornerZ))

                        corners[cornerIndex] = cornerPosition
                        pureCorners[cornerIndex] = vec3(cornerX, cornerY, cornerZ)
                    end

                    local CrossVector = Utils.Lerp(corners[0], corners[2], 0.5)

                    if #(pedCoords - CrossVector) <= 8.0 then
                        if Client.portalPoly then
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z,
                                corners[2].x, corners[2].y, corners[2].z, 0, 0, 180, 150)
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z,
                                corners[3].x, corners[3].y, corners[3].z, 0, 0, 180, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z,
                                corners[1].x, corners[1].y, corners[1].z, 0, 0, 180, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z,
                                corners[0].x, corners[0].y, corners[0].z, 0, 0, 180, 150)
                        end

                        if Client.portalLines then
                            -- Borders oultine
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z,
                                0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z,
                                0, 255, 0, 255)
                            DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z,
                                0, 255, 0, 255)
                            DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z,
                                0, 255, 0, 255)

                            -- Middle lines
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z,
                                0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[3].x, corners[3].y, corners[3].z,
                                0, 255, 0, 255)
                        end

                        if Client.portalCorners then
                            Utils.Draw3DText(corners[0],
                                ('~b~C0:~w~ %s %s %s'):format(math.round(pureCorners[0].x, 2),
                                    math.round(pureCorners[0].y, 2), math.round(pureCorners[0].z, 2)))
                            Utils.Draw3DText(corners[1],
                                ('~b~C1:~w~ %s %s %s'):format(math.round(pureCorners[1].x, 2),
                                    math.round(pureCorners[1].y, 2), math.round(pureCorners[1].z, 2)))
                            Utils.Draw3DText(corners[2],
                                ('~b~C2:~w~ %s %s %s'):format(math.round(pureCorners[2].x, 2),
                                    math.round(pureCorners[2].y, 2), math.round(pureCorners[2].z, 2)))
                            Utils.Draw3DText(corners[3],
                                ('~b~C3:~w~ %s %s %s'):format(math.round(pureCorners[3].x, 2),
                                    math.round(pureCorners[3].y, 2), math.round(pureCorners[3].z, 2)))
                        end

                        if Client.portalInfos then
                            local portalFlags = GetInteriorPortalFlag(Client.interiorId, portalId)
                            local portalRoomTo = GetInteriorPortalRoomTo(Client.interiorId, portalId)
                            local portalRoomFrom = GetInteriorPortalRoomFrom(Client.interiorId, portalId)

                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.2),
                                ('~b~Portal ~w~%s'):format(portalId))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.05),
                                ('~b~From ~w~%s~b~ To ~w~%s'):format(portalRoomFrom, portalRoomTo))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z - 0.1),
                                ('~b~Flags ~w~%s'):format(portalFlags))
                        end
                    end
                end
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)

RegisterNUICallback('setPortalBox', function(data, cb)
    Client.portalInfos = data.portalInfos
    Client.portalPoly = data.portalPoly
    Client.portalLines = data.portalLines
    Client.portalCorners = data.portalCorners
    cb(1)
end)


RegisterNUICallback('setTimecycle', function(data, cb)
    cb(1)
    if not data.timeCycle then return end
    Utils.setTimecycle(data.timeCycle)
    Utils.Notification('Timecycle set to ' .. data.timeCycle)
end)

RegisterNuiCallback('copyInteriorData', function(data, cb)
    cb(1)
    Utils.setClipBoard(data)
    Utils.Notification('Copied to clipboard')
end)
