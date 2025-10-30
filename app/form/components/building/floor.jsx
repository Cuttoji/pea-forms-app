import React, { useState } from 'react';

/**
 * FloorSection - Contains inspection items 2.17 to 2.21,
 * related to floor/unit electrical distribution.
 * * Props: value, onChange, getField, updateField, RadioOption
 */
const FloorSection = ({ getField, updateField, RadioOption }) => {
    // แผงจ่ายไฟประจำชั้น (2.17) หลายแผง
    const [floorPanels, setFloorPanels] = useState([
        {
            id: Date.now(),
            data: {},
            rooms: []
        }
    ]);

    // เพิ่มแผงจ่ายไฟใหม่
    const addFloorPanel = () => {
        setFloorPanels([
            ...floorPanels,
            {
                id: Date.now() + Math.random(),
                data: {},
                rooms: []
            }
        ]);
    };

    // เพิ่มห้องตรวจสอบในแผงจ่ายไฟ
    const addRoomCheck = (panelIdx) => {
        setFloorPanels(floorPanels.map((panel, idx) =>
            idx === panelIdx
                ? { ...panel, rooms: [...panel.rooms, { id: Date.now() + Math.random(), data: {} }] }
                : panel
        ));
    };

    // อัปเดตข้อมูลในแผงจ่ายไฟ
    const updatePanelData = (panelIdx, path, value) => {
        setFloorPanels(floorPanels.map((panel, idx) =>
            idx === panelIdx
                ? { ...panel, data: { ...panel.data, [path]: value } }
                : panel
        ));
    };

    // อัปเดตข้อมูลในห้องตรวจสอบ
    const updateRoomData = (panelIdx, roomIdx, path, value) => {
        setFloorPanels(floorPanels.map((panel, idx) =>
            idx === panelIdx
                ? {
                    ...panel,
                    rooms: panel.rooms.map((room, rIdx) =>
                        rIdx === roomIdx
                            ? { ...room, data: { ...room.data, [path]: value } }
                            : room
                    )
                }
                : panel
        ));
    };

    // RadioOnlyCheck
    const RadioOnlyCheck = ({ label, value, onChange }) => (
        <div>
            {label && <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>}
            <RadioOption
                name={label}
                selectedValue={value?.result}
                options={[
                    { label: 'ถูกต้อง', value: 'correct' },
                    { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={val => onChange({ ...value, result: val })}
            />
            {value?.result === 'incorrect' && (
                <textarea
                    className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                    rows={2}
                    value={value?.remark || ''}
                    onChange={e => onChange({ ...value, remark: e.target.value })}
                    placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
            )}
        </div>
    );

    // InputCheckSection
    const InputCheckSection = ({ label, value, onChange, inputs }) => (
        <div>
            {label && <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>}
            <div className="flex flex-wrap gap-6 mb-2">
                {inputs.map(({ key, unit, label: inputLabel }) => (
                    <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 min-w-[40px]">{inputLabel || key.toUpperCase()}:</label>
                        <input
                            type="text"
                            className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                            value={value?.[key] || ''}
                            onChange={e => onChange({ ...value, [key]: e.target.value })}
                            placeholder={key.toUpperCase()}
                        />
                        <span className="text-sm text-gray-600">{unit}</span>
                    </div>
                ))}
            </div>
            <RadioOption
                name={label}
                selectedValue={value?.result}
                options={[
                    { label: 'ถูกต้อง', value: 'correct' },
                    { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={val => onChange({ ...value, result: val })}
            />
            {value?.result === 'incorrect' && (
                <textarea
                    className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                    rows={2}
                    value={value?.remark || ''}
                    onChange={e => onChange({ ...value, remark: e.target.value })}
                    placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            {floorPanels.map((panel, panelIdx) => (
                <div key={panel.id} className="space-y-4 border-b pb-6 mb-6">
                    <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
                        2.17 แผงจ่ายไฟประจำชั้น {panelIdx + 1}
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        <RadioOnlyCheck
                            label="2.17.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน"
                            value={panel.data.cb_standard}
                            onChange={val => updatePanelData(panelIdx, 'cb_standard', val)}
                        />
                        <InputCheckSection
                            label="2.17.2 Feeder"
                            value={panel.data.feeder}
                            onChange={val => updatePanelData(panelIdx, 'feeder', val)}
                            inputs={[
                                { key: 'at', unit: 'A' },
                                { key: 'af', unit: 'A' },
                                { key: 'ic', unit: 'kA' },
                            ]}
                        />
                        <RadioOnlyCheck
                            label="2.17.3 ขั้วต่อสายดิน"
                            value={panel.data.ground_bus}
                            onChange={val => updatePanelData(panelIdx, 'ground_bus', val)}
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        onClick={() => addRoomCheck(panelIdx)}
                    >
                        + เพิ่มห้องชุด
                    </button>
                    {panel.rooms.map((room, roomIdx) => (
                        <div key={room.id} className="mt-6 space-y-4 border-l-4 border-purple-200 pl-4">
                            <h5 className="text-md font-bold text-purple-700 mb-2">
                                ห้องที่ {roomIdx + 1}
                            </h5>
                            <InputCheckSection
                                label="2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์"
                                value={room.data.meterBreaker}
                                onChange={val => updateRoomData(panelIdx, roomIdx, 'meterBreaker', val)}
                                inputs={[
                                    { key: 'at', unit: 'A' },
                                    { key: 'af', unit: 'A' },
                                    { key: 'ic', unit: 'kA' },
                                ]}
                            />
                            {/* 2.19 สายตัวนำประธานเข้าห้องชุด */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">2.19 สายตัวนำประธานเข้าห้องชุด</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">ชนิด:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                                            value={room.data?.roomConductor?.type || ''}
                                            onChange={e => updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, type: e.target.value })}
                                            placeholder="ชนิดสายไฟ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">ขนาด:</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                                                value={room.data?.roomConductor?.size || ''}
                                                onChange={e => updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, size: e.target.value })}
                                                placeholder="ขนาด"
                                            />
                                            <span className="text-sm text-gray-600">ตร.มม.</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">วิธีการเดินสาย:</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[{label: 'ท่อร้อยสาย (Conduit)', value: 'conduit' },
                                            { label: 'รางเดินสาย (Wire Way)', value: 'wireway' },
                                            { label: 'อื่นๆ', value: 'other' }
                                        ].map(opt => (
                                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={(room.data?.roomConductor?.methods || []).includes(opt.value)}
                                                    onChange={e => {
                                                        const current = room.data?.roomConductor?.methods || [];
                                                        const updated = e.target.checked
                                                            ? [...current, opt.value]
                                                            : current.filter(v => v !== opt.value);
                                                        updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, methods: updated });
                                                    }}
                                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span className="text-sm text-gray-700">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {(room.data?.roomConductor?.methods || []).includes('other') && (
                                        <input
                                            type="text"
                                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                                            value={room.data?.roomConductor?.other || ''}
                                            onChange={e => updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, other: e.target.value })}
                                            placeholder="ระบุวิธีการอื่นๆ"
                                        />
                                    )}
                                </div>
                                <RadioOption
                                    name="room-conductor-result"
                                    selectedValue={room.data?.roomConductor?.result}
                                    options={[
                                        { label: 'ถูกต้อง', value: 'correct' },
                                        { label: 'ต้องแก้ไข', value: 'incorrect' }
                                    ]}
                                    onSelect={val => updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, result: val })}
                                />
                                {room.data?.roomConductor?.result === 'incorrect' && (
                                    <textarea
                                        className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                                        rows={2}
                                        value={room.data?.roomConductor?.remark || ''}
                                        onChange={e => updateRoomData(panelIdx, roomIdx, 'roomConductor', { ...room.data.roomConductor, remark: e.target.value })}
                                        placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                                    />
                                )}
                            </div>
                            <div>
                                <h6 className="font-semibold text-gray-700 mt-4 mb-2">2.20 แผงจ่ายไฟในห้องชุด</h6>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                    <RadioOnlyCheck
                                        label="2.20.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน"
                                        value={room.data?.roomPanel?.cb_standard}
                                        onChange={val => updateRoomData(panelIdx, roomIdx, 'roomPanel', { ...room.data.roomPanel, cb_standard: val })}
                                    />
                                    <InputCheckSection
                                        label="2.20.2 Meter"
                                        value={room.data?.roomPanel?.meter}
                                        onChange={val => updateRoomData(panelIdx, roomIdx, 'roomPanel', { ...room.data.roomPanel, meter: val })}
                                        inputs={[
                                            { key: 'at', unit: 'A' },
                                            { key: 'af', unit: 'A' },
                                        ]}
                                    />
                                    <RadioOnlyCheck
                                        label="2.20.3 IC"
                                        value={room.data?.roomPanel?.ic}
                                        onChange={val => updateRoomData(panelIdx, roomIdx, 'roomPanel', { ...room.data.roomPanel, ic: val })}
                                    />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold text-gray-700 mt-4 mb-2">2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน</h6>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                    <RadioOnlyCheck
                                        label="2.21 ขั้วต่อสายดิน"
                                        value={room.data?.roomPanelGroundBus}
                                        onChange={val => updateRoomData(panelIdx, roomIdx, 'roomPanelGroundBus', val)}
                                    />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold text-gray-700 mt-4 mb-2">2.22 อื่นๆ</h6>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                                    rows={2}
                                    value={room.data?.note || ''}
                                    onChange={e => updateRoomData(panelIdx, roomIdx, 'note', e.target.value)}
                                    placeholder="กรุณาระบุรายละเอียดเพิ่มเติม"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <button
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                onClick={addFloorPanel}
            >
                + เพิ่มแผงจ่ายไฟประจำชั้น
            </button>
        </div>
    );
};

export default FloorSection;