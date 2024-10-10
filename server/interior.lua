local function getFileData(path, file)
    return json.decode(LoadResourceFile(cache.resource, path .. '/' .. file))
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


lib.callback.register('elz_script:server:getTimeCycle', function()
    return formatTimecycles(getFileData('shared/data', 'timecycle.json'))
end)
