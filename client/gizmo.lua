dataView = setmetatable({
    EndBig = ">",
    EndLittle = "<",
    Types = {
        Int8 = { code = "i1" },
        Uint8 = { code = "I1" },
        Int16 = { code = "i2" },
        Uint16 = { code = "I2" },
        Int32 = { code = "i4" },
        Uint32 = { code = "I4" },
        Int64 = { code = "i8" },
        Uint64 = { code = "I8" },
        Float32 = { code = "f", size = 4 },  -- a float (native size)
        Float64 = { code = "d", size = 8 },  -- a double (native size)

        LuaInt = { code = "j" },             -- a lua_Integer
        UluaInt = { code = "J" },            -- a lua_Unsigned
        LuaNum = { code = "n" },             -- a lua_Number
        String = { code = "z", size = -1, }, -- zero terminated string
    },

    FixedTypes = {
        String = { code = "c" }, -- a fixed-sized string with n bytes
        Int = { code = "i" },    -- a signed int with n bytes
        Uint = { code = "I" },   -- an unsigned int with n bytes
    },
}, {
    __call = function(_, length)
        return dataView.ArrayBuffer(length)
    end
})
dataView.__index = dataView

--[[ Create an ArrayBuffer with a size in bytes --]]
function dataView.ArrayBuffer(length)
    return setmetatable({
        blob = string.blob(length),
        length = length,
        offset = 1,
        cangrow = true,
    }, dataView)
end

--[[ Wrap a non-internalized string --]]
function dataView.Wrap(blob)
    return setmetatable({
        blob = blob,
        length = blob:len(),
        offset = 1,
        cangrow = true,
    }, dataView)
end

--[[ Return the underlying bytebuffer --]]
function dataView:Buffer() return self.blob end

function dataView:ByteLength() return self.length end

function dataView:ByteOffset() return self.offset end

function dataView:SubView(offset, length)
    return setmetatable({
        blob = self.blob,
        length = length or self.length,
        offset = 1 + offset,
        cangrow = false,
    }, dataView)
end

--[[ Return the Endianness format character --]]
local function ef(big) return (big and dataView.EndBig) or dataView.EndLittle end

--[[ Helper function for setting fixed datatypes within a buffer --]]
local function packblob(self, offset, value, code)
    -- If cangrow is false the dataview represents a subview, i.e., a subset
    -- of some other string view. Ensure the references are the same before
    -- updating the subview
    local packed = self.blob:blob_pack(offset, code, value)
    if self.cangrow or packed == self.blob then
        self.blob = packed
        self.length = packed:len()
        return true
    else
        return false
    end
end

--[[
    Create the API by using dataView.Types
--]]
for label, datatype in pairs(dataView.Types) do
    if not datatype.size then -- cache fixed encoding size
        datatype.size = string.packsize(datatype.code)
    elseif datatype.size >= 0 and string.packsize(datatype.code) ~= datatype.size then
        local msg = "Pack size of %s (%d) does not match cached length: (%d)"
        error(msg:format(label, string.packsize(datatype.code), datatype.size))
        return nil
    end

    dataView["Get" .. label] = function(self, offset, endian)
        offset = offset or 0
        if offset >= 0 then
            local o = self.offset + offset
            local v, _ = self.blob:blob_unpack(o, ef(endian) .. datatype.code)
            return v
        end
        return nil
    end

    dataView["Set" .. label] = function(self, offset, value, endian)
        if offset >= 0 and value then
            local o = self.offset + offset
            local v_size = (datatype.size < 0 and value:len()) or datatype.size
            if self.cangrow or ((o + (v_size - 1)) <= self.length) then
                if not packblob(self, o, value, ef(endian) .. datatype.code) then
                    error("cannot grow subview")
                end
            else
                error("cannot grow dataview")
            end
        end
        return self
    end
end

