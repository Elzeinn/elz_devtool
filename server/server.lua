-- Variable
local ServerCallback = {}

-- Function
local function CreateCallback(name, cb)
    ServerCallback[name] = cb
end

local function TriggerCallback(name, source, cb, ...)
    if not ServerCallback[name] then return end
    ServerCallback[name](source, cb, ...)
end

local function formatTimecycles(timecycles)
    local formatedTimecycles = {}

    for i = 1, #timecycles do
        local v = timecycles[i]
        local found
        for j = 1, #formatedTimecycles do
            if formatedTimecycles[j].label == v.Name then
                found = true
                break
            end
        end
        if not found then
            table.insert(formatedTimecycles, { label = v.Name, value = tostring(joaat(v.Name)) })
        end
    end
    table.sort(formatedTimecycles, function(a, b) return a.label < b.label end)
    return formatedTimecycles
end

local function getFileData(path, file)
    return json.decode(LoadResourceFile(GetCurrentResourceName(), path .. '/' .. file))
end

local function writeJSONFile(data)
    local jsonData = json.encode(data, { indent = true })
    SaveResourceFile(GetCurrentResourceName(), '/shared/data/worldeditor.json', jsonData, -1)
end

-- Event Callback
RegisterNetEvent('elz_scripts:server:triggerCallback', function(name, ...)
    local src = source
    TriggerCallback(name, src, function(...)
        TriggerClientEvent('elz_scripts:client:triggerCallback', src, name, ...)
    end, ...)
end)

-- Weather Section --

CreateCallback('elz_scripts:server:getTimeCycle', function(source, cb)
    cb(formatTimecycles(getFileData('shared/data', 'timecycle.json')))
end)

CreateCallback('elz_scripts:server:setTimeSync', function(source, cb, data)
    if data then
        TriggerClientEvent('elz_scripts:client:syncTime', -1, data)
        cb(true)
    end
    cb(false)
end)

CreateCallback('elz_scripts:server:setWeatherSync', function(source, cb, data)
    if data.weather then
        TriggerClientEvent('elz_scripts:client:syncWeather', -1, data.weather)
        cb(true)
    end
    cb(false)
end)

CreateCallback('elz_scripts:server:setFreezeTime', function(source, cb, data)
    if data.time and data.freeze then
        TriggerClientEvent('elz_scripts:client:setFreezeTime', -1, data.time, data.freeze)
        cb(true)
    end
    cb(false)
end)

-- End Weather Section



-- World Editor Section

CreateCallback('elz_scripts:server:GetDataWorld', function(source, cb)
    for k, v in pairs(getFileData('shared/data', 'worldeditor.json')) do
        cb(v)
    end
end)

CreateCallback('elz_scripts:server:savePreset', function(source, cb, data)
    local database = getFileData('shared/data', 'worldeditor.json')
    if type(database.presets) ~= "table" then
        database.presets = {}
    end
    local presetId = tostring(data.id)
    if not database.presets[presetId] then
        database.presets[presetId] = {
            name = data.name,
            label = data.label or "Preset " .. presetId,
            objects = {}
        }
    end
    writeJSONFile(database)
    Wait(100)
    cb(database)
end)

CreateCallback('elz_scripts:server:removePreset', function(source, cb, id)
    local database = getFileData('shared/data', 'worldeditor.json')
    for k, v in pairs(database.presets) do
        if tonumber(k) == tonumber(id) then
            database.presets[k] = nil
            break
        end
    end
    writeJSONFile(database)
    cb(true)
end)

CreateCallback('elz_scripts:server:saveCopiedObject', function(source, cb, data)
    local database = getFileData('shared/data', 'worldeditor.json')
    local presetFound = false
    for _, preset in ipairs(database.presets) do
        if preset.id == data.presetId then
            presetFound = true
            table.insert(preset.objects, {
                id = #preset.objects + 1,
                name = data.newObject.name,
                propModel = data.newObject.propModel,
                position = data.newObject.position,
                rotation = data.newObject.rotation
            })
            break
        end
    end

    if presetFound then
        writeJSONFile(database)
        return { success = true, message = "Object copied and saved successfully!" }
    else
        return { success = false, message = "Preset not found!" }
    end
end)

CreateCallback('elz_scripts:server:deleteObject', function(source, cb, data)
    local database = getFileData('shared/data', 'worldeditor.json')
    local presetId = tostring(data.presetId)
    local presetFound = false
    local objectDeleted = false
    if database.presets[presetId] then
        presetFound = true
        local preset = database.presets[presetId]
        for k, v in pairs(preset.objects) do
            if not v.entity then
                print('not entity')
                return
            end
            if v.entity == data.entity then
                database.presets[presetId].objects[k] = nil
                objectDeleted = true
                break
            end
        end
    end
    if presetFound and objectDeleted then
        writeJSONFile(database)
        return { success = true, message = "Object deleted successfully!" }
    elseif not presetFound then
        return { success = false, message = "Preset not found!" }
    elseif not objectDeleted then
        return { success = false, message = "Object not found!" }
    end
end)

CreateCallback('elz_scripts:server:saveObjectPreset', function(source, cb, data)
    local presetId = tostring(data.preset.id)
    local database = getFileData('shared/data', 'worldeditor.json')
    local newObject = data.dataObjects[presetId].objects
    if database.presets[presetId] then
        if not database.presets[presetId].objects then
            database.presets[presetId].objects = {}
        end
        database.presets[presetId].objects = newObject
        writeJSONFile(database)
        return { success = true, message = "Object updated and saved successfully!" }
    else
        return { success = false, message = "Preset not found!" }
    end
end)

CreateCallback('elz_scripts:server:getPreset', function(source, cb)
    local option = {}
    local fileData = getFileData('shared/data', 'worldeditor.json')
    for k, v in pairs(fileData.presets) do
        option[k] = {
            id = k,
            name = v.name
        }
    end
    cb(option)
end)

CreateCallback('elz_scripts:server:getAllObjectList', function(source, cb)
    local database = getFileData('shared/data', 'worldeditor.json')
    cb(database.presets)
end)



-- End World Editor Section
