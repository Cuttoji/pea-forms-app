import React, { useState } from 'react';

const LVSystemSection = () => {
    const [formData, setFormData] = useState({
        // 5.1.1 Main conductor standards
        standard: '',
        standardCorrect: null,
        standardNote: '',
        // 5.1.2 Conductor type
        conductorType: '',
        otherConductorType: '',
        // 5.1.3 Phase wire size
        phaseWireSize: '',
        phaseWireSizeCorrect: null,
        phaseWireSizeNote: '',
        // 5.1.4 Neutral wire size
        neutralWireSize: '',
        neutralWireSizeCorrect: null,
        neutralWireSizeNote: '',
        // 5.1.5 Phase identification
        phaseIdentificationCorrect: null,
        phaseIdentificationNote: '',
        // 5.1.6 Cable pathway
        cablePathwayCorrect: null,
        cablePathwayNote: '',
        // 5.1.7 Wiring method
        wiringMethod: '',
        cableTraySize: { width: '', height: '' },
        conduitSize: '',
        conduitSizeWall: '',
        otherWiringMethod: '',
        wiringMethodCorrect: null,
        wiringMethodNote: '',
        // 5.1.8 Conduit type
        conduitType: '',
        otherConduitType: '',
        conduitTypeCorrect: null,
        conduitTypeNote: '',
        // 5.2 Main switch overcurrent protection
        mainBreakerStandardCorrect: null,
        mainBreakerStandardNote: '',
        mainBreakerSize: '',
        mainBreakerSizeCorrect: null,
        mainBreakerSizeNote: '',
        shortCircuitRating: '',
        shortCircuitRatingCorrect: null,
        shortCircuitRatingNote: '',
        groundFaultProtectionCorrect: null,
        groundFaultProtectionNote: '',
        // 5.3 Grounding system
        groundWireSize: '',
        groundWireSizeCorrect: null,
        groundWireSizeNote: '',
        groundingSystem: '',
        groundingSystemCorrect: null,
        groundingSystemNote: '',
        // 5.4 Grounding configuration
        groundingConfig: '',
        // 5.4.1 TN-C-S system measures
        tncsLoadBalance: false,
        tncsNeutralProtection: false,
        tncsTouchVoltageProtection: false,
        tncsCorrect: null,
        tncsNote: '',
        // 5.4.2 TT system
        ttCorrect: null,
        ttNote: '',
        // 5.4.3 TT partial system
        ttPartialCorrect: null,
        ttPartialNote: '',
        // 5.4.4 TN-S system
        tnsCorrect: null,
        tnsNote: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderCorrectIncorrectField = (name, correctField, noteField, isTextarea = false, rows = 1) => (
        <div className="mt-3">
            <div className="flex items-start gap-6">
                <label className="flex items-center gap-2 min-w-20">
                    <input
                        type="radio"
                        name={name}
                        checked={formData[correctField] === true}
                        onChange={() => handleInputChange(correctField, true)}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-green-700">ถูกต้อง</span>
                </label>
                <label className="flex items-center gap-2 min-w-24">
                    <input
                        type="radio"
                        name={name}
                        checked={formData[correctField] === false}
                        onChange={() => handleInputChange(correctField, false)}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-red-700">ต้องแก้ไข</span>
                </label>
                {formData[correctField] === false && (
                    <div className="flex-1">
                        {isTextarea ? (
                            <textarea
                                value={formData[noteField] || ''}
                                onChange={(e) => handleInputChange(noteField, e.target.value)}
                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                                rows={rows}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        ) : (
                            <input
                                type="text"
                                value={formData[noteField] || ''}
                                onChange={(e) => handleInputChange(noteField, e.target.value)}
                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 text-gray-700">
            {/* 5.1 Main Low Voltage Circuit */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">5.1 วงจรประธานแรงต่ำ </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* 5.1.1 Standards */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน
                        </label>
                        <div className="flex flex-wrap gap-4 mb-3">
                            {['มอก. 11-2553', 'มอก. 293-2541', 'IEC 60502'].map((std) => (
                                <label key={std} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="standard"
                                        value={std}
                                        checked={formData.standard === std}
                                        onChange={() => handleInputChange('standard', std)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">{std}</span>
                                </label>
                            ))}
                        </div>
                        {renderCorrectIncorrectField('standard_status', 'standardCorrect', 'standardNote')}
                    </div>

                    {/* 5.1.2 Conductor Type */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">5.1.2 ชนิดสายตัวนำ</label>
                        <div className="flex flex-wrap gap-4">
                            {['IEC01', 'NYY', 'CV'].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="conductor_type"
                                        value={type}
                                        checked={formData.conductorType === type}
                                        onChange={() => handleInputChange('conductorType', type)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">{type}</span>
                                </label>
                            ))}
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="conductor_type"
                                    value="other"
                                    checked={formData.conductorType === 'other'}
                                    onChange={() => handleInputChange('conductorType', 'other')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">อื่นๆ</span>
                                {formData.conductorType === 'other' && (
                                    <input
                                        type="text"
                                        value={formData.otherConductorType}
                                        onChange={(e) => handleInputChange('otherConductorType', e.target.value)}
                                        placeholder="ระบุ"
                                        className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm w-32"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 5.1.3 Phase Wire Size */}
                    <div className="form-group">
                        <div className="flex items-center gap-3 mb-2">
                            <label className="text-sm font-medium text-gray-700">5.1.3 ขนาดสายเฟส</label>
                            <input
                                type="text"
                                value={formData.phaseWireSize}
                                onChange={(e) => handleInputChange('phaseWireSize', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
                            />
                            <span className="text-sm text-gray-600">ตร.มม.</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md mb-3">
                            <p className="text-sm text-gray-700">
                                พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                            </p>
                        </div>
                        {renderCorrectIncorrectField('phase_wire_status', 'phaseWireSizeCorrect', 'phaseWireSizeNote')}
                    </div>

                    {/* 5.1.4 Neutral Wire Size */}
                    <div className="form-group">
                        <div className="flex items-center gap-3 mb-2">
                            <label className="text-sm font-medium text-gray-700">5.1.4 ขนาดสายนิวทรัล</label>
                            <input
                                type="text"
                                value={formData.neutralWireSize}
                                onChange={(e) => handleInputChange('neutralWireSize', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
                            />
                            <span className="text-sm text-gray-600">ตร.มม.</span>
                        </div>
                        {renderCorrectIncorrectField('neutral_wire_status', 'neutralWireSizeCorrect', 'neutralWireSizeNote')}
                    </div>

                    {/* 5.1.5 Phase Identification */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                        </label>
                        {renderCorrectIncorrectField('phase_id_status', 'phaseIdentificationCorrect', 'phaseIdentificationNote')}
                    </div>

                    {/* 5.1.6 Cable Pathway */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                        </label>
                        {renderCorrectIncorrectField('cable_pathway_status', 'cablePathwayCorrect', 'cablePathwayNote')}
                    </div>

                    {/* 5.1.7 Wiring Method */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">5.1.7 วิธีการเดินสาย</label>
                        <div className="space-y-3 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="overhead"
                                    checked={formData.wiringMethod === 'overhead'}
                                    onChange={() => handleInputChange('wiringMethod', 'overhead')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                            </label>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="cable_tray"
                                    checked={formData.wiringMethod === 'cable_tray'}
                                    onChange={() => handleInputChange('wiringMethod', 'cable_tray')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                                <input
                                    type="text"
                                    value={formData.cableTraySize.width}
                                    onChange={(e) => handleInputChange('cableTraySize', {...formData.cableTraySize, width: e.target.value})}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                                    disabled={formData.wiringMethod !== 'cable_tray'}
                                />
                                <span className="text-sm">มม. x</span>
                                <input
                                    type="text"
                                    value={formData.cableTraySize.height}
                                    onChange={(e) => handleInputChange('cableTraySize', {...formData.cableTraySize, height: e.target.value})}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                                    disabled={formData.wiringMethod !== 'cable_tray'}
                                />
                                <span className="text-sm">มม.</span>
                            </div>
                            
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="direct_burial"
                                    checked={formData.wiringMethod === 'direct_burial'}
                                    onChange={() => handleInputChange('wiringMethod', 'direct_burial')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                            </label>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="underground_conduit"
                                    checked={formData.wiringMethod === 'underground_conduit'}
                                    onChange={() => handleInputChange('wiringMethod', 'underground_conduit')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                                <input
                                    type="text"
                                    value={formData.conduitSize}
                                    onChange={(e) => handleInputChange('conduitSize', e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                                    disabled={formData.wiringMethod !== 'underground_conduit'}
                                />
                                <span className="text-sm">นิ้ว</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="wall_conduit"
                                    checked={formData.wiringMethod === 'wall_conduit'}
                                    onChange={() => handleInputChange('wiringMethod', 'wall_conduit')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                                <input
                                    type="text"
                                    value={formData.conduitSizeWall}
                                    onChange={(e) => handleInputChange('conduitSizeWall', e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                                    disabled={formData.wiringMethod !== 'wall_conduit'}
                                />
                                <span className="text-sm">นิ้ว</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="wiring_method"
                                    value="other"
                                    checked={formData.wiringMethod === 'other'}
                                    onChange={() => handleInputChange('wiringMethod', 'other')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">อื่นๆ ระบุ</span>
                                <input
                                    type="text"
                                    value={formData.otherWiringMethod}
                                    onChange={(e) => handleInputChange('otherWiringMethod', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                                    disabled={formData.wiringMethod !== 'other'}
                                    placeholder="ระบุรายละเอียด"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                            <p className="text-sm text-yellow-800">
                                <strong>หมายเหตุ:</strong> การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร
                            </p>
                        </div>
                        
                        {renderCorrectIncorrectField('wiring_method_status', 'wiringMethodCorrect', 'wiringMethodNote', true, 5)}
                    </div>

                    {/* 5.1.8 Conduit Type */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">5.1.8 ประเภทท่อร้อยสาย</label>
                        <div className="space-y-4 mb-4">
                            <div>
                                <div className="font-medium text-gray-700 mb-2">ท่อโลหะ</div>
                                <div className="ml-4 flex flex-wrap gap-4">
                                    {[{
                                        value: 'RMC',
                                        label: 'หนา (RMC)'
                                    },
                                    {
                                        value: 'IMC',
                                        label: 'หนาปานกลาง (IMC)'
                                    },
                                    {
                                        value: 'EMT',
                                        label: 'บาง (EMT)'
                                    }].map((type) => (
                                        <label key={type.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="conduit_type"
                                                value={type.value}
                                                checked={formData.conduitType === type.value}
                                                onChange={() => handleInputChange('conduitType', type.value)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-sm">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <div className="font-medium text-gray-700 mb-2">ท่ออโลหะ</div>
                                <div className="ml-4 flex flex-wrap gap-4">
                                    {[{
                                        value: 'RNC',
                                        label: 'แข็ง (RNC)'
                                    },
                                    {
                                        value: 'ENT',
                                        label: 'อ่อน (ENT)'
                                    }].map((type) => (
                                        <label key={type.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="conduit_type"
                                                value={type.value}
                                                checked={formData.conduitType === type.value}
                                                onChange={() => handleInputChange('conduitType', type.value)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-sm">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="conduit_type"
                                    value="other"
                                    checked={formData.conduitType === 'other'}
                                    onChange={() => handleInputChange('conduitType', 'other')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">อื่นๆ ระบุ</span>
                                <input
                                    type="text"
                                    value={formData.otherConduitType}
                                    onChange={(e) => handleInputChange('otherConduitType', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                                    disabled={formData.conduitType !== 'other'}
                                    placeholder="ระบุรายละเอียด"
                                />
                            </div>
                        </div>
                        
                        {renderCorrectIncorrectField('conduit_type_status', 'conduitTypeCorrect', 'conduitTypeNote', true, 2)}
                    </div>
                </div>
            </section>

            {/* 5.2 Main Switch Protection */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* 5.2.1 Main breaker standard */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</label>
                        {renderCorrectIncorrectField('main_breaker_standard_status', 'mainBreakerStandardCorrect', 'mainBreakerStandardNote')}
                    </div>

                    {/* 5.2.2 Main breaker size */}
                    <div className="form-group">
                        <div className="flex items-center gap-3 mb-2">
                            <label className="text-sm font-medium text-gray-700">5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT</label>
                            <input
                                type="text"
                                value={formData.mainBreakerSize}
                                onChange={(e) => handleInputChange('mainBreakerSize', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-24"
                            />
                            <span className="text-sm text-gray-600">แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน</span>
                        </div>
                        {renderCorrectIncorrectField('main_breaker_size_status', 'mainBreakerSizeCorrect', 'mainBreakerSizeNote')}
                    </div>

                    {/* 5.2.3 Short circuit rating */}
                    <div className="form-group">
                        <div className="flex items-center gap-3 mb-2">
                            <label className="text-sm font-medium text-gray-700">5.2.3 พิกัดทนกระแสลัดวงจร (Ic)</label>
                            <input
                                type="text"
                                value={formData.shortCircuitRating}
                                onChange={(e) => handleInputChange('shortCircuitRating', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-24"
                            />
                            <span className="text-sm text-gray-600">กิโลแอมแปร์ (kA)</span>
                        </div>
                        {renderCorrectIncorrectField('short_circuit_rating_status', 'shortCircuitRatingCorrect', 'shortCircuitRatingNote')}
                    </div>

                    {/* 5.2.4 Ground fault protection */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            5.2.4 กรณีเมนเซอร์กิตเบรกเกอร์มีขนาดตั้งแต่ 1,000 แอมแปร์ ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)
                        </label>
                        {renderCorrectIncorrectField('ground_fault_protection_status', 'groundFaultProtectionCorrect', 'groundFaultProtectionNote')}
                    </div>
                </div>
            </section>

            {/* 5.3 Grounding System */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="form-group">
                        <div className="flex items-center gap-3 mb-2">
                            <label className="text-sm font-medium text-gray-700">5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด</label>
                            <input
                                type="text"
                                value={formData.groundWireSize}
                                onChange={(e) => handleInputChange('groundWireSize', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
                            />
                            <span className="text-sm text-gray-600">ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 7</span>
                        </div>
                        {renderCorrectIncorrectField('ground_wire_size_status', 'groundWireSizeCorrect', 'groundWireSizeNote')}
                    </div>
                    
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">5.3.2 การต่อลงดินที่แผงเมนสวิตช์</label>
                        <div className="space-y-3 mb-4 pl-4">
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name="grounding_system"
                                    value="single_phase"
                                    checked={formData.groundingSystem === 'single_phase'}
                                    onChange={() => handleInputChange('groundingSystem', 'single_phase')}
                                    className="w-4 h-4 text-blue-600 mt-1"
                                />
                                <span className="text-sm">
                                    กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                </span>
                            </label>
                            
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name="grounding_system"
                                    value="three_phase"
                                    checked={formData.groundingSystem === 'three_phase'}
                                    onChange={() => handleInputChange('groundingSystem', 'three_phase')}
                                    className="w-4 h-4 text-blue-600 mt-1"
                                />
                                <span className="text-sm">
                                    กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                </span>
                            </label>
                        </div>
                        
                        {renderCorrectIncorrectField('grounding_system_status', 'groundingSystemCorrect', 'groundingSystemNote')}
                    </div>
                </div>
            </section>

            {/* 5.4 Grounding Configuration */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[{
                            value: 'TN-C-S',
                            label: 'TN-C-S ทั้งระบบ'
                        },
                        {
                            value: 'TT',
                            label: 'TT ทั้งระบบ'
                        },
                        {
                            value: 'TT-partial',
                            label: 'TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)'
                        },
                        {
                            value: 'TN-S',
                            label: 'TN-S ทั้งระบบ'
                        }].map((config) => (
                            <label key={config.value} className="flex items-start gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="grounding_config"
                                    value={config.value}
                                    checked={formData.groundingConfig === config.value}
                                    onChange={() => handleInputChange('groundingConfig', config.value)}
                                    className="w-4 h-4 text-blue-600 mt-1"
                                />
                                <span className="text-sm font-medium">{config.label}</span>
                            </label>
                        ))}
                    </div>

                    {/* TN-C-S System Requirements */}
                    {formData.groundingConfig === 'TN-C-S' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)</h4>
                            <div className="space-y-4 mb-6">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.tncsLoadBalance}
                                        onChange={() => handleInputChange('tncsLoadBalance', !formData.tncsLoadBalance)}
                                        className="w-4 h-4 text-blue-600 mt-1"
                                    />
                                    <span className="text-sm">
                                        มีการจัดโหลดไฟฟ้า 3 เฟส ให้สมดุลอย่างเพียงพอ โดยให้มีโหลดต่างกันระหว่างเฟสได้ไม่เกิน 20 แอมแปร์ รวมทั้งค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                                    </span>
                                </label>
                                
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.tncsNeutralProtection}
                                        onChange={() => handleInputChange('tncsNeutralProtection', !formData.tncsNeutralProtection)}
                                        className="w-4 h-4 text-blue-600 mt-1"
                                    />
                                    <span className="text-sm">
                                        มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น
                                    </span>
                                </label>
                                
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.tncsTouchVoltageProtection}
                                        onChange={() => handleInputChange('tncsTouchVoltageProtection', !formData.tncsTouchVoltageProtection)}
                                        className="w-4 h-4 text-blue-600 mt-1"
                                    />
                                    <span className="text-sm">
                                        ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดินออกพร้อมกันภายในเวลา 5 วินาที
                                    </span>
                                </label>
                            </div>
                            
                            {renderCorrectIncorrectField('tncs_status', 'tncsCorrect', 'tncsNote', true, 4)}
                        </div>
                    )}

                    {/* TT System Requirements */}
                    {formData.groundingConfig === 'TT' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ</h4>
                            <p className="text-sm text-gray-700 mb-6 pl-4">
                                ต้องติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม
                            </p>
                            
                            {renderCorrectIncorrectField('tt_status', 'ttCorrect', 'ttNote', true, 2)}
                        </div>
                    )}

                    {/* TT Partial System Requirements */}
                    {formData.groundingConfig === 'TT-partial' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">5.4.3 กรณีต่อลงดินแบบ TT บางส่วน (ต้องดำเนินการครบทุกข้อ ก) – จ))</h4>
                            <div className="text-sm space-y-3 mb-6 pl-4">
                                <p><strong>ก)</strong> มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครงยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน หรือมีระยะห่างไม่น้อยกว่า 2.50 เมตร สามารถใช้การห่อหุ้มหรือกั้นได้</p>
                                <p><strong>ข)</strong> ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกันอย่างน้อย 2.00 เมตร</p>
                                <p><strong>ค)</strong> มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้า ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด</p>
                                <p><strong>ง)</strong> มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น</p>
                                <p><strong>จ)</strong> ค่าความต้านทานการต่อลงดินแบบ TN-C-S ต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</p>
                            </div>
                            
                            {renderCorrectIncorrectField('tt_partial_status', 'ttPartialCorrect', 'ttPartialNote', true, 4)}
                        </div>
                    )}

                    {/* TN-S System Requirements */}
                    {formData.groundingConfig === 'TN-S' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ</h4>
                            <p className="text-sm text-gray-700 mb-6 pl-4">
                                ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                            </p>
                            
                            {renderCorrectIncorrectField('tns_status', 'tnsCorrect', 'tnsNote', true, 2)}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LVSystemSection;