import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/ResumePDF';
import { ResumeData } from '@/types/resume';

export async function downloadResumePDF(resumeData: ResumeData, sectionOrder: string[]) {
    const blob = await pdf(<ResumePDF data={ resumeData } sectionOrder = { sectionOrder } />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.replace(/\\s+/g, '_') : 'Resume';
    a.download = `${safeName}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
