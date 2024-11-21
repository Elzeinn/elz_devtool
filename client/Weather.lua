local timeToFreeze = {}
local freezeTime = false

RegisterNuiCallback('setTimeWeather', function(data, cb)
    TriggerCallback('elz_scripts:server:setTimeSync', function() end, data)
    cb('ok')
end)

RegisterNetEvent('elz_scripts:client:syncTime', function(data)
    Utils.Notification('Time set to ' .. data.time.hours .. ':' .. data.time.minutes .. ':' .. data.time.seconds)
    NetworkOverrideClockTime(tonumber(data.time.hours), tonumber(data.time.minutes), tonumber(data.time.seconds))
end)

RegisterNuiCallback('setWeather', function(data, cb)
    Utils.Notification('Weather set to ' .. data.weather)
    TriggerCallback('elz_scripts:server:setWeatherSync', function() end, data)
    cb('ok')
end)

RegisterNetEvent('elz_scripts:client:syncWeather', function(weather)
    if not weather then return end
    ClearOverrideWeather()
    ClearWeatherTypePersist()
    SetWeatherTypePersist(weather)
    SetWeatherTypeNow(weather)
    SetWeatherTypeNowPersist(weather)
end)

RegisterNuiCallback('setFreezeTime', function(data, cb)
    freezeTime = data.freeze
    Utils.Notification('Freeze Time set to ' .. data.time.hours .. ':' .. data.time.minutes .. ':' .. data.time.seconds)
    TriggerCallback('elz_scripts:server:setFreezeTime', function() end, data)
    cb('ok')
end)

RegisterNetEvent('elz_scripts:client:setFreezeTime', function(time, freeze)
    timeToFreeze = time
    while freezeTime do
        Wait(1000)
        NetworkOverrideClockTime(tonumber(timeToFreeze.hours), tonumber(timeToFreeze.minutes),
            tonumber(timeToFreeze.seconds))
    end
end)

RegisterNuiCallback('setFreezeWeather', function(data, cb)
    if not data.weather then return end
    Utils.Notification('Weather set to ' .. data.weather)
    while data.freeze do
        ClearOverrideWeather()
        ClearWeatherTypePersist()
        SetWeatherTypePersist(data.weather)
        SetWeatherTypeNow(data.weather)
        SetWeatherTypeNowPersist(data.weather)
        Wait(5000)
    end
    cb('ok')
end)
