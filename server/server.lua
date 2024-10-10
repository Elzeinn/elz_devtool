local function readJSONFile()
    local content = LoadResourceFile('17MovementTools', 'shared/data/worldeditor.json')
    return json.decode(content) or { presets = {} }
end

local function writeJSONFile(data)
    local jsonData = json.encode(data, { indent = true })
    SaveResourceFile('17MovementTools', '/shared/data/worldeditor.json', jsonData, -1)
end

lib.callback.register('elz_scripts:server:setTimeSync', function(source, data)
    if data then
        TriggerClientEvent('elz_scripts:client:syncTime', -1, data)
        return true
    end
    return false
end)

lib.callback.register('elz_scripts:server:setWeatherSync', function(source, data)
    if data.weather then
        TriggerClientEvent('elz_scripts:client:syncWeather', -1, data.weather)
        return true
    end
    return false
end)

lib.callback.register('elz_scripts:server:setFreezeTime', function(source, data)
    if data.time and data.freeze then
        TriggerClientEvent('elz_scripts:client:setFreezeTime', -1, data.time, data.freeze)
        return true
    end
    return false
end)

lib.callback.register('elz_scripts:server:savePreset', function(source, data)
    local database = readJSONFile()
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
    local options = {}
    for id, preset in pairs(database.presets) do
        table.insert(options, {
            id = id,
            name = preset.name
        })
    end

    return options
end)

lib.callback.register('saveCopiedObject', function(source, data)
    local database = readJSONFile()
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

lib.callback.register('elz_scripts:server:saveObjectPrest', function(source, data)
    local presetId = tostring(data.preset.id)
    local newObject = data.dataObjects
    local database = readJSONFile()
    if database.presets[presetId] then
        if not database.presets[presetId].objects then
            database.presets[presetId].objects = {}
        end
        local objectCount = #database.presets[presetId].objects + 1
        newObject.id = objectCount
        table.insert(database.presets[presetId].objects, newObject)
        writeJSONFile(database)
        return { success = true, message = "Object added and saved successfully!" }
    else
        return { success = false, message = "Preset not found!" }
    end
end)

lib.callback.register('deleteObject', function(source, data)
    local database = readJSONFile()
    local presetId = tostring(data.presetId)
    local objectId = data.objectId
    local presetFound = false
    local objectDeleted = false

    if database.presets[presetId] then
        presetFound = true
        local preset = database.presets[presetId]

        for i, obj in ipairs(preset.objects) do
            if obj.id == objectId then
                table.remove(preset.objects, i)
                obj[i] = {}
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

lib.callback.register('elz_scripts:server:getPreset', function(source)
    local option = {}
    for k, v in pairs(readJSONFile().presets) do
        option[k] = {
            id = k,
            name = v.name
        }
    end
    return option
end)

lib.callback.register('elz_scripts:server:getDataPreset', function(source)
    local database = readJSONFile()
    local dataObjectName = {}
    for object, value in pairs(database.presets) do
        dataObjectName[#dataObjectName + 1] = {
            id = object,
            name = value.label,
        }
    end
    return dataObjectName
end)

lib.callback.register('elz_scripts:server:getPresetObjectFromId', function(source, dataId)
    local database = readJSONFile()
    local objects = {}
    local presetId = tostring(tonumber(dataId))
    if database.presets[presetId] and database.presets[presetId].objects then
        objects = database.presets[presetId].objects
    end
    return objects
end)

lib.callback.register('elz_scripts:server:removePreset', function(source, id)
    local database = readJSONFile()
    for k, v in pairs(database.presets) do
        if tonumber(k) == tonumber(id) then
            database.presets[k] = nil
            break
        end
    end
    writeJSONFile(database)
end)
