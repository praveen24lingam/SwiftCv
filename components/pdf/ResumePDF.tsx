import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
    page: {
        padding: '18mm',
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#000000',
        lineHeight: 1.4,
    },
    header: {
        marginBottom: 10,
        textAlign: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    contactInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    contactText: {
        fontSize: 9,
    },
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        paddingBottom: 2,
        marginBottom: 6,
    },
    itemContainer: {
        marginBottom: 8,
    },
    itemHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemTitle: {
        fontFamily: 'Helvetica-Bold',
    },
    itemSubtitle: {
        fontFamily: 'Helvetica-Oblique',
    },
    itemDate: {
        fontFamily: 'Helvetica',
    },
    bulletPointContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletPoint: {
        width: 10,
        flexShrink: 0,
    },
    bulletText: {
        flex: 1,
    },
    summaryText: {
        marginBottom: 4,
    },
    skillsGroup: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillsLabel: {
        fontFamily: 'Helvetica-Bold',
        width: 65,
        flexShrink: 0,
    },
    skillsList: {
        flex: 1,
    }
});

interface ResumePDFProps {
    data: ResumeData;
    sectionOrder?: string[];
}

export function ResumePDF({ data, sectionOrder }: ResumePDFProps) {
    const defaultOrder = ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements'];
    const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    const renderContactItem = (text: string | undefined, addSeparator = false) => {
        if (!text) return null;
        return (
            <Text style={styles.contactText}>
                {text}{addSeparator ? '  |  ' : ''}
            </Text>
        );
    };

    const activeContactItems = [
        data.personalInfo.email,
        data.personalInfo.phone,
        data.personalInfo.city,
        data.personalInfo.linkedin,
        data.personalInfo.github,
        data.personalInfo.portfolio
    ].filter(Boolean);

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.name}>{data.personalInfo.fullName.toUpperCase()}</Text>
            <View style={styles.contactInfo}>
                {activeContactItems.map((item, index) => renderContactItem(item, index < activeContactItems.length - 1))}
            </View>
        </View>
    );

    const renderSummary = () => {
        if (!data.summary) return null;
        return (
            <View style={styles.section} wrap={false}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{data.summary}</Text>
            </View>
        );
    };

    const renderEducation = () => {
        if (data.education.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle} wrap={false}>Education</Text>
                {data.education.map((edu, idx) => (
                    <View key={idx} style={styles.itemContainer} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{edu.degree}</Text>
                            <Text style={styles.itemDate}>{edu.startYear} - {edu.currentlyStudying ? 'Present' : edu.endYear}</Text>
                        </View>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemSubtitle}>{edu.college}</Text>
                            <Text>
                                {edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}
                                {edu.percentage ? `Percentage: ${edu.percentage}%` : ''}
                            </Text>
                        </View>
                        {edu.board && <Text style={styles.itemDate}>Board: {edu.board}</Text>}
                    </View>
                ))}
            </View>
        );
    };

    const renderExperience = () => {
        if (data.experience.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle} wrap={false}>Experience</Text>
                {data.experience.map((exp, idx) => (
                    <View key={idx} style={styles.itemContainer} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{exp.title}</Text>
                            <Text style={styles.itemDate}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                        </View>
                        <Text style={styles.itemSubtitle}>{exp.company}</Text>
                        {exp.bullets.filter(b => b.trim() !== '').map((bullet, bIdx) => (
                            <View key={bIdx} style={styles.bulletPointContainer}>
                                <Text style={styles.bulletPoint}>– </Text>
                                <Text style={styles.bulletText}>{bullet}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const renderProjects = () => {
        if (data.projects.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle} wrap={false}>Projects</Text>
                {data.projects.map((proj, idx) => (
                    <View key={idx} style={styles.itemContainer} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{proj.title}</Text>
                            <Text style={styles.itemDate}>{proj.techStack.join(', ')}</Text>
                        </View>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemSubtitle}>
                                {proj.liveUrl ? `Live: ${proj.liveUrl}` : ''}
                                {proj.githubUrl && proj.liveUrl ? ' | ' : ''}
                                {proj.githubUrl ? `GitHub: ${proj.githubUrl}` : ''}
                            </Text>
                        </View>
                        {proj.bullets.filter(b => b.trim() !== '').map((bullet, bIdx) => (
                            <View key={bIdx} style={styles.bulletPointContainer}>
                                <Text style={styles.bulletPoint}>– </Text>
                                <Text style={styles.bulletText}>{bullet}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const renderSkills = () => {
        const hasSkills = data.skills.technical.length > 0 || data.skills.tools.length > 0 || data.skills.languages.length > 0 || data.skills.soft.length > 0;
        if (!hasSkills) return null;
        return (
            <View style={styles.section} wrap={false}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {data.skills.technical.length > 0 && (
                    <View style={styles.skillsGroup}>
                        <Text style={styles.skillsLabel}>Technical:</Text>
                        <Text style={styles.skillsList}>{data.skills.technical.join(', ')}</Text>
                    </View>
                )}
                {data.skills.tools.length > 0 && (
                    <View style={styles.skillsGroup}>
                        <Text style={styles.skillsLabel}>Tools:</Text>
                        <Text style={styles.skillsList}>{data.skills.tools.join(', ')}</Text>
                    </View>
                )}
                {data.skills.languages.length > 0 && (
                    <View style={styles.skillsGroup}>
                        <Text style={styles.skillsLabel}>Languages:</Text>
                        <Text style={styles.skillsList}>{data.skills.languages.join(', ')}</Text>
                    </View>
                )}
                {data.skills.soft.length > 0 && (
                    <View style={styles.skillsGroup}>
                        <Text style={styles.skillsLabel}>Soft Skills:</Text>
                        <Text style={styles.skillsList}>{data.skills.soft.join(', ')}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderCertifications = () => {
        if (data.certifications.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle} wrap={false}>Certifications</Text>
                {data.certifications.map((cert, idx) => (
                    <View key={idx} style={styles.itemContainer} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{cert.name}</Text>
                            <Text style={styles.itemDate}>{cert.date}</Text>
                        </View>
                        <Text style={styles.itemSubtitle}>
                            {cert.issuer} {cert.url ? `| ${cert.url}` : ''}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderAchievements = () => {
        if (data.achievements.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle} wrap={false}>Achievements</Text>
                {data.achievements.map((ach, idx) => (
                    <View key={idx} style={styles.itemContainer} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{ach.title}</Text>
                            {ach.date && <Text style={styles.itemDate}>{ach.date}</Text>}
                        </View>
                        <Text>{ach.description}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const sectionRenderers: Record<string, () => any> = {
        'summary': renderSummary,
        'education': renderEducation,
        'experience': renderExperience,
        'projects': renderProjects,
        'skills': renderSkills,
        'certifications': renderCertifications,
        'achievements': renderAchievements,
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {renderHeader()}
                {order.map(sectionId => {
                    const renderer = sectionRenderers[sectionId];
                    return renderer ? <React.Fragment key={sectionId}>{renderer()}</React.Fragment> : null;
                })}
            </Page>
        </Document>
    );
}