for label, datatype in pairs(dataView.FixedTypes) do
    datatype.size = -1 -- Ensure cached encoding size is invalidated

    dataView["GetFixed" .. label] = function(self, offset, typelen, endian)
        if offset >= 0 then
            local o = self.offset + offset
            if (o + (typelen - 1)) <= self.length then
                local code = ef(endian) .. "c" .. tostring(typelen)
                local v, _ = self.blob:blob_unpack(o, code)
                return v
            end
        end
        return nil -- Out of bounds
    end

    dataView["SetFixed" .. label] = function(self, offset, typelen, value, endian)
        if offset >= 0 and value then
            local o = self.offset + offset
            if self.cangrow or ((o + (typelen - 1)) <= self.length) then
                local code = ef(endian) .. "c" .. tostring(typelen)
                if not packblob(self, o, value, code) then
                    error("cannot grow subview")
                end
            else
                error("cannot grow dataview")
            end
        end
        return self
    end
end

local dataview = dataView

local enableScale = false

local gizmoEnabled = false
local currentMode = 'translate'
local isRelative = false
local currentEntity

-- FUNCTIONS

local function normalize(x, y, z)
    local length = math.sqrt(x * x + y * y + z * z)
    if length == 0 then
        return 0, 0, 0
    end
    return x / length, y / length, z / length
end

local function makeEntityMatrix(entity)
    local f, r, u, a = GetEntityMatrix(entity)
    local view = dataview.ArrayBuffer(60)

    view:SetFloat32(0, r[1])
        :SetFloat32(4, r[2])
        :SetFloat32(8, r[3])
        :SetFloat32(12, 0)
        :SetFloat32(16, f[1])
        :SetFloat32(20, f[2])
        :SetFloat32(24, f[3])
        :SetFloat32(28, 0)
        :SetFloat32(32, u[1])
        :SetFloat32(36, u[2])
        :SetFloat32(40, u[3])
        :SetFloat32(44, 0)
        :SetFloat32(48, a[1])
        :SetFloat32(52, a[2])
        :SetFloat32(56, a[3])
        :SetFloat32(60, 1)

    return view
end

local function applyEntityMatrix(entity, view)
    local x1, y1, z1 = view:GetFloat32(16), view:GetFloat32(20), view:GetFloat32(24)
    local x2, y2, z2 = view:GetFloat32(0), view:GetFloat32(4), view:GetFloat32(8)
    local x3, y3, z3 = view:GetFloat32(32), view:GetFloat32(36), view:GetFloat32(40)
    local tx, ty, tz = view:GetFloat32(48), view:GetFloat32(52), view:GetFloat32(56)

    if not enableScale then
        x1, y1, z1 = normalize(x1, y1, z1)
        x2, y2, z2 = normalize(x2, y2, z2)
        x3, y3, z3 = normalize(x3, y3, z3)
    end

    SetEntityMatrix(entity,
        x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3,
        tx, ty, tz
    )
end

-- LOOPS

local modeStatus = false
local function SetModeFocus()
    if IsControlJustPressed(0, 38) then
        if not modeStatus then
            modeStatus = true
            LeaveCursorMode()
        else
            modeStatus = false
            EnterCursorMode()
        end
    end
end


local function gizmoLoop(entity)
    if not gizmoEnabled then
        return LeaveCursorMode()
    end

    EnterCursorMode()
    if IsEntityAPed(entity) then
        SetEntityAlpha(entity, 200)
    else
        SetEntityDrawOutline(entity, true)
    end

    while gizmoEnabled and DoesEntityExist(entity) do
        Wait(0)
        SetModeFocus()
        DisableControlAction(0, 24, true)  -- lmb
        DisableControlAction(0, 25, true)  -- rmb
        DisableControlAction(0, 140, true) -- r
        DisablePlayerFiring(PlayerId(), true)

        local matrixBuffer = makeEntityMatrix(entity)
        local changed = Citizen.InvokeNative(0xEB2EDCA2, matrixBuffer:Buffer(), 'Editor1',
            Citizen.ReturnResultAnyway())

        if changed then
            applyEntityMatrix(entity, matrixBuffer)
        end
    end

    LeaveCursorMode()

    if DoesEntityExist(entity) then
        if IsEntityAPed(entity) then SetEntityAlpha(entity, 255) end
        SetEntityDrawOutline(entity, false)
    end
    modeStatus = false
    gizmoEnabled = false
    currentEntity = nil
