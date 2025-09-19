import { useState } from 'react';
import dynamic from 'next/dynamic';

const PDFDownloadButton = ({ formRef, fileName = 'form' }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to temporarily replace problematic CSS styles
  const prepareDOMForPDF = (element) => {
    const elementsToRevert = [];
    
    // Find all elements with problematic styles
    const allElements = element.querySelectorAll('*');
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const originalStyles = {};
      let needsRevert = false;
      
      // Check for oklch colors and other problematic styles
      ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
        const value = computedStyle[prop];
        if (value && (value.includes('oklch') || value.includes('color-mix'))) {
          originalStyles[prop] = el.style[prop];
          // Convert to a fallback color
          if (value.includes('oklch')) {
            el.style[prop] = '#6b7280'; // gray-500 fallback
          }
          needsRevert = true;
        }
      });
      
      if (needsRevert) {
        elementsToRevert.push({ element: el, originalStyles });
      }
    });
    
    return elementsToRevert;
  };

  // Function to revert DOM changes
  const revertDOMChanges = (elementsToRevert) => {
    elementsToRevert.forEach(({ element, originalStyles }) => {
      Object.entries(originalStyles).forEach(([prop, value]) => {
        if (value) {
          element.style[prop] = value;
        } else {
          element.style.removeProperty(prop);
        }
      });
    });
  };

  const handleDownloadPDF = async () => {
    if (!formRef.current) return;
    
    setIsGenerating(true);
    let elementsToRevert = [];
    
    try {
      // Prepare DOM for PDF generation
      elementsToRevert = prepareDOMForPDF(formRef.current);
      
      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      // Generate canvas with better options
      const canvas = await html2canvas(formRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.classList?.contains('no-pdf') || false;
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
    } finally {
      // Always revert DOM changes
      if (elementsToRevert.length > 0) {
        revertDOMChanges(elementsToRevert);
      }
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          กำลังสร้าง PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          ดาวน์โหลด PDF
        </>
      )}
    </button>
  );
};

export default PDFDownloadButton;
