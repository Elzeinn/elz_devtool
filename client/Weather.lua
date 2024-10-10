local timeToFreeze = {}
local freezeTime = false


RegisterNuiCallback('setTimeWeather', function(data, cb)
    lib.callback.await('elz_scripts:server:setTimeSync', false, data)
end)

RegisterNetEvent('elz_scripts:client:syncTime', function(data)
    NetworkOverrideClockTime(tonumber(data.time.hours), tonumber(data.time.minutes), tonumber(data.time.seconds))
end)

RegisterNuiCallback('setWeather', function(data, cb)
    lib.callback.await('elz_scripts:server:setWeatherSync', false, data)
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
    lib.callback.await('elz_scripts:server:setFreezeTime', false, data)
end)

RegisterCommand('getTime', function()
    local hours = GetClockHours()
    local minutes = GetClockMinutes()
    local seconds = GetClockSeconds()
    return { hours = hours, minutes = minutes, seconds = seconds }
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
    while data.freeze do
        print(data.freeze)
        print('tes')
        ClearOverrideWeather()
        ClearWeatherTypePersist()
        SetWeatherTypePersist(data.weather)
        SetWeatherTypeNow(data.weather)
        SetWeatherTypeNowPersist(data.weather)
        Wait(5000)
    end
end)
