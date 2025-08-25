"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ConstructionInspectionPDF from '@/components/pdf/constructioninspectionPDF';
import { Download, Save } from "lucide-react";

function ConstructionInspection() {
    const inspectorSigRef = useRef(null);
    const userSigRef = useRef(null);
    const [formData, setFormData] = useState({
        // Header Information
        inspectionNumber: "",
        workName: "",
        approvalNumber: "",
        approvalDate: "",
        workId: "",
        peaOperation: false,
        contractorWork: false,
        hvWorkVolumeKm: "",
        hvWorkVolumePoles: "",
        hvStation: "",
        hvFeeder: "",
        hvPhase: "",
        hvTransformerKVA: "",
        lvWorkVolumeKm: "",
        lvWorkVolumePoles: "",
        supervisorName: "",
        supervisorPosition: "",
        supervisorAffiliation: "",
        inspectionDate: "",

        // 1. ระบบจำหน่ายแรงสูง (High Voltage Distribution System)
        hv_poleInstallation: "",
        hv_poleInstallation_note: "",
        hv_insulatorInstallation: "",
        hv_insulatorInstallation_note: "",
        hv_lightningRodInstallation: "",
        hv_lightningRodInstallation_note: "",
        hv_anchorInstallationDistribution: "",
        hv_anchorInstallationDistribution_note: "",
        hv_anchorInstallationLightning: "",
        hv_anchorInstallationLightning_note: "",
        hv_wireSagging: "",
        hv_wireSagging_note: "",
        hv_lightningRodSagging: "",
        hv_lightningRodSagging_note: "",
        hv_wireClearanceHeight: "",
        hv_wireClearanceHeight_note: "",
        hv_insulatorTying: "",
        hv_insulatorTying_note: "",
        hv_insulatedWireSplicing: "",
        hv_insulatedWireSplicing_note: "",
        hv_insulatedWireBranching: "",
        hv_insulatedWireBranching_note: "",
        hv_wireTermination: "",
        hv_wireTermination_note: "",
        hv_treeTrimming: "",
        hv_treeTrimming_note: "",
        hv_polePainting: "",
        hv_polePainting_note: "",
        hv_poleNumbering: "",
        hv_poleNumbering_note: "",
        hv_guying: "",
        hv_guying_note: "",
        hv_grounding: "",
        hv_grounding_note: "",
        hv_groundResistance: "",
        hv_groundResistanceSystem: "",
        hv_surgeArresterInstallation: "",
        hv_surgeArresterInstallation_note: "",
        hv_other: "",
        hv_other_note: "",

        // 2. ระบบจำหน่ายแรงต่ำ (Low Voltage Distribution System)
        lv_poleInstallation: "",
        lv_poleInstallation_note: "",
        lv_rackInstallationHorizontal: "",
        lv_rackInstallationHorizontal_note: "",
        lv_rackInstallationVertical: "",
        lv_rackInstallationVertical_note: "",
        lv_anchorInstallation: "",
        lv_anchorInstallation_note: "",
        lv_wireSagging: "",
        lv_wireSagging_note: "",
        lv_communicationWireClearance: "",
        lv_communicationWireClearance_note: "",
        lv_wireClearanceHeight: "",
        lv_wireClearanceHeight_note: "",
        lv_rollerTying: "",
        lv_rollerTying_note: "",
        lv_wireSplicingSingleEnd: "",
        lv_wireSplicingSingleEnd_note: "",
        lv_wireBranchingSingleEnd: "",
        lv_wireBranchingSingleEnd_note: "",
        lv_wireTerminationDoubleEnd: "",
        lv_wireTerminationDoubleEnd_note: "",
        lv_surgeArresterInstallation: "",
        lv_surgeArresterInstallation_note: "",
        lv_polePainting: "",
        lv_polePainting_note: "",
        lv_poleNumbering: "",
        lv_poleNumbering_note: "",
        lv_guying: "",
        lv_guying_note: "",
        lv_grounding: "",
        lv_grounding_note: "",
        lv_totalGroundResistance: "",
        lv_other: "",
        lv_other_note: "",

        // 3. การติดตั้งหม้อแปลง (Transformer Installation)
        transformerType: "",
        transformerKVA: "",
        transformer_installation: "",
        transformer_installation_note: "",
        transformer_insulatorBondwire: "",
        transformer_insulatorBondwire_note: "",
        transformer_hvWireRoutingPhase: "",
        transformer_hvWireRoutingPhase_note: "",
        transformer_wireTyingInsulator: "",
        transformer_wireTyingInsulator_note: "",
        transformer_hvSurgeArrester: "",
        transformer_hvSurgeArrester_note: "",
        transformer_dropoutPinTerminalFuseLink: "",
        transformer_dropoutPinTerminalFuseLink_note: "",
        transformer_conspanInstallation: "",
        transformer_conspanInstallation_note: "",
        transformer_bushingTermination: "",
        transformer_bushingTermination_note: "",
        transformer_lvWireRoutingPhase: "",
        transformer_lvWireRoutingPhase_note: "",
        transformer_lvSurgeArrester: "",
        transformer_lvSurgeArrester_note: "",
        transformer_ltSwitchFuse: "",
        transformer_ltSwitchFuse_note: "",
        transformer_tankHandleHangerConduit: "",
        transformer_tankHandleHangerConduit_note: "",
        transformer_concreteBeamPoleBase: "",
        transformer_concreteBeamPoleBase_note: "",
        transformer_grounding: "",
        transformer_grounding_note: "",
        transformer_tankGrounding: "",
        transformer_tankGrounding_note: "",
        transformer_hvGrounding: "",
        transformer_hvGrounding_note: "",
        transformer_lvGrounding: "",
        transformer_lvGrounding_note: "",
        transformer_groundResistancePerPoint: "",
        transformer_groundResistanceSystem: "",
        transformer_groundResistanceSystem: "",
        transformer_other: "",
        transformer_other_note: "",

        // Inspection Summary
        inspectionResult: "",
        correctionDetails: "",
        correctedAndApproved: false,

        // Signatures
        userSignature: "",
        inspectorSignature: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    useEffect(() => {
        const fetchForm = async () => {
            if (id) {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('construction_inspection')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error("Error fetching data:", error);
                    toast.error("ไม่สามารถโหลดข้อมูลฟอร์มได้");
                    router.push('/dashboard');
                } else if (data) {
                    setFormData(data);
                }
                setIsLoading(false);
            } else {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                setFormData(prev => ({
                    ...prev,
                    inspectionDate: formattedDate
                }));
                setIsLoading(false);
            }
        };

        fetchForm();
    }, [id, router, supabase]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleRadioChange = (groupName, value, noteFieldName) => {
        setFormData((prev) => ({
            ...prev,
            [groupName]: value,
            ...(noteFieldName && value === 'ถูกต้อง' ? { [noteFieldName]: '' } : {}),
        }));
    };

    // Helper: Validate form (add your own validation logic as needed)
    const validateForm = (data) => {
        // Example: require workName and supervisorName
        if (!data.workName || !data.supervisorName) {
            toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return false;
        }
        return true;
    };

    // Helper: Transform form data (numbers, dates, etc.)
    const transformFormData = (data, userId, isUpdate) => {
        const transformed = isUpdate ? { ...data } : { ...data, user_id: userId };
        const numberFields = [
            'hvWorkVolumeKm', 'hvWorkVolumePoles', 'hvTransformerKVA',
            'lvWorkVolumeKm', 'lvWorkVolumePoles', 'hv_groundResistance',
            'hv_groundResistanceSystem', 'lv_totalGroundResistance',
            'transformerKVA', 'transformer_groundResistancePerPoint',
            'transformer_groundResistanceSystem'
        ];
        numberFields.forEach(field => {
            transformed[field] = transformed[field] ? Number(transformed[field]) : null;
        });
        const dateFields = [
            'approvalDate', 'inspectionDate', 'inspector1Date',
            'inspector2Date', 'inspector3Date', 'supervisorSignatureDate'
        ];
        dateFields.forEach(field => {
            if (transformed[field] === '') {
                transformed[field] = null;
            }
        });
        return transformed;
    };

    // Helper: Submit to Supabase
    const submitToSupabase = async (dataToSubmit, isUpdate, id) => {
        if (isUpdate) {
            return await supabase
                .from('construction_inspection')
                .update(dataToSubmit)
                .eq('id', id);
        } else {
            return await supabase
                .from('construction_inspection')
                .insert([dataToSubmit]);
        }
    };

    // Main submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) {
                toast.error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
                setIsSubmitting(false);
                return;
            }
            if (!validateForm(formData)) {
                setIsSubmitting(false);
                return;
            }
            const dataToSubmit = transformFormData(formData, user.id, !!id);
            const { error } = await submitToSupabase(dataToSubmit, !!id, id);
            if (error) throw error;
            toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">กำลังโหลดข้อมูลฟอร์ม...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-[#5b2d90]">
                การไฟฟ้าส่วนภูมิภาค
                <br />
                แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.
            </h2>

            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
                <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
                    ข้อมูลส่วนหัว
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="workName" className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่องาน:
                        </label>
                        <input
                            type="text"
                            id="workName"
                            name="workName"
                            value={formData.workName}
                            onChange={handleChange}
                            className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                        />
                    </div>
                    <div>
                        <label htmlFor="approvalNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            อนุมัติเลขที่:
                        </label>
                        <input
                            type="text"
                            id="approvalNumber"
                            name="approvalNumber"
                            value={formData.approvalNumber}
                            onChange={handleChange}
                            className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                        />
                    </div>
                    <div>
                        <label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700 mb-1">
                            ลงวันที่:
                        </label>
                        <input
                            type="date"
                            id="approvalDate"
                            name="approvalDate"
                            value={formData.approvalDate}
                            onChange={handleChange}
                            className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                        />
                    </div>
                    <div>
                        <label htmlFor="workId" className="block text-sm font-medium text-gray-700 mb-1">
                            หมายเลขงาน:
                        </label>
                        <input
                            type="text"
                            id="workId"
                            name="workId"
                            value={formData.workId}
                            onChange={handleChange}
                            className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                        />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-4">
                        <label className="inline-flex items-center text-gray-800">
                            <input
                                type="checkbox"
                                name="peaOperation"
                                checked={formData.peaOperation}
                                onChange={handleChange}
                                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="ml-3">กฟภ. ดำเนินการ</span>
                        </label>
                        <label className="inline-flex items-center text-gray-800">
                            <input
                                type="checkbox"
                                name="contractorWork"
                                checked={formData.contractorWork}
                                onChange={handleChange}
                                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="ml-3">งานจ้างฯบริษัท</span>
                        </label>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="hvWorkVolumeKm" className="block text-sm font-medium text-gray-700 mb-1">
                                ปริมาณงานแรงสูง (วงจร-กม.):
                            </label>
                            <input type="number" id="hvWorkVolumeKm" name="hvWorkVolumeKm" value={formData.hvWorkVolumeKm} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="hvWorkVolumePoles" className="block text-sm font-medium text-gray-700 mb-1">
                                จำนวนเสา (ต้น):
                            </label>
                            <input type="number" id="hvWorkVolumePoles" name="hvWorkVolumePoles" value={formData.hvWorkVolumePoles} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="hvStation" className="block text-sm font-medium text-gray-700 mb-1">
                                รับไฟจากสถานี:
                            </label>
                            <input type="text" id="hvStation" name="hvStation" value={formData.hvStation} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="hvFeeder" className="block text-sm font-medium text-gray-700 mb-1">
                                ฟีดเดอร์:
                            </label>
                            <input type="text" id="hvFeeder" name="hvFeeder" value={formData.hvFeeder} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="hvPhase" className="block text-sm font-medium text-gray-700 mb-1">
                                เฟสที่ต่อ:
                            </label>
                            <input type="text" id="hvPhase" name="hvPhase" value={formData.hvPhase} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="hvTransformerKVA" className="block text-sm font-medium text-gray-700 mb-1">
                                หม้อแปลงรวม (KVA):
                            </label>
                            <input type="number" id="hvTransformerKVA" name="hvTransformerKVA" value={formData.hvTransformerKVA} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lvWorkVolumeKm" className="block text-sm font-medium text-gray-700 mb-1">
                                ปริมาณงานแรงต่ำ (วงจร-กม.):
                            </label>
                            <input type="number" id="lvWorkVolumeKm" name="lvWorkVolumeKm" value={formData.lvWorkVolumeKm} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="lvWorkVolumePoles" className="block text-sm font-medium text-gray-700 mb-1">
                                จำนวนเสา (ต้น):
                            </label>
                            <input type="number" id="lvWorkVolumePoles" name="lvWorkVolumePoles" value={formData.lvWorkVolumePoles} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700 mb-1">
                                ผู้ควบคุมงาน:
                            </label>
                            <input type="text" id="supervisorName" name="supervisorName" value={formData.supervisorName} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="supervisorPosition" className="block text-sm font-medium text-gray-700 mb-1">
                                ตำแหน่ง:
                            </label>
                            <input type="text" id="supervisorPosition" name="supervisorPosition" value={formData.supervisorPosition} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="supervisorAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
                                สังกัด:
                            </label>
                            <input type="text" id="supervisorAffiliation" name="supervisorAffiliation" value={formData.supervisorAffiliation} onChange={handleChange} className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
                        </div>
                        <div>
                            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700 mb-1">
                                วัน/เดือน/ปี ที่ดำเนินการตรวจ:
                            </label>
                            <input
                                type="date"
                                id="inspectionDate"
                                name="inspectionDate"
                                value={formData.inspectionDate}
                                onChange={handleChange}
                                className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. ระบบจำหน่ายแรงสูง (High Voltage Distribution System) */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
                <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
                    1. ระบบจำหน่ายแรงสูง
                </h2>
                <div className="space-y-4">
                    <CorrectiveRadio
                        groupName="hv_poleInstallation"
                        label="1.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)"
                        currentValue={formData.hv_poleInstallation}
                        currentNote={formData.hv_poleInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_insulatorInstallation"
                        label="1.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์"
                        currentValue={formData.hv_insulatorInstallation}
                        currentNote={formData.hv_insulatorInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_lightningRodInstallation"
                        label="1.3 การติดตั้งเหล็กรับสายล่อฟ้า (เหล็กฉาก, เหล็กรูปรางน้ำ)"
                        currentValue={formData.hv_lightningRodInstallation}
                        currentNote={formData.hv_lightningRodInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_anchorInstallationDistribution"
                        label="1.4 การฝังสมอบก และประกอบยึดโยงระบบจำหน่าย"
                        currentValue={formData.hv_anchorInstallationDistribution}
                        currentNote={formData.hv_anchorInstallationDistribution_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_anchorInstallationLightning"
                        label="1.5 การฝังสมอบก และประกอบยึดโยงสายล่อฟ้า"
                        currentValue={formData.hv_anchorInstallationLightning}
                        currentNote={formData.hv_anchorInstallationLightning_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_wireSagging"
                        label="1.6 การพาดสายไฟ ระยะหย่อนยาน"
                        currentValue={formData.hv_wireSagging}
                        currentNote={formData.hv_wireSagging_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_lightningRodSagging"
                        label="1.7 การพาดสายล่อฟ้า ระยะหย่อนยาน"
                        currentValue={formData.hv_lightningRodSagging}
                        currentNote={formData.hv_lightningRodSagging_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            1.8 ระยะห่าง, ความสูงของสายไฟ
                        </label>
                        <ul className="list-disc pl-5 text-gray-700 text-sm mb-2">
                            <li>ข้ามถนน &gt; 6.1 ม., ข้ามทางหลวง 22 kV &gt; 7.51 ม., ข้ามทางหลวง 33 kV &gt; 9 ม.</li>
                            <li>ข้ามทางรถไฟ &gt; 9 ม.</li>
                            <li>ระยะห่างสายด้านข้างกับสิ่งก่อสร้างต่างๆ</li>
                            <li>ระยะห่างระบบจำหน่ายแรงสูง กับสายส่ง</li>
                            <li>ระยะห่างระบบจำหน่ายแรงสูง กับแรงต่ำ</li>
                        </ul>
                        <CorrectiveRadio
                            groupName="hv_wireClearanceHeight"
                            label="ถูกต้องหรือไม่"
                            currentValue={formData.hv_wireClearanceHeight}
                            currentNote={formData.hv_wireClearanceHeight_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                    </div>
                    <CorrectiveRadio
                        groupName="hv_insulatorTying"
                        label="1.9 การพันและผูกลูกถ้วย"
                        currentValue={formData.hv_insulatorTying}
                        currentNote={formData.hv_insulatorTying_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_insulatedWireSplicing"
                        label="1.10 การต่อสาย พันเทป (สายหุ้มฉนวน)"
                        currentValue={formData.hv_insulatedWireSplicing}
                        currentNote={formData.hv_insulatedWireSplicing_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_insulatedWireBranching"
                        label="1.11 การเชื่อมสาย, สายแยก พันเทป (สายหุ้มฉนวน)"
                        currentValue={formData.hv_insulatedWireBranching}
                        currentNote={formData.hv_insulatedWireBranching_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_wireTermination"
                        label="1.12 การเข้าปลายสาย"
                        currentValue={formData.hv_wireTermination}
                        currentNote={formData.hv_wireTermination_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_treeTrimming"
                        label="1.13 การตัดต้นไม้"
                        currentValue={formData.hv_treeTrimming}
                        currentNote={formData.hv_treeTrimming_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_polePainting"
                        label="1.14 การทาสีเสา"
                        currentValue={formData.hv_polePainting}
                        currentNote={formData.hv_polePainting_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_poleNumbering"
                        label="1.15 การพ่นสี หมายเลขเสา"
                        currentValue={formData.hv_poleNumbering}
                        currentNote={formData.hv_poleNumbering_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_guying"
                        label="1.16 การยึดโยง (storm guy, line guy, fix guy, etc.)"
                        currentValue={formData.hv_guying}
                        currentNote={formData.hv_guying_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            1.17 การต่อลงดิน
                        </label>
                        <div className="mb-2">
                            <label htmlFor="hv_groundResistance" className="block text-sm font-medium text-gray-700 mb-1">
                                ค่าความต้านทานดินต่อจุด (โอห์ม):
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="hv_groundResistance"
                                name="hv_groundResistance"
                                value={formData.hv_groundResistance}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="hv_groundResistanceSystem" className="block text-sm font-medium text-gray-700 mb-1">
                                ระบบ (โอห์ม):
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="hv_groundResistanceSystem"
                                name="hv_groundResistanceSystem"
                                value={formData.hv_groundResistanceSystem}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>
                        <CorrectiveRadio
                            groupName="hv_grounding"
                            label="ถูกต้องหรือไม่"
                            currentValue={formData.hv_grounding}
                            currentNote={formData.hv_grounding_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />

                    </div>
                    <CorrectiveRadio
                        groupName="hv_surgeArresterInstallation"
                        label="1.18 การติดตั้งกับดักเสิร์จแรงสูง"
                        currentValue={formData.hv_surgeArresterInstallation}
                        currentNote={formData.hv_surgeArresterInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="hv_other"
                        label="1.19 อื่นๆ"
                        currentValue={formData.hv_other}
                        currentNote={formData.hv_other_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                </div>
            </section>

            {/* 2. ระบบจำหน่ายแรงต่ำ (Low Voltage Distribution System) */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
                <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
                    2. ระบบจำหน่ายแรงต่ำ
                </h2>
                <div className="space-y-4">
                    <CorrectiveRadio
                        groupName="lv_poleInstallation"
                        label="2.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)"
                        currentValue={formData.lv_poleInstallation}
                        currentNote={formData.lv_poleInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            2.2 การติดตั้งคอน แร็ค
                        </label>
                        <ul className="list-disc pl-5 text-gray-700 text-sm mb-2">
                            <li>แนวนอน สำหรับทางตรง</li>
                            <li>แนวตั้ง สำหรับทางโค้ง</li>
                        </ul>
                        <CorrectiveRadio
                            groupName="lv_rackInstallationHorizontal"
                            label="แนวนอน สำหรับทางตรง ถูกต้องหรือไม่"
                            currentValue={formData.lv_rackInstallationHorizontal}
                            currentNote={formData.lv_rackInstallationHorizontal_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                        <CorrectiveRadio
                            groupName="lv_rackInstallationVertical"
                            label="แนวตั้ง สำหรับทางโค้ง ถูกต้องหรือไม่"
                            currentValue={formData.lv_rackInstallationVertical}
                            currentNote={formData.lv_rackInstallationVertical_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                    </div>
                    <CorrectiveRadio
                        groupName="lv_anchorInstallation"
                        label="2.3 การฝังสมอบก และประกอบยึดโยง"
                        currentValue={formData.lv_anchorInstallation}
                        currentNote={formData.lv_anchorInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            2.4 การพาดสายไฟ ระยะหย่อนยาน
                        </label>
                        <CorrectiveRadio
                            groupName="lv_wireSagging"
                            label="ถูกต้องหรือไม่"
                            currentValue={formData.lv_wireSagging}
                            currentNote={formData.lv_wireSagging_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                            ระยะห่างสายสื่อสาร
                        </label>
                        <CorrectiveRadio
                            groupName="lv_communicationWireClearance"
                            label="ถูกต้องหรือไม่"
                            currentValue={formData.lv_communicationWireClearance}
                            currentNote={formData.lv_communicationWireClearance_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                    </div>
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            2.5 ระยะห่าง, ความสูงของสายไฟ
                        </label>
                        <ul className="list-disc pl-5 text-gray-700 text-sm mb-2">
                            <li>ข้ามถนน &gt; 5.5 ม., ข้ามทางหลวง &gt; 6.0 ม.</li>
                            <li>ข้ามทางรถไฟ &gt; 7 ม.</li>
                            <li>ระยะห่างสายด้านข้างกับสิ่งก่อสร้างต่างๆ</li>
                        </ul>
                        <CorrectiveRadio
                            groupName="lv_wireClearanceHeight"
                            label="ถูกต้องหรือไม่"
                            currentValue={formData.lv_wireClearanceHeight}
                            currentNote={formData.lv_wireClearanceHeight_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                    </div>
                    <CorrectiveRadio
                        groupName="lv_rollerTying"
                        label="2.6 การผูกสายไฟกับลูกรอกแรงต่ำ"
                        currentValue={formData.lv_rollerTying}
                        currentNote={formData.lv_rollerTying_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_wireSplicingSingleEnd"
                        label="2.7 การต่อสาย พันเทป การเข้าปลายสายข้างเดียว"
                        currentValue={formData.lv_wireSplicingSingleEnd}
                        currentNote={formData.lv_wireSplicingSingleEnd_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_wireBranchingSingleEnd"
                        label="2.8 การเชื่อมสาย, สายแยก พันเทป การเข้าปลายสายข้างเดียว"
                        currentValue={formData.lv_wireBranchingSingleEnd}
                        currentNote={formData.lv_wireBranchingSingleEnd_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_wireTerminationDoubleEnd"
                        label="2.9 การเข้าปลายสาย-พันเทป การเข้าปลายสายสองข้าง"
                        currentValue={formData.lv_wireTerminationDoubleEnd}
                        currentNote={formData.lv_wireTerminationDoubleEnd_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_surgeArresterInstallation"
                        label="2.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป"
                        currentValue={formData.lv_surgeArresterInstallation}
                        currentNote={formData.lv_surgeArresterInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_polePainting"
                        label="2.11 การทาสีเสา"
                        currentValue={formData.lv_polePainting}
                        currentNote={formData.lv_polePainting_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_poleNumbering"
                        label="2.12 การพ่นสี หมายเลขเสา"
                        currentValue={formData.lv_poleNumbering}
                        currentNote={formData.lv_poleNumbering_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="lv_guying"
                        label="2.13 การยึดโยง (storm guy, line guy, fix guy)"
                        currentValue={formData.lv_guying}
                        currentNote={formData.lv_guying_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <CorrectiveRadio
                            groupName="lv_grounding"
                            label="2.14 การต่อลงดิน"
                            currentValue={formData.lv_grounding}
                            currentNote={formData.lv_grounding_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                        <div className="mb-2">
                            <label htmlFor="lv_totalGroundResistance" className="block text-sm font-medium text-gray-700 mb-1">
                                2.15 ค่าความต้านทานดินรวม (โอห์ม):
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="lv_totalGroundResistance"
                                name="lv_totalGroundResistance"
                                value={formData.lv_totalGroundResistance}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <CorrectiveRadio
                        groupName="lv_other"
                        label="2.16 อื่นๆ"
                        currentValue={formData.lv_other}
                        currentNote={formData.lv_other_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                </div>
            </section>

            {/* 3. การติดตั้งหม้อแปลง (Transformer Installation) */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
                <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
                    3. การติดตั้งหม้อแปลง
                </h2>
                <div className="mb-4 flex flex-wrap gap-4">
                    <label className="inline-flex items-center text-gray-800">
                        <input type="radio" name="transformerType" value="แขวนเสา" checked={formData.transformerType === 'แขวนเสา'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6" />
                        <span className="ml-3">แขวนเสา</span>
                    </label>
                    <label className="inline-flex items-center text-gray-800">
                        <input type="radio" name="transformerType" value="นั่งร้าน" checked={formData.transformerType === 'นั่งร้าน'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6" />
                        <span className="ml-3">นั่งร้าน</span>
                    </label>
                    <div className="ml-auto">
                        <label htmlFor="transformerKVA" className="block text-sm font-medium text-gray-700 mb-1">
                            KVA:
                        </label>
                        <input
                            type="number"
                            id="transformerKVA"
                            name="transformerKVA"
                            value={formData.transformerKVA}
                            onChange={handleChange}
                            className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <CorrectiveRadio
                        groupName="transformer_installation"
                        label="3.1 การติดตั้งหม้อแปลง (ระยะความสูง, ทิศทาง)"
                        currentValue={formData.transformer_installation}
                        currentNote={formData.transformer_installation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_insulatorBondwire"
                        label="3.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์"
                        currentValue={formData.transformer_insulatorBondwire}
                        currentNote={formData.transformer_insulatorBondwire_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_hvWireRoutingPhase"
                        label="3.3 การพาดสายแรงสูงเข้าหม้อแปลง และลำดับเฟส"
                        currentValue={formData.transformer_hvWireRoutingPhase}
                        currentNote={formData.transformer_hvWireRoutingPhase_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_wireTyingInsulator"
                        label="3.4 การผูกสายไฟกับลูกถ้วย"
                        currentValue={formData.transformer_wireTyingInsulator}
                        currentNote={formData.transformer_wireTyingInsulator_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_hvSurgeArrester"
                        label="3.5 การติดตั้งกับดักเสิร์จแรงสูง, หางปลา"
                        currentValue={formData.transformer_hvSurgeArrester}
                        currentNote={formData.transformer_hvSurgeArrester_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_dropoutPinTerminalFuseLink"
                        label="3.6 การติดตั้งดร็อปเอาต์, พินเทอร์มินอล และฟิวส์ลิงก์"
                        currentValue={formData.transformer_dropoutPinTerminalFuseLink}
                        currentNote={formData.transformer_dropoutPinTerminalFuseLink_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_conspanInstallation"
                        label="3.7 การติดตั้งคอนสปัน 3,200 มม. ระยะความสูง"
                        currentValue={formData.transformer_conspanInstallation}
                        currentNote={formData.transformer_conspanInstallation_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_bushingTermination"
                        label="3.8 การเข้าสายที่บุชชิ่งหม้อแปลง, หางปลา, ฉนวนครอบบุชชิ่ง"
                        currentValue={formData.transformer_bushingTermination}
                        currentNote={formData.transformer_bushingTermination_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_lvWireRoutingPhase"
                        label="3.9 การติดตั้งสายแรงต่ำ และลำดับเฟส"
                        currentValue={formData.transformer_lvWireRoutingPhase}
                        currentNote={formData.transformer_lvWireRoutingPhase_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_lvSurgeArrester"
                        label="3.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป"
                        currentValue={formData.transformer_lvSurgeArrester}
                        currentNote={formData.transformer_lvSurgeArrester_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_ltSwitchFuse"
                        label="3.11 การติดตั้งคอนสำหรับ LT, LT สวิตช์ และ ฟิวส์แรงต่ำ"
                        currentValue={formData.transformer_ltSwitchFuse}
                        currentNote={formData.transformer_ltSwitchFuse_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_tankHandleHangerConduit"
                        label="3.12 การติดตั้งที่จับขอบถัง, เหล็กแขวน ท่อร้อยสายแรงต่ำ"
                        currentValue={formData.transformer_tankHandleHangerConduit}
                        currentNote={formData.transformer_tankHandleHangerConduit_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <CorrectiveRadio
                        groupName="transformer_concreteBeamPoleBase"
                        label="3.13 เทคอนกรีตที่คาน, โคนเสา"
                        currentValue={formData.transformer_concreteBeamPoleBase}
                        currentNote={formData.transformer_concreteBeamPoleBase_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            3.14 การต่อลงดิน
                        </label>
                        <ul className="list-disc pl-5 text-gray-700 text-sm mb-2">
                            <li>ตัวถังหม้อแปลง</li>
                            <li>สายกราวด์ด้านแรงสูง</li>
                            <li>สายกราวด์ด้านแรงต่ำ</li>
                        </ul>
                        <CorrectiveRadio
                            groupName="transformer_tankGrounding"
                            label="ตัวถังหม้อแปลง ถูกต้องหรือไม่"
                            currentValue={formData.transformer_tankGrounding}
                            currentNote={formData.transformer_tankGrounding_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                        <CorrectiveRadio
                            groupName="transformer_hvGrounding"
                            label="สายกราวด์ด้านแรงสูง ถูกต้องหรือไม่"
                            currentValue={formData.transformer_hvGrounding}
                            currentNote={formData.transformer_hvGrounding_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                        <CorrectiveRadio
                            groupName="transformer_lvGrounding"
                            label="สายกราวด์ด้านแรงต่ำ ถูกต้องหรือไม่"
                            currentValue={formData.transformer_lvGrounding}
                            currentNote={formData.transformer_lvGrounding_note}
                            onStatusChange={handleRadioChange}
                            onNoteChange={handleChange}
                        />
                    </div>
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <label htmlFor="transformer_groundResistancePerPoint" className="block text-sm font-medium text-gray-700 mb-1">
                            3.15 ค่าความต้านทานดินต่อจุด (โอห์ม):
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="transformer_groundResistancePerPoint"
                            name="transformer_groundResistancePerPoint"
                            value={formData.transformer_groundResistancePerPoint}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                        <label htmlFor="transformer_groundResistanceSystem" className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                            ระบบ (โอห์ม):
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="transformer_groundResistanceSystem"
                            name="transformer_groundResistanceSystem"
                            value={formData.transformer_groundResistanceSystem}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                    </div>
                    <CorrectiveRadio
                        groupName="transformer_other"
                        label="3.16 อื่นๆ"
                        currentValue={formData.transformer_other}
                        currentNote={formData.transformer_other_note}
                        onStatusChange={handleRadioChange}
                        onNoteChange={handleChange}
                    />

                </div>
            </section>

            {/* Inspection Summary Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
                <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
                    ผลการตรวจสอบ
                </h2>
                <div className="flex flex-wrap gap-4 mb-4">
                    <label className="inline-flex items-center text-gray-800">
                        <input
                            type="radio"
                            name="inspectionResult"
                            value="ถูกต้องตามมาตรฐาน กฟภ."
                            checked={formData.inspectionResult === 'ถูกต้องตามมาตรฐาน กฟภ.'}
                            onChange={handleChange}
                            className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6"
                        />
                        <span className="ml-3">ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ.</span>
                    </label>
                    <label className="inline-flex items-center text-gray-800">
                        <input
                            type="radio"
                            name="inspectionResult"
                            value="เห็นควรแก้ไข"
                            checked={formData.inspectionResult === 'เห็นควรแก้ไข'}
                            onChange={handleChange}
                            className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6"
                        />
                        <span className="ml-3">ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น</span>
                    </label>
                </div>
                {formData.inspectionResult === 'เห็นควรแก้ไข' && (
                    <textarea
                        name="correctionDetails"
                        value={formData.correctionDetails}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 text-gray-900 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
                        placeholder="รายละเอียดที่ต้องแก้ไข"
                    ></textarea>
                )}
                {formData.inspectionResult === 'เห็นควรแก้ไข' && (
                    <label className="inline-flex items-center text-gray-800 mt-4">
                        <input
                            type="checkbox"
                            name="correctedAndApproved"
                            checked={formData.correctedAndApproved}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-3">ได้แก้ไขให้ถูกต้องตามมาตรฐานทุกรายการแล้ว</span>
                    </label>
                )}
            </section>

            {/* Signatures Section */}
<section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
          <div className="text-gray-900 text-sm mb-6 space-y-3">
              <p>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</p>
              <p>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
              <p>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
              <p>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad 
              title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
              ref={userSigRef}
              onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)} 
              onClear={() => handleSignatureClear('userSignature')}
              initialValue={formData.userSignature}
            />
            <SignaturePad 
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
              ref={inspectorSigRef} 
              onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)} 
              onClear={() => handleSignatureClear('inspectorSignature')}
              initialValue={formData.inspectorSignature}
            />
          </div>
        </section>
        
        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
          <PDFDownloadLink
            document={<ConstructionInspectionPDF formData={formData} />}
            fileName={`inspection-form-${formData.inspectionNumber || 'form'}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <button
                disabled={loading || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Download className="w-5 h-5"/>
                {loading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-white bg-[#5b2d90] rounded-lg shadow-lg hover:bg-[#4a2575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a78bfa] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>กำลังบันทึก...</span>
                </>
            ) : (
                <>
                    <Save className="w-5 h-5"/>
                    <span>บันทึกข้อมูล</span>
                </>
            )}
          </button>
        </div>
        </form>
    );
}

export default function ConstructionInspectionPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConstructionInspection />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลดฟอร์ม...</p>
      </div>
    </div>
  );
}