end

local function textUILoop()
    CreateThread(function()
        while gizmoEnabled do
            Wait(100)
            local scaleText = (enableScale and '[S]     - Scale Mode  \n') or ''

            Utils.TextUi(
                ('Current Mode: %s | %s  \n'):format(currentMode, (isRelative and 'Relative') or 'World') ..
                '[W]     - Translate Mode  \n' ..
                '[R]     - Rotate Mode  \n' ..
                scaleText ..
                '[Q]     - Relative/World  \n' ..
                '[LALT]  - Snap To Ground  \n' ..
                '[ENTER] - Done Editing  \n' ..
                '[E] - Change Mode Focus'
            )
        end
        Utils.HideTextUi()
    end)
end

-- EXPORTS

function useGizmo(entity)
    gizmoEnabled = true
    currentEntity = entity
    textUILoop()
    gizmoLoop(entity)

    return {
        handle = entity,
        position = GetEntityCoords(entity),
        rotation = GetEntityRotation(entity)
    }
end

-- exports("useGizmo", useGizmo)


-- Gizmo select
RegisterCommand('+gizmoSelect', function()
    if not gizmoEnabled then return end
    -- Logic for selecting the gizmo
    ExecuteCommand('+gizmoSelect')
end, false)

RegisterCommand('-gizmoSelect', function()
    ExecuteCommand('-gizmoSelect')
end, false)

RegisterKeyMapping('+gizmoSelect', 'Selects the currently highlighted gizmo', 'mouse_button', 'MOUSE_LEFT')

-- Gizmo translation mode
RegisterCommand('+gizmoTranslation', function()
    if not gizmoEnabled then return end
    currentMode = 'Translate'
    ExecuteCommand('+gizmoTranslation')
end, false)

RegisterCommand('-gizmoTranslation', function()
    ExecuteCommand('-gizmoTranslation')
end, false)

RegisterKeyMapping('+gizmoTranslation', 'Sets mode of the gizmo to translation', 'keyboard', 'W')

-- Gizmo rotation mode
RegisterCommand('+gizmoRotation', function()
    if not gizmoEnabled then return end
    currentMode = 'Rotate'
    ExecuteCommand('+gizmoRotation')
end, false)

RegisterCommand('-gizmoRotation', function()
    ExecuteCommand('-gizmoRotation')
end, false)

RegisterKeyMapping('+gizmoRotation', 'Sets mode for the gizmo to rotation', 'keyboard', 'R')

-- Gizmo local/world toggle
RegisterCommand('+gizmoLocal', function()
    if not gizmoEnabled then return end
    isRelative = not isRelative
    ExecuteCommand('+gizmoLocal')
end, false)

RegisterCommand('-gizmoLocal', function()
    ExecuteCommand('-gizmoLocal')
end, false)

RegisterKeyMapping('+gizmoLocal', 'Toggle gizmo to be local to the entity instead of world', 'keyboard', 'Q')

-- Close gizmo
RegisterCommand('gizmoclose', function()
    if not gizmoEnabled then return end
    gizmoEnabled = false
end, false)

RegisterKeyMapping('gizmoclose', 'Close gizmo', 'keyboard', 'RETURN')

-- Snap object to ground
RegisterCommand('gizmoSnapToGround', function()
    if not gizmoEnabled then return end
    PlaceObjectOnGroundProperly_2(currentEntity)
end, false)

RegisterKeyMapping('gizmoSnapToGround', 'Snap current gizmo object to floor/surface', 'keyboard', 'LMENU')

-- Gizmo scale mode (conditional on enableScale being true)
if enableScale then
    RegisterCommand('+gizmoScale', function()
        if not gizmoEnabled then return end
        currentMode = 'Scale'
        ExecuteCommand('+gizmoScale')
    end, false)

    RegisterCommand('-gizmoScale', function()
        ExecuteCommand('-gizmoScale')
    end, false)

    RegisterKeyMapping('+gizmoScale', 'Sets mode for the gizmo to scale', 'keyboard', 'S')
end
