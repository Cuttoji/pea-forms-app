import React from 'react';

const LVSystemSection = ({ value = {}, onChange, transformerIndex = 0 }) => {
    console.log(`=== LVSystemSection Debug (transformer ${transformerIndex}) ===`);
    console.log('Received value:', value);
    console.log('onChange function:', typeof onChange);
    
    const formData = value || {};

    const handleInputChange = (field, newValue) => {
        console.log(`LVSystemSection updating field: ${field} with value:`, newValue);
        
        if (onChange && typeof onChange === 'function') {
            const updatedData = {
                ...formData,
                [field]: newValue
            };
            console.log('LVSystemSection sending updated data:', updatedData);
            onChange(updatedData);
        } else {
            console.error('onChange is not a function:', onChange);
        }
    };

    const handleNestedInputChange = (parentField, childField, newValue) => {
        console.log(`LVSystemSection updating nested: ${parentField}.${childField} = `, newValue);
        
        if (onChange && typeof onChange === 'function') {
            const updatedData = {
                ...formData,
                [parentField]: {
                    ...(formData[parentField] || {}),
                    [childField]: newValue
                }
            };
            console.log('LVSystemSection sending nested update:', updatedData);
            onChange(updatedData);
        }
    };

    const renderCorrectIncorrectField = (uniqueId, correctField, noteField, isTextarea = false, rows = 2) => (
        <div className="mt-3">
            <div className="flex items-start gap-6">
                <label className="flex items-center gap-2 min-w-20">
                    <input
                        type="radio"
                        name={`${uniqueId}_${transformerIndex}`}
                        checked={formData[correctField] === "ถูกต้อง"}
                        onChange={() => handleInputChange(correctField, "ถูกต้อง")}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-green-700">ถูกต้อง</span>
                </label>

                <label className="flex items-center gap-2 min-w-24 flex-1">
                    <input
                        type="radio"
                        name={`${uniqueId}_${transformerIndex}`}
                        checked={formData[correctField] === "ต้องแก้ไข"}
                        onChange={() => handleInputChange(correctField, "ต้องแก้ไข")}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-red-700">ต้องแก้ไข</span>

                    {formData[correctField] === "ต้องแก้ไข" && (
                        isTextarea ? (
                            <textarea
                                value={formData[noteField] || ''}
                                onChange={(e) => handleInputChange(noteField, e.target.value)}
                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                                rows={rows}
                                className="ml-3 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        ) : (
                            <input
                                type="text"
                                value={formData[noteField] || ''}
                                onChange={(e) => handleInputChange(noteField, e.target.value)}
                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                                className="ml-3 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        )
                    )}
                </label>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    5. วงจรประธานแรงต่ำ
                </h3>
                
                {/* 5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน
                    </label>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`standard_${transformerIndex}`}
                                value="มอก. 11-2553"
                                checked={formData.standard === "มอก. 11-2553"}
                                onChange={(e) => handleInputChange('standard', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span>มอก. 11-2553</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`standard_${transformerIndex}`}
                                value="มอก. 293-2541"
                                checked={formData.standard === "มอก. 293-2541"}
                                onChange={(e) => handleInputChange('standard', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span>มอก. 293-2541</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`standard_${transformerIndex}`}
                                value="IEC 60502"
                                checked={formData.standard === "IEC 60502"}
                                onChange={(e) => handleInputChange('standard', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span>IEC 60502</span>
                        </label>
                    </div>
                    {renderCorrectIncorrectField('lv_standard', 'standardCorrect', 'standardNote')}
                </div>

                {/* 5.1.2 ชนิดสายตัวนำ */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.2 ชนิดสายตัวนำ
                    </label>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.conductorIEC01 || false}
                                onChange={(e) => handleInputChange('conductorIEC01', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>IEC01</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.conductorNYY || false}
                                onChange={(e) => handleInputChange('conductorNYY', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>NYY</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.conductorCV || false}
                                onChange={(e) => handleInputChange('conductorCV', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>CV</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.conductorOther || false}
                                onChange={(e) => handleInputChange('conductorOther', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>อื่นๆ</span>
                            <input
                                type="text"
                                value={formData.conductorOtherText || ''}
                                onChange={(e) => handleInputChange('conductorOtherText', e.target.value)}
                                placeholder="ระบุ..."
                                className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                                disabled={!formData.conductorOther}
                            />
                        </label>
                    </div>
                    {renderCorrectIncorrectField('lv_conductor_type', 'conductorTypeCorrect', 'conductorTypeNote')}
                </div>

                {/* 5.1.3 ขนาดสายเฟส */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.3 ขนาดสายเฟส
                    
                    <input
                        type="text"
                        value={formData.phaseWireSize || ''}
                        onChange={(e) => handleInputChange('phaseWireSize', e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                        placeholder="ขนาดสายเฟส ตร.มม."
                    />
                    ตร.มม. (พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด)
                    {renderCorrectIncorrectField('lv_phase_wire', 'phaseWireSizeCorrect', 'phaseWireSizeNote')}
                </label>
                </div>

                {/* 5.1.4 ขนาดสายนิวทรัล */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.4 ขนาดสายนิวทรัล
                    <input
                        type="text"
                        value={formData.neutralWireSize || ''}
                        onChange={(e) => handleInputChange('neutralWireSize', e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                        placeholder="ขนาดสายนิวทรัล ตร.มม."
                    />
                    ตร.มม.</label>
                    {renderCorrectIncorrectField('lv_neutral_wire', 'neutralWireSizeCorrect', 'neutralWireSizeNote')}
                </div>

                {/* 5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                    </label>
                    {renderCorrectIncorrectField('lv_phase_identification', 'phaseIdentificationCorrect', 'phaseIdentificationNote')}
                </div>

                {/* 5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                    </label>
                    {renderCorrectIncorrectField('lv_cable_pathway', 'cablePathwayCorrect', 'cablePathwayNote')}
                </div>

                {/* 5.1.7 วิธีการเดินสาย */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.7 วิธีการเดินสาย
                    </label>
                    
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringOverhead || false}
                                onChange={(e) => handleInputChange('wiringOverhead', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringCableTray || false}
                                onChange={(e) => handleInputChange('wiringCableTray', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                            <input
                                type="text"
                                value={formData.cableTraySize?.width || ''}
                                onChange={(e) => handleNestedInputChange('cableTraySize', 'width', e.target.value)}
                                placeholder="กว้าง"
                                className="px-2 py-1 border border-gray-300 rounded w-20"
                                disabled={!formData.wiringCableTray}
                            />
                            <span>มม. x</span>
                            <input
                                type="text"
                                value={formData.cableTraySize?.height || ''}
                                onChange={(e) => handleNestedInputChange('cableTraySize', 'height', e.target.value)}
                                placeholder="สูง"
                                className="px-2 py-1 border border-gray-300 rounded w-20"
                                disabled={!formData.wiringCableTray}
                            />
                            <span>มม.</span>
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringDirectBuried || false}
                                onChange={(e) => handleInputChange('wiringDirectBuried', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringConduitBuried || false}
                                onChange={(e) => handleInputChange('wiringConduitBuried', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                            <input
                                type="text"
                                value={formData.conduitBuriedSize || ''}
                                onChange={(e) => handleInputChange('conduitBuriedSize', e.target.value)}
                                placeholder="ขนาด"
                                className="px-2 py-1 border border-gray-300 rounded"
                                disabled={!formData.wiringConduitBuried}
                            />
                            <span>นิ้ว</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringConduitWall || false}
                                onChange={(e) => handleInputChange('wiringConduitWall', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                            <input
                                type="text"
                                value={formData.conduitWallSize || ''}
                                onChange={(e) => handleInputChange('conduitWallSize', e.target.value)}
                                placeholder="ขนาด"
                                className="px-2 py-1 border border-gray-300 rounded"
                                disabled={!formData.wiringConduitWall}
                            />
                            <span>นิ้ว</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.wiringOther || false}
                                onChange={(e) => handleInputChange('wiringOther', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span>อื่นๆ ระบุ</span>
                            <input
                                type="text"
                                value={formData.wiringOtherText || ''}
                                onChange={(e) => handleInputChange('wiringOtherText', e.target.value)}
                                placeholder="ระบุ..."
                                className="px-2 py-1 border border-gray-300 rounded flex-1"
                                disabled={!formData.wiringOther}
                            />
                        </div>
                    </div>

                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                            * การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร 
                            ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร
                        </p>
                    </div>

                    {renderCorrectIncorrectField('lv_wiring_method', 'wiringMethodCorrect', 'wiringMethodNote', true, 5)}
                </div>

                {/* 5.1.8 ประเภทท่อร้อยสาย */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.1.8 ประเภทท่อร้อยสาย
                    </label>
                    
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-medium">ท่อโลหะ:</span>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitMetalRMC || false}
                                    onChange={(e) => handleInputChange('conduitMetalRMC', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>หนา (RMC)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitMetalIMC || false}
                                    onChange={(e) => handleInputChange('conduitMetalIMC', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>หนาปานกลาง (IMC)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitMetalEMT || false}
                                    onChange={(e) => handleInputChange('conduitMetalEMT', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>บาง (EMT)</span>
                            </label>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-medium">ท่ออโลหะ:</span>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitNonMetalRNC || false}
                                    onChange={(e) => handleInputChange('conduitNonMetalRNC', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>แข็ง (RNC)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitNonMetalENT || false}
                                    onChange={(e) => handleInputChange('conduitNonMetalENT', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>อ่อน (ENT)</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.conduitTypeOther || false}
                                    onChange={(e) => handleInputChange('conduitTypeOther', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>อื่นๆ ระบุ (</span>
                            </label>
                            <input
                                type="text"
                                value={formData.conduitTypeOtherText || ''}
                                onChange={(e) => handleInputChange('conduitTypeOtherText', e.target.value)}
                                className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2 bg-white"
                                disabled={!formData.conduitTypeOther}
                            />
                            <span>)</span>
                        </div>
                    </div>

                    {renderCorrectIncorrectField('lv_conduit_type', 'conduitTypeCorrect', 'conduitTypeNote')}
                </div>
            </div>

            {/* 5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน) */}
            <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                    5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
                </h3>

                {/* 5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                    </label>
                    {renderCorrectIncorrectField('main_breaker_standard', 'mainBreakerStandardCorrect', 'mainBreakerStandardNote')}
                </div>

                {/* 5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT 
                    <input
                        type="text"
                        value={formData.mainBreakerSize || ''}
                        onChange={(e) => handleInputChange('mainBreakerSize', e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                        placeholder="ขนาด AT แอมแปร์ (A)"
                    />
                    แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน
                    </label>
                    {renderCorrectIncorrectField('main_breaker_size', 'mainBreakerSizeCorrect', 'mainBreakerSizeNote')}
                </div>

                {/* 5.2.3 พิกัดทนกระแสลัดวงจร */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.2.3 พิกัดทนกระแสลัดวงจร (Ic)
                    
                    <input
                        type="text"
                        value={formData.shortCircuitRating || ''}
                        onChange={(e) => handleInputChange('shortCircuitRating', e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                        placeholder="พิกัดทนกระแสลัดวงจร (Ic) กิโลแอมแปร์ (kA)"
                    />
                    กิโลแอมแปร์ (kA)</label>
                    {renderCorrectIncorrectField('short_circuit_rating', 'shortCircuitRatingCorrect', 'shortCircuitRatingNote')}
                </div>

                {/* 5.2.4 Ground Fault Protection */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.2.4 กรณีเมนเซอร์กิตเบรกเกอร์มีขนาดตั้งแต่ 1,000 แอมแปร์ ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)
                    </label>
                    {renderCorrectIncorrectField('ground_fault_protection', 'groundFaultProtectionCorrect', 'groundFaultProtectionNote')}
                </div>
            </div>

            {/* 5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์ */}
            <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                    5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
                </h3>

                {/* 5.3.1 สายต่อหลักดิน */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด 
                    <input
                        type="text"
                        value={formData.groundWireSize || ''}
                        onChange={(e) => handleInputChange('groundWireSize', e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                        placeholder="ขนาดสายต่อหลักดิน ตร.มม."
                    />ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 7
                    </label>
                    {renderCorrectIncorrectField('ground_wire_size', 'groundWireSizeCorrect', 'groundWireSizeNote')}
                </div>

                {/* 5.3.2 การต่อลงดินที่แผงเมนสวิตช์ */}
                <div className="form-group mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        5.3.2 การต่อลงดินที่แผงเมนสวิตช์
                    </label>
                    
                    <div className="space-y-4">
                        <div className="p-3 border border-gray-300 rounded-md">
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name={`groundingConfig_${transformerIndex}`}
                                    value="single_phase"
                                    checked={formData.groundingConfig === 'single_phase'}
                                    onChange={(e) => handleInputChange('groundingConfig', e.target.value)}
                                    className="w-4 h-4 mt-1"
                                />
                                <span className="text-sm">
                                    <strong>กรณีระบบไฟฟ้า 1 เฟส</strong>  กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground 
Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) 
เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่       
การไฟฟ้าส่วนภูมิภาคกำหนด 
                                </span>
                            </label>
                        </div>

                        <div className="p-3 border border-gray-300 rounded-md">
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name={`groundingConfig_${transformerIndex}`}
                                    value="three_phase"
                                    checked={formData.groundingConfig === 'three_phase'}
                                    onChange={(e) => handleInputChange('groundingConfig', e.target.value)}
                                    className="w-4 h-4 mt-1"
                                />
                                <span className="text-sm">
                                    <strong>กรณีระบบไฟฟ้า 3 เฟส</strong>  แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground 
Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดิน
 บริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                </span>
                            </label>
                        </div>
                    </div>

                    {renderCorrectIncorrectField('grounding_config', 'groundingConfigCorrect', 'groundingConfigNote', true, 3)}
                </div>
            </div>

            {/* 5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ */}
            <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">
                    5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`groundingSystem_${transformerIndex}`}
                                value="TN-C-S"
                                checked={formData.groundingSystem === 'TN-C-S'}
                                onChange={(e) => handleInputChange('groundingSystem', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">TN-C-S ทั้งระบบ</span>
                        </div>
                        <img src="/ex_system/TN-C.png" alt="TN-C-S" className="w-full h-auto rounded-md border" />
                    </label>
                    <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`groundingSystem_${transformerIndex}`}
                                value="TT"
                                checked={formData.groundingSystem === 'TT'}
                                onChange={(e) => handleInputChange('groundingSystem', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">TT ทั้งระบบ</span>
                        </div>
                        <img src="/ex_system/TT-all.png" alt="TT" className="w-full h-auto rounded-md border" />
                    </label>
                    <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`groundingSystem_${transformerIndex}`}
                                value="TT_partial"
                                checked={formData.groundingSystem === 'TT_partial'}
                                onChange={(e) => handleInputChange('groundingSystem', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">TT บางส่วน</span>
                        </div>
                        <img src="/ex_system/TT.png" alt="TT Partial" className="w-full h-auto rounded-md border" />
                    </label>
                    <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`groundingSystem_${transformerIndex}`}
                                value="TN-S"
                                checked={formData.groundingSystem === 'TN-S'}
                                onChange={(e) => handleInputChange('groundingSystem', e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">TN-S ทั้งระบบ</span>
                        </div>
                        <img src="/ex_system/TN-S.png" alt="TN-S" className="w-full h-auto rounded-md border" />
                    </label>
                </div>

                {/* 5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ */}
                {formData.groundingSystem === 'TN-C-S' && (
                    <div className="mb-6 p-4 border border-orange-200 rounded-md">
                        <h4 className="font-semibold mb-3">5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)</h4>
                        <div className="space-y-3">
                            <label className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.tncsLoadBalance || false}
                                    onChange={(e) => handleInputChange('tncsLoadBalance', e.target.checked)}
                                    className="w-4 h-4 mt-1"
                                />
                                <span className="text-sm">
                                    มีการจัดโหลดไฟฟ้า 3 เฟส ให้สมดุลอย่างเพียงพอ โดยให้มีโหลดต่างกัน
 ระหว่างเฟสได้ไม่เกิน 20 แอมแปร์ รวมทั้งค่าความต้านทานการต่อลงดินต้อง      
ไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของ
 หลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดิน
 เพิ่มอีกตามความเหมาะสม 
                                </span>
                            </label>

                            <label className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.tncsNeutralProtection || false}
                                    onChange={(e) => handleInputChange('tncsNeutralProtection', e.target.checked)}
                                    className="w-4 h-4 mt-1"
                                />
                                <span className="text-sm">
                                     มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์
 ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) 
หรือช่องเดินสายเท่านั้น 
                                </span>
                            </label>

                            <label className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.tncsTouchVoltageProtection || false}
                                    onChange={(e) => handleInputChange('tncsTouchVoltageProtection', e.target.checked)}
                                    className="w-4 h-4 mt-1"
                                />
                                <span className="text-sm">
                                     ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครง
 บริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัด
 ประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน   
ออกพร้อมกันภายในเวลา 5 วินาท
                                </span>
                            </label>
                        </div>

                        {renderCorrectIncorrectField('tncs_system', 'tncsCorrect', 'tncsNote', true, 4)}
                    </div>
                )}

                {/* 5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ */}
                {formData.groundingSystem === 'TT' && (
                    <div className="mb-6 p-4 border border-orange-200 rounded-md">
                        <h4 className="font-semibold mb-3">5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ</h4>
                        <p className="text-sm mb-3">
                            ต้องติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า    
ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม 
                        </p>
                        {renderCorrectIncorrectField('tt_system', 'ttCorrect', 'ttNote')}
                    </div>
                )}

                {/* 5.4.3 กรณีต่อลงดินแบบ TT บางส่วน */}
                {formData.groundingSystem === 'TT_partial' && (
                    <div className="mb-6 p-4 border border-orange-200 rounded-md">
                        <h4 className="font-semibold mb-3">5.4.3 กรณีต่อลงดินแบบ TT บางส่วน (ต้องดำเนินการครบทุกข้อ ก) – จ))</h4>
                        <p className="text-sm mb-3">ก) มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์
 ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครง
 ยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน หรือมีระยะห่างไม่น้อยกว่า 2.50 
เมตร สามารถใช้การห่อหุ้มหรือกั้นได้ </p>
                        <p className="text-sm mb-3">
ข) ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกัน
 อย่างน้อย 2.00 เมตร </p>
                        <p className="text-sm mb-3">
ค) มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้า 
ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด </p>
                        <p className="text-sm mb-3">
ง) มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์
 ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) 
หรือช่องเดินสายเท่านั้น </p>
                        <p className="text-sm mb-3">
จ) ค่าความต้านทานการต่อลงดินแบบ TN-C-S ต้องไม่เกิน 5 โอห์ม ยกเว้น
 พื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้อง ไม่เกิน 
25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</p>
                        {renderCorrectIncorrectField('tt_partial_system', 'ttPartialCorrect', 'ttPartialNote', true, 5)}
                    </div>
                )}

                {/* 5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ */}
                {formData.groundingSystem === 'TN-S' && (
                    <div className="mb-6 p-4 border border-orange-200 rounded-md">
                        <h4 className="font-semibold mb-3">5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ</h4>
                        <p className="text-sm mb-3">
ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การ
 ต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำ
 การวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม 
                        </p>
                        {renderCorrectIncorrectField('tns_system', 'tnsCorrect', 'tnsNote')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LVSystemSection